/**
 * Unified File Picker Types
 * 
 * This file contains all the TypeScript types used by the Unified File Picker component.
 */

export type Provider = "google" | "dropbox" | "onedrive" | "box" | "sharepoint" | "confluence" | "notion";

export interface PickedFile {
  provider: Provider;
  id: string;
  name: string;
  mimeType?: string | null;
  size?: number | null;
  downloadUrl?: string | null;
  webViewUrl?: string | null;
  raw?: unknown;
}

export interface UnifiedPickerResult {
  files: PickedFile[];
}

export interface GooglePickerOptions {
  mimeTypes?: string[];
  viewId?: string;
  multiselect?: boolean;
}

export interface DropboxOptions {
  path?: string;
  recursive?: boolean;
}

export interface OneDriveOptions {
  folderId?: string;
  searchQuery?: string;
  siteId?: string;
}

export interface BoxOptions {
  folderId?: string;
  fileTypes?: string[];
}

export interface SharePointOptions {
  siteId?: string;
  driveId?: string;
  folderId?: string;
  searchQuery?: string;
}

export interface ConfluenceOptions {
  spaceKey?: string;
  pageId?: string;
  searchQuery?: string;
  contentTypes?: string[];
}

export interface NotionOptions {
  databaseId?: string;
  pageId?: string;
  searchQuery?: string;
  filterTypes?: string[];
}

export interface UnifiedFilePickerProps {
  providers?: Provider[];
  onPick: (result: UnifiedPickerResult) => void;
  onCancel?: () => void;
  tokens: Partial<Record<Provider, string>> & {
    confluenceBaseUrl?: string;
  };
  googleAppId?: string; // Google Cloud Project Number
  className?: string;
  googlePickerOptions?: GooglePickerOptions;
  dropboxOptions?: DropboxOptions;
  onedriveOptions?: OneDriveOptions;
  boxOptions?: BoxOptions;
  sharepointOptions?: SharePointOptions;
  confluenceOptions?: ConfluenceOptions;
  notionOptions?: NotionOptions;
}

export interface ProviderConfig {
  name: string;
  displayName: string;
  icon: string;
  color: string;
}

export const PROVIDER_CONFIGS: Record<Provider, ProviderConfig> = {
  google: {
    name: "google",
    displayName: "Google Drive",
    icon: "G",
    color: "bg-blue-500"
  },
  dropbox: {
    name: "dropbox", 
    displayName: "Dropbox",
    icon: "D",
    color: "bg-blue-600"
  },
  onedrive: {
    name: "onedrive",
    displayName: "OneDrive", 
    icon: "O",
    color: "bg-blue-700"
  },
  box: {
    name: "box",
    displayName: "Box",
    icon: "B", 
    color: "bg-orange-500"
  },
  sharepoint: {
    name: "sharepoint",
    displayName: "SharePoint",
    icon: "S",
    color: "bg-purple-600"
  },
  confluence: {
    name: "confluence",
    displayName: "Confluence",
    icon: "C",
    color: "bg-blue-800"
  },
  notion: {
    name: "notion",
    displayName: "Notion",
    icon: "N",
    color: "bg-gray-800"
  }
};
