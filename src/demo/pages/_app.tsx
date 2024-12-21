import type { AppProps } from 'next/app';
import { LitAuthProvider } from '@lit-protocol/auth-lib';
import React from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LitAuthProvider>
      <Component {...pageProps} />
    </LitAuthProvider>
  );
}

export default MyApp;
