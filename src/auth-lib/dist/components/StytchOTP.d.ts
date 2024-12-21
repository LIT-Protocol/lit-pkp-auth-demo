export type OtpMethod = 'email' | 'phone';
export type OtpStep = 'submit' | 'verify';
export interface StytchOTPLibProps {
    method: OtpMethod;
    authWithStytch: (accessToken: string, userId: string, method: string) => Promise<void>;
    setView: (view: string) => void;
    onSendCode: (userId: string, method: OtpMethod) => Promise<{
        methodId: string;
    }>;
    onVerifyCode: (code: string, methodId: string) => Promise<{
        sessionJwt: string;
        userId: string;
    }>;
}
export declare const StytchOTPLib: ({ method, authWithStytch, setView, onSendCode, onVerifyCode, }: {
    method: any;
    authWithStytch: any;
    setView: any;
    onSendCode: any;
    onVerifyCode: any;
}) => import("react/jsx-runtime").JSX.Element;
