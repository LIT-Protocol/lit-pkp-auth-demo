"use strict";
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
exports.default = useLitAccounts;
const react_1 = require("react");
const lit_1 = require("../utils/lit");
function useLitAccounts() {
    const [accounts, setAccounts] = (0, react_1.useState)([]);
    const [currentAccount, setCurrentAccount] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const fetchAccounts = (0, react_1.useCallback)((authMethod) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        try {
            const myPKPs = yield (0, lit_1.getPKPs)(authMethod);
            setAccounts(myPKPs);
            if (myPKPs.length === 1) {
                setCurrentAccount(myPKPs[0]);
            }
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), []);
    const createAccount = (0, react_1.useCallback)((authMethod) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(undefined);
        try {
            const newPKP = yield (0, lit_1.mintPKP)(authMethod);
            setAccounts(prev => [...prev, newPKP]);
            setCurrentAccount(newPKP);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }), []);
    return {
        fetchAccounts,
        createAccount,
        setCurrentAccount,
        accounts,
        currentAccount,
        loading,
        error,
    };
}
//# sourceMappingURL=useLitAccounts.js.map