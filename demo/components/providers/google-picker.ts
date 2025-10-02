/**
 * Google Picker API Integration
 * 
 * Handles loading and interacting with the native Google Picker API
 */

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
 */
export function createGooglePicker(
  accessToken: string,
  appId: string,
  options: any,
  onPick: (files: any[]) => void,
  onCancel: () => void
) {
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
    .setOAuthToken(accessToken)
    .setAppId(appId)
    .setCallback((data: any) => {
      if (data.action === window.google.picker.Action.PICKED) {
        const files = data.docs.map((doc: any) => ({
          provider: "google",
          id: doc.id,
          name: doc.name,
          mimeType: doc.mimeType,
          size: doc.sizeBytes,
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
 * Opens the Google Picker
 */
export async function openGooglePicker(
  accessToken: string,
  options: any,
  onPick: (files: any[]) => void,
  onCancel: () => void
): Promise<void> {
  try {
    await loadGooglePickerAPI();
    createGooglePicker(accessToken, options.appId || '', options, onPick, onCancel);
  } catch (error) {
    console.error('Failed to load Google Picker:', error);
    onCancel();
  }
}
