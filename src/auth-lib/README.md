# Lit Protocol Auth Library

A modular, framework-agnostic authentication library for React applications using Lit Protocol.

## Installation

```bash
# From GitHub
npm install git+https://github.com/LIT-Protocol/lit-pkp-auth-demo.git#main

# From local source
npm install /path/to/lit-pkp-auth-demo
```

## Configuration

1. Set up your environment variables:

```env
NEXT_PUBLIC_STYTCH_PROJECT_ID="your-stytch-project-id"
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN="your-stytch-public-token"
NEXT_PUBLIC_LIT_NETWORK="cayenne" # Optional: defaults to 'cayenne'
```

## Usage

### Basic Authentication

```typescript
import { useLitAuth } from '@lit-protocol/auth-lib';

function App() {
  const { authenticate, isAuthenticated, error } = useLitAuth();

  const handleLogin = async () => {
    await authenticate();
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <p>Authenticated!</p>
      )}
    </div>
  );
}
```

### Using UI Components

```typescript
import { AuthMethodsLib, WebAuthnLib } from '@lit-protocol/auth-lib';

function LoginPage() {
  const { authenticate } = useLitAuth();

  return (
    <div>
      <AuthMethodsLib
        onGoogleLogin={authenticate}
        onDiscordLogin={authenticate}
      />
      <WebAuthnLib onAuthenticate={authenticate} />
    </div>
  );
}
```

### Managing Sessions

```typescript
import { useLitSession } from '@lit-protocol/auth-lib';

function Dashboard() {
  const { sessionSigs, logout } = useLitSession();

  return (
    <div>
      {sessionSigs ? (
        <>
          <p>Authenticated with Lit Protocol</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
}
```

### Managing PKP Accounts

```typescript
import { useLitAccounts } from '@lit-protocol/auth-lib';

function AccountManager() {
  const { accounts, createAccount, switchAccount } = useLitAccounts();

  return (
    <div>
      {accounts.map(account => (
        <button key={account.address} onClick={() => switchAccount(account)}>
          Switch to {account.address}
        </button>
      ))}
      <button onClick={createAccount}>Create New Account</button>
    </div>
  );
}
```

## Available Hooks

- `useLitAuth`: Main authentication hook
- `useLitSession`: Session management
- `useLitAccounts`: PKP account management

## UI Components

- `AuthMethodsLib`: Multiple authentication methods
- `WebAuthnLib`: WebAuthn/passkey authentication
- `StytchOTPLib`: Email/Phone OTP authentication
- `WalletMethodsLib`: Ethereum wallet authentication
- `AccountSelectionLib`: PKP account selection
- `LoginMethodsLib`: Complete login flow
- `SignUpMethodsLib`: Complete signup flow
- `DashboardLib`: User dashboard

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Submit a pull request

## License

MIT License
