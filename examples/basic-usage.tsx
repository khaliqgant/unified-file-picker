/**
 * Basic Usage Example
 * 
 * This example shows how to use the UnifiedFilePicker component
 * with basic configuration for all providers.
 */

import React, { useState } from 'react';
import { UnifiedFilePicker, PickedFile } from 'unified-file-picker';

export default function BasicUsageExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  const handlePick = (result: { files: PickedFile[] }) => {
    setFiles(result.files);
    console.log('Selected files:', result.files);
  };

  const handleCancel = () => {
    console.log('File picker cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Unified File Picker - Basic Usage
        </h1>
        
        <UnifiedFilePicker
          tokens={{
            google: process.env.REACT_APP_GOOGLE_TOKEN!,
            dropbox: process.env.REACT_APP_DROPBOX_TOKEN!,
            onedrive: process.env.REACT_APP_ONEDRIVE_TOKEN!,
            box: process.env.REACT_APP_BOX_TOKEN!,
          }}
          googleAppId={process.env.REACT_APP_GOOGLE_APP_ID!}
          onPick={handlePick}
          onCancel={handleCancel}
        />

        {files.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Selected Files ({files.length})
            </h2>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {file.provider} • {file.mimeType || 'Unknown type'} • {file.size ? `${Math.round(file.size / 1024)}KB` : 'Unknown size'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {file.downloadUrl && (
                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Download
                      </a>
                    )}
                    {file.webViewUrl && (
                      <a
                        href={file.webViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
