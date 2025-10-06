import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

// Nango integration IDs for each provider
const NANGO_INTEGRATIONS = {
  gdrive: 'google-drive',
  dropbox: 'dropbox',
  onedrive: 'microsoft-onedrive',
  box: 'box',
  sharepoint: 'microsoft-sharepoint',
  confluence: 'atlassian-confluence',
  notion: 'notion',
  s3: 'amazon-s3'
} as const;

interface Document {
  id: string;
  provider: string;
  providerId: string;
  kind: 'file' | 'folder' | 'shortcut';
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
  permissions?: ('reader'|'writer'|'owner')[];
}

interface NangoFilePickerProps {
  onSelect: (docs: Document[]) => void;
  onCancel?: () => void;
  multiple?: boolean;
}

export default function NangoFilePicker({ 
  onSelect, 
  onCancel, 
  multiple = false 
}: NangoFilePickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedProviders, setConnectedProviders] = useState<Set<string>>(new Set());
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [currentProvider, setCurrentProvider] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleConnectProvider = useCallback(async (provider: string) => {
    setLoading(true);
    setError(null);

    try {
      // First, list integrations to see what's available
      const integrationsResponse = await fetch('/api/nango/integrations?action=integrations');
      const integrationsData = await integrationsResponse.json();
      
      console.log('Available integrations:', integrationsData.integrations);
      
      // Find the integration for this provider
      const integration = integrationsData.integrations.find((i: any) => 
        i.provider === provider || i.unique_key === NANGO_INTEGRATIONS[provider as keyof typeof NANGO_INTEGRATIONS]
      );
      
      if (!integration) {
        throw new Error(`Integration not found for ${provider}`);
      }
      
      // List connections for this integration
      const connectionsResponse = await fetch(`/api/nango/integrations?action=connections&integrationId=${integration.unique_key}`);
      const connectionsData = await connectionsResponse.json();
      
      console.log(`Connections for ${provider}:`, connectionsData.connections);
      
      if (connectionsData.connections.length > 0) {
        setConnectedProviders(prev => new Set([...Array.from(prev), provider]));
        console.log(`Connected to ${provider} with ${connectionsData.connections.length} connections`);
      } else {
        throw new Error(`No connections found for ${provider}. Please authenticate first.`);
      }
    } catch (err) {
      console.error(`Failed to connect to ${provider}:`, err);
      setError(`Failed to connect to ${provider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoadProviderFiles = useCallback(async (provider: string) => {
    setLoading(true);
    setError(null);
    setCurrentProvider(provider);

    try {
      // First get the integration and connections
      const integrationsResponse = await fetch('/api/nango/integrations?action=integrations');
      const integrationsData = await integrationsResponse.json();
      
      const integration = integrationsData.integrations.find((i: any) => 
        i.provider === provider || i.unique_key === NANGO_INTEGRATIONS[provider as keyof typeof NANGO_INTEGRATIONS]
      );
      
      if (!integration) {
        throw new Error(`Integration not found for ${provider}`);
      }
      
      const connectionsResponse = await fetch(`/api/nango/integrations?action=connections&integrationId=${integration.unique_key}`);
      const connectionsData = await connectionsResponse.json();
      
      if (connectionsData.connections.length === 0) {
        throw new Error(`No connections found for ${provider}. Please authenticate first.`);
      }
      
      // Use the first available connection
      const connectionId = connectionsData.connections[0].connection_id;
      
      // Use backend API with Nango Node SDK to fetch files
      const response = await fetch('/api/nango/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          integrationId: integration.unique_key,
          connectionId: connectionId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to load files from ${provider}`);
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(`Failed to load files from ${provider}:`, err);
      setError(`Failed to load files from ${provider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectDocument = useCallback((doc: Document) => {
    if (multiple) {
      setSelectedDocuments(prev => {
        const exists = prev.find(d => d.id === doc.id);
        if (exists) {
          return prev.filter(d => d.id !== doc.id);
        } else {
          return [...prev, doc];
        }
      });
    } else {
      setSelectedDocuments([doc]);
    }
  }, [multiple]);

  const handleConfirmSelection = useCallback(() => {
    if (selectedDocuments.length > 0) {
      onSelect(selectedDocuments);
    }
  }, [selectedDocuments, onSelect]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Select Files with Nango
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Provider Sidebar */}
          <div className="w-1/3 border-r border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cloud Providers</h3>
            <div className="space-y-2">
              {Object.entries(NANGO_INTEGRATIONS).map(([provider, integrationId]) => (
                <button
                  key={provider}
                  onClick={() => {
                    if (connectedProviders.has(provider)) {
                      handleLoadProviderFiles(provider);
                    } else {
                      handleConnectProvider(provider);
                    }
                  }}
                  disabled={loading}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    connectedProviders.has(provider)
                      ? 'border-green-200 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{provider}</div>
                      <div className="text-sm text-gray-500">{integrationId}</div>
                    </div>
                    {connectedProviders.has(provider) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Files Area */}
          <div className="flex-1 p-6">
            {currentProvider ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Files from {currentProvider}
                </h3>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleSelectDocument(doc)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedDocuments.find(d => d.id === doc.id)
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">
                              {doc.kind} • {doc.mimeType || 'Unknown type'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a provider to browse files</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {selectedDocuments.length} file{selectedDocuments.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={selectedDocuments.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select {selectedDocuments.length > 0 ? `(${selectedDocuments.length})` : ''}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
