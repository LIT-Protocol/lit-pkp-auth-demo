import React from 'react';
interface LitAuthContextType {
    litNodeClient: any;
    authClient: any;
    session: any;
    accounts: any[];
    authenticate: (method: string) => Promise<void>;
    loading: boolean;
}
export declare const useLitAuth: () => LitAuthContextType;
export declare const LitAuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
