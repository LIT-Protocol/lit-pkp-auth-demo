import { StytchToken } from '@lit-protocol/types';
export type FactorParser = 'email' | 'sms' | 'whatsApp' | 'totp';
export declare const emailOtpAuthFactorParser: (parsedToken: StytchToken, provider: string) => string;
export declare const smsOtpAuthFactorParser: (parsedToken: StytchToken, provider: string) => string;
export declare const whatsAppOtpAuthFactorParser: (parsedToken: StytchToken, provider: string) => string;
export declare const totpAuthFactorParser: (parsedToken: StytchToken, provider: string) => string;
