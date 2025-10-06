# 🔧 Nango Node SDK Setup Guide

This guide shows how to properly configure the Nango Node SDK for the Unified File Picker demo.

## 📋 Prerequisites

1. **Nango Account**: Sign up at [https://app.nango.dev](https://app.nango.dev)
2. **Node.js**: Version 18+ recommended
3. **npm**: For package management

## 🔑 Step 1: Get Your Nango Credentials

1. **Login to Nango Dashboard**: Go to [https://app.nango.dev](https://app.nango.dev)
2. **Navigate to Environment Settings**: Click on your environment → Settings
3. **Copy Secret Key**: Copy your secret key (starts with `sk_...`)

## 🛠️ Step 2: Configure Environment Variables

Create `.env.local` in the `nango-demo` directory:

```bash
# Nango Configuration (Backend Only)
NANGO_SECRET_KEY=sk_your_actual_secret_key_here
NANGO_HOST=https://api.nango.dev
```

## 🔌 Step 3: Set Up Integrations

For each provider you want to use, create an integration in your Nango dashboard:

### **Notion Integration (using ContentMetadata model)**

1. **Go to Integrations** → **Create Integration**
2. **Choose Provider**: Select "Notion"
3. **Configure OAuth**:
   - **Client ID**: Your Notion integration client ID
   - **Client Secret**: Your Notion integration secret
   - **Scopes**: `read`
4. **Save Integration ID**: Note the integration ID (e.g., `notion`)

### **Other Providers**

- **Google Drive**: Create integration with Google OAuth
- **Dropbox**: Create integration with Dropbox OAuth
- **OneDrive**: Create integration with Microsoft OAuth
- **Box**: Create integration with Box OAuth
- **SharePoint**: Create integration with Microsoft Graph
- **Confluence**: Create integration with Atlassian OAuth
- **Amazon S3**: Create integration with AWS credentials

## 🔗 Step 4: Get Connection IDs

Connection IDs are created when users authenticate. For demo purposes:

### **Option A: Use Demo Connection ID (Simplest)**
The demo is configured to use `'demo-connection-id'` as a fallback.

### **Option B: Create Real Connections**
1. **Set up OAuth flows** in your Nango dashboard
2. **Test connections** by authenticating with each provider
3. **Get connection IDs** from the Nango dashboard after successful authentication

## 🚀 Step 5: Test the Setup

1. **Start the demo**:
   ```bash
   cd nango-demo
   npm run dev
   ```

2. **Visit** `http://localhost:3000`

3. **Test a provider** by clicking "Connect" and then "Load Files"

## 📚 Nango Node SDK Methods Used

The demo uses the following Nango Node SDK methods:

### **For Notion (ContentMetadata model)**:
```typescript
const response = await nango.listRecords({
  providerConfigKey: integrationId,
  connectionId,
  model: 'ContentMetadata',
  limit: 100
});
```

### **For Other Providers**:
```typescript
// Google Drive
const response = await nango.get({
  endpoint: '/drive/v3/files',
  params: { pageSize: 100 },
  providerConfigKey: integrationId,
  connectionId
});

// Dropbox
const response = await nango.post({
  endpoint: '/2/files/list_folder',
  data: { path: '' },
  providerConfigKey: integrationId,
  connectionId
});
```

## 🎯 Key Benefits

- **🔐 Backend Security**: All OAuth handled server-side
- **🌐 Unified API**: Single interface for all providers
- **🛡️ No CORS Issues**: Backend proxy handles all API calls
- **📊 Rich Data**: Uses Nango's `ContentMetadata` model for Notion
- **⚡ Performance**: Optimized API calls and caching

## 🚨 Troubleshooting

### **Rate Limiting**
The demo includes rate limiting handling as per [Nango documentation](https://docs.nango.dev/reference/sdks/node):

```typescript
if (error.response?.status === 429) {
  const retryAfter = error.response.headers['retry-after'];
  // Handle rate limiting
}
```

### **Connection Issues**
- Ensure your secret key is correct
- Verify integration IDs match your Nango dashboard
- Check that connection IDs are valid (or use demo connection ID)

### **API Errors**
- Check Nango dashboard for integration status
- Verify OAuth credentials are correct
- Ensure proper scopes are set for each provider

## 📖 Additional Resources

- [Nango Node SDK Documentation](https://docs.nango.dev/reference/sdks/node)
- [Nango Integration Templates](https://github.com/NangoHQ/integration-templates)
- [Notion ContentMetadata Model](https://github.com/NangoHQ/integration-templates/blob/main/integrations/notion/models.ts#L29)
