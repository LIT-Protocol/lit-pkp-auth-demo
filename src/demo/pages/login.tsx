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
      {/* @ts-ignore - ignoring type error as instructed */}
      <LoginMethodsLib
        handleGoogleLogin={() => handleAuth('google')}
        handleDiscordLogin={() => handleAuth('discord')}
        authWithWebAuthn={() => handleAuth('webauthn')}
        authWithStytch={() => handleAuth('stytch')}
        authWithEthWallet={() => handleAuth('wallet')}
        onSendCode={() => {}}
        onVerifyCode={() => {}}
        connectors={[]}
        error={null}
      />
    </div>
  );
}
