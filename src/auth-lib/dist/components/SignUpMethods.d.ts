import { Dispatch, SetStateAction } from 'react';
export type SignUpView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';
export type SetSignUpView = Dispatch<SetStateAction<SignUpView>>;
export interface SignUpMethodsLibProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithStytch: (accessToken: string, userId: string, method: string) => Promise<void>;
    authWithEthWallet: (connector: any) => Promise<void>;
    registerWithWebAuthn: () => Promise<void>;
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
export declare const SignUpMethodsLib: ({ handleGoogleLogin, handleDiscordLogin, authWithStytch, authWithEthWallet, registerWithWebAuthn, authWithWebAuthn, onSendCode, onVerifyCode, connectors, error, }: {
    handleGoogleLogin: any;
    handleDiscordLogin: any;
    authWithStytch: any;
    authWithEthWallet: any;
    registerWithWebAuthn: any;
    authWithWebAuthn: any;
    onSendCode: any;
    onVerifyCode: any;
    connectors: any;
    error: any;
}) => JSX.Element;
