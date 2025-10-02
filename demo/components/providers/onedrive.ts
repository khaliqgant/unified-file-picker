/**
 * OneDrive Provider
 * 
 * Handles OneDrive file selection using Microsoft File Picker v8.
 * Provides native Microsoft 365 experience with familiar UI.
 * 
 * Based on: https://learn.microsoft.com/en-us/onedrive/developer/controls/file-pickers/
 */

import { PickedFile, OneDriveOptions } from '../types';

// OneDrive File Picker types
interface OneDrivePickerOptions {
  sdk: string;
  entry: {
    oneDrive?: {};
    sharePoint?: {
      siteId?: string;
      webUrl?: string;
    };
  };
  authentication: {};
  messaging: {
    origin: string;
    channelId: string;
  };
}

interface OneDrivePickerMessage {
  type: 'initialize' | 'notification' | 'command';
  channelId?: string;
  data?: any;
  id?: string;
}

// Declare MSAL types
declare global {
  interface Window {
    msal?: any;
  }
}

/**
 * Loads MSAL for authentication
 */
async function loadMSAL(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.msal) {
      resolve(window.msal);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://alcdn.msauth.net/browser/2.38.3/js/msal-browser.min.js';
    script.onload = () => {
      resolve(window.msal);
    };
    script.onerror = () => {
      reject(new Error('Failed to load MSAL'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Gets authentication token using MSAL
 */
async function getOneDriveToken(baseUrl: string): Promise<string> {
  try {
    const msal = await loadMSAL();
    
    // Initialize MSAL (you'll need to configure this with your app registration)
    const msalConfig = {
      auth: {
        clientId: process.env.REACT_APP_ONEDRIVE_CLIENT_ID || 'your-client-id',
        authority: 'https://login.microsoftonline.com/common'
      }
    };
    
    const msalInstance = new msal.PublicClientApplication(msalConfig);
    
    const scopes = [`${baseUrl}/.default`];
    const tokenRequest = {
      scopes,
      account: msalInstance.getActiveAccount()
    };
    
    try {
      const response = await msalInstance.acquireTokenSilent(tokenRequest);
      return response.accessToken;
    } catch (error) {
      // Fall back to popup if silent acquisition fails
      const response = await msalInstance.acquireTokenPopup(tokenRequest);
      return response.accessToken;
    }
  } catch (error) {
    console.error('MSAL authentication error:', error);
    throw new Error('Failed to authenticate with OneDrive');
  }
}

/**
 * Opens OneDrive File Picker v8
 * 
 * @param accessToken - OneDrive access token (optional, will use MSAL if not provided)
 * @param options - OneDrive configuration options
 * @param onPick - Callback when files are selected
 * @param onCancel - Callback when picker is cancelled
 */
export async function openOneDrivePicker(
  accessToken: string,
  options: OneDriveOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    // Determine base URL based on options
    const tenant = process.env.REACT_APP_SHAREPOINT_TENANT || 'your-tenant';
    const baseUrl = options.siteId 
      ? `https://${tenant}.sharepoint.com/sites/${options.siteId}`
      : `https://${tenant}-my.sharepoint.com`;

    // Generate unique channel ID
    const channelId = `onedrive-picker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Configure picker options
    const pickerOptions: OneDrivePickerOptions = {
      sdk: "8.0",
      entry: options.siteId ? {
        sharePoint: {
          siteId: options.siteId,
          webUrl: baseUrl
        }
      } : {
        oneDrive: {}
      },
      authentication: {},
      messaging: {
        origin: window.location.origin,
        channelId: channelId
      }
    };

    // Create picker window
    const pickerWindow = window.open('', 'OneDrivePicker', 'width=1080,height=680,scrollbars=yes,resizable=yes');
    
    if (!pickerWindow) {
      throw new Error('Failed to open picker window');
    }

    // Get authentication token
    let token = accessToken;
    if (!token || token.startsWith('demo-')) {
      // Use MSAL for real authentication
      token = await getOneDriveToken(baseUrl);
    }

    // Build picker URL
    const queryString = new URLSearchParams({
      filePicker: JSON.stringify(pickerOptions),
      locale: 'en-us'
    });

    const pickerUrl = `${baseUrl}/_layouts/15/FilePicker.aspx?${queryString}`;

    // Create and submit form
    const form = pickerWindow.document.createElement('form');
    form.setAttribute('action', pickerUrl);
    form.setAttribute('method', 'POST');

    const tokenInput = pickerWindow.document.createElement('input');
    tokenInput.setAttribute('type', 'hidden');
    tokenInput.setAttribute('name', 'access_token');
    tokenInput.setAttribute('value', token);
    form.appendChild(tokenInput);

    pickerWindow.document.body.appendChild(form);
    form.submit();

    // Set up message handling
    let messagePort: MessagePort;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== pickerWindow) return;

      const message: OneDrivePickerMessage = event.data;

      if (message.type === 'initialize' && message.channelId === channelId) {
        messagePort = event.ports[0];
        messagePort.addEventListener('message', handleChannelMessage);
        messagePort.start();

        // Activate the picker
        messagePort.postMessage({
          type: 'activate'
        });
      }
    };

    const handleChannelMessage = async (event: MessageEvent) => {
      const payload = event.data;

      switch (payload.type) {
        case 'notification':
          if (payload.data?.notification === 'page-loaded') {
            console.log('OneDrive picker loaded and ready');
          }
          break;

        case 'command':
          // Acknowledge command
          messagePort.postMessage({
            type: 'acknowledge',
            id: payload.id
          });

          const command = payload.data;

          switch (command.command) {
            case 'authenticate':
              try {
                const newToken = await getOneDriveToken(baseUrl);
                messagePort.postMessage({
                  type: 'result',
                  id: payload.id,
                  data: {
                    result: 'token',
                    token: newToken
                  }
                });
              } catch (error) {
                messagePort.postMessage({
                  type: 'result',
                  id: payload.id,
                  data: {
                    result: 'error',
                    error: {
                      code: 'unableToObtainToken',
                      message: error instanceof Error ? error.message : 'Authentication failed'
                    }
                  }
                });
              }
              break;

            case 'close':
              pickerWindow.close();
              onCancel();
              break;

            case 'pick':
              try {
                const pickedItems = command.data.items || [];
                const files: PickedFile[] = pickedItems.map((item: any) => ({
                  provider: "onedrive" as const,
                  id: item.id,
                  name: item.name || 'Unknown file',
                  mimeType: item.mimeType || null,
                  size: item.size || null,
                  downloadUrl: item.downloadUrl || null,
                  webViewUrl: item.webUrl || null,
                  raw: item
                }));

                messagePort.postMessage({
                  type: 'result',
                  id: payload.id,
                  data: {
                    result: 'success'
                  }
                });

                pickerWindow.close();
                onPick(files);
              } catch (error) {
                messagePort.postMessage({
                  type: 'result',
                  id: payload.id,
                  data: {
                    result: 'error',
                    error: {
                      code: 'unusableItem',
                      message: error instanceof Error ? error.message : 'Failed to process selected items'
                    }
                  }
                });
              }
              break;

            default:
              messagePort.postMessage({
                type: 'result',
                id: payload.id,
                data: {
                  result: 'error',
                  error: {
                    code: 'unsupportedCommand',
                    message: command.command
                  }
                }
              });
              break;
          }
          break;
      }
    };

    // Listen for messages from the picker
    window.addEventListener('message', handleMessage);

    // Clean up when window closes
    const checkClosed = setInterval(() => {
      if (pickerWindow.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        onCancel();
      }
    }, 1000);

  } catch (error) {
    console.error('OneDrive picker error:', error);
    onCancel();
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use openOneDrivePicker instead
 */
export async function fetchOneDriveFiles(
  token: string,
  options: OneDriveOptions = {}
): Promise<PickedFile[]> {
  console.warn('fetchOneDriveFiles is deprecated. Use openOneDrivePicker for native picker experience.');
  
  // For demo purposes, return mock data
  return [
    {
      provider: "onedrive" as const,
      id: "demo-onedrive-1",
      name: "Sample OneDrive Document.pdf",
      mimeType: "application/pdf",
      size: 1024000,
      downloadUrl: "#",
      webViewUrl: "#",
      raw: { demo: true }
    }
  ];
}