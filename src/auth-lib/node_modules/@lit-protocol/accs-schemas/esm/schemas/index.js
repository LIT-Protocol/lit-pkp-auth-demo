export async function loadSchema(schemaName) {
    switch (schemaName) {
        case 'LPACC_ATOM':
            return import('./LPACC_ATOM.json');
        case 'LPACC_EVM_BASIC':
            return import('./LPACC_EVM_BASIC.json');
        case 'LPACC_EVM_CONTRACT':
            return import('./LPACC_EVM_CONTRACT.json');
        case 'LPACC_SOL':
            return import('./LPACC_SOL.json');
        default:
            throw new Error(`Unknown schema: ${schemaName}`);
    }
}
