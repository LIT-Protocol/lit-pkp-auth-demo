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
const fs = __importStar(require("fs"));
const parsingPositive = JSON.parse(fs.readFileSync('../../test/parsing_positive.json', 'utf8'));
const parsingNegative = JSON.parse(fs.readFileSync('../../test/parsing_negative.json', 'utf8'));
const parsingNegativeObjects = JSON.parse(fs.readFileSync('../../test/parsing_negative_objects.json', 'utf8'));
const verificationPositive = JSON.parse(fs.readFileSync('../../test/verification_positive.json', 'utf8'));
const verificationNegative = JSON.parse(fs.readFileSync('../../test/verification_negative.json', 'utf8'));
const EIP1271 = JSON.parse(fs.readFileSync('../../test/eip1271.json', 'utf8'));
const ethers_1 = require("ethers");
const client_1 = require("./client");
const types_1 = require("./types");
describe(`Message Generation`, () => {
    test.concurrent.each(Object.entries(parsingPositive))('Generates message successfully: %s', (_, test) => {
        const msg = new client_1.SiweMessage(test.fields);
        expect(msg.toMessage()).toBe(test.message);
    });
    test.concurrent.each(Object.entries(parsingNegative))('Fails to generate message: %s', (n, test) => {
        try {
            new client_1.SiweMessage(test);
        }
        catch (error) {
            expect(Object.values(types_1.SiweErrorType).includes(error));
        }
    });
    test.concurrent.each(Object.entries(parsingNegativeObjects))('Fails to generate message: %s', (n, test) => {
        try {
            new client_1.SiweMessage(test);
        }
        catch (error) {
            expect(Object.values(types_1.SiweErrorType).includes(error));
        }
    });
});
describe(`Message verification without suppressExceptions`, () => {
    test.concurrent.each(Object.entries(verificationPositive))('Verifies message successfully: %s', (_, test_fields) => __awaiter(void 0, void 0, void 0, function* () {
        const msg = new client_1.SiweMessage(test_fields);
        yield expect(msg
            .verify({
            signature: test_fields.signature,
            time: test_fields.time || test_fields.issuedAt,
            scheme: test_fields.scheme,
            domain: test_fields.domainBinding,
            nonce: test_fields.matchNonce,
        })
            // when validate is removed uncomment this and remove the following then
            // .then(({ success }) => success)
            .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .useFakeTimers()
                .setSystemTime(new Date(test_fields.time || test_fields.issuedAt));
            const res = yield msg.validate(test_fields.signature);
            return res === data;
        }))).resolves.toBeTruthy();
        jest.useRealTimers();
    }));
    test.concurrent.each(Object.entries(verificationNegative))('Fails to verify message: %s and rejects the promise', (n, test_fields) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const msg = new client_1.SiweMessage(test_fields);
            yield expect(msg
                .verify({
                signature: test_fields.signature,
                time: test_fields.time || test_fields.issuedAt,
                scheme: test_fields.scheme,
                domain: test_fields.domainBinding,
                nonce: test_fields.matchNonce,
            })
                .then(({ success }) => success)).rejects.toBeFalsy();
        }
        catch (error) {
            expect(Object.values(types_1.SiweErrorType).includes(error));
        }
    }));
});
describe(`Message verification with suppressExceptions`, () => {
    test.concurrent.each(Object.entries(verificationNegative))('Fails to verify message: %s but still resolves the promise', (n, test_fields) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const msg = new client_1.SiweMessage(test_fields);
            yield expect(msg
                .verify({
                signature: test_fields.signature,
                time: test_fields.time || test_fields.issuedAt,
                scheme: test_fields.scheme,
                domain: test_fields.domainBinding,
                nonce: test_fields.matchNonce,
            }, { suppressExceptions: true })
                .then(({ success }) => success)).resolves.toBeFalsy();
        }
        catch (error) {
            expect(Object.values(types_1.SiweErrorType).includes(error));
        }
    }));
});
describe(`Round Trip`, () => {
    const wallet = ethers_1.Wallet.createRandom();
    test.concurrent.each(Object.entries(parsingPositive))('Generates a Successfully Verifying message: %s', (_, test) => __awaiter(void 0, void 0, void 0, function* () {
        const msg = new client_1.SiweMessage(test.fields);
        msg.address = wallet.address;
        const signature = yield wallet.signMessage(msg.toMessage());
        yield expect(msg.verify({ signature }).then(({ success }) => success)).resolves.toBeTruthy();
    }));
});
describe(`Round Trip`, () => {
    const wallet = ethers_1.Wallet.createRandom();
    test.concurrent.each(Object.entries(parsingPositive))('Generates a Successfully Verifying message: %s', (_, test) => __awaiter(void 0, void 0, void 0, function* () {
        const msg = new client_1.SiweMessage(test.fields);
        msg.address = wallet.address;
        const signature = yield wallet.signMessage(msg.toMessage());
        yield expect(msg.verify({ signature }).then(({ success }) => success)).resolves.toBeTruthy();
    }));
});
describe(`EIP1271`, () => {
    function getProviderCompat(networkId) {
        return typeof (ethers_1.providers === null || ethers_1.providers === void 0 ? void 0 : ethers_1.providers.InfuraProvider) !== 'undefined'
            ? new ethers_1.providers.InfuraProvider(networkId)
            : new ethers_1.InfuraProvider(networkId);
    }
    test.concurrent.each(Object.entries(EIP1271))('Verifies message successfully: %s', (_, test_fields) => __awaiter(void 0, void 0, void 0, function* () {
        const provider = getProviderCompat(1);
        const msg = new client_1.SiweMessage(test_fields.message);
        yield expect(msg
            .verify({
            signature: test_fields.signature,
        }, {
            provider,
        })
            .then(({ success }) => success)).resolves.toBeTruthy();
    }));
});
describe(`Unit`, () => {
    test('Should throw if validateMessage is called with arguments', () => expect(() => {
        const msg = new client_1.SiweMessage({
            domain: 'service.org',
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
            uri: 'https://service.org/login',
            version: '1',
            chainId: 1,
            nonce: '32891757',
            issuedAt: '2021-09-30T16:25:24.000Z',
            resources: [
                'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
                'https://example.com/my-web2-claim.json',
            ],
        });
        msg.validateMessage('0xdc35c7f8ba2720df052e0092556456127f00f7707eaa8e3bbff7e56774e7f2e05a093cfc9e02964c33d86e8e066e221b7d153d27e5a2e97ccd5ca7d3f2ce06cb1b');
    }).toThrow());
    test('Should not throw if params are valid.', () => __awaiter(void 0, void 0, void 0, function* () {
        const wallet = ethers_1.Wallet.createRandom();
        const msg = new client_1.SiweMessage({
            address: wallet.address,
            domain: 'login.xyz',
            statement: 'Sign-In With Ethereum Example Statement',
            uri: 'https://login.xyz',
            version: '1',
            nonce: 'bTyXgcQxn2htgkjJn',
            issuedAt: '2022-01-27T17:09:38.578Z',
            chainId: 1,
            expirationTime: '2100-01-07T14:31:43.952Z',
        });
        const signature = yield wallet.signMessage(msg.toMessage());
        const result = yield msg.verify({ signature });
        expect(result.success).toBeTruthy();
    }));
    test('Should throw if params are invalid.', () => __awaiter(void 0, void 0, void 0, function* () {
        const wallet = ethers_1.Wallet.createRandom();
        const msg = new client_1.SiweMessage({
            address: wallet.address,
            domain: 'login.xyz',
            statement: 'Sign-In With Ethereum Example Statement',
            uri: 'https://login.xyz',
            version: '1',
            nonce: 'bTyXgcQxn2htgkjJn',
            issuedAt: '2022-01-27T17:09:38.578Z',
            chainId: 1,
            expirationTime: '2100-01-07T14:31:43.952Z',
        });
        const signature = yield wallet.signMessage(msg.toMessage());
        try {
            yield msg.verify({
                signature,
                invalidKey: 'should throw',
            });
        }
        catch (e) {
            expect(e.success).toBeFalsy();
            expect(e.error).toEqual(new Error('invalidKey is/are not valid key(s) for VerifyParams.'));
        }
    }));
    test('Should throw if opts are invalid.', () => __awaiter(void 0, void 0, void 0, function* () {
        const wallet = ethers_1.Wallet.createRandom();
        const msg = new client_1.SiweMessage({
            address: wallet.address,
            domain: 'login.xyz',
            statement: 'Sign-In With Ethereum Example Statement',
            uri: 'https://login.xyz',
            version: '1',
            nonce: 'bTyXgcQxn2htgkjJn',
            issuedAt: '2022-01-27T17:09:38.578Z',
            chainId: 1,
            expirationTime: '2100-01-07T14:31:43.952Z',
        });
        const signature = yield wallet.signMessage(msg.toMessage());
        try {
            yield msg.verify({ signature }, { suppressExceptions: true, invalidKey: 'should throw' });
        }
        catch (e) {
            expect(e.success).toBeFalsy();
            expect(e.error).toEqual(new Error('invalidKey is/are not valid key(s) for VerifyOpts.'));
        }
    }));
});
