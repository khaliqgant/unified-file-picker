const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Unified File Picker Backend is running' });
});

// Notion API proxy
app.post('/api/notion/search', async (req, res) => {
  try {
    const { token, query, filterTypes = ['page', 'database'] } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Notion token is required' });
    }

    const response = await axios.post('https://api.notion.com/v1/search', {
      filter: {
        value: 'page',
        property: 'object'
      },
      ...(query && { query })
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    });

    const files = response.data.results.map(item => ({
      provider: "notion",
      id: item.id,
      name: item.properties?.title?.title?.[0]?.text?.content || 'Untitled',
      mimeType: 'application/json',
      size: null,
      downloadUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
      webViewUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
      raw: item
    }));

    res.json({ files });
  } catch (error) {
    console.error('Notion API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Notion content',
      details: error.response?.data || error.message
    });
  }
});

// Notion database query proxy
app.post('/api/notion/database/:databaseId/query', async (req, res) => {
  try {
    const { token } = req.body;
    const { databaseId } = req.params;
    
    if (!token) {
      return res.status(400).json({ error: 'Notion token is required' });
    }

    const response = await axios.post(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      // Add any query filters from request body
      ...req.body.query
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    });

    const files = response.data.results.map(item => ({
      provider: "notion",
      id: item.id,
      name: item.properties?.title?.title?.[0]?.text?.content || 
            item.properties?.Name?.title?.[0]?.text?.content || 'Untitled',
      mimeType: 'application/json',
      size: null,
      downloadUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
      webViewUrl: `https://notion.so/${item.id.replace(/-/g, '')}`,
      raw: item
    }));

    res.json({ files });
  } catch (error) {
    console.error('Notion database query error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to query Notion database',
      details: error.response?.data || error.message
    });
  }
});

// Dropbox API proxy
app.post('/api/dropbox/list_folder', async (req, res) => {
  try {
    const { token, path = '', limit = 10 } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Dropbox token is required' });
    }

    const response = await axios.post('https://api.dropboxapi.com/2/files/list_folder', {
      path,
      limit
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const files = response.data.entries.map(item => ({
      provider: "dropbox",
      id: item.id,
      name: item.name,
      mimeType: item.content_type || null,
      size: item.size || null,
      downloadUrl: `https://content.dropboxapi.com/2/files/download`,
      webViewUrl: item.preview_url || null,
      raw: item
    }));

    res.json({ files });
  } catch (error) {
    console.error('Dropbox API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Dropbox files',
      details: error.response?.data || error.message
    });
  }
});

// Box API proxy
app.get('/api/box/folders/:folderId/items', async (req, res) => {
  try {
    const { token } = req.query;
    const { folderId } = req.params;
    const { limit = 10 } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Box token is required' });
    }

    const response = await axios.get(`https://api.box.com/2.0/folders/${folderId}/items?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const files = response.data.entries.map(item => ({
      provider: "box",
      id: item.id,
      name: item.name,
      mimeType: item.type === "file" ? item.content_modified_at : null,
      size: item.size || null,
      downloadUrl: item.download_url || null,
      webViewUrl: item.shared_link?.url || null,
      raw: item
    }));

    res.json({ files });
  } catch (error) {
    console.error('Box API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Box files',
      details: error.response?.data || error.message
    });
  }
});

// SharePoint API proxy
app.get('/api/sharepoint/sites/:siteId/drives/:driveId/items/:itemId/children', async (req, res) => {
  try {
    const { token } = req.query;
    const { siteId, driveId, itemId } = req.params;
    const { top = 10 } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'SharePoint token is required' });
    }

    const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${itemId}/children?$top=${top}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const files = response.data.value.map(item => ({
      provider: "sharepoint",
      id: item.id,
      name: item.name,
      mimeType: item.file?.mimeType || null,
      size: item.size || null,
      downloadUrl: item["@microsoft.graph.downloadUrl"] || null,
      webViewUrl: item.webUrl || null,
      raw: item
    }));

    res.json({ files });
  } catch (error) {
    console.error('SharePoint API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch SharePoint files',
      details: error.response?.data || error.message
    });
  }
});

// Confluence API proxy
app.get('/api/confluence/content', async (req, res) => {
  try {
    const { token, baseUrl } = req.query;
    const { spaceKey, pageId, searchQuery, limit = 10 } = req.query;
    
    if (!token || !baseUrl) {
      return res.status(400).json({ error: 'Confluence token and baseUrl are required' });
    }

    let url = `${baseUrl}/rest/api/content`;
    const params = new URLSearchParams();
    
    if (spaceKey) params.append('spaceKey', spaceKey);
    if (pageId) params.append('pageId', pageId);
    if (searchQuery) params.append('cql', `text ~ "${searchQuery}"`);
    params.append('limit', limit);
    
    url += `?${params.toString()}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const files = response.data.results.map(item => ({
      provider: "confluence",
      id: item.id,
      name: item.title,
      mimeType: item.type === 'page' ? 'text/html' : 'application/octet-stream',
      size: null,
      downloadUrl: `${baseUrl}${item._links.download || item._links.webui}`,
      webViewUrl: `${baseUrl}${item._links.webui}`,
      raw: item
    }));

    res.json({ files });
  } catch (error) {
    console.error('Confluence API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Confluence content',
      details: error.response?.data || error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Unified File Picker Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 CORS enabled for all origins`);
});
