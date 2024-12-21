# Lit Auth Demo

This demo application showcases the usage of the Lit Protocol authentication library. It demonstrates various authentication methods and account management features.

## Features

- Multiple authentication methods (Google, Discord, WebAuthn, Stytch, Wallet)
- Session management
- PKP account management
- Dashboard with user information

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```env
NEXT_PUBLIC_STYTCH_PROJECT_ID="your-stytch-project-id"
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN="your-stytch-public-token"
```

3. Run the development server:
```bash
npm run dev
```

## Pages

- `/`: Sign up page with multiple authentication options
- `/login`: Login page for existing users
- `/dashboard`: User dashboard showing session and account information

## Components

The demo uses components from the `@lit-protocol/auth-lib` package:

- `SignUpMethodsLib`: Authentication options for new users
- `LoginMethodsLib`: Authentication options for existing users
- `DashboardLib`: Display user session information
- `AccountSelectionLib`: Manage PKP accounts
