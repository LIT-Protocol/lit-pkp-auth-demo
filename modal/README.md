# Lit PKP Auth Modal

A reusable authentication modal component for Lit Protocol PKP authentication.

## Installation

```bash
npm install @lit-protocol/pkp-auth-modal
# or
yarn add @lit-protocol/pkp-auth-modal
# or
pnpm add @lit-protocol/pkp-auth-modal
```

## Usage

### React Usage

```tsx
import { LitPKPAuthModal } from '@lit-protocol/pkp-auth-modal';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAuth = (sessionSigs) => {
    console.log('Authentication successful:', sessionSigs);
    // sessionSigs contains the authentication signatures
  };

  return (
    <LitPKPAuthModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onAuth={handleAuth}
      enabledMethods={['google', 'discord', 'webauthn', 'wallet', 'stytch']}
      litNetwork="cayenne"
    />
  );
}
```

### Vanilla JavaScript Usage

```html
<!-- Add the modal container -->
<div id="modal-container"></div>

<!-- Add the script -->
<script src="https://cdn.jsdelivr.net/npm/@lit-protocol/pkp-auth-modal/dist/pkp-auth-modal.js"></script>

<script>
  window.LitPKPAuthModal.init({
    container: '#modal-container',
    onAuth: function(sessionSigs) {
      console.log('Authentication successful:', sessionSigs);
    },
    enabledMethods: ['google', 'discord', 'webauthn', 'wallet', 'stytch'],
    litNetwork: 'cayenne'
  });
</script>
```

### Environment Variables

Create a `.env` file in your project root:

```env
# Required for Stytch authentication
NEXT_PUBLIC_STYTCH_PROJECT_ID="your-stytch-project-id"
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN="your-stytch-public-token"

# Optional: Configure Lit Network (default: 'cayenne')
NEXT_PUBLIC_LIT_NETWORK="cayenne"
```

To get your Stytch credentials:
1. Create an account at [Stytch Dashboard](https://stytch.com/dashboard)
2. Create a new project
3. Navigate to API Keys
4. Copy your Project ID and Public Token

### Building from Source

```bash
# Clone the repository
git clone https://github.com/LIT-Protocol/lit-pkp-auth-demo.git

# Navigate to modal directory
cd lit-pkp-auth-demo/modal

# Install dependencies
npm install

# Build the package
npm run build
```

The built files will be available in the `dist` directory:
- `dist/pkp-auth-modal.js` - UMD bundle for direct browser usage
- `dist/index.js` - CommonJS bundle for Node.js
- `dist/index.esm.js` - ES module bundle for modern bundlers

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| container | string | Yes (Vanilla JS only) | - | CSS selector for the modal container |
| onAuth | function | Yes | - | Callback function called after successful authentication |
| onClose | function | No | - | Callback function called when modal is closed |
| isOpen | boolean | No | false | Control modal visibility (React only) |
| litNetwork | string | No | 'cayenne' | Lit Protocol network to use |
| enabledMethods | Array<string> | No | all | Array of enabled authentication methods |
| theme | object | No | - | Custom theme options for the modal |

### Theme Customization

```typescript
interface ThemeOptions {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonTextColor?: string;
  modalBorderRadius?: string;
}

// Example usage
const theme = {
  primaryColor: '#3B82F6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  buttonTextColor: '#FFFFFF',
  modalBorderRadius: '8px'
};

### Authentication Methods

Available authentication methods:
- `'google'` - Google OAuth login
- `'discord'` - Discord OAuth login
- `'ethereum'` - Web3 wallet connection
- `'webauthn'` - WebAuthn/Passkey authentication
- `'stytch'` - Stytch OTP authentication

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the package:
```bash
npm run build
```

3. Test locally:
```bash
npm run dev
```

## License

MIT License
