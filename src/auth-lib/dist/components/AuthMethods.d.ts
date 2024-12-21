import type { LoginView } from './LoginMethods';
import type { SignUpView } from './SignUpMethods';
export interface AuthMethodsLibProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    setView: (view: LoginView | SignUpView) => void;
    googleIconUrl?: string;
    discordIconUrl?: string;
}
export declare const AuthMethodsLib: ({ handleGoogleLogin, handleDiscordLogin, setView, googleIconUrl, discordIconUrl, }: {
    handleGoogleLogin: any;
    handleDiscordLogin: any;
    setView: any;
    googleIconUrl?: string;
    discordIconUrl?: string;
}) => import("react/jsx-runtime").JSX.Element;
