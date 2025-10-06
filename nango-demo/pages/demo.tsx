import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NangoFilePicker from '@/components/NangoFilePicker';

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

export default function DemoPage() {
  const [selectedDocs, setSelectedDocs] = useState<Document[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (docs: Document[]) => {
    setSelectedDocs(docs);
    setShowPicker(false);
    console.log('Selected Documents:', docs);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Nango-Powered File Picker Demo
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">How it works</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-blue-800">
                <div className="mb-4">
                  <p className="mb-2"><strong>1. OAuth Flow:</strong> Click "Connect" on any provider to trigger Nango's OAuth flow. Nango handles all authentication automatically.</p>
                  <p className="mb-2"><strong>2. File Browsing:</strong> Once connected, browse files from that provider using Nango's unified API.</p>
                  <p className="mb-2"><strong>3. Selection:</strong> Select files and they'll be returned in a unified Document format.</p>
                  <p className="text-sm">• No CORS issues • Automatic token refresh • Unified API responses</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">File Picker</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <button
                onClick={() => setShowPicker(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Open Nango File Picker
              </button>
            </div>
          </div>

          {selectedDocs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Selected Documents ({selectedDocs.length})
              </h2>
              <div className="space-y-4">
                {selectedDocs.map((doc) => (
                  <div key={doc.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doc.name} ({doc.provider})</p>
                        <p className="text-sm text-gray-600">ID: {doc.id}</p>
                        <p className="text-sm text-gray-600">Kind: {doc.kind}</p>
                        {doc.mimeType && (
                          <p className="text-sm text-gray-600">Type: {doc.mimeType}</p>
                        )}
                        {doc.sizeBytes && (
                          <p className="text-sm text-gray-600">
                            Size: {Math.round(doc.sizeBytes / 1024)} KB
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {doc.webUrl && (
                          <a 
                            href={doc.webUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View
                          </a>
                        )}
                        {doc.downloadUrl && (
                          <a 
                            href={doc.downloadUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-green-600 text-sm hover:underline ml-2"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Nango Benefits</h3>
            <div className="text-green-800">
              <div className="mb-4">
                <p className="mb-2"><strong>🔐 OAuth Management:</strong> Nango handles all OAuth flows, token refresh, and credential management automatically.</p>
                <p className="mb-2"><strong>🌐 Unified API:</strong> Single API endpoint to access all cloud providers with normalized responses.</p>
                <p className="mb-2"><strong>🛡️ Security:</strong> Credentials are securely stored and managed by Nango.</p>
                <p className="text-sm">• No CORS issues • Automatic token refresh • Unified API responses • Enterprise security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPicker && (
        <NangoFilePicker
          onSelect={handleSelect}
          onCancel={handleCancel}
          multiple={true}
        />
      )}
    </div>
  );
}
