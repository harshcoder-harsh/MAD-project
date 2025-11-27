# 🚀 How to Run the App on Expo Go

## Quick Start Commands

Copy and paste these commands **one by one** into your terminal:

### Step 1: Navigate to project
```bash
cd /Users/harshvardhan/MAD-project
```

### Step 2: Switch to Node 20
```bash
source ~/.nvm/nvm.sh
nvm use 20
```

### Step 3: Start Expo
```bash
npx expo start
```

**OR** use the startup script:
```bash
./start-expo-android.sh
```

## What Happens Next?

1. ⏳ Wait 10-15 seconds for Metro bundler to start
2. 📱 A **QR code** will appear in your terminal
3. 📲 Open **Expo Go** app on your Android phone
4. 👆 Tap **"Scan QR code"** in the Expo Go app
5. 📷 Point your camera at the QR code in the terminal
6. 🎉 Your app will load automatically!

## Troubleshooting

### If QR code doesn't appear:
- Wait a bit longer (Metro bundler takes time to start)
- Make sure you're using Node 20 (check with `node --version`)

### If connection fails:
- Make sure your phone and computer are on the **same WiFi network**
- Try using tunnel mode: `npx expo start --tunnel`

### Android SDK warnings:
- These are just warnings and won't prevent the QR code from working
- You can ignore them if you're using Expo Go

## All Commits Are on GitHub! ✅

Your repository: https://github.com/harshcoder-harsh/MAD-project

All 37 commits have been pushed successfully!

