/**
 * Google Drive Provider
 * 
 * Handles Google Drive file selection using the native Google Picker API.
 * This provides the best user experience with Google's official interface.
 */

import { PickedFile, GooglePickerOptions } from '../types';

// Google Picker API types
declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

/**
 * Loads the Google Picker API dynamically
 */
export function loadGooglePickerAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
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
}

/**
 * Creates and displays the Google Picker
 * 
 * @param accessToken - Google OAuth access token
 * @param appId - Google Cloud Project Number
 * @param options - Google Picker configuration options
 * @param onPick - Callback when files are selected
 * @param onCancel - Callback when picker is cancelled
 */
export function createGooglePicker(
  accessToken: string,
  appId: string,
  options: GooglePickerOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): void {
  // Create My Drive view with detailed configuration
  const myDriveView = new window.google.picker.DocsView()
    .setIncludeFolders(true)
    .setSelectFolderEnabled(true)
    .setOwnedByMe(true)
    .setLabel('My Drive')
    .setMode(window.google.picker.DocsViewMode.LIST);

  // Create Shared with Me view with detailed configuration
  const sharedWithMeView = new window.google.picker.DocsView()
    .setIncludeFolders(true)
    .setSelectFolderEnabled(true)
    .setOwnedByMe(false)
    .setLabel('Shared with Me')
    .setMode(window.google.picker.DocsViewMode.LIST);

  // Apply MIME type filtering to both views if specified
  if (options.mimeTypes) {
    myDriveView.setMimeTypes(options.mimeTypes.join(','));
    sharedWithMeView.setMimeTypes(options.mimeTypes.join(','));
  }

  const picker = new window.google.picker.PickerBuilder()
    .addView(myDriveView)
    .addView(sharedWithMeView)
    .enableFeature(window.google.picker.Feature.SUPPORT_FOLDER_SELECT)
    .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
    .setAppId(appId)
    .setOAuthToken(accessToken)
    .setCallback((data: any) => {
      if (data.action === window.google.picker.Action.PICKED) {
        const files: PickedFile[] = data.docs.map((doc: any) => ({
          provider: "google" as const,
          id: doc.id,
          name: doc.name,
          mimeType: doc.mimeType,
          size: doc.sizeBytes ? Number(doc.sizeBytes) : null,
          downloadUrl: doc.url,
          webViewUrl: doc.url,
          raw: doc
        }));
        onPick(files);
      } else if (data.action === window.google.picker.Action.CANCEL) {
        onCancel();
      }
    })
    .build();

  picker.setVisible(true);
}

/**
 * Opens the Google Picker for file selection
 * 
 * @param accessToken - Google OAuth access token
 * @param appId - Google Cloud Project Number
 * @param options - Google Picker configuration options
 * @param onPick - Callback when files are selected
 * @param onCancel - Callback when picker is cancelled
 */
export async function openGooglePicker(
  accessToken: string,
  appId: string,
  options: GooglePickerOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    await loadGooglePickerAPI();
    createGooglePicker(accessToken, appId, options, onPick, onCancel);
  } catch (error) {
    console.error('Failed to load Google Picker:', error);
    onCancel();
  }
}
