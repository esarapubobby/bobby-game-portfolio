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

export type VideoSourceType = 'youtube' | 'google-drive' | 'direct';

export interface VideoSourceInfo {
  type: VideoSourceType;
  embedUrl: string;
  rawUrl: string;
  sourceLabel: string;
}

/**
 * Detects whether a URL is a YouTube video, Google Drive video, or direct video file,
 * returning the appropriate embeddable URL.
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

  // 2. Google Drive
  const driveEmbed = toGoogleDriveEmbedUrl(trimmed);
  if (driveEmbed) {
    return {
      type: 'google-drive',
      embedUrl: driveEmbed,
      rawUrl: trimmed,
      sourceLabel: 'Google Drive Video',
    };
  }

  // 3. Direct HTML5 video file
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
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
 * then Google Drive video (e.g. driveVideoUrl or Google Drive link pasted in gameplayVideoUrl),
 * then demoUrl fallback if it links to video.
 */
export function getProjectVideo(project?: Project | null): VideoSourceInfo | null {
  if (!project) return null;

  // 1. Check gameplayVideoUrl (YouTube trailer or direct video)
  if (project.gameplayVideoUrl && typeof project.gameplayVideoUrl === 'string') {
    const info = detectVideoSource(project.gameplayVideoUrl);
    if (info) return info;
  }

  // 2. Check driveVideoUrl (Google Drive video link)
  if (project.driveVideoUrl && typeof project.driveVideoUrl === 'string') {
    const info = detectVideoSource(project.driveVideoUrl);
    if (info) return info;
  }

  // 3. Fallback: Check demoUrl in case user pasted a video or Drive link there
  if (project.demoUrl && typeof project.demoUrl === 'string') {
    const info = detectVideoSource(project.demoUrl);
    if (info) return info;
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
