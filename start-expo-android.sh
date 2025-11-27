#!/bin/bash
# Start Expo and show QR code for Android

echo "═══════════════════════════════════════════════════════════"
echo "   Starting Expo Go for Android"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Load nvm and use Node 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Start Expo
cd "$(dirname "$0")"
npx expo start

