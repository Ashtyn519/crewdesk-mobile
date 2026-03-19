# CrewDesk iOS App Store Build Guide

## Prerequisites
1. Apple Developer Account ($99/yr) — https://developer.apple.com
2. Expo account — https://expo.dev (username: crewdesk)
3. EAS CLI — already installed (eas-cli 18.4.0)

## Bundle Identifier
`com.crewdesk.mobile`

## Quick Start — iOS Production Build

### Step 1: Login to EAS
```bash
cd /workspaces/crewdesk-mobile
eas login
# Username: crewdesk
# Password: [your expo password]
```

### Step 2: Run iOS Production Build
```bash
eas build --platform ios --profile production
```
This will:
- Auto-generate/manage signing certificates via EAS
- Ask for your Apple Developer credentials
- Build on Expo's cloud servers (no Mac needed!)
- Output an .ipa file ready for App Store Connect

### Step 3: Submit to App Store
```bash
eas submit --platform ios
```
Or manually upload via Transporter or Xcode Organizer.

## EAS Configuration Summary

### eas.json
```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "store",
        "autoIncrement": true
      }
    }
  }
}
```

### app.json iOS Config
- Bundle ID: `com.crewdesk.mobile`
- Build Number: auto-incremented
- Privacy strings configured for camera, photos, microphone, contacts, Face ID
- Encryption exempt: true (ITSAppUsesNonExemptEncryption: false)
- Supports tablet: true

## App Store Requirements

### Icons Required
- `assets/icon.png` — 1024x1024px, PNG, no alpha channel, no rounded corners
- `assets/splash.png` — any size, will be cropped to fit
- `assets/adaptive-icon.png` — for Android

### App Store Metadata Needed
- App name: CrewDesk
- Subtitle: Freelance Workforce OS
- Description: The operating system for your freelance workforce
- Keywords: freelance, crew, invoice, project, contract, management
- Category: Business
- Age rating: 4+
- Privacy policy URL: https://crewdeskapp.vercel.app/privacy
- Support URL: https://crewdeskapp.vercel.app/support

## TestFlight Distribution (Recommended First)
```bash
# Build for internal testing
eas build --platform ios --profile preview
# Then submit to TestFlight
eas submit --platform ios --latest
```

## Screens Summary
- **Home/Dashboard** — Stats grid, activity feed, project progress bars
- **Projects** — Create/filter projects, animated budget bars, modal creation
- **Crew** — Member cards, star ratings, search, status indicators  
- **Invoices** — Invoice list, mark paid, amount summaries, status filters
- **Messages** — Thread list with unread badges, full chat view with send
- **Onboarding** — 3-step animated walkthrough with spring transitions

## Design System
- Background: #04080F
- Surface: #0A1020
- Accent: #F59E0B (amber)
- Border: #1A2540
- Text: #F1F5F9

All screens built with React Native Animated API for buttery-smooth 60fps animations.
