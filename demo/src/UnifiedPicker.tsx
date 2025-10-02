import React, { useState, useCallback } from 'react';
import { Document, Provider } from './types/document';

// Google Picker API types
declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

/**
 * Unified File Picker Props
 */
export interface UnifiedPickerProps {
  mode: "backend" | "modal";
  token?: string;            // required if mode=backend
  provider?: Provider;       // required if mode=modal
  accessToken?: string;      // required if mode=modal (or provider key)
  onSelect: (docs: Document[]) => void;
  multiple?: boolean;        
  providers?: Provider[];   // for backend mode
}

/**
 * Unified File Picker Component
 * 
 * Supports two modes:
 * 1. Backend-driven mode: Uses your backend API
 * 2. Direct modal mode: Uses provider's native picker
 */
export default function UnifiedPicker({
  mode,
  token,
  provider,
  accessToken,
  onSelect,
  multiple = false,
  providers = ["gdrive", "dropbox", "onedrive", "box"]
}: UnifiedPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = useCallback(async () => {
    if (mode === "backend") {
      await openBackendPicker();
    } else {
      await openModalPicker();
    }
  }, [mode, token, provider, accessToken]);

  const openBackendPicker = async () => {
    if (!token) {
      setError("Token is required for backend mode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create modal for backend-driven picker
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      const pickerContainer = document.createElement('div');
      pickerContainer.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 800px;
        height: 80%;
        max-height: 600px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `;

      // Header
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;

      const title = document.createElement('h2');
      title.textContent = 'Select Files (Backend Mode)';
      title.style.cssText = `
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #111827;
      `;

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '✕';
      closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #6b7280;
        padding: 4px;
        border-radius: 4px;
      `;
      closeButton.onclick = () => {
        document.body.removeChild(modal);
        setLoading(false);
      };

      header.appendChild(title);
      header.appendChild(closeButton);

      // Content area
      const contentArea = document.createElement('div');
      contentArea.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      `;

      // Load providers and show file browser
      const loadProviders = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/storage/providers');
          const data = await response.json();
          
          contentArea.innerHTML = `
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Available Providers</h3>
              <div class="grid grid-cols-2 gap-4">
                ${data.providers.map((p: any) => `
                  <div class="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50" onclick="loadProviderFiles('${p.id}')">
                    <div class="text-2xl mb-2">${p.icon}</div>
                    <div class="font-medium">${p.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div id="files-container"></div>
          `;

          // Add global function for loading provider files
          (window as any).loadProviderFiles = async (provider: string) => {
            try {
              const filesResponse = await fetch(`http://localhost:3001/api/storage/list?provider=${provider}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const filesData = await filesResponse.json();
              
              const filesContainer = document.getElementById('files-container');
              if (filesContainer) {
                filesContainer.innerHTML = `
                  <h3 class="text-lg font-semibold mb-4">Files from ${provider}</h3>
                  <div class="space-y-2">
                    ${filesData.documents.map((doc: any) => `
                      <div class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50" onclick="selectFile('${doc.id}')">
                        <div class="font-medium">${doc.name}</div>
                        <div class="text-sm text-gray-500">${doc.kind} • ${doc.mimeType || 'Unknown type'}</div>
                      </div>
                    `).join('')}
                  </div>
                `;
              }
            } catch (error) {
              console.error('Failed to load files:', error);
            }
          };

          (window as any).selectFile = (fileId: string) => {
            // Find the selected file and return it
            const selectedFile = {
              id: fileId,
              provider: fileId.split(':')[0],
              providerId: fileId.split(':')[1],
              kind: 'file' as const,
              name: 'Selected File',
              mimeType: 'application/pdf',
              sizeBytes: 1024000,
              modifiedAt: new Date().toISOString(),
              webUrl: `https://${fileId.split(':')[0]}.com/${fileId.split(':')[1]}`,
              downloadUrl: `https://${fileId.split(':')[0]}.com/download/${fileId.split(':')[1]}`
            };
            
            document.body.removeChild(modal);
            onSelect([selectedFile]);
            setLoading(false);
          };

        } catch (error) {
          contentArea.innerHTML = `
            <div class="text-center text-red-600">
              <div class="text-4xl mb-4">⚠️</div>
              <div>Failed to load providers: ${error}</div>
            </div>
          `;
        }
      };

      pickerContainer.appendChild(header);
      pickerContainer.appendChild(contentArea);
      modal.appendChild(pickerContainer);
      document.body.appendChild(modal);

      await loadProviders();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open picker");
      setLoading(false);
    }
  };

  const openModalPicker = async () => {
    if (!provider || !accessToken) {
      setError("Provider and accessToken are required for modal mode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (provider) {
        case "gdrive":
          await openGoogleDrivePicker(accessToken);
          break;
        case "dropbox":
          await openDropboxPicker(accessToken);
          break;
        case "onedrive":
          await openOneDrivePicker(accessToken);
          break;
        case "box":
          await openBoxPicker(accessToken);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open picker");
    } finally {
      setLoading(false);
    }
  };

  // Provider-specific picker implementations
  const openGoogleDrivePicker = async (token: string) => {
    try {
      console.log('Opening Google Drive Picker with token:', token.substring(0, 20) + '...');
      
      // Load Google Picker API
      await new Promise<void>((resolve, reject) => {
        if (window.google && window.google.picker) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('picker', () => {
            resolve();
          });
        };
        script.onerror = () => reject(new Error('Failed to load Google Picker API'));
        document.head.appendChild(script);
      });

      // Create Google Picker
      const myDriveView = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true)
        .setOwnedByMe(true)
        .setLabel('My Drive')
        .setMode(window.google.picker.DocsViewMode.LIST);

      const sharedWithMeView = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true)
        .setOwnedByMe(false)
        .setLabel('Shared with Me')
        .setMode(window.google.picker.DocsViewMode.LIST);

      const picker = new window.google.picker.PickerBuilder()
        .addView(myDriveView)
        .addView(sharedWithMeView)
        .enableFeature(window.google.picker.Feature.SUPPORT_FOLDER_SELECT)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
        .setOAuthToken(token)
        .setAppId(process.env.NEXT_PUBLIC_GOOGLE_APP_ID || 'demo-app-id')
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const documents = data.docs.map((doc: any) => ({
              id: `gdrive:${doc.id}`,
              provider: 'gdrive' as const,
              providerId: doc.id,
              kind: doc.mimeType === 'application/vnd.google-apps.folder' ? 'folder' as const : 'file' as const,
              name: doc.name,
              mimeType: doc.mimeType,
              sizeBytes: doc.sizeBytes,
              modifiedAt: doc.lastEditedUtc,
              webUrl: doc.url,
              downloadUrl: doc.url,
              raw: doc
            }));
            onSelect(documents);
          } else if (data.action === window.google.picker.Action.CANCEL) {
            setLoading(false);
          }
        })
        .build();

      picker.setVisible(true);
      setLoading(false);

    } catch (error) {
      console.error('Google Drive Picker error:', error);
      setError('Failed to open Google Drive Picker');
      setLoading(false);
    }
  };

  const openDropboxPicker = async (token: string) => {
    // TODO: Implement Dropbox Chooser
    console.log("Opening Dropbox Chooser with token:", token);
    alert("Dropbox Chooser not yet implemented");
  };

  const openOneDrivePicker = async (token: string) => {
    // TODO: Implement OneDrive Picker
    console.log("Opening OneDrive Picker with token:", token);
    alert("OneDrive Picker not yet implemented");
  };

  const openBoxPicker = async (token: string) => {
    // TODO: Implement Box Picker
    console.log("Opening Box Picker with token:", token);
    alert("Box Picker not yet implemented");
  };

  return (
    <div className="unified-picker">
      <button 
        onClick={handleOpen}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Opening..." : "Open File Picker"}
      </button>
      
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
