/**
 * SharePoint Provider
 * 
 * Handles SharePoint file selection using Microsoft Graph API.
 * Supports SharePoint Online and SharePoint Server.
 */

import { PickedFile, SharePointOptions } from '../types';

/**
 * Fetches files from SharePoint using Microsoft Graph API
 */
async function fetchSharePointFiles(
  accessToken: string,
  options: SharePointOptions = {}
): Promise<PickedFile[]> {
  const { siteId, driveId, folderId, searchQuery } = options;
  
  let url = 'https://graph.microsoft.com/v1.0';
  
  // Build the endpoint based on provided options
  if (siteId && driveId) {
    // Specific site and drive
    url += `/sites/${siteId}/drives/${driveId}`;
  } else if (siteId) {
    // Specific site, default drive
    url += `/sites/${siteId}/drive`;
  } else {
    // User's default SharePoint
    url += '/me/drive';
  }
  
  // Add folder path if specified
  if (folderId && folderId !== 'root') {
    url += `/items/${folderId}`;
  } else {
    url += '/root';
  }
  
  // Add children endpoint
  url += '/children';
  
  // Add search query if provided
  if (searchQuery) {
    url += `?search="${encodeURIComponent(searchQuery)}"`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`SharePoint API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return data.value
    .filter((item: any) => !item.folder) // Only files, not folders
    .map((item: any) => ({
      provider: "sharepoint" as const,
      id: item.id,
      name: item.name,
      mimeType: item.file?.mimeType || null,
      size: item.size || null,
      downloadUrl: item['@microsoft.graph.downloadUrl'] || null,
      webViewUrl: item.webUrl || null,
      raw: item
    }));
}

/**
 * Opens SharePoint file picker
 */
export async function openSharePointPicker(
  accessToken: string,
  options: SharePointOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    const files = await fetchSharePointFiles(accessToken, options);
    onPick(files);
  } catch (error) {
    console.error('SharePoint picker error:', error);
    onCancel();
  }
}
