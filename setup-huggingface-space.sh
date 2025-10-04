#!/bin/bash

# Hugging Face Space Setup Script
# This script helps you set up your Hugging Face Space

echo "🚀 Setting up Hugging Face Space for Exoplanet Classification"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed."
    exit 1
fi

echo "📋 Steps to set up your Hugging Face Space:"
echo ""
echo "1. Go to https://huggingface.co/spaces"
echo "2. Click 'Create new Space'"
echo "3. Fill in:"
echo "   - Space name: exoplanet-predictor"
echo "   - License: Apache 2.0"
echo "   - SDK: Gradio"
echo "   - Visibility: Public (or Private)"
echo "4. Click 'Create Space'"
echo ""
echo "5. After creation, run these commands:"
echo ""
echo "Replace YOUR_USERNAME with your actual Hugging Face username:"
echo ""

cat << 'EOF'
# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/exoplanet-predictor
cd exoplanet-predictor

# Copy the files from this project
cp ../ck-landing-page/huggingface-space-files/* .

# Add and commit files
git add .
git commit -m "Initial model deployment"
git push

EOF

echo ""
echo "6. Your space will be available at:"
echo "   https://huggingface.co/spaces/YOUR_USERNAME/exoplanet-predictor"
echo ""
echo "7. The API endpoint will be:"
echo "   https://YOUR_USERNAME-exoplanet-predictor.hf.space"
echo ""
echo "8. Add this to your .env.local:"
echo "   HUGGING_FACE_SPACE_URL=https://YOUR_USERNAME-exoplanet-predictor.hf.space"
echo ""
echo "📁 Files ready in: ./huggingface-space-files/"
echo "   - app.py (main application)"
echo "   - requirements.txt (dependencies)"
echo "   - README.md (space configuration)"
echo ""
echo "🎉 Ready to deploy!"