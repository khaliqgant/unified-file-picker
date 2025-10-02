/**
 * Provider Exports
 *
 * This file exports all provider implementations for easy importing.
 */

// External API providers (now exported from separate files)
export { openGooglePicker } from './google-picker';
export { openOneDrivePicker } from './onedrive-picker';

// REST API providers (safe to export)
export { openDropboxPicker } from './dropbox';
export { openBoxPicker } from './box';
export { openSharePointPicker } from './sharepoint';
export { openConfluencePicker } from './confluence';
export { openNotionPicker } from './notion';

// Re-export types for convenience
export type {
  GooglePickerOptions,
  DropboxOptions,
  OneDriveOptions,
  BoxOptions,
  SharePointOptions,
  ConfluenceOptions,
  NotionOptions
} from '../types';
