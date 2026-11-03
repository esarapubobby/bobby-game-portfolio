import { Project } from '../types';
import { formatYouTubeEmbedUrl } from './utils';

/**
 * Utility functions for external URL validation, Google Drive link conversions,
 * and media embedding.
 */

/**
 * Extracts a Google Drive file ID from various sharing URL patterns.
 * Supports:
 * - https://drive.google.com/file/d/{id}/view
 * - https://drive.google.com/file/d/{id}/preview
 * - https://drive.google.com/file/u/0/d/{id}/view
 * - https://drive.google.com/open?id={id}
 * - https://drive.google.com/uc?id={id}&export=download
 * - https://drive.google.com/uc?export=download&id={id}
 * - https://docs.google.com/document/d/{id}/...
 * - direct file ID string (alphanumeric, -, _, length >= 20)
 */
export function extractGoogleDriveId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // Pattern 1: /d/{id} (handles /file/d/{id}, /file/u/0/d/{id}, /document/d/{id}, etc.)
  const fileDMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: ?id={id} or &id={id}
  const idQueryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (idQueryMatch && idQueryMatch[1]) {
    return idQueryMatch[1];
  }

  // Pattern 3: If user directly pasted the Google Drive file ID itself (typically 25+ chars)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Converts a Google Drive sharing URL into a direct-download URL.
 * If the URL is not a Google Drive link, returns the original URL.
 */
export function toGoogleDriveDirectDownload(url: string): string {
  if (!url) return '';
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url.trim();
}

/**
 * Converts a Google Drive sharing URL into a clean preview/view URL.
 */
export function toGoogleDrivePreview(url: string): string {
  if (!url) return '';
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  return url.trim();
}

/**
 * Converts a Google Drive sharing URL into an iframe preview embed URL.
 * Standard embed pattern: https://drive.google.com/file/d/{id}/preview
 */
export function toGoogleDriveEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return null;
}

/**
 * Returns true if a given URL represents a valid Google Drive file.
 */
export function isGoogleDriveUrl(url?: string | null): boolean {
  return Boolean(extractGoogleDriveId(url));
}

/**
 * Returns true if a given URL represents a valid Cloudinary video delivery asset.
 */
export function isCloudinaryVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return /cloudinary\.com/i.test(trimmed);
}

export type VideoSourceType = 'youtube' | 'cloudinary' | 'direct';

export interface VideoSourceInfo {
  type: VideoSourceType;
  embedUrl: string;
  rawUrl: string;
  sourceLabel: string;
}

/**
 * Detects whether a URL is a YouTube video, Cloudinary video, or direct video file,
 * returning the appropriate embeddable / stream URL.
 */
export function detectVideoSource(url?: string | null): VideoSourceInfo | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube
  const ytEmbed = formatYouTubeEmbedUrl(trimmed);
  if (ytEmbed) {
    return {
      type: 'youtube',
      embedUrl: ytEmbed,
      rawUrl: trimmed,
      sourceLabel: 'YouTube Trailer',
    };
  }

  // 2. Cloudinary video delivery URL
  if (isCloudinaryVideoUrl(trimmed)) {
    return {
      type: 'cloudinary',
      embedUrl: trimmed,
      rawUrl: trimmed,
      sourceLabel: 'Cloudinary Gameplay Video',
    };
  }

  // 3. Direct HTML5 video file
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      rawUrl: trimmed,
      sourceLabel: 'Gameplay Video',
    };
  }

  return null;
}

/**
 * Determines the primary video for a project, prioritizing YouTube (e.g. DeadZone trailer),
 * then Cloudinary video URL (cloudinaryVideoUrl), then direct video formats.
 */
export function getProjectVideo(project?: Project | null): VideoSourceInfo | null {
  if (!project) return null;

  // 1. YouTube trailer priority (DeadZone has gameplayVideoUrl: 'https://youtu.be/OihvAqWn06w')
  if (project.gameplayVideoUrl && typeof project.gameplayVideoUrl === 'string') {
    const ytEmbed = formatYouTubeEmbedUrl(project.gameplayVideoUrl);
    if (ytEmbed) {
      return {
        type: 'youtube',
        embedUrl: ytEmbed,
        rawUrl: project.gameplayVideoUrl.trim(),
        sourceLabel: 'YouTube Trailer',
      };
    }
  }

  // 2. Cloudinary Gameplay Video URL
  if (project.cloudinaryVideoUrl && typeof project.cloudinaryVideoUrl === 'string') {
    const trimmed = project.cloudinaryVideoUrl.trim();
    if (trimmed) {
      const detected = detectVideoSource(trimmed);
      if (detected) return detected;
      if (isValidUrl(trimmed)) {
        return {
          type: 'cloudinary',
          embedUrl: trimmed,
          rawUrl: trimmed,
          sourceLabel: 'Cloudinary Gameplay Video',
        };
      }
    }
  }

  // 3. Fallback: Check if gameplayVideoUrl is a Cloudinary / direct video URL
  if (project.gameplayVideoUrl && typeof project.gameplayVideoUrl === 'string') {
    const info = detectVideoSource(project.gameplayVideoUrl);
    if (info && info.type !== 'youtube') return info;
  }

  return null;
}

/**
 * Validates whether a given string is a valid web URL or a local absolute path.
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();

  // Accept local root paths e.g. /Bobby_Esarapu_Resume.pdf
  if (trimmed.startsWith('/')) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
