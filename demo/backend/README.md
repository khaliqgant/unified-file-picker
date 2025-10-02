# Unified File Picker Backend Demo

This is a demonstration backend that implements the Unified File Picker API specification.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:3001` by default.

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Unified File Picker API (Spec Compliant)

#### Get Available Providers
```
GET /api/storage/providers
```

#### List Files/Folders
```
GET /api/storage/list?provider={provider}&folderId={folderId}
Authorization: Bearer {session-token}
```

#### Search Files
```
GET /api/storage/search?provider={provider}&q={query}
Authorization: Bearer {session-token}
```

#### Get Specific Node
```
GET /api/storage/node?provider={provider}&id={nodeId}
Authorization: Bearer {session-token}
```

#### Generate Presigned Download URL
```
POST /api/storage/presign-download
Authorization: Bearer {session-token}
Content-Type: application/json

{
  "provider": "gdrive",
  "documentId": "gdrive:file123"
}
```

## 🔧 Configuration

Create a `.env` file:

```bash
# Server Configuration
PORT=3001

# CORS Configuration (for production)
CORS_ORIGIN=http://localhost:3000
```

## 📝 Document Model

All endpoints return documents in the unified format:

```typescript
interface Document {
  id: string;                 // `${provider}:${providerId}`
  provider: "gdrive" | "dropbox" | "onedrive" | "box" | "s3";
  providerId: string;
  kind: "file" | "folder" | "shortcut";
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  modifiedAt?: string;        
  parentId?: string | null;
  path?: string[];            
  webUrl?: string;            
  thumbnailUrl?: string;      
  downloadUrl?: string;       
  shortcutTargetId?: string;  
  owners?: { id?: string; email?: string; displayName?: string }[];
  permissions?: ("reader"|"writer"|"owner")[];
}
```

## 🎯 Demo Mode

This backend currently returns mock data for demonstration purposes. In a real implementation, you would:

1. **Authenticate the session token** with your user management system
2. **Call provider APIs** based on the provider parameter
3. **Normalize responses** to the Document model
4. **Handle errors** and rate limiting appropriately

## 🚀 Production Considerations

For production deployment:

1. **Add authentication middleware** to validate session tokens
2. **Implement provider-specific logic** for each storage provider
3. **Add rate limiting** and request validation
4. **Use HTTPS** and configure CORS properly
5. **Add logging and monitoring**
6. **Implement caching** for frequently accessed data

## 🔄 How It Works

1. **Frontend** calls this backend with a session token
2. **Backend** validates the token and determines which provider to use
3. **Backend** calls the appropriate provider API (Google Drive, Dropbox, etc.)
4. **Backend** normalizes the response to the Document model
5. **Backend** returns the unified format to the frontend

This approach eliminates CORS issues and keeps provider tokens secure on the server side.