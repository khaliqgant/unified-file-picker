/**
 * Unified File Picker
 * 
 * A React component library for selecting files from multiple cloud storage providers.
 * 
 * Features:
 * - Google Drive (native picker)
 * - Dropbox (custom interface)
 * - OneDrive (custom interface) 
 * - Box (custom interface)
 * - Unified API with provider-specific options
 * - TypeScript support
 * - Beautiful animations
 */

// Main component
export { default as UnifiedFilePicker } from './UnifiedFilePicker';

// Types
export type {
  UnifiedFilePickerProps,
  PickedFile,
  UnifiedPickerResult,
  Provider,
  GooglePickerOptions,
  DropboxOptions,
  OneDriveOptions,
  BoxOptions
} from './types';

// Provider functions (for advanced usage)
// Note: Google and OneDrive pickers use external APIs and are only available through the main component
export {
  openDropboxPicker,
  openBoxPicker
} from './providers';

// UI components
export { Button } from './ui/button';
