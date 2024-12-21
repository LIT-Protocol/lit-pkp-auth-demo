export type WebAuthnStep = 'register' | 'authenticate';
export interface WebAuthnLibProps {
    start: WebAuthnStep;
    authWithWebAuthn: () => Promise<void>;
    setView: (view: string) => void;
    registerWithWebAuthn?: () => Promise<void>;
}
export declare const WebAuthnLib: ({ start, authWithWebAuthn, setView, registerWithWebAuthn, }: {
    start: any;
    authWithWebAuthn: any;
    setView: any;
    registerWithWebAuthn: any;
}) => import("react/jsx-runtime").JSX.Element;
