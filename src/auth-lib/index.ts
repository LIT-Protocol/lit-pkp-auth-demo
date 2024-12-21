// Hooks
export { default as useLitAuth } from './hooks/useLitAuth';
export { default as useLitSession } from './hooks/useLitSession';
export { default as useLitAccounts } from './hooks/useLitAccounts';

// Components
export { AuthMethodsLib } from './components/AuthMethods';
export { WebAuthnLib } from './components/WebAuthn';
export { StytchOTPLib } from './components/StytchOTP';
export { WalletMethodsLib } from './components/WalletMethods';

// Utils
export * from './utils/lit';

// Types
export type { LitConfig } from './utils/lit';
export type { UseLitSessionProps } from './hooks/useLitSession';
export type { AuthMethodsLibProps } from './components/AuthMethods';
export type { WebAuthnLibProps, WebAuthnStep } from './components/WebAuthn';
export type { StytchOTPLibProps, OtpMethod, OtpStep } from './components/StytchOTP';
export type { WalletMethodsLibProps } from './components/WalletMethods';
export type { WalletConnector } from './components/WalletMethods';
export type { AccountSelectionLibProps, PKPAccount } from './components/AccountSelection';
export type { LoginMethodsLibProps, LoginView } from './components/LoginMethods';
export type { SignUpMethodsLibProps, SignUpView } from './components/SignUpMethods';
export type { DashboardLibProps } from './components/Dashboard';

// Component Exports
export { AccountSelectionLib } from './components/AccountSelection';
export { LoginMethodsLib } from './components/LoginMethods';
export { SignUpMethodsLib } from './components/SignUpMethods';
export { DashboardLib } from './components/Dashboard';
