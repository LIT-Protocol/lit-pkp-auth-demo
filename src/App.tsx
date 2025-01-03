import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { goerli, mainnet, optimism } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { StytchProvider } from '@stytch/react';
import { createStytchUIClient } from '@stytch/react/ui';
import SignUpView from './components/SignUpView';
import LoginView from './components/LoginView';
import './styles/globals.css';

const { provider, chains } = configureChains(
  [mainnet, goerli, optimism],
  [publicProvider()]
);

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
  ],
  provider,
});

const stytch = createStytchUIClient(
  process.env.REACT_APP_STYTCH_PUBLIC_TOKEN || ''
);

function App() {
  return (
    <BrowserRouter>
      <StytchProvider stytch={stytch}>
        <WagmiConfig client={client}>
          <div className="container">
            <header>
              <img src="/lit.svg" alt="Lit logo" width={32} height={32} />
              <a
                href="https://developer.litprotocol.com/?ref=demo.getlit.dev"
                target="_blank"
                rel="noopener nofollow"
                className="lit-cta"
              >
                Build on Lit
              </a>
            </header>
            <main>
              <Routes>
                <Route path="/" element={<SignUpView />} />
                <Route path="/login" element={<LoginView />} />
              </Routes>
            </main>
            <footer>
              <a
                href="https://github.com/LIT-Protocol/pkp-social-auth-example"
                target="_blank"
                rel="noopener nofollow"
                className="footer-link"
              >
                View the source code
              </a>
            </footer>
          </div>
        </WagmiConfig>
      </StytchProvider>
    </BrowserRouter>
  );
}

export default App;
