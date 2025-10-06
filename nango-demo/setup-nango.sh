#!/bin/bash

echo "🚀 Setting up Nango Demo for Unified File Picker"
echo "================================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Nango Configuration (Backend Only)
NANGO_SECRET_KEY=your_nango_secret_key_here
NANGO_HOST=https://api.nango.dev

# Note: No frontend SDK needed - using backend API with Nango Node SDK
# The backend uses nango.listRecords() to fetch data from providers
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🔑 Next Steps:"
echo "1. Get your Nango Secret Key from https://app.nango.dev"
echo "2. Edit .env.local and replace 'your_nango_secret_key_here' with your actual secret key"
echo "3. Set up integrations in your Nango dashboard for each provider"
echo "4. Run 'npm run dev' to start the demo"
echo ""
echo "📚 For detailed setup instructions, see README.md"
