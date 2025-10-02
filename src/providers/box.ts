/**
 * Box Provider
 * 
 * Handles Box file selection using the Box API.
 * Provides a custom file browser interface for consistent UX.
 */

import { PickedFile, BoxOptions } from '../types';

/**
 * Fetches files from Box using the Box API
 * 
 * @param token - Box access token
 * @param options - Box configuration options
 * @returns Promise with array of picked files
 */
export async function fetchBoxFiles(
  token: string,
  options: BoxOptions = {}
): Promise<PickedFile[]> {
  const { folderId = "0", fileTypes = ["file"] } = options;
  
  const res = await fetch(`https://api.box.com/2.0/folders/${folderId}/items?limit=100`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Box API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  
  return (data.entries || [])
    .filter((item: any) => fileTypes.includes(item.type)) // Filter by file types
    .map((f: any) => ({
      provider: "box" as const,
      id: f.id,
      name: f.name,
      mimeType: f.type === "file" ? f.content_modified_at : null,
      size: f.size || null,
      downloadUrl: f.download_url || null,
      webViewUrl: f.shared_link?.url || null,
      raw: f
    }));
}

/**
 * Opens Box file picker (custom implementation)
 * 
 * @param token - Box access token
 * @param options - Box configuration options
 * @param onPick - Callback when files are selected
 * @param onCancel - Callback when picker is cancelled
 */
export async function openBoxPicker(
  token: string,
  options: BoxOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    const files = await fetchBoxFiles(token, options);
    if (files.length > 0) {
      onPick(files);
    } else {
      onCancel();
    }
  } catch (error) {
    console.error('Box API error:', error);
    onCancel();
  }
}
