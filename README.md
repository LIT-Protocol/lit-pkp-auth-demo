# Lit MFA
Multi-factor authentication with Lit Protocol

## Overview

This example web app demonstrates the implementation of a robust Multi-Factor Authentication (MFA) system using Lit Protocol's JS SDK. It supports various authentication methods.

### Supported Authentication Methods
- SMS
- Email
- Passkey
- Web3 Wallets
- WebAuthn
- Google Authenticator

## Getting Started
To get started with this project, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/tesla809/demo-mfa-react.git
cd demo-mfa-react
```

### Install Dependencies

```bash
npm install
```

### Configure Environment
Add your project-specific environment variables to .env.local. This includes credentials for SMS, email services, and any other third-party services you're using:

```env
NEXT_PUBLIC_SMS_API_KEY="<Your SMS API Key>"
NEXT_PUBLIC_EMAIL_SERVICE_ID="<Your Email Service ID>"
# Add other relevant variables here
```

### Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to interact with the app.