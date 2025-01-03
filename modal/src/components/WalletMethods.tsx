import React from 'react';
import { useIsMounted } from '../hooks/useIsMounted';
import { AuthView } from './Modal';

interface WalletMethodsProps {
  authWithEthWallet: (connector: any) => Promise<void>;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

const WalletMethods = ({ authWithEthWallet, setView }: WalletMethodsProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <h1>Connect your web3 wallet</h1>
      <p>
        Connect your wallet then sign a message to verify you&apos;re the owner
        of the address.
      </p>
      <div className="buttons-container">
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => authWithEthWallet({ connector: 'metamask' })}
        >
          <div className="btn__icon">
            <img src="/metamask.png" alt="MetaMask logo" className="icon" />
          </div>
          <span className="btn__label">Continue with MetaMask</span>
        </button>
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => authWithEthWallet({ connector: 'coinbase' })}
        >
          <div className="btn__icon">
            <img src="/coinbase.png" alt="Coinbase logo" className="icon" />
          </div>
          <span className="btn__label">Continue with Coinbase Wallet</span>
        </button>
        <button onClick={() => setView('default')} className="btn btn--link">
          Back
        </button>
      </div>
    </>
  );
};

export default WalletMethods;
