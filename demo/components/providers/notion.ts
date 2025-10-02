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
 * 
 * Uses backend proxy to handle CORS restrictions
 */
export async function openNotionPicker(
  accessToken: string,
  options: NotionOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create file picker container
    const pickerContainer = document.createElement('div');
    pickerContainer.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 90%;
      max-width: 800px;
      height: 80%;
      max-height: 600px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Select Notion Content';
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      padding: 4px;
      border-radius: 4px;
    `;
    closeButton.onclick = () => {
      document.body.removeChild(modal);
      onCancel();
    };

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create search bar
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search pages and databases...';
    searchInput.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
    `;

    searchContainer.appendChild(searchInput);

    // Create content area
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    `;

    // Create loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: #6b7280;
    `;
    loadingDiv.textContent = 'Loading Notion content...';
    contentArea.appendChild(loadingDiv);

    // Create footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
      onCancel();
    };

    const selectBtn = document.createElement('button');
    selectBtn.textContent = 'Select';
    selectBtn.style.cssText = `
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;
    selectBtn.disabled = true;

    footer.appendChild(cancelBtn);
    footer.appendChild(selectBtn);

    // Assemble modal
    pickerContainer.appendChild(header);
    pickerContainer.appendChild(searchContainer);
    pickerContainer.appendChild(contentArea);
    pickerContainer.appendChild(footer);
    modal.appendChild(pickerContainer);
    document.body.appendChild(modal);

    // Load content
    let allItems: PickedFile[] = [];
    let selectedItems: Set<string> = new Set();

    const loadContent = async () => {
      try {
        loadingDiv.textContent = 'Loading Notion content...';
        
        // Check if this is a demo token
        if (accessToken.startsWith('demo-') || accessToken === 'demo-notion-token') {
          // Show mock data for demo
          allItems = [
            {
              provider: "notion",
              id: "mock-page-1",
              name: "📄 Project Planning Document",
              mimeType: 'application/json',
              size: null,
              downloadUrl: "https://notion.so/mock-page-1",
              webViewUrl: "https://notion.so/mock-page-1",
              raw: { id: "mock-page-1", type: "page" }
            },
            {
              provider: "notion",
              id: "mock-page-2", 
              name: "📄 Meeting Notes - Q4 Planning",
              mimeType: 'application/json',
              size: null,
              downloadUrl: "https://notion.so/mock-page-2",
              webViewUrl: "https://notion.so/mock-page-2",
              raw: { id: "mock-page-2", type: "page" }
            },
            {
              provider: "notion",
              id: "mock-database-1",
              name: "🗃️ Task Database",
              mimeType: 'application/json',
              size: null,
              downloadUrl: "https://notion.so/mock-database-1",
              webViewUrl: "https://notion.so/mock-database-1",
              raw: { id: "mock-database-1", type: "database" }
            },
            {
              provider: "notion",
              id: "mock-page-3",
              name: "📄 Design System Guidelines",
              mimeType: 'application/json',
              size: null,
              downloadUrl: "https://notion.so/mock-page-3",
              webViewUrl: "https://notion.so/mock-page-3",
              raw: { id: "mock-page-3", type: "page" }
            },
            {
              provider: "notion",
              id: "mock-database-2",
              name: "🗃️ Customer Feedback Database",
              mimeType: 'application/json',
              size: null,
              downloadUrl: "https://notion.so/mock-database-2",
              webViewUrl: "https://notion.so/mock-database-2",
              raw: { id: "mock-database-2", type: "database" }
            }
          ];
        } else {
          // Use backend proxy for real tokens
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
          
          let response;
          if (options.databaseId) {
            response = await fetch(`${backendUrl}/api/notion/database/${options.databaseId}/query`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: accessToken,
                query: options.searchQuery ? {
                  filter: {
                    property: "title",
                    title: { contains: options.searchQuery }
                  }
                } : {}
              })
            });
          } else {
            response = await fetch(`${backendUrl}/api/notion/search`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: accessToken,
                query: options.searchQuery,
                filterTypes: options.filterTypes
              })
            });
          }
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }
          
          const data = await response.json();
          allItems = data.files;
        }
        
        renderItems(allItems);
      } catch (error) {
        console.error('Notion picker error:', error);
        contentArea.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #ef4444;">
            <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Failed to load content</div>
            <div style="font-size: 14px; color: #6b7280;">${error.message}</div>
          </div>
        `;
      }
    };

    const renderItems = (items: PickedFile[]) => {
      contentArea.innerHTML = '';
      
      if (items.length === 0) {
        contentArea.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #6b7280;">
            <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
            <div style="font-size: 16px;">No content found</div>
          </div>
        `;
        return;
      }

      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: ${selectedItems.has(item.id) ? '#eff6ff' : 'white'};
          border-color: ${selectedItems.has(item.id) ? '#3b82f6' : '#e5e7eb'};
        `;

        itemDiv.onmouseover = () => {
          if (!selectedItems.has(item.id)) {
            itemDiv.style.background = '#f9fafb';
          }
        };
        itemDiv.onmouseout = () => {
          if (!selectedItems.has(item.id)) {
            itemDiv.style.background = 'white';
          }
        };

        itemDiv.onclick = () => {
          if (selectedItems.has(item.id)) {
            selectedItems.delete(item.id);
          } else {
            selectedItems.add(item.id);
          }
          renderItems(items);
          selectBtn.disabled = selectedItems.size === 0;
          selectBtn.textContent = selectedItems.size > 0 ? `Select (${selectedItems.size})` : 'Select';
        };

        const checkbox = document.createElement('div');
        checkbox.style.cssText = `
          width: 20px;
          height: 20px;
          border: 2px solid ${selectedItems.has(item.id) ? '#3b82f6' : '#d1d5db'};
          border-radius: 4px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${selectedItems.has(item.id) ? '#3b82f6' : 'white'};
        `;
        
        if (selectedItems.has(item.id)) {
          checkbox.innerHTML = '✓';
          checkbox.style.color = 'white';
        }

        const content = document.createElement('div');
        content.style.cssText = `flex: 1;`;

        const name = document.createElement('div');
        name.textContent = item.name;
        name.style.cssText = `
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 4px;
        `;

        const type = document.createElement('div');
        type.textContent = item.raw?.type === 'database' ? 'Database' : 'Page';
        type.style.cssText = `
          font-size: 12px;
          color: #6b7280;
        `;

        content.appendChild(name);
        content.appendChild(type);
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(content);
        contentArea.appendChild(itemDiv);
      });
    };

    // Search functionality
    searchInput.oninput = () => {
      const query = searchInput.value.toLowerCase();
      const filtered = allItems.filter(item => 
        item.name.toLowerCase().includes(query)
      );
      renderItems(filtered);
    };

    // Select button functionality
    selectBtn.onclick = () => {
      const selectedFiles = allItems.filter(item => selectedItems.has(item.id));
      document.body.removeChild(modal);
      onPick(selectedFiles);
    };

    // Load initial content
    loadContent();

  } catch (error) {
    console.error('Notion picker error:', error);
    onCancel();
  }
}
