/**
 * Unified File Picker Component
 * 
 * A React component that provides a unified interface for selecting files
 * from multiple cloud storage providers (Google Drive, Dropbox, OneDrive, Box).
 * 
 * Features:
 * - Native Google Picker for Google Drive (best UX)
 * - Custom interfaces for other providers (consistent UX)
 * - Provider-specific configuration options
 * - Error handling and loading states
 * - Beautiful animations and responsive design
 */

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FolderOpen, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { 
  UnifiedFilePickerProps, 
  Provider, 
  PROVIDER_CONFIGS 
} from "./types";
import { 
  openGooglePicker,
  openDropboxPicker,
  openOneDrivePicker,
  openBoxPicker,
  openSharePointPicker,
  openConfluencePicker,
  openNotionPicker
} from "./providers";
export default function UnifiedFilePicker({ 
  providers = ["google", "dropbox", "onedrive", "box", "sharepoint", "confluence", "notion"], 
  onPick, 
  onCancel, 
  tokens, 
  googleAppId,
  className,
  googlePickerOptions,
  dropboxOptions,
  onedriveOptions,
  boxOptions,
  sharepointOptions,
  confluenceOptions,
  notionOptions
}: UnifiedFilePickerProps) {
  const [busy, setBusy] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  /**
   * Handles provider selection and file picking
   */
  const handleProvider = useCallback(async (provider: Provider) => {
    try {
      setBusy(provider);
      setError(null);
      
      const token = tokens[provider];
      if (!token) {
        throw new Error(`No access token provided for ${provider}`);
      }

      const handlePick = (files: any[]) => {
        if (files.length > 0) {
          onPick({ files });
        } else {
          onCancel?.();
        }
      };

      const handleCancel = () => {
        onCancel?.();
      };

      // Route to appropriate provider handler
      switch (provider) {
        case "google":
          if (!googleAppId) {
            throw new Error('Google App ID is required for Google Drive picker');
          }
          await openGooglePicker(token, { ...googlePickerOptions, appId: googleAppId }, handlePick, handleCancel);
          break;
        case "dropbox":
          await openDropboxPicker(token, dropboxOptions, handlePick, handleCancel);
          break;
        case "onedrive":
          await openOneDrivePicker(token, onedriveOptions, handlePick, handleCancel);
          break;
        case "box":
          await openBoxPicker(token, boxOptions, handlePick, handleCancel);
          break;
        case "sharepoint":
          await openSharePointPicker(token, sharepointOptions, handlePick, handleCancel);
          break;
        case "confluence":
          // Confluence requires baseUrl, we'll need to add this to the props
          const confluenceBaseUrl = tokens.confluenceBaseUrl || 'https://your-domain.atlassian.net';
          await openConfluencePicker(token, confluenceBaseUrl, confluenceOptions, handlePick, handleCancel);
          break;
        case "notion":
          await openNotionPicker(token, notionOptions, handlePick, handleCancel);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error with ${provider} provider:`, error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      if (mountedRef.current) {
        setBusy(null);
      }
    }
  }, [tokens, googleAppId, onPick, onCancel, googlePickerOptions, dropboxOptions, onedriveOptions, boxOptions, sharepointOptions, confluenceOptions, notionOptions]);

  /**
   * Gets the icon for a provider
   */
  const getProviderIcon = (provider: Provider) => {
    const config = PROVIDER_CONFIGS[provider];
    return (
      <div className={`w-4 h-4 mr-2 ${config.color} rounded text-white flex items-center justify-center text-xs font-bold`}>
        {config.icon}
      </div>
    );
  };

  /**
   * Gets the display name for a provider
   */
  const getProviderName = (provider: Provider) => {
    return PROVIDER_CONFIGS[provider].displayName;
  };

  return (
    <div className={`w-full max-w-xl mx-auto p-4 ${className || ""}`}>
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Choose a file source</h2>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {providers.map((provider) => (
            <Button 
              key={provider} 
              variant="outline" 
              className="justify-start h-12 text-left hover:bg-blue-50 hover:border-blue-300 transition-colors" 
              onClick={() => handleProvider(provider)} 
              disabled={!!busy}
            >
              {busy === provider ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting to {getProviderName(provider)}...
                </>
              ) : (
                <>
                  {getProviderIcon(provider)}
                  {getProviderName(provider)}
                </>
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Select a cloud provider to browse and pick files
        </div>
      </motion.div>
    </div>
  );
}

// Export types for external use
export type { 
  UnifiedFilePickerProps,
  PickedFile,
  UnifiedPickerResult,
  Provider,
  GooglePickerOptions,
  DropboxOptions,
  OneDriveOptions,
  BoxOptions
} from "./types";
