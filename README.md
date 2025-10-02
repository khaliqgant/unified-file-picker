# Unified File Picker

[![npm version](https://badge.fury.io/js/unified-file-picker.svg)](https://badge.fury.io/js/unified-file-picker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A React component library for selecting files from multiple cloud storage providers with a unified interface. Supports 8 major cloud providers with both native pickers and custom interfaces.

## ✨ Features

- 🎨 **Beautiful UI** with smooth animations and modern design
- 🔄 **8 Cloud Providers** - Google Drive, Dropbox, OneDrive, Box, SharePoint, Confluence, Notion, Amazon S3
- 🚀 **Two Operation Modes** - Backend-driven and Direct modal
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Real-time Loading States** - Visual feedback during API calls
- 🛡️ **Error Handling** - Graceful error messages and recovery
- 📁 **File Preview** - See file details, size, and type
- 🔗 **Direct Links** - Download and view files in browser
- 🎯 **Unified Interface** - Single API with provider-specific options
- 🚀 **Native Pickers** - Google Drive Picker, OneDrive File Picker v8
- 📦 **TypeScript Support** - Full type safety and IntelliSense
- 🎛️ **Customizable** - Provider-specific configuration options
- 🔧 **Backend Integration** - BFF pattern for enterprise use

## 🚀 Quick Start

### Installation

```bash
npm install unified-file-picker
# or
yarn add unified-file-picker
# or
pnpm add unified-file-picker
```

### Basic Usage

#### Backend-Driven Mode (Recommended for Production)

```tsx
import React, { useState } from 'react';
import { UnifiedPicker, Document } from 'unified-file-picker';

function App() {
  const [docs, setDocs] = useState<Document[]>([]);

  return (
    <UnifiedPicker
      mode="backend"
      token="your-session-token"
      onSelect={(docs) => setDocs(docs)}
      multiple={true}
      providers={["gdrive", "dropbox", "onedrive", "box", "sharepoint", "confluence", "notion", "s3"]}
    />
  );
}
```

#### Direct Modal Mode (For Native Pickers)

```tsx
import React, { useState } from 'react';
import { UnifiedPicker, Document } from 'unified-file-picker';

function App() {
  const [docs, setDocs] = useState<Document[]>([]);

  return (
    <UnifiedPicker
      mode="modal"
      provider="gdrive"
      accessToken="your-google-oauth-token"
      onSelect={(docs) => setDocs(docs)}
      multiple={true}
    />
  );
}
```

#### Legacy Component (Still Supported)

```tsx
import React, { useState } from 'react';
import { UnifiedFilePicker, PickedFile } from 'unified-file-picker';

function App() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  return (
    <UnifiedFilePicker
      tokens={{
        google: "your_google_token",
        dropbox: "your_dropbox_token",
        onedrive: "your_onedrive_token",
        box: "your_box_token"
      }}
      googleAppId="123456789012" // Your Google Cloud Project Number
      onPick={(result) => setFiles(result.files)}
      onCancel={() => console.log("Cancelled")}
    />
  );
}
```

## 📖 Documentation

### Two Operation Modes

#### 1. Backend-Driven Mode (Recommended for Production)

The picker calls your backend with a session token. Your backend handles all provider authentication and API calls, normalizes responses to the Document model, and returns them.

**Benefits:**
- ✅ No CORS or tokens in the browser
- ✅ Best for consistency and control  
- ✅ Full customization of UI
- ✅ Enterprise security compliance

#### 2. Direct Modal Mode (For Native Pickers)

For providers with an official picker UI (Google Drive Picker, OneDrive File Picker), the picker can accept an access token directly and open the vendor's modal.

**Benefits:**
- ✅ Fastest to integrate
- ✅ Uses native provider UIs
- ✅ Familiar user experience

### UnifiedPicker Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `"backend" \| "modal"` | ✅ | Operation mode |
| `token` | `string` | ✅ (backend) | Session token for backend mode |
| `provider` | `Provider` | ✅ (modal) | Provider for modal mode |
| `accessToken` | `string` | ✅ (modal) | Access token for modal mode |
| `onSelect` | `(docs: Document[]) => void` | ✅ | Callback when documents are selected |
| `multiple` | `boolean` | - | Allow multiple selection (default: false) |
| `providers` | `Provider[]` | - | Available providers for backend mode |

### Supported Providers

| Provider | Backend Mode | Modal Mode | Native Picker |
|----------|-------------|------------|---------------|
| Google Drive | ✅ | ✅ | ✅ Google Picker |
| Dropbox | ✅ | ❌ | ❌ |
| OneDrive | ✅ | ✅ | ✅ OneDrive File Picker v8 |
| Box | ✅ | ❌ | ❌ |
| SharePoint | ✅ | ❌ | ❌ |
| Confluence | ✅ | ❌ | ❌ |
| Notion | ✅ | ❌ | ❌ |
| Amazon S3 | ✅ | ❌ | ❌ |

### Document Model

```typescript
interface Document {
  id: string;                 // `${provider}:${providerId}`
  provider: Provider;
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

### Provider-Specific Options

#### Google Drive (Native Picker)

```tsx
<UnifiedFilePicker
  googlePickerOptions={{
    mimeTypes: ["application/pdf", "image/*"], // Filter file types
    multiselect: true // Allow multiple file selection
  }}
  // ... other props
/>
```

**Features:**
- ✅ Native Google Picker UI
- ✅ MIME type filtering
- ✅ Multi-select support
- ✅ My Drive & Shared with Me views
- ✅ Folder selection support
- ✅ Shared Drives support

#### Dropbox

```tsx
<UnifiedFilePicker
  dropboxOptions={{
    path: "", // Start path (empty = root)
    recursive: false // Include subfolders
  }}
  // ... other props
/>
```

#### OneDrive (Native Picker)

```tsx
<UnifiedFilePicker
  onedriveOptions={{
    folderId: "root", // Start folder
    searchQuery: "" // Search filter
  }}
  // ... other props
/>
```

**Features:**
- ✅ Native OneDrive File Picker v8
- ✅ Microsoft 365 Integration
- ✅ OneDrive & SharePoint access
- ✅ MSAL Authentication
- ✅ Upload support in picker
- ✅ Familiar Microsoft UI

#### Box

```tsx
<UnifiedFilePicker
  boxOptions={{
    folderId: "0", // Start folder (0 = root)
    fileTypes: ["file"] // File type filter
  }}
  // ... other props
/>
```

### File Object Structure

Each picked file has this structure:

```typescript
interface PickedFile {
  provider: "google" | "dropbox" | "onedrive" | "box";
  id: string;
  name: string;
  mimeType?: string | null;
  size?: number | null;
  downloadUrl?: string | null;
  webViewUrl?: string | null;
  raw?: unknown; // Original API response
}
```

## 🔧 Advanced Usage

### Using Individual Providers

```tsx
import { openGooglePicker, openDropboxPicker } from 'unified-file-picker';

// Google Picker
await openGooglePicker(
  accessToken,
  { mimeTypes: ["image/*"] },
  (files) => console.log(files),
  () => console.log("Cancelled")
);

// Dropbox
await openDropboxPicker(
  accessToken,
  { path: "/Documents" },
  (files) => console.log(files),
  () => console.log("Cancelled")
);
```

### Custom Styling

The component uses Tailwind CSS classes. You can override styles by passing a `className` prop or by customizing your Tailwind configuration.

```tsx
<UnifiedFilePicker
  className="my-custom-picker"
  // ... other props
/>
```

## 🔑 Getting API Tokens

### Google Drive
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API and Google Picker API
4. Create credentials (OAuth 2.0 Client ID)
5. Get your **Project Number**:
   - Go to **IAM & Admin** > **Settings**
   - Copy the **Project Number** (this is your App ID)
6. Use the access token from OAuth flow

### Dropbox
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Create a new app
3. Generate access token in the app settings

### OneDrive
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add Microsoft Graph permissions
4. Get access token via OAuth flow

### Box
1. Go to [Box Developer Console](https://app.box.com/developers/console)
2. Create a new app
3. Generate access token in the app settings

## 🎨 Examples

### Basic File Picker

```tsx
import React, { useState } from 'react';
import { UnifiedFilePicker, PickedFile } from 'unified-file-picker';

function BasicExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  return (
    <div>
      <UnifiedFilePicker
        tokens={{
          google: process.env.REACT_APP_GOOGLE_TOKEN!,
          dropbox: process.env.REACT_APP_DROPBOX_TOKEN!,
        }}
        onPick={(result) => setFiles(result.files)}
        onCancel={() => console.log("Cancelled")}
      />
      
      {files.length > 0 && (
        <div>
          <h3>Selected Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({file.provider})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Google Drive Only with Custom Options

```tsx
import React from 'react';
import { UnifiedFilePicker } from 'unified-file-picker';

function GoogleDriveExample() {
  return (
    <UnifiedFilePicker
      providers={["google"]}
      tokens={{
        google: process.env.REACT_APP_GOOGLE_TOKEN!
      }}
      googlePickerOptions={{
        mimeTypes: ["application/pdf", "image/*"],
        multiselect: true
      }}
      onPick={(result) => {
        console.log("Selected files:", result.files);
      }}
      onCancel={() => console.log("Cancelled")}
    />
  );
}
```

### Custom Styling

```tsx
import React from 'react';
import { UnifiedFilePicker } from 'unified-file-picker';

function CustomStyledExample() {
  return (
    <div className="max-w-2xl mx-auto">
      <UnifiedFilePicker
        className="custom-picker shadow-2xl"
        tokens={{
          google: process.env.REACT_APP_GOOGLE_TOKEN!,
        }}
        onPick={(result) => console.log(result.files)}
        onCancel={() => console.log("Cancelled")}
      />
    </div>
  );
}
```

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/unified-file-picker.git
cd unified-file-picker

# Install dependencies
npm install

# Build the package
npm run build
```

### Project Structure

```
unified-file-picker/
├── src/                    # Source code
│   ├── types/             # TypeScript definitions
│   │   ├── index.ts       # Legacy types
│   │   └── document.ts    # Document model
│   ├── providers/         # Provider implementations
│   │   ├── google-picker.ts    # Google Picker API
│   │   ├── onedrive-picker.ts  # OneDrive File Picker v8
│   │   ├── dropbox.ts          # Dropbox REST API
│   │   ├── box.ts              # Box REST API
│   │   ├── sharepoint.ts       # SharePoint REST API
│   │   ├── confluence.ts        # Confluence REST API
│   │   ├── notion.ts            # Notion REST API
│   │   └── index.ts              # Provider exports
│   ├── ui/                # UI components
│   │   └── button.tsx     # Button component
│   ├── UnifiedFilePicker.tsx  # Legacy component
│   ├── UnifiedPicker.tsx      # New unified component
│   └── index.ts           # Main exports
├── examples/              # Usage examples
├── demo/                  # Next.js demo application
│   ├── pages/             # Demo pages
│   ├── backend/           # Backend implementation
│   ├── src/               # Local demo components
│   └── .env.local         # Demo environment variables
├── dist/                  # Built package (generated)
└── package.json           # NPM package configuration
```

### Building

```bash
# Build the package
npm run build

# Watch mode for development
npm run dev

# Type check
npm run type-check

# Clean build artifacts
npm run clean
```

### Demo Application

The demo showcases all 8 cloud providers with both operation modes and native pickers.

#### Quick Start (Demo Mode)

```bash
cd demo
npm install
npm run dev
```

This will start the demo with mock data - no API tokens required! Perfect for exploring the interface.

**Demo Features:**
- 🏠 **Homepage** - Overview and feature showcase
- 🧪 **Demo Page** - Interactive testing of both modes
- 🔧 **Backend Integration** - Full BFF implementation
- 📱 **Responsive Design** - Works on all devices

#### Full Setup (Real API Integration)

To test with real cloud providers:

1. **Copy environment template:**
   ```bash
   cd demo
   cp .env.example .env.local
   ```

2. **Configure your API tokens:**
   Edit `demo/.env.local` with your actual tokens:

   ```bash
   # Google Drive (Native Picker)
   NEXT_PUBLIC_GOOGLE_TOKEN=ya29.your_actual_google_token
   NEXT_PUBLIC_GOOGLE_APP_ID=123456789012

   # OneDrive (Native Picker v8)  
   NEXT_PUBLIC_ONEDRIVE_TOKEN=EwBwAq_your_actual_onedrive_token
   REACT_APP_ONEDRIVE_CLIENT_ID=your-azure-client-id
   REACT_APP_SHAREPOINT_TENANT=your-tenant-name

   # Dropbox (REST API)
   NEXT_PUBLIC_DROPBOX_TOKEN=sl.BD_your_actual_dropbox_token

   # Box (REST API)
   NEXT_PUBLIC_BOX_TOKEN=eyJhbGci_your_actual_box_token

   # SharePoint (Microsoft Graph)
   NEXT_PUBLIC_SHAREPOINT_TOKEN=eyJ0eXAi_your_actual_sharepoint_token

   # Confluence (Atlassian API)
   NEXT_PUBLIC_CONFLUENCE_TOKEN=your_actual_confluence_token
   REACT_APP_CONFLUENCE_BASE_URL=https://your-domain.atlassian.net

   # Notion (Notion API)
   NEXT_PUBLIC_NOTION_TOKEN=secret_your_actual_notion_token
   ```

3. **Start the backend:**
   ```bash
   cd demo/backend
   npm install
   npm start
   ```

4. **Start the demo:**
   ```bash
   cd demo
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) (or the next available port)

#### Backend API Endpoints

The demo includes a full backend implementation with these endpoints:

- `GET /api/storage/providers` - List available providers
- `GET /api/storage/list?provider={id}` - List files from provider
- `GET /api/storage/search?provider={id}&query={q}` - Search files
- `GET /api/storage/node/{id}` - Get specific file/folder
- `POST /api/storage/presign-download` - Get download URLs

#### Backend API Specification

For production use, implement these endpoints in your backend:

```typescript
// GET /api/storage/providers
interface ProvidersResponse {
  providers: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

// GET /api/storage/list?provider={id}&folderId={id}
interface ListResponse {
  documents: Document[];
}

// GET /api/storage/search?provider={id}&query={q}
interface SearchResponse {
  documents: Document[];
}

// GET /api/storage/node/{id}
interface NodeResponse {
  document: Document;
}

// POST /api/storage/presign-download
interface PresignRequest {
  documentId: string;
  expiresIn?: number; // seconds, default 3600
}
interface PresignResponse {
  downloadUrl: string;
  expiresAt: string;
}
```

**Authentication:**
- All requests require `Authorization: Bearer {session-token}` header
- Your backend validates the session token and maps it to provider tokens
- Provider tokens should never be exposed to the frontend

#### Getting API Tokens

See the detailed setup instructions in the [Getting API Tokens](#-getting-api-tokens) section below.

**Note:** Environment variables for the demo go in the `demo/` directory, not the root directory.

## 🔑 Getting API Tokens

### Google Drive (Native Picker)

1. **Go to Google Cloud Console:**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs:**
   - Go to "APIs & Services" > "Library"
   - Enable "Google Drive API" and "Google Picker API"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs (e.g., `http://localhost:3000`)

4. **Get Project Number:**
   - Go to "IAM & Admin" > "Settings"
   - Copy the "Project Number" (this is your `GOOGLE_APP_ID`)

5. **Get Access Token:**
   - Use OAuth 2.0 flow to get access token
   - Or use Google's OAuth 2.0 Playground for testing

### OneDrive (Native Picker v8)

1. **Go to Azure Portal:**
   - Visit [https://portal.azure.com/](https://portal.azure.com/)
   - Sign in with your Microsoft account

2. **Create App Registration:**
   - Go to "Azure Active Directory" > "App registrations"
   - Click "New registration"
   - Name: "Unified File Picker"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: Single-page application, `http://localhost:3000`

3. **Configure API Permissions:**
   - Go to "API permissions" > "Add a permission"
   - Microsoft Graph: `Files.Read.All`, `Sites.Read.All`
   - SharePoint: `MyFiles.Read`, `AllSites.Read`

4. **Get Client ID:**
   - Copy the "Application (client) ID" from Overview
   - This is your `REACT_APP_ONEDRIVE_CLIENT_ID`

5. **Get Tenant Name:**
   - Your tenant name (e.g., "contoso" for contoso.sharepoint.com)
   - This is your `REACT_APP_SHAREPOINT_TENANT`

### Dropbox (REST API)

1. **Go to Dropbox App Console:**
   - Visit [https://www.dropbox.com/developers/apps](https://www.dropbox.com/developers/apps)
   - Sign in with your Dropbox account

2. **Create New App:**
   - Click "Create app"
   - Choose "Scoped access" > "Full Dropbox"
   - Name your app (e.g., "Unified File Picker")

3. **Generate Access Token:**
   - Go to your app's settings
   - Scroll to "OAuth 2" section
   - Click "Generate access token"
   - Copy the generated token

### Box (REST API)

1. **Go to Box Developer Console:**
   - Visit [https://app.box.com/developers/console](https://app.box.com/developers/console)
   - Sign in with your Box account

2. **Create New App:**
   - Click "Create New App"
   - Choose "Custom App" > "Server Authentication (JWT)"
   - Name your app

3. **Generate Access Token:**
   - Go to "Configuration" > "Access Token Actions"
   - Click "Generate Token"
   - Copy the generated token

### SharePoint (Microsoft Graph)

1. **Use Same App Registration as OneDrive:**
   - The same Azure AD app registration works for SharePoint
   - Just ensure you have the right permissions

2. **Get Access Token:**
   - Use the same OAuth flow as OneDrive
   - The token will work for both OneDrive and SharePoint

### Confluence (Atlassian API)

1. **Go to Atlassian Developer Console:**
   - Visit [https://developer.atlassian.com/](https://developer.atlassian.com/)
   - Sign in with your Atlassian account

2. **Create Personal Access Token:**
   - Go to "Personal access tokens"
   - Click "Create token"
   - Name: "Unified File Picker"
   - Scopes: Select "Confluence" > "Read"

3. **Get Base URL:**
   - Your Confluence instance URL (e.g., `https://your-domain.atlassian.net`)

### Notion (Notion API)

⚠️ **CORS Limitation**: Notion API has CORS restrictions that prevent direct browser requests. For production use, you'll need a backend proxy to handle Notion API calls.

**For Demo/Development:**
- The demo shows mock data for Notion
- No real API calls are made due to CORS restrictions

**For Production:**
1. **Go to Notion Integrations:**
   - Visit [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Sign in with your Notion account

2. **Create New Integration:**
   - Click "New integration"
   - Name: "Unified File Picker"
   - Select workspace
   - Copy the "Internal Integration Token"

3. **Share Pages with Integration:**
   - Go to the pages you want to access
   - Click "Share" > "Invite" > Select your integration

4. **Backend Proxy Required:**
   - Create a backend endpoint to proxy Notion API calls
   - Pass the Notion token to your backend
   - Return the results to your frontend

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Picker API](https://developers.google.com/drive/picker) for the native Google Drive picker
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](#-documentation)
2. Search [existing issues](https://github.com/yourusername/unified-file-picker/issues)
3. Create a [new issue](https://github.com/yourusername/unified-file-picker/issues/new)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)