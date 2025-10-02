# Unified File Picker Backend

A CORS proxy server for the Unified File Picker to handle API calls that are restricted by CORS policies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

The server will run on `http://localhost:3001` by default.

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Notion API
```
POST /api/notion/search
POST /api/notion/database/:databaseId/query
```

### Dropbox API
```
POST /api/dropbox/list_folder
```

### Box API
```
GET /api/box/folders/:folderId/items
```

### SharePoint API
```
GET /api/sharepoint/sites/:siteId/drives/:driveId/items/:itemId/children
```

### Confluence API
```
GET /api/confluence/content
```

## 🔧 Configuration

Create a `.env` file:

```bash
# Server Configuration
PORT=3001

# CORS Configuration (for production)
CORS_ORIGIN=http://localhost:3000
```

## 🛡️ Security Notes

- This backend is designed for development and demo purposes
- In production, add proper authentication and rate limiting
- Configure CORS_ORIGIN to your frontend domain
- Consider adding request validation and sanitization

## 🔄 How It Works

1. Frontend makes requests to this backend
2. Backend forwards requests to external APIs
3. Backend handles CORS and authentication
4. Backend returns formatted responses to frontend

## 📝 Example Usage

```javascript
// Frontend calls backend
const response = await fetch('http://localhost:3001/api/notion/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'your-notion-token',
    query: 'search term'
  })
});

const data = await response.json();
console.log(data.files); // Array of files
```

## 🚀 Production Deployment

For production deployment:

1. Set up proper environment variables
2. Configure CORS_ORIGIN to your frontend domain
3. Add authentication middleware
4. Add rate limiting
5. Use HTTPS
6. Consider using a reverse proxy like Nginx
