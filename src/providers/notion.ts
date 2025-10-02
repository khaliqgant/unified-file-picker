/**
 * Notion Provider
 * 
 * Handles Notion page and database selection using Notion API.
 * Supports both pages and database entries as "files".
 */

import { PickedFile, NotionOptions } from '../types';

/**
 * Fetches pages and database entries from Notion
 */
async function fetchNotionContent(
  accessToken: string,
  options: NotionOptions = {}
): Promise<PickedFile[]> {
  const { databaseId, pageId, searchQuery, filterTypes = ['page', 'database'] } = options;
  
  const files: PickedFile[] = [];
  
  // Fetch from specific database if provided
  if (databaseId && filterTypes.includes('database')) {
    const dbFiles = await fetchNotionDatabase(accessToken, databaseId, searchQuery);
    files.push(...dbFiles);
  }
  
  // Fetch from specific page if provided
  if (pageId && filterTypes.includes('page')) {
    const pageFiles = await fetchNotionPage(accessToken, pageId);
    files.push(...pageFiles);
  }
  
  // If no specific ID provided, search across all accessible content
  if (!databaseId && !pageId) {
    const searchFiles = await searchNotionContent(accessToken, searchQuery, filterTypes);
    files.push(...searchFiles);
  }
  
  return files;
}

/**
 * Fetches entries from a specific Notion database
 */
async function fetchNotionDatabase(
  accessToken: string,
  databaseId: string,
  searchQuery?: string
): Promise<PickedFile[]> {
  let url = `https://api.notion.com/v1/databases/${databaseId}/query`;
  
  const body: any = {};
  
  // Add search filter if provided
  if (searchQuery) {
    body.filter = {
      property: "title",
      title: {
        contains: searchQuery
      }
    };
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return data.results.map((item: any) => ({
    provider: "notion" as const,
    id: item.id,
    name: item.properties?.title?.title?.[0]?.text?.content || item.properties?.Name?.title?.[0]?.text?.content || 'Untitled',
    mimeType: 'application/json',
    size: null,
    downloadUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
    webViewUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
    raw: item
  }));
}

/**
 * Fetches a specific Notion page
 */
async function fetchNotionPage(
  accessToken: string,
  pageId: string
): Promise<PickedFile[]> {
  const url = `https://api.notion.com/v1/pages/${pageId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }
  
  const page = await response.json();
  
  return [{
    provider: "notion" as const,
    id: page.id,
    name: page.properties?.title?.title?.[0]?.text?.content || 'Untitled',
    mimeType: 'application/json',
    size: null,
    downloadUrl: `https://notion.so/${page.id.replace(/-/g, '')}`,
    webViewUrl: `https://notion.so/${page.id.replace(/-/g, '')}`,
    raw: page
  }];
}

/**
 * Searches across all accessible Notion content
 */
async function searchNotionContent(
  accessToken: string,
  searchQuery?: string,
  filterTypes: string[] = ['page', 'database']
): Promise<PickedFile[]> {
  const url = 'https://api.notion.com/v1/search';
  
  const body: any = {
    filter: {
      value: 'page',
      property: 'object'
    }
  };
  
  if (searchQuery) {
    body.query = searchQuery;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return data.results.map((item: any) => ({
    provider: "notion" as const,
    id: item.id,
    name: item.properties?.title?.title?.[0]?.text?.content || 'Untitled',
    mimeType: 'application/json',
    size: null,
    downloadUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
    webViewUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
    raw: item
  }));
}

/**
 * Opens Notion content picker
 */
export async function openNotionPicker(
  accessToken: string,
  options: NotionOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    const files = await fetchNotionContent(accessToken, options);
    onPick(files);
  } catch (error) {
    console.error('Notion picker error:', error);
    onCancel();
  }
}
