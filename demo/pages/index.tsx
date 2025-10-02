import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unified File Picker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            An open-source, embeddable UI component that allows end users to browse and select files 
            from multiple storage providers through a single interface.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Two Operation Modes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Backend-driven mode (default)
                </h3>
                <p className="text-gray-600 mb-4">
                  The picker calls your backend with a session token. Your backend talks to provider APIs, 
                  normalizes responses to the Document model, and returns them.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• No CORS or tokens in the browser</li>
                  <li>• Best for consistency and control</li>
                  <li>• Full customization of UI</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Direct modal mode (prebuilt pickers)
                </h3>
                <p className="text-gray-600 mb-4">
                  For providers with an official picker UI (Google Drive Picker, Dropbox Chooser, OneDrive Picker), 
                  the picker can accept an access token directly and open the vendor's modal.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Fastest to integrate</li>
                  <li>• Limited customization</li>
                  <li>• Uses native provider UIs</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Supported Providers
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Google Drive', icon: '📁' },
                { name: 'Dropbox', icon: '📦' },
                { name: 'OneDrive', icon: '☁️' },
                { name: 'Box', icon: '📋' },
                { name: 'Amazon S3', icon: '🪣' },
                { name: 'SharePoint', icon: '🏢' },
                { name: 'Confluence', icon: '📝' },
                { name: 'Notion', icon: '📄' }
              ].map((provider, index) => (
                <div key={provider.name} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{provider.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{provider.name}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Link href="/demo">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Try the Demo
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}