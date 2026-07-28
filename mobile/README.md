# GUYGD Mobile App

React Native + Expo mobile app for GUYGD — connects to the existing Railway backend.

## Setup

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** app on your phone.

## Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Build Android APK
eas build --platform android

# Build iOS
eas build --platform ios
```

## Structure

```
mobile/
├── App.js                        # Entry point
├── app.json                      # Expo config
├── src/
│   ├── services/api.js           # Axios + JWT interceptor
│   ├── context/AuthContext.js    # Auth state (login/logout)
│   ├── navigation/
│   │   ├── RootNavigator.js      # Routes based on role
│   │   ├── AuthNavigator.js      # Login / Register
│   │   ├── MemberTabs.js         # Member bottom tabs
│   │   └── AdminTabs.js          # Admin bottom tabs
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.js
│       │   └── RegisterScreen.js
│       ├── public/
│       │   ├── HomeScreen.js
│       │   ├── EventsScreen.js
│       │   ├── NewsScreen.js
│       │   └── GalleryScreen.js
│       ├── member/
│       │   └── MemberDashboardScreen.js
│       └── admin/
│           ├── AdminDashboardScreen.js
│           ├── MembersScreen.js
│           ├── ApplicationsScreen.js
│           ├── DonationsScreen.js
│           └── AdminSettingsScreen.js
```

## Roles

| Role | Access |
|---|---|
| member | Home, Events, News, Gallery, Dashboard |
| executive | Dashboard, Donations (hide only), Settings |
| admin | Dashboard, Members, Applications, Donations, Settings |
| super_admin | Full access |
