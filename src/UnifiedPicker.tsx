import React, { useState, useCallback } from 'react';
import { Document, Provider } from './types/document';

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
      // TODO: Implement backend-driven picker UI
      // This would show a custom file browser that calls your backend
      console.log("Opening backend-driven picker with token:", token);
      
      // For now, show a placeholder
      alert("Backend-driven picker not yet implemented. This would show a custom file browser.");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open picker");
    } finally {
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
    // TODO: Implement Google Drive Picker
    console.log("Opening Google Drive Picker with token:", token);
    alert("Google Drive Picker not yet implemented");
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
