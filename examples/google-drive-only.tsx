/**
 * Google Drive Only Example
 * 
 * This example shows how to use the UnifiedFilePicker component
 * with only Google Drive and custom options.
 */

import React, { useState } from 'react';
import { UnifiedFilePicker, PickedFile } from 'unified-file-picker';

export default function GoogleDriveOnlyExample() {
  const [files, setFiles] = useState<PickedFile[]>([]);

  const handlePick = (result: { files: PickedFile[] }) => {
    setFiles(result.files);
    console.log('Selected Google Drive files:', result.files);
  };

  const handleCancel = () => {
    console.log('Google Drive picker cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Google Drive File Picker
        </h1>
        
        <p className="text-gray-600 mb-8">
          This example shows the Google Drive picker with custom options:
          PDF and image files only, with multi-select enabled.
        </p>
        
        <UnifiedFilePicker
          providers={["google"]}
          tokens={{
            google: process.env.REACT_APP_GOOGLE_TOKEN!,
          }}
          googleAppId={process.env.REACT_APP_GOOGLE_APP_ID!}
          googlePickerOptions={{
            mimeTypes: ["application/pdf", "image/*"],
            multiselect: true
          }}
          onPick={handlePick}
          onCancel={handleCancel}
        />

        {files.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Selected Google Drive Files ({files.length})
            </h2>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {file.mimeType} • {file.size ? `${Math.round(file.size / 1024)}KB` : 'Unknown size'}
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
                        View in Drive
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
