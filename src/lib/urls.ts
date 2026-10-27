/**
 * Utility functions for external URL validation, Google Drive link conversions,
 * and media embedding.
 */

/**
 * Extracts a Google Drive file ID from various sharing URL patterns.
 * Supports:
 * - https://drive.google.com/file/d/{id}/view
 * - https://drive.google.com/open?id={id}
 * - https://drive.google.com/uc?id={id}&export=download
 * - https://docs.google.com/document/d/{id}/...
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // Pattern 1: /file/d/{id} or /document/d/{id}
  const fileDMatch = trimmed.match(/\/(?:file|document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: ?id={id} or &id={id}
  const idQueryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) {
    return idQueryMatch[1];
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
