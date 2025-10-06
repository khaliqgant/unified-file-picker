import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unified File Picker with Nango
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A powerful file picker that uses Nango to handle OAuth flows and API calls across 8 cloud providers.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Powered by Nango</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🔐 OAuth Management</h3>
                <p className="text-gray-600 mb-4">
                  Nango handles all OAuth flows, token refresh, and credential management automatically.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Automatic token refresh</li>
                  <li>• Secure credential storage</li>
                  <li>• Unified OAuth experience</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🌐 Unified API</h3>
                <p className="text-gray-600 mb-4">
                  Single API endpoint to access all cloud providers with normalized responses.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Consistent data format</li>
                  <li>• Rate limiting handled</li>
                  <li>• Error handling unified</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Supported Providers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm font-medium text-gray-700">Google Drive</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm font-medium text-gray-700">Dropbox</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">☁️</div>
                <div className="text-sm font-medium text-gray-700">OneDrive</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium text-gray-700">Box</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🪣</div>
                <div className="text-sm font-medium text-gray-700">Amazon S3</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-sm font-medium text-gray-700">SharePoint</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-gray-700">Confluence</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-sm font-medium text-gray-700">Notion</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Link href="/demo">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Try the Nango Demo
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
