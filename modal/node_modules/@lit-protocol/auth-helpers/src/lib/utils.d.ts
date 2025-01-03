/**
 * Formats the resource ID to a 32-byte hex string.
 *
 * - Takes out '0x' and makes the string 64 characters long.
 * - Adds zeros to make short strings 64 characters.
 * - Doesn't change valid 64-character hex strings.
 * - Returns '*' as is.
 * - Returns the original if it has bad hex characters.
 * - Doesn't change 64-character strings.
 * - Adds zeros to make short hex strings 64 characters.
 * - Returns the original if it partly matches hex.
 * - Throws an error if the string is too long.
 *
 * @param resource The identifier for the resource. This should be the PKP token ID.
 * @returns A 32-byte hex string representing the resource ID.
 * @throws Will throw an error if the input exceeds 64 characters.
 */
export declare function formatPKPResource(resource: string): string;
