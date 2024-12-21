import React from 'react';
import { PKPAccount } from './AccountSelection';

export interface DashboardLibProps {
  account?: PKPAccount;
  onDisconnect: () => void;
  onSwitchAccount: () => void;
}

export const DashboardLib: React.FC<DashboardLibProps> = ({
  account,
  onDisconnect,
  onSwitchAccount,
}) => {
  if (!account) {
    return null;
  }

  return (
    <div className="container">
      <div className="wrapper">
        <h1>Dashboard</h1>
        <div className="account-info">
          <h2>Current Account</h2>
          <p className="account-address">{account.ethAddress.toLowerCase()}</p>
          <div className="buttons-container">
            <button
              type="button"
              className="btn btn--outline"
              onClick={onSwitchAccount}
            >
              Switch Account
            </button>
            <button
              type="button"
              className="btn btn--outline btn--danger"
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
