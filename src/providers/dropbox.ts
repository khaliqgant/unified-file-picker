/**
 * Dropbox Provider
 * 
 * Handles Dropbox file selection using the Dropbox API.
 * Provides a custom file browser interface for consistent UX.
 */

import { PickedFile, DropboxOptions } from '../types';

/**
 * Fetches files from Dropbox using the API
 * 
 * @param token - Dropbox access token
 * @param options - Dropbox configuration options
 * @returns Promise with array of picked files
 */
export async function fetchDropboxFiles(
  token: string, 
  options: DropboxOptions = {}
): Promise<PickedFile[]> {
  const { path = "", recursive = false } = options;
  
  const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      path, 
      recursive,
      limit: 100 // Limit results for better performance
    })
  });

  if (!res.ok) {
    throw new Error(`Dropbox API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  
  return (data.entries || [])
    .filter((entry: any) => entry['.tag'] === 'file') // Only include files, not folders
    .map((f: any) => ({
      provider: "dropbox" as const,
      id: f.id,
      name: f.name,
      mimeType: f.content_type || null,
      size: f.size || null,
      downloadUrl: `https://content.dropboxapi.com/2/files/download`,
      webViewUrl: f.preview_url || null,
      raw: f
    }));
}

/**
 * Opens Dropbox file picker (custom implementation)
 * 
 * @param token - Dropbox access token
 * @param options - Dropbox configuration options
 * @param onPick - Callback when files are selected
 * @param onCancel - Callback when picker is cancelled
 */
export async function openDropboxPicker(
  token: string,
  options: DropboxOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    const files = await fetchDropboxFiles(token, options);
    if (files.length > 0) {
      onPick(files);
    } else {
      onCancel();
    }
  } catch (error) {
    console.error('Dropbox API error:', error);
    onCancel();
  }
}
