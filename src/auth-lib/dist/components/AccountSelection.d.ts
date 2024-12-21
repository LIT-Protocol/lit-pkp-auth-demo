import React from 'react';
export interface PKPAccount {
    ethAddress: string;
    publicKey: string;
}
export interface AccountSelectionLibProps {
    accounts: PKPAccount[];
    setCurrentAccount: (account: PKPAccount) => void;
    error?: Error;
}
export declare const AccountSelectionLib: React.FC<AccountSelectionLibProps>;
