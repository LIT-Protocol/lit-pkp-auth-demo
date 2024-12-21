import { AuthMethod, IRelayPKP } from '@lit-protocol/types';
export default function useLitAccounts(): {
    fetchAccounts: (authMethod: AuthMethod) => Promise<void>;
    createAccount: (authMethod: AuthMethod) => Promise<void>;
    setCurrentAccount: import("react").Dispatch<import("react").SetStateAction<IRelayPKP | undefined>>;
    accounts: IRelayPKP[];
    currentAccount: IRelayPKP | undefined;
    loading: boolean;
    error: Error | undefined;
};
