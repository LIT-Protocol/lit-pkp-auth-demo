import { AuthSig, ParsedSignedMessage, SessionSigsMap } from '@lit-protocol/types';
interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare function parseSignedMessage(signedMessage: string): ParsedSignedMessage;
/**
 * Validates the session signature.
 *
 * @param sessionSig - The session signature to validate.
 * @returns The validation result, indicating whether the session signature is valid and any errors encountered during validation.
 */
export declare function validateSessionSig(sessionSig: AuthSig): ValidationResult;
/**
 * Validates the session signatures.
 *
 * @param sessionSigs - The session signatures to validate.
 * @returns The validation result, indicating whether the session signatures are valid and any errors encountered during validation.
 */
export declare function validateSessionSigs(sessionSigs: SessionSigsMap): ValidationResult;
export {};
