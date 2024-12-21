import { useRouter } from 'next/router';
import { useLitAuth, SignUpMethodsLib } from '@lit-protocol/auth-lib';
import React from 'react';

export default function Home() {
  const router = useRouter();
  const { authenticate } = useLitAuth();

  const handleAuth = async (authMethod: string) => {
    await authenticate(authMethod);
    router.push('/dashboard');
  };

  const handleSendCode = async (userId: string, method: 'email' | 'phone') => {
    // This is a placeholder implementation
    return { methodId: 'placeholder-method-id' };
  };

  const handleVerifyCode = async (code: string, methodId: string) => {
    // This is a placeholder implementation
    return { sessionJwt: 'placeholder-jwt', userId: 'placeholder-user-id' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Lit Auth Demo</h1>
      <SignUpMethodsLib
        handleGoogleLogin={() => handleAuth('google')}
        handleDiscordLogin={() => handleAuth('discord')}
        authWithStytch={async (accessToken: string, userId: string, method: string) => handleAuth('stytch')}
        authWithEthWallet={async (connector: any) => handleAuth('wallet')}
        registerWithWebAuthn={() => handleAuth('webauthn')}
        authWithWebAuthn={() => handleAuth('webauthn')}
        onSendCode={handleSendCode}
        onVerifyCode={handleVerifyCode}
        connectors={[]}
        error={undefined}
      />
    </div>
  );
}
