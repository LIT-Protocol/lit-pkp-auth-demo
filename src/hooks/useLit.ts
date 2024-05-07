import { useContext, useEffect } from "react";
import { LitContext } from "../contexts/LitProvider";

export function useLit() {
    const { litNodeClient: nodeClient, litAuthClient: authClient } = useContext(LitContext);

    return {
        litNodeClient: nodeClient,
        litAuthClient: authClient,
    };
}