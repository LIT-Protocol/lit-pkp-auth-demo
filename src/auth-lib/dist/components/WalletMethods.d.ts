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
export declare const WalletMethodsLib: ({ connectors, authWithEthWallet, setView, }: {
    connectors: any;
    authWithEthWallet: any;
    setView: any;
}) => import("react/jsx-runtime").JSX.Element;
