import { AuthMethod, IRelayPKP } from '@lit-protocol/types';
export declare function useLitAccounts(): {
    fetchAccounts: (authMethod: AuthMethod) => Promise<void>;
    createAccount: (authMethod: AuthMethod) => Promise<void>;
    setCurrentAccount: import("react").Dispatch<import("react").SetStateAction<IRelayPKP>>;
    accounts: IRelayPKP[];
    currentAccount: IRelayPKP;
    loading: boolean;
    error: Error;
};
