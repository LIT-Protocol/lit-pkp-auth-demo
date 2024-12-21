import React from 'react';
import { PKPAccount } from './AccountSelection';
export interface DashboardLibProps {
    account?: PKPAccount;
    onDisconnect: () => void;
    onSwitchAccount: () => void;
}
export declare const DashboardLib: React.FC<DashboardLibProps>;
