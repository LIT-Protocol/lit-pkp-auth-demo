declare module "*.json" {
  export interface ContractData {
    network: string;
    address_hash: string;
    inserted_at: string;
    ABI: any[];
  }

  export interface ContractInfo {
    name: string;
    contracts: ContractData[];
  }

  export interface NetworkContext {
    config: {
      chainId: string;
      rpcUrl: string;
      chainName: string;
      litNodeDomainName: string;
      litNodePort: number;
      rocketPort: number;
    };
    data: ContractInfo[];
  }

  const value: NetworkContext;
  export default value;
}
