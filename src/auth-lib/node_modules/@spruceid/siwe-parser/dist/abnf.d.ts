export declare class ParsedMessage {
    scheme: string | null;
    domain: string;
    address: string;
    statement: string | null;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
    expirationTime: string | null;
    notBefore: string | null;
    requestId: string | null;
    resources: Array<string> | null;
    constructor(msg: string);
}
