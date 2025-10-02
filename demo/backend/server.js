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

// Unified File Picker API Endpoints (according to spec)
app.get('/api/storage/providers', (req, res) => {
  res.json({
    providers: [
      { id: 'gdrive', name: 'Google Drive', icon: '📁' },
      { id: 'dropbox', name: 'Dropbox', icon: '📦' },
      { id: 'onedrive', name: 'OneDrive', icon: '☁️' },
      { id: 'box', name: 'Box', icon: '📋' },
      { id: 's3', name: 'Amazon S3', icon: '🪣' },
      { id: 'sharepoint', name: 'SharePoint', icon: '🏢' },
      { id: 'confluence', name: 'Confluence', icon: '📝' },
      { id: 'notion', name: 'Notion', icon: '📄' }
    ]
  });
});

app.get('/api/storage/list', async (req, res) => {
  try {
    const { provider, folderId } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    // TODO: Implement provider-specific listing logic
    // This would call the appropriate provider API based on the provider parameter
    
    // Mock response for demo - provider-specific content
    let mockDocuments = [];
    
    if (provider === 'notion') {
      mockDocuments = [
        {
          id: `${provider}:page1`,
          provider,
          providerId: 'page1',
          kind: 'file',
          name: 'Project Planning Page',
          mimeType: 'application/notion-page',
          sizeBytes: null,
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://notion.so/page1`,
          downloadUrl: null
        },
        {
          id: `${provider}:database1`,
          provider,
          providerId: 'database1',
          kind: 'folder',
          name: 'Tasks Database',
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://notion.so/database1`
        },
        {
          id: `${provider}:page2`,
          provider,
          providerId: 'page2',
          kind: 'file',
          name: 'Meeting Notes',
          mimeType: 'application/notion-page',
          sizeBytes: null,
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://notion.so/page2`,
          downloadUrl: null
        }
      ];
    } else if (provider === 'confluence') {
      mockDocuments = [
        {
          id: `${provider}:page1`,
          provider,
          providerId: 'page1',
          kind: 'file',
          name: 'Product Requirements',
          mimeType: 'application/confluence-page',
          sizeBytes: 2048000,
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://company.atlassian.net/wiki/spaces/PROD/pages/123456`,
          downloadUrl: `https://company.atlassian.net/wiki/download/attachments/123456/Product%20Requirements.pdf`
        },
        {
          id: `${provider}:space1`,
          provider,
          providerId: 'space1',
          kind: 'folder',
          name: 'Engineering Space',
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://company.atlassian.net/wiki/spaces/ENG`
        }
      ];
    } else if (provider === 'sharepoint') {
      mockDocuments = [
        {
          id: `${provider}:file1`,
          provider,
          providerId: 'file1',
          kind: 'file',
          name: 'Company Policy.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          sizeBytes: 1536000,
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://company.sharepoint.com/sites/hr/Documents/Company%20Policy.docx`,
          downloadUrl: `https://company.sharepoint.com/sites/hr/_layouts/15/download.aspx?SourceUrl=/sites/hr/Documents/Company%20Policy.docx`
        },
        {
          id: `${provider}:folder1`,
          provider,
          providerId: 'folder1',
          kind: 'folder',
          name: 'HR Documents',
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://company.sharepoint.com/sites/hr/Documents/HR%20Documents`
        }
      ];
    } else {
      // Default for other providers
      mockDocuments = [
        {
          id: `${provider}:file1`,
          provider,
          providerId: 'file1',
          kind: 'file',
          name: 'Sample Document.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 1024000,
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://${provider}.com/file1`,
          downloadUrl: `https://${provider}.com/download/file1`
        },
        {
          id: `${provider}:folder1`,
          provider,
          providerId: 'folder1',
          kind: 'folder',
          name: 'Documents',
          modifiedAt: new Date().toISOString(),
          parentId: folderId || null,
          webUrl: `https://${provider}.com/folder1`
        }
      ];
    }
    
    res.json({ documents: mockDocuments });
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

app.get('/api/storage/search', async (req, res) => {
  try {
    const { provider, q } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (!provider || !q) {
      return res.status(400).json({ error: 'Provider and query are required' });
    }
    
    // TODO: Implement provider-specific search logic
    
    // Mock response for demo
    const mockDocuments = [
      {
        id: `${provider}:search1`,
        provider,
        providerId: 'search1',
        kind: 'file',
        name: `Search Result for "${q}".docx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        sizeBytes: 512000,
        modifiedAt: new Date().toISOString(),
        webUrl: `https://${provider}.com/search1`,
        downloadUrl: `https://${provider}.com/download/search1`
      }
    ];
    
    res.json({ documents: mockDocuments });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search files' });
  }
});

app.get('/api/storage/node', async (req, res) => {
  try {
    const { provider, id } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (!provider || !id) {
      return res.status(400).json({ error: 'Provider and id are required' });
    }
    
    // TODO: Implement provider-specific node fetching logic
    
    // Mock response for demo
    const mockDocument = {
      id: `${provider}:${id}`,
      provider,
      providerId: id,
      kind: 'file',
      name: 'Specific Document.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 2048000,
      modifiedAt: new Date().toISOString(),
      webUrl: `https://${provider}.com/${id}`,
      downloadUrl: `https://${provider}.com/download/${id}`
    };
    
    res.json({ document: mockDocument });
  } catch (error) {
    console.error('Node error:', error);
    res.status(500).json({ error: 'Failed to fetch node' });
  }
});

app.post('/api/storage/presign-download', async (req, res) => {
  try {
    const { provider, documentId } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (!provider || !documentId) {
      return res.status(400).json({ error: 'Provider and documentId are required' });
    }
    
    // TODO: Implement provider-specific presigned URL generation
    
    // Mock response for demo
    const presignedUrl = `https://${provider}.com/presigned/${documentId}?token=${token}`;
    
    res.json({ 
      downloadUrl: presignedUrl,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    });
  } catch (error) {
    console.error('Presign error:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
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
