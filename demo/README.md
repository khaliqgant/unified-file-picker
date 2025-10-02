# Unified File Picker Demo

This is a Next.js demo application showcasing the Unified File Picker component.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual tokens:
   ```
   NEXT_PUBLIC_GOOGLE_TOKEN=ya29.your_actual_google_token
   NEXT_PUBLIC_GOOGLE_APP_ID=123456789012
   NEXT_PUBLIC_DROPBOX_TOKEN=sl.BD_your_actual_dropbox_token
   NEXT_PUBLIC_ONEDRIVE_TOKEN=EwBwAq_your_actual_onedrive_token
   NEXT_PUBLIC_BOX_TOKEN=eyJhbGci_your_actual_box_token
   ```
   
   **Important:** The environment variables must be in the `demo/` directory, not the root directory.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Getting API Tokens

See the main README.md for detailed instructions on obtaining API tokens for each provider.

## Features Demonstrated

- Google Drive with native picker
- Dropbox file selection
- OneDrive file selection  
- Box file selection
- Provider-specific options
- Error handling
- File preview and metadata
