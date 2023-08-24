import { AppProps } from 'next/app';
import '../styles/globals.css';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { goerli, mainnet, optimism } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import { Albert_Sans } from 'next/font/google';
import Image from 'next/image';

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
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);

const font = Albert_Sans({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StytchProvider stytch={stytch}>
      <WagmiConfig client={client}>
        <header>
          <Image src="/lit.svg" alt="Lit logo" width={32} height={32}></Image>
          <a
            href="https://developer.litprotocol.com/?ref=demo.getlit.dev"
            target="_blank"
            rel="noopener nofollow"
            className="lit-cta"
          >
            Build on Lit
          </a>
        </header>
        <main className={font.className}>
          <Component {...pageProps} />
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
      </WagmiConfig>
    </StytchProvider>
  );
}
