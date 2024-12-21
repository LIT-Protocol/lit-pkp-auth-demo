"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiweMessage = void 0;
// TODO: Figure out how to get types from this lib:
const siwe_parser_1 = require("@spruceid/siwe-parser");
const uri = __importStar(require("valid-url"));
const ethersCompat_1 = require("./ethersCompat");
const types_1 = require("./types");
const utils_1 = require("./utils");
class SiweMessage {
    /**
     * Creates a parsed Sign-In with Ethereum Message (EIP-4361) object from a
     * string or an object. If a string is used an ABNF parser is called to
     * validate the parameter, otherwise the fields are attributed.
     * @param param {string | SiweMessage} Sign message as a string or an object.
     */
    constructor(param) {
        if (typeof param === 'string') {
            const parsedMessage = new siwe_parser_1.ParsedMessage(param);
            this.scheme = parsedMessage.scheme;
            this.domain = parsedMessage.domain;
            this.address = parsedMessage.address;
            this.statement = parsedMessage.statement;
            this.uri = parsedMessage.uri;
            this.version = parsedMessage.version;
            this.nonce = parsedMessage.nonce;
            this.issuedAt = parsedMessage.issuedAt;
            this.expirationTime = parsedMessage.expirationTime;
            this.notBefore = parsedMessage.notBefore;
            this.requestId = parsedMessage.requestId;
            this.chainId = parsedMessage.chainId;
            this.resources = parsedMessage.resources;
        }
        else {
            this.scheme = param === null || param === void 0 ? void 0 : param.scheme;
            this.domain = param.domain;
            this.address = param.address;
            this.statement = param === null || param === void 0 ? void 0 : param.statement;
            this.uri = param.uri;
            this.version = param.version;
            this.chainId = param.chainId;
            this.nonce = param.nonce;
            this.issuedAt = param === null || param === void 0 ? void 0 : param.issuedAt;
            this.expirationTime = param === null || param === void 0 ? void 0 : param.expirationTime;
            this.notBefore = param === null || param === void 0 ? void 0 : param.notBefore;
            this.requestId = param === null || param === void 0 ? void 0 : param.requestId;
            this.resources = param === null || param === void 0 ? void 0 : param.resources;
            if (typeof this.chainId === 'string') {
                this.chainId = (0, siwe_parser_1.parseIntegerNumber)(this.chainId);
            }
        }
        this.nonce = this.nonce || (0, utils_1.generateNonce)();
        this.validateMessage();
    }
    /**
     * This function can be used to retrieve an EIP-4361 formated message for
     * signature, although you can call it directly it's advised to use
     * [prepareMessage()] instead which will resolve to the correct method based
     * on the [type] attribute of this object, in case of other formats being
     * implemented.
     * @returns {string} EIP-4361 formated message, ready for EIP-191 signing.
     */
    toMessage() {
        /** Validates all fields of the object */
        this.validateMessage();
        const headerPrefx = this.scheme ? `${this.scheme}://${this.domain}` : this.domain;
        const header = `${headerPrefx} wants you to sign in with your Ethereum account:`;
        const uriField = `URI: ${this.uri}`;
        let prefix = [header, this.address].join('\n');
        const versionField = `Version: ${this.version}`;
        if (!this.nonce) {
            this.nonce = (0, utils_1.generateNonce)();
        }
        const chainField = `Chain ID: ` + this.chainId || '1';
        const nonceField = `Nonce: ${this.nonce}`;
        const suffixArray = [uriField, versionField, chainField, nonceField];
        this.issuedAt = this.issuedAt || new Date().toISOString();
        suffixArray.push(`Issued At: ${this.issuedAt}`);
        if (this.expirationTime) {
            const expiryField = `Expiration Time: ${this.expirationTime}`;
            suffixArray.push(expiryField);
        }
        if (this.notBefore) {
            suffixArray.push(`Not Before: ${this.notBefore}`);
        }
        if (this.requestId) {
            suffixArray.push(`Request ID: ${this.requestId}`);
        }
        if (this.resources) {
            suffixArray.push([`Resources:`, ...this.resources.map(x => `- ${x}`)].join('\n'));
        }
        const suffix = suffixArray.join('\n');
        prefix = [prefix, this.statement].join('\n\n');
        if (this.statement) {
            prefix += '\n';
        }
        return [prefix, suffix].join('\n');
    }
    /**
     * This method parses all the fields in the object and creates a messaging for signing
     * message according with the type defined.
     * @returns {string} Returns a message ready to be signed according with the
     * type defined in the object.
     */
    prepareMessage() {
        let message;
        switch (this.version) {
            case '1': {
                message = this.toMessage();
                break;
            }
            default: {
                message = this.toMessage();
                break;
            }
        }
        return message;
    }
    /**
     * @deprecated
     * Verifies the integrity of the object by matching its signature.
     * @param signature Signature to match the address in the message.
     * @param provider Ethers provider to be used for EIP-1271 validation
     */
    validate(signature, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn('validate() has been deprecated, please update your code to use verify(). validate() may be removed in future versions.');
            return this.verify({ signature }, { provider, suppressExceptions: false })
                .then(({ data }) => data)
                .catch(({ error }) => {
                throw error;
            });
        });
    }
    /**
     * Verifies the integrity of the object by matching its signature.
     * @param params Parameters to verify the integrity of the message, signature is required.
     * @returns {Promise<SiweMessage>} This object if valid.
     */
    verify(params, opts = { suppressExceptions: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a, _b, _c;
                const fail = result => {
                    if (opts.suppressExceptions) {
                        return resolve(result);
                    }
                    else {
                        return reject(result);
                    }
                };
                const invalidParams = (0, utils_1.checkInvalidKeys)(params, types_1.VerifyParamsKeys);
                if (invalidParams.length > 0) {
                    fail({
                        success: false,
                        data: this,
                        error: new Error(`${invalidParams.join(', ')} is/are not valid key(s) for VerifyParams.`),
                    });
                }
                const invalidOpts = (0, utils_1.checkInvalidKeys)(opts, types_1.VerifyOptsKeys);
                if (invalidParams.length > 0) {
                    fail({
                        success: false,
                        data: this,
                        error: new Error(`${invalidOpts.join(', ')} is/are not valid key(s) for VerifyOpts.`),
                    });
                }
                const { signature, scheme, domain, nonce, time } = params;
                /** Scheme for domain binding */
                if (scheme && scheme !== this.scheme) {
                    fail({
                        success: false,
                        data: this,
                        error: new types_1.SiweError(types_1.SiweErrorType.SCHEME_MISMATCH, scheme, this.scheme),
                    });
                }
                /** Domain binding */
                if (domain && domain !== this.domain) {
                    fail({
                        success: false,
                        data: this,
                        error: new types_1.SiweError(types_1.SiweErrorType.DOMAIN_MISMATCH, domain, this.domain),
                    });
                }
                /** Nonce binding */
                if (nonce && nonce !== this.nonce) {
                    fail({
                        success: false,
                        data: this,
                        error: new types_1.SiweError(types_1.SiweErrorType.NONCE_MISMATCH, nonce, this.nonce),
                    });
                }
                /** Check time or now */
                const checkTime = new Date(time || new Date());
                /** Message not expired */
                if (this.expirationTime) {
                    const expirationDate = new Date(this.expirationTime);
                    if (checkTime.getTime() >= expirationDate.getTime()) {
                        fail({
                            success: false,
                            data: this,
                            error: new types_1.SiweError(types_1.SiweErrorType.EXPIRED_MESSAGE, `${checkTime.toISOString()} < ${expirationDate.toISOString()}`, `${checkTime.toISOString()} >= ${expirationDate.toISOString()}`),
                        });
                    }
                }
                /** Message is valid already */
                if (this.notBefore) {
                    const notBefore = new Date(this.notBefore);
                    if (checkTime.getTime() < notBefore.getTime()) {
                        fail({
                            success: false,
                            data: this,
                            error: new types_1.SiweError(types_1.SiweErrorType.NOT_YET_VALID_MESSAGE, `${checkTime.toISOString()} >= ${notBefore.toISOString()}`, `${checkTime.toISOString()} < ${notBefore.toISOString()}`),
                        });
                    }
                }
                let EIP4361Message;
                try {
                    EIP4361Message = this.prepareMessage();
                }
                catch (e) {
                    fail({
                        success: false,
                        data: this,
                        error: e,
                    });
                }
                /** Recover address from signature */
                let addr;
                try {
                    addr = (0, ethersCompat_1.verifyMessage)(EIP4361Message, signature);
                }
                catch (e) {
                    console.error(e);
                }
                /** Match signature with message's address */
                if (addr === this.address) {
                    return resolve({
                        success: true,
                        data: this,
                    });
                }
                else {
                    const EIP1271Promise = (0, utils_1.checkContractWalletSignature)(this, signature, opts.provider)
                        .then(isValid => {
                        if (!isValid) {
                            return {
                                success: false,
                                data: this,
                                error: new types_1.SiweError(types_1.SiweErrorType.INVALID_SIGNATURE, addr, `Resolved address to be ${this.address}`),
                            };
                        }
                        return {
                            success: true,
                            data: this,
                        };
                    })
                        .catch(error => {
                        return {
                            success: false,
                            data: this,
                            error,
                        };
                    });
                    Promise.all([
                        EIP1271Promise,
                        (_c = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.verificationFallback) === null || _a === void 0 ? void 0 : _a.call(opts, params, opts, this, EIP1271Promise)) === null || _b === void 0 ? void 0 : _b.then(res => res)) === null || _c === void 0 ? void 0 : _c.catch((res) => res),
                    ]).then(([EIP1271Response, fallbackResponse]) => {
                        if (fallbackResponse) {
                            if (fallbackResponse.success) {
                                return resolve(fallbackResponse);
                            }
                            else {
                                fail(fallbackResponse);
                            }
                        }
                        else {
                            if (EIP1271Response.success) {
                                return resolve(EIP1271Response);
                            }
                            else {
                                fail(EIP1271Response);
                            }
                        }
                    });
                }
            });
        });
    }
    /**
     * Validates the values of this object fields.
     * @throws Throws an {ErrorType} if a field is invalid.
     */
    validateMessage(...args) {
        var _a;
        /** Checks if the user might be using the function to verify instead of validate. */
        if (args.length > 0) {
            throw new types_1.SiweError(types_1.SiweErrorType.UNABLE_TO_PARSE, `Unexpected argument in the validateMessage function.`);
        }
        /** `domain` check. */
        if (!this.domain ||
            this.domain.length === 0 ||
            !/[^#?]*/.test(this.domain)) {
            throw new types_1.SiweError(types_1.SiweErrorType.INVALID_DOMAIN, `${this.domain} to be a valid domain.`);
        }
        /** EIP-55 `address` check. */
        if (!(0, siwe_parser_1.isEIP55Address)(this.address)) {
            throw new types_1.SiweError(types_1.SiweErrorType.INVALID_ADDRESS, (0, ethersCompat_1.getAddress)(this.address), this.address);
        }
        /** Check if the URI is valid. */
        if (!uri.isUri(this.uri)) {
            throw new types_1.SiweError(types_1.SiweErrorType.INVALID_URI, `${this.uri} to be a valid uri.`);
        }
        /** Check if the version is 1. */
        if (this.version !== '1') {
            throw new types_1.SiweError(types_1.SiweErrorType.INVALID_MESSAGE_VERSION, '1', this.version);
        }
        /** Check if the nonce is alphanumeric and bigger then 8 characters */
        const nonce = (_a = this === null || this === void 0 ? void 0 : this.nonce) === null || _a === void 0 ? void 0 : _a.match(/[a-zA-Z0-9]{8,}/);
        if (!nonce || this.nonce.length < 8 || nonce[0] !== this.nonce) {
            throw new types_1.SiweError(types_1.SiweErrorType.INVALID_NONCE, `Length > 8 (${nonce.length}). Alphanumeric.`, this.nonce);
        }
        /** `issuedAt` conforms to ISO-8601 and is a valid date. */
        if (this.issuedAt) {
            if (!(0, utils_1.isValidISO8601Date)(this.issuedAt)) {
                throw new Error(types_1.SiweErrorType.INVALID_TIME_FORMAT);
            }
        }
        /** `expirationTime` conforms to ISO-8601 and is a valid date. */
        if (this.expirationTime) {
            if (!(0, utils_1.isValidISO8601Date)(this.expirationTime)) {
                throw new Error(types_1.SiweErrorType.INVALID_TIME_FORMAT);
            }
        }
        /** `notBefore` conforms to ISO-8601 and is a valid date. */
        if (this.notBefore) {
            if (!(0, utils_1.isValidISO8601Date)(this.notBefore)) {
                throw new Error(types_1.SiweErrorType.INVALID_TIME_FORMAT);
            }
        }
    }
}
exports.SiweMessage = SiweMessage;
