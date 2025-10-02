/**
 * Confluence Provider
 * 
 * Handles Confluence page and attachment selection using Atlassian Confluence API.
 * Supports both Cloud and Server versions of Confluence.
 */

import { PickedFile, ConfluenceOptions } from '../types';

/**
 * Fetches pages and attachments from Confluence
 */
async function fetchConfluenceContent(
  accessToken: string,
  baseUrl: string,
  options: ConfluenceOptions = {}
): Promise<PickedFile[]> {
  const { spaceKey, pageId, searchQuery, contentTypes = ['page', 'attachment'] } = options;
  
  let url = `${baseUrl}/rest/api/content`;
  const params = new URLSearchParams();
  
  // Add space filter if specified
  if (spaceKey) {
    params.append('spaceKey', spaceKey);
  }
  
  // Add page filter if specified
  if (pageId) {
    params.append('pageId', pageId);
  }
  
  // Add content type filter
  if (contentTypes.length > 0) {
    params.append('type', contentTypes.join(','));
  }
  
  // Add search query if provided
  if (searchQuery) {
    params.append('cql', `text ~ "${searchQuery}"`);
  }
  
  // Add expand parameters to get more details
  params.append('expand', 'body.storage,version,space,ancestors,descendants,children.attachment');
  
  url += `?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Confluence API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  const files: PickedFile[] = [];
  
  // Process pages
  if (contentTypes.includes('page')) {
    const pages = data.results.filter((item: any) => item.type === 'page');
    pages.forEach((page: any) => {
      files.push({
        provider: "confluence" as const,
        id: page.id,
        name: page.title,
        mimeType: 'text/html',
        size: page.body?.storage?.value?.length || null,
        downloadUrl: `${baseUrl}/pages/viewpage.action?pageId=${page.id}`,
        webViewUrl: `${baseUrl}/pages/viewpage.action?pageId=${page.id}`,
        raw: page
      });
    });
  }
  
  // Process attachments
  if (contentTypes.includes('attachment')) {
    const attachments = data.results.filter((item: any) => item.type === 'attachment');
    attachments.forEach((attachment: any) => {
      files.push({
        provider: "confluence" as const,
        id: attachment.id,
        name: attachment.title,
        mimeType: attachment.extensions?.mediaType || null,
        size: attachment.extensions?.fileSize || null,
        downloadUrl: `${baseUrl}/download/attachments/${attachment.space?.key}/${attachment.title}`,
        webViewUrl: `${baseUrl}/pages/viewpage.action?pageId=${attachment.id}`,
        raw: attachment
      });
    });
  }
  
  return files;
}

/**
 * Opens Confluence content picker
 */
export async function openConfluencePicker(
  accessToken: string,
  baseUrl: string,
  options: ConfluenceOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    const files = await fetchConfluenceContent(accessToken, baseUrl, options);
    onPick(files);
  } catch (error) {
    console.error('Confluence picker error:', error);
    onCancel();
  }
}
