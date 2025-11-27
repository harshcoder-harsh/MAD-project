# Running the App on Expo Go

## Prerequisites
- Node.js 18+ (currently using Node 20)
- Expo Go app installed on your Android device

## Quick Start

1. **Switch to Node 20** (if not already):
   ```bash
   source ~/.nvm/nvm.sh
   nvm use 20
   ```

2. **Start Expo**:
   ```bash
   npx expo start
   ```
   
   Or for Android specifically:
   ```bash
   npx expo start --android
   ```

3. **Scan QR Code**:
   - Open Expo Go app on your Android device
   - Tap "Scan QR code"
   - Point camera at the QR code in terminal
   - App will load automatically

## Troubleshooting

- **If QR code doesn't appear**: Wait 10-15 seconds for Metro bundler to start
- **If connection fails**: Make sure phone and computer are on same WiFi network
- **Android SDK errors**: These are warnings and won't prevent QR code from working

## Features Available

✅ Home screen with today's classes and stats
✅ Timetable with add/edit/delete functionality  
✅ Notices with add/delete functionality
✅ Notes with search, add/edit/delete functionality
✅ All data persists locally using AsyncStorage

