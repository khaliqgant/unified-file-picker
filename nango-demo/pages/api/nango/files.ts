import { NextApiRequest, NextApiResponse } from 'next';
import { Nango } from '@nangohq/node';

const nango = new Nango({ 
  secretKey: process.env.NANGO_SECRET_KEY!,
  host: process.env.NANGO_HOST || 'https://api.nango.dev'
});

// ContentMetadata model from Nango Notion integration
interface ContentMetadata {
  id: string;
  object: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  cover?: {
    type: string;
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  };
  icon?: {
    type: string;
    emoji?: string;
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  };
  parent: {
    type: string;
    database_id?: string;
    page_id?: string;
    workspace?: boolean;
  };
  archived: boolean;
  in_trash: boolean;
  url: string;
  public_url?: string;
  properties: Record<string, any>;
}

// Provider-specific file fetching logic
const fetchProviderFiles = async (provider: string, integrationId: string, connectionId: string) => {
  switch (provider) {
    case 'gdrive':
      return await fetchGoogleDriveFiles(integrationId, connectionId);
    case 'dropbox':
      return await fetchDropboxFiles(integrationId, connectionId);
    case 'onedrive':
      return await fetchOneDriveFiles(integrationId, connectionId);
    case 'box':
      return await fetchBoxFiles(integrationId, connectionId);
    case 'sharepoint':
      return await fetchSharePointFiles(integrationId, connectionId);
    case 'confluence':
      return await fetchConfluenceFiles(integrationId, connectionId);
    case 'notion':
      return await fetchNotionFiles(integrationId, connectionId);
    case 's3':
      return await fetchS3Files(integrationId, connectionId);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

const fetchGoogleDriveFiles = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.get({
      endpoint: '/drive/v3/files',
      params: {
        pageSize: 100,
        fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,parents)'
      },
      providerConfigKey: integrationId,
      connectionId
    });

    return response.data.files.map((file: any) => ({
      id: `gdrive:${file.id}`,
      provider: 'gdrive',
      providerId: file.id,
      kind: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
      name: file.name,
      mimeType: file.mimeType,
      sizeBytes: file.size ? parseInt(file.size) : null,
      modifiedAt: file.modifiedTime,
      parentId: file.parents && file.parents.length > 0 ? `gdrive:${file.parents[0]}` : null,
      webUrl: file.webViewLink,
      downloadUrl: file.webContentLink
    }));
  } catch (error) {
    console.error('Google Drive API error:', error);
    throw new Error('Failed to fetch Google Drive files');
  }
};

const fetchDropboxFiles = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.post({
      endpoint: '/2/files/list_folder',
      data: { path: '' },
      providerConfigKey: integrationId,
      connectionId
    });

    return response.data.entries.map((file: any) => ({
      id: `dropbox:${file.id}`,
      provider: 'dropbox',
      providerId: file.id,
      kind: file['.tag'] === 'folder' ? 'folder' : 'file',
      name: file.name,
      mimeType: file['.tag'] === 'file' ? file.content_hash : null,
      sizeBytes: file.size || null,
      modifiedAt: file.server_modified,
      parentId: null, // Dropbox doesn't provide parent info in list_folder
      webUrl: file.preview_url,
      downloadUrl: file.preview_url
    }));
  } catch (error) {
    console.error('Dropbox API error:', error);
    throw new Error('Failed to fetch Dropbox files');
  }
};

const fetchOneDriveFiles = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.get({
      endpoint: '/me/drive/root/children',
      providerConfigKey: integrationId,
      connectionId
    });

    return response.data.value.map((file: any) => ({
      id: `onedrive:${file.id}`,
      provider: 'onedrive',
      providerId: file.id,
      kind: file.folder ? 'folder' : 'file',
      name: file.name,
      mimeType: file.file?.mimeType || null,
      sizeBytes: file.size || null,
      modifiedAt: file.lastModifiedDateTime,
      parentId: file.parentReference?.id ? `onedrive:${file.parentReference.id}` : null,
      webUrl: file.webUrl,
      downloadUrl: file['@microsoft.graph.downloadUrl']
    }));
  } catch (error) {
    console.error('OneDrive API error:', error);
    throw new Error('Failed to fetch OneDrive files');
  }
};

const fetchBoxFiles = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.get({
      endpoint: '/2.0/folders/0/items',
      params: { limit: 100 },
      providerConfigKey: integrationId,
      connectionId
    });

    return response.data.entries.map((file: any) => ({
      id: `box:${file.id}`,
      provider: 'box',
      providerId: file.id,
      kind: file.type === 'folder' ? 'folder' : 'file',
      name: file.name,
      mimeType: file.type === 'file' ? file.content_created_at : null,
      sizeBytes: file.size || null,
      modifiedAt: file.modified_at,
      parentId: file.parent?.id ? `box:${file.parent.id}` : null,
      webUrl: file.shared_link?.url,
      downloadUrl: file.shared_link?.download_url
    }));
  } catch (error) {
    console.error('Box API error:', error);
    throw new Error('Failed to fetch Box files');
  }
};

const fetchSharePointFiles = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.get({
      endpoint: '/me/drive/root/children',
      providerConfigKey: integrationId,
      connectionId
    });

    return response.data.value.map((file: any) => ({
      id: `sharepoint:${file.id}`,
      provider: 'sharepoint',
      providerId: file.id,
      kind: file.folder ? 'folder' : 'file',
      name: file.name,
      mimeType: file.file?.mimeType || null,
      sizeBytes: file.size || null,
      modifiedAt: file.lastModifiedDateTime,
      parentId: file.parentReference?.id ? `sharepoint:${file.parentReference.id}` : null,
      webUrl: file.webUrl,
      downloadUrl: file['@microsoft.graph.downloadUrl']
    }));
  } catch (error) {
    console.error('SharePoint API error:', error);
    throw new Error('Failed to fetch SharePoint files');
  }
};

const fetchConfluenceFiles = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.get({
      endpoint: '/wiki/rest/api/content',
      params: { limit: 100, expand: 'space,version' },
      providerConfigKey: integrationId,
      connectionId
    });

    return response.data.results.map((page: any) => ({
      id: `confluence:${page.id}`,
      provider: 'confluence',
      providerId: page.id,
      kind: 'file',
      name: page.title,
      mimeType: 'application/confluence-page',
      sizeBytes: null,
      modifiedAt: page.version?.when,
      parentId: page.space?.id ? `confluence:${page.space.id}` : null,
      webUrl: page._links?.webui,
      downloadUrl: null
    }));
  } catch (error) {
    console.error('Confluence API error:', error);
    throw new Error('Failed to fetch Confluence files');
  }
};

const fetchNotionFiles = async (integrationId: string, connectionId: string) => {
  try {
    // Use Nango's listRecords method to get ContentMetadata
    const response = await nango.listRecords({
      providerConfigKey: integrationId,
      connectionId,
      model: 'ContentMetadata',
      limit: 100
    });

    return response.records.map((record: any) => {
      const content = record.record as ContentMetadata;
      return {
        id: `notion:${content.id}`,
        provider: 'notion',
        providerId: content.id,
        kind: content.object === 'database' ? 'folder' : 'file',
        name: getNotionContentName(content),
        mimeType: 'application/notion-page',
        sizeBytes: null,
        modifiedAt: content.last_edited_time,
        parentId: content.parent?.page_id ? `notion:${content.parent.page_id}` : 
                  content.parent?.database_id ? `notion:${content.parent.database_id}` : null,
        webUrl: content.url,
        downloadUrl: null,
        // Additional Notion-specific metadata
        metadata: {
          object: content.object,
          createdTime: content.created_time,
          lastEditedTime: content.last_edited_time,
          createdBy: content.created_by,
          lastEditedBy: content.last_edited_by,
          cover: content.cover,
          icon: content.icon,
          parent: content.parent,
          archived: content.archived,
          inTrash: content.in_trash,
          publicUrl: content.public_url,
          properties: content.properties
        }
      };
    });
  } catch (error) {
    console.error('Notion API error:', error);
    throw new Error('Failed to fetch Notion files');
  }
};

// Helper function to extract name from Notion content
const getNotionContentName = (content: ContentMetadata): string => {
  // Try to get title from properties
  if (content.properties?.title?.title?.[0]?.text?.content) {
    return content.properties.title.title[0].text.content;
  }
  
  // Try other common title fields
  if (content.properties?.Name?.title?.[0]?.text?.content) {
    return content.properties.Name.title[0].text.content;
  }
  
  if (content.properties?.name?.title?.[0]?.text?.content) {
    return content.properties.name.title[0].text.content;
  }
  
  // Fallback to object type
  return `${content.object} ${content.id.slice(0, 8)}`;
};

const fetchS3Files = async (integrationId: string, connectionId: string) => {
  try {
    const response = await nango.get({
      endpoint: '/',
      providerConfigKey: integrationId,
      connectionId
    });

    // S3 returns XML, so we'd need to parse it
    // This is a simplified example
    return [{
      id: 's3:example-bucket',
      provider: 's3',
      providerId: 'example-bucket',
      kind: 'folder',
      name: 'Example Bucket',
      mimeType: null,
      sizeBytes: null,
      modifiedAt: new Date().toISOString(),
      parentId: null,
      webUrl: null,
      downloadUrl: null
    }];
  } catch (error) {
    console.error('S3 API error:', error);
    throw new Error('Failed to fetch S3 files');
  }
};

// List all integrations
export async function listIntegrations() {
  try {
    const response = await nango.listIntegrations();
    return response.configs;
  } catch (error) {
    console.error('Error listing integrations:', error);
    throw new Error('Failed to list integrations');
  }
}

// List connections for a specific integration
export async function listConnections(integrationId: string) {
  try {
    const response = await nango.listConnections(integrationId);
    return response.connections;
  } catch (error) {
    console.error('Error listing connections:', error);
    throw new Error('Failed to list connections');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET requests for listing integrations and connections
    const { action, integrationId } = req.query;
    
    try {
      if (action === 'integrations') {
        const integrations = await listIntegrations();
        res.status(200).json({ integrations });
      } else if (action === 'connections' && integrationId) {
        const connections = await listConnections(integrationId as string);
        res.status(200).json({ connections });
      } else {
        res.status(400).json({ error: 'Invalid action or missing integrationId' });
      }
    } catch (error: any) {
      console.error('Nango API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'POST') {
    // Handle POST requests for fetching files
    try {
      const { provider, integrationId, connectionId } = req.body;

      if (!provider || !integrationId) {
        return res.status(400).json({ error: 'Missing required parameters: provider and integrationId' });
      }

      // For demo purposes, use a default connection ID if not provided
      const effectiveConnectionId = connectionId || 'demo-connection-id';

      const documents = await fetchProviderFiles(provider, integrationId, effectiveConnectionId);

      res.status(200).json({ documents });
    } catch (error: any) {
      console.error('Nango API error:', error);
      
      // Handle rate limiting as per Nango docs
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        res.status(429).json({ 
          error: 'Rate limited',
          retryAfter: retryAfter ? parseInt(retryAfter) : 60
        });
        return;
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch files',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
