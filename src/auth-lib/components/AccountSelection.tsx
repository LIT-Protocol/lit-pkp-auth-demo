import React, { useState } from 'react';

export interface PKPAccount {
  ethAddress: string;
  publicKey: string;
}

export interface AccountSelectionLibProps {
  accounts: PKPAccount[];
  setCurrentAccount: (account: PKPAccount) => void;
  error?: Error;
}

export const AccountSelectionLib: React.FC<AccountSelectionLibProps> = ({
  accounts,
  setCurrentAccount,
  error,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('0');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const account = accounts[parseInt(selectedValue)];
    return setCurrentAccount(account);
  }

  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <h1>Choose your account</h1>
        <p>Continue with one of your accounts.</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="accounts-wrapper" role="radiogroup" aria-label="View accounts">
            {accounts.map((account, index) => (
              <div
                key={`account-${index}`}
                className={`account-item ${
                  selectedValue === index.toString() && 'account-item--selected'
                }`}
              >
                <label className="account-item__label">
                  <input
                    type="radio"
                    className="account-item__radio"
                    name="account"
                    value={index.toString()}
                    checked={selectedValue === index.toString()}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    aria-label={account.ethAddress.toLowerCase()}
                  />
                  <span className="account-item__indicator" />
                  <span className="account-item__text">
                    {account.ethAddress.toLowerCase()}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn--primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
