import { Dispatch, SetStateAction } from 'react';
export type LoginView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';
export type SetLoginView = Dispatch<SetStateAction<LoginView>>;
export interface LoginMethodsLibProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithStytch: (accessToken: string, userId: string, method: string) => Promise<void>;
    authWithEthWallet: (connector: any) => Promise<void>;
    authWithWebAuthn: () => Promise<void>;
    onSendCode: (userId: string, method: 'email' | 'phone') => Promise<{
        methodId: string;
    }>;
    onVerifyCode: (code: string, methodId: string) => Promise<{
        sessionJwt: string;
        userId: string;
    }>;
    connectors: any[];
    error?: Error;
}
export declare const LoginMethodsLib: ({ handleGoogleLogin, handleDiscordLogin, authWithStytch, authWithEthWallet, authWithWebAuthn, onSendCode, onVerifyCode, connectors, error, }: {
    handleGoogleLogin: any;
    handleDiscordLogin: any;
    authWithStytch: any;
    authWithEthWallet: any;
    authWithWebAuthn: any;
    onSendCode: any;
    onVerifyCode: any;
    connectors: any;
    error: any;
}) => JSX.Element;
