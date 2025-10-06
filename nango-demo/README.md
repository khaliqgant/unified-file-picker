# Nango-Powered Unified File Picker Demo

This demo showcases how to use Nango to handle OAuth flows and API calls for the Unified File Picker across 8 cloud providers.

## 🚀 Features

- **Nango Integration**: Uses Nango for OAuth flows and API calls
- **8 Cloud Providers**: Google Drive, Dropbox, OneDrive, Box, SharePoint, Confluence, Notion, Amazon S3
- **Unified API**: Single interface to access all providers
- **Automatic Token Management**: Nango handles token refresh and credential storage
- **No CORS Issues**: Backend proxy handles all API calls

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Nango

1. **Sign up for Nango**: Go to [https://app.nango.dev](https://app.nango.dev) and create an account
2. **Get your credentials**:
   - Secret Key (from Environment Settings)
   - Connect Session Token (for frontend)
3. **Create integrations** for each provider:
   - Google Drive
   - Dropbox  
   - OneDrive
   - Box
   - SharePoint
   - Confluence
   - Notion
   - Amazon S3

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Nango credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Nango Configuration (Backend Only)
NANGO_SECRET_KEY=your_actual_secret_key
NANGO_HOST=https://api.nango.dev

# Note: No frontend SDK needed - using backend API with Nango Node SDK
# The backend uses nango.listRecords() to fetch data from providers
```

### 4. Run the Demo

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo.

## 🔧 How It Works

### 1. Backend-Only Architecture
- **No Frontend OAuth**: Uses Nango Node SDK on backend only
- **API-First**: Frontend makes simple HTTP requests to backend
- **Unified Data**: Backend normalizes all provider responses

### 2. File Browsing
- Backend uses `nango.listRecords()` for Notion with `ContentMetadata` model
- Backend uses `nango.get()`, `nango.post()` for direct API calls to other providers
- **Notion Integration**: Uses `ContentMetadata` model from Nango templates
- Provider-specific API calls are normalized
- Files are returned in unified Document format

### 3. File Selection
- User selects files from the picker
- Selected files are returned with metadata
- Download and view URLs are provided

## 📁 Project Structure

```
nango-demo/
├── pages/
│   ├── index.tsx          # Homepage
│   ├── demo.tsx           # Demo page
│   └── api/
│       └── nango/
│           └── files.ts   # Backend API for Nango
├── components/
│   └── NangoFilePicker.tsx # Main picker component
├── styles/
│   └── globals.css        # Global styles
└── .env.example           # Environment template
```

## 🔑 Nango Integration Setup

For each provider, you'll need to:

1. **Create OAuth App** on the provider's developer portal
2. **Configure Integration** in Nango dashboard
3. **Set up Scopes** and permissions
4. **Test Connection** in Nango

### Provider-Specific Setup

#### Google Drive
- Enable Google Drive API
- Create OAuth 2.0 credentials
- Set scopes: `https://www.googleapis.com/auth/drive.readonly`

#### Dropbox
- Create Dropbox app
- Set scopes: `files.metadata.read files.content.read`

#### OneDrive
- Register Azure AD app
- Set Microsoft Graph permissions: `Files.Read`

#### Box
- Create Box app
- Set scopes: `read`

#### SharePoint
- Use same Azure AD app as OneDrive
- Set Microsoft Graph permissions: `Sites.Read.All`

#### Confluence
- Create Atlassian app
- Set scopes: `read:confluence-content.all`

#### Notion
- Create Notion integration
- Set scopes: `read`

#### Amazon S3
- Create IAM user with S3 permissions
- Use API key authentication

## 🎯 Benefits of Backend-Only Nango Integration

- **🔐 Backend Security**: All OAuth handled server-side, no tokens in browser
- **🌐 Unified API**: Single `nango.listRecords()` call for all providers
- **🛡️ No CORS Issues**: Backend proxy handles all API calls
- **⚡ Performance**: Optimized API calls and caching on backend
- **🔧 Simple Frontend**: Just HTTP requests, no OAuth complexity
- **📊 Rich Data**: Uses Nango's `ContentMetadata` model for Notion

## 🚀 Production Deployment

For production use:

1. **Set up Nango Cloud** or self-host Nango
2. **Configure production OAuth apps** for each provider
3. **Set up proper scopes** and permissions
4. **Implement error handling** and retry logic
5. **Add rate limiting** and monitoring

## 📞 Support

- [Nango Documentation](https://docs.nango.dev)
- [Nango Community](https://nango.dev/community)
- [GitHub Issues](https://github.com/nangohq/nango/issues)
