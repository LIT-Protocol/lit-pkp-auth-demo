import React, { JSX } from 'react';
import { IRelayPKP } from '@lit-protocol/types';

interface AccountSelectionProps {
  accounts: IRelayPKP[];
  setCurrentAccount: (account: IRelayPKP) => void;
  error?: Error;
}

const AccountSelection = ({
  accounts,
  setCurrentAccount,
  error,
}: AccountSelectionProps): JSX.Element => {
  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <h1>Select an account</h1>
        <p>Choose which account you&apos;d like to use.</p>
        <div className="buttons-container">
          {accounts.map((account, i) => (
            <button
              key={i}
              type="button"
              className="btn btn--outline"
              onClick={() => setCurrentAccount(account)}
            >
              <div className="btn__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
              </div>
              <span className="btn__label">
                {account.ethAddress.toLowerCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountSelection;
