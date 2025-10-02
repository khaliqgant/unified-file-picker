/**
 * Document Model
 * 
 * Unified model for files and folders across all storage providers
 */

export type DocumentKind = "file" | "folder" | "shortcut";

export type Provider = "gdrive" | "dropbox" | "onedrive" | "box" | "s3";

export interface Document {
  id: string;                 // `${provider}:${providerId}`
  provider: Provider;
  providerId: string;
  kind: DocumentKind;
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

/**
 * Helper function to create a Document ID
 */
export function createDocumentId(provider: Provider, providerId: string): string {
  return `${provider}:${providerId}`;
}

/**
 * Helper function to parse a Document ID
 */
export function parseDocumentId(id: string): { provider: Provider; providerId: string } | null {
  const parts = id.split(':');
  if (parts.length !== 2) return null;
  
  const [provider, providerId] = parts;
  if (!['gdrive', 'dropbox', 'onedrive', 'box', 's3'].includes(provider)) {
    return null;
  }
  
  return { provider: provider as Provider, providerId };
}
