import { useRouter } from 'next/router';
import { useLitAuth, LoginMethodsLib } from '@lit-protocol/auth-lib';
import React from 'react';

export default function Login() {
  const router = useRouter();
  const { authenticate } = useLitAuth();

  const handleAuth = async (authMethod: string) => {
    await authenticate(authMethod);
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Login to Lit Auth Demo</h1>
      <LoginMethodsLib
        onGoogleLogin={() => handleAuth('google')}
        onDiscordLogin={() => handleAuth('discord')}
        onWebAuthnLogin={() => handleAuth('webauthn')}
        onStytchLogin={() => handleAuth('stytch')}
        onWalletLogin={() => handleAuth('wallet')}
      />
    </div>
  );
}