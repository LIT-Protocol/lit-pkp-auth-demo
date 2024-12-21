import React from 'react';
export interface AuthMethodsLibProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    setView: (view: string) => void;
    googleIconUrl?: string;
    discordIconUrl?: string;
}
export declare const AuthMethodsLib: ({ handleGoogleLogin, handleDiscordLogin, setView, googleIconUrl, discordIconUrl, }: {
    handleGoogleLogin: any;
    handleDiscordLogin: any;
    setView: any;
    googleIconUrl?: string | undefined;
    discordIconUrl?: string | undefined;
}) => React.JSX.Element;
