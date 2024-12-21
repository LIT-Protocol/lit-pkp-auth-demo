import React from 'react';

export interface WalletConnector {
  id: string;
  name: string;
  ready: boolean;
  icon?: string;
}

export interface WalletMethodsLibProps {
  connectors: WalletConnector[];
  authWithEthWallet: (connector: WalletConnector) => Promise<void>;
  setView: (view: string) => void;
}

export const WalletMethodsLib: React.FC<WalletMethodsLibProps> = ({
  connectors,
  authWithEthWallet,
  setView,
}) => {
  return (
    <>
      <h1>Connect your web3 wallet</h1>
      <p>
        Connect your wallet then sign a message to verify you&apos;re the owner
        of the address.
      </p>
      <div className="buttons-container">
        {connectors.map(connector => (
          <button
            type="button"
            className="btn btn--outline"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => authWithEthWallet(connector)}
          >
            {connector.icon && (
              <div className="btn__icon">
                <img
                  src={connector.icon}
                  alt={`${connector.name} logo`}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
            <span className="btn__label">Continue with {connector.name}</span>
          </button>
        ))}
        <button onClick={() => setView('default')} className="btn btn--link">
          Back
        </button>
      </div>
    </>
  );
};
