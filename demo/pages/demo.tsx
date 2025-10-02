import React, { useState } from 'react';
import { Document } from '../src/types/document';
import UnifiedPicker from '../src/UnifiedPicker';

export default function DemoPage() {
  const [selectedDocs, setSelectedDocs] = useState<Document[]>([]);
  const [mode, setMode] = useState<'backend' | 'modal'>('backend');
  const [provider, setProvider] = useState<'gdrive' | 'dropbox' | 'onedrive' | 'box'>('gdrive');

  const handleSelect = (docs: Document[]) => {
    setSelectedDocs(docs);
    console.log('Selected documents:', docs);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Unified File Picker Demo
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Choose Mode</h2>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="backend"
                  checked={mode === 'backend'}
                  onChange={(e) => setMode(e.target.value as 'backend')}
                  className="mr-2"
                />
                Backend-driven mode
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="modal"
                  checked={mode === 'modal'}
                  onChange={(e) => setMode(e.target.value as 'modal')}
                  className="mr-2"
                />
                Direct modal mode
              </label>
            </div>
          </div>

          {mode === 'modal' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Choose Provider</h2>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="gdrive">Google Drive</option>
                <option value="dropbox">Dropbox</option>
                <option value="onedrive">OneDrive</option>
                <option value="box">Box</option>
              </select>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">File Picker</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {mode === 'backend' ? (
                <UnifiedPicker
                  mode="backend"
                  token="demo-session-token"
                  onSelect={handleSelect}
                  multiple={true}
                />
              ) : (
                <UnifiedPicker
                  mode="modal"
                  provider={provider}
                  accessToken={
                    provider === 'gdrive' 
                      ? (process.env.NEXT_PUBLIC_GOOGLE_TOKEN || "demo-access-token")
                      : "demo-access-token"
                  }
                  onSelect={handleSelect}
                  multiple={true}
                />
              )}
            </div>
          </div>

          {selectedDocs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Selected Documents ({selectedDocs.length})
              </h2>
              <div className="space-y-2">
                {selectedDocs.map((doc, index) => (
                  <div key={doc.id} className="bg-gray-100 rounded p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {doc.provider} • {doc.kind} • {doc.mimeType || 'Unknown type'}
                        </div>
                        {doc.sizeBytes && (
                          <div className="text-sm text-gray-500">
                            {(doc.sizeBytes / 1024).toFixed(1)} KB
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {doc.id}
                      </div>
                    </div>
                    {doc.webUrl && (
                      <div className="mt-2">
                        <a
                          href={doc.webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View in {doc.provider}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How it works
            </h3>
            <div className="text-blue-800">
              {mode === 'backend' ? (
                <div>
                  <p className="mb-2">
                    <strong>Backend-driven mode:</strong> The picker calls your backend API 
                    with a session token. Your backend handles all provider authentication 
                    and API calls, returning normalized Document objects.
                  </p>
                  <p className="text-sm">
                    • No CORS issues • No tokens in browser • Full control over data flow
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-2">
                    <strong>Direct modal mode:</strong> The picker opens the provider's 
                    native picker UI directly with an access token. Fastest to integrate 
                    but limited customization.
                  </p>
                  <p className="text-sm">
                    • Uses {provider} native picker • Fastest integration • Limited customization
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
