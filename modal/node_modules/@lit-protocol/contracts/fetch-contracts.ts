import * as fs from "fs";

if (!process.env.LIT_ABI_SOURCE) {
  throw new Error("❌ LIT_ABI_SOURCE is not defined");
}

if (!process.env.GH_LIT_ASSETS_READ_ONLY_API) {
  throw new Error("❌ GH_LIT_ASSETS_READ_ONLY_API is not defined");
}

const DEV_BRANCH = process.env.DEV_BRANCH;

if (!DEV_BRANCH) {
  throw new Error("❌ DEV_BRANCH is not defined");
}

type ABISource = {
  repoName: string;
  path: string;
  branch: string;
  fileExtensionToRemove: string;
  abiSourceInJson: any[];
  contractNameMap: any;
  deployedContract: {
    internalDev: string;
    cayenne: string;
    manzano: string;
    habanero: string;
    datilDev: string;
    datilTest: string;
    datilProd: string;
  };
};

const LIT_ABI_SOURCE = {
  dev: {
    repoName: "lit-assets",
    path: "rust/lit-core/lit-blockchain/abis",
    branch: DEV_BRANCH,
    fileExtensionToRemove: ".json",
    abiSourceInJson: ["abi"],
    contractNameMap: {
      litTokenContractAddress: "LITToken",
      pkpNftContractAddress: "PKPNFT",
      pkpHelperContractAddress: "PKPHelper",
      pkpPermissionsContractAddress: "PKPPermissions",
      pkpNftMetadataContractAddress: "PKPNFTMetadata",
      pubkeyRouterContractAddress: "PubkeyRouter",
      rateLimitNftContractAddress: "RateLimitNFT",
      stakingBalancesContractAddress: "StakingBalances",
      stakingContractAddress: "Staking",
      multisenderContractAddress: "Multisender",
      allowlistContractAddress: "Allowlist",
      paymentDelegationContractAddress: "PaymentDelegation",
      priceFeedContractAddress: "PriceFeed",
      cloneNetContractAddress: "CloneNet",
    },
    deployedContract: {
      internalDev:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/internal-dev/deployed-lit-node-contracts-temp.json",
      cayenne:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/cayenne/deployed-lit-node-contracts-temp.json",
      manzano:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/manzano/deployed-lit-node-contracts-temp.json",
      habanero:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/habanero/deployed-lit-node-contracts-temp.json",
      datilDev:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/datil-dev/deployed-lit-node-contracts-temp.json",
      datilTest:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/datil-test/deployed-lit-node-contracts-temp.json",
      datilProd:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/datil-prod/deployed-lit-node-contracts-temp.json",
    },
  },
  prod: {
    repoName: "networks",
    branch: "main",
    path: "abis",
    fileExtensionToRemove: ".abi",
    abiSourceInJson: [],
    contractNameMap: {
      litTokenContractAddress: "LITToken",
      pkpNftContractAddress: "PKPNFT",
      pkpHelperContractAddress: "PKPHelper",
      pkpPermissionsContractAddress: "PKPPermissions",
      pkpNftMetadataContractAddress: "PKPNFTMetadata",
      pubkeyRouterContractAddress: "PubkeyRouter",
      rateLimitNftContractAddress: "RateLimitNFT",
      stakingBalancesContractAddress: "StakingBalances",
      stakingContractAddress: "Staking",
      multisenderContractAddress: "Multisender",
      allowlistContractAddress: "Allowlist",
      paymentDelegationContractAddress: "PaymentDelegation",
      cloneNetContractAddress: "CloneNet",
    },
    deployedContract: {
      internalDev:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/internal-dev/deployed-lit-node-contracts-temp.json",
      cayenne:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/cayenne/deployed-lit-node-contracts-temp.json",
      manzano:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/manzano/deployed-lit-node-contracts-temp.json",
      habanero:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/habanero/deployed-lit-node-contracts-temp.json",
      datilDev:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/datil-dev/deployed-lit-node-contracts-temp.json",
      datilTest:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/datil-test/deployed-lit-node-contracts-temp.json",
      datilProd:
        "https://raw.githubusercontent.com/LIT-Protocol/networks/main/datil-prod/deployed-lit-node-contracts-temp.json",
    },
  },
};

type LIT_ABI_SOURCE_TYPES = keyof typeof LIT_ABI_SOURCE;

const SOURCE_BY_ENV: { [key in LIT_ABI_SOURCE_TYPES]: ABISource } = {
  dev: LIT_ABI_SOURCE.dev,
  prod: LIT_ABI_SOURCE.prod,
};

const source: ABISource =
  process.env.LIT_ABI_SOURCE === "dev" ? SOURCE_BY_ENV.dev : SOURCE_BY_ENV.prod;

type LitNetwork =
  | "cayenne"
  | "internalDev"
  | "manzano"
  | "habanero"
  | "datil-dev"
  | "datil-test"
  | "datil";

const TOKEN = process.env.GH_LIT_ASSETS_READ_ONLY_API;
const USERNAME = "LIT-Protocol";
const REPO_NAME = source.repoName;

const createPath = (PATH: string, BRANCH: string) => {
  return `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${PATH}?ref=${BRANCH}`;
};

function extractPathAfterMain(urlString: string): string {
  const url = new URL(urlString);
  const pathname = url.pathname;
  const parts = pathname.split("/");
  const mainIndex = parts.indexOf("main");
  const desiredPath = parts.slice(mainIndex + 1).join("/");
  return desiredPath;
}

async function getLastModified(filePath: string, network: string) {
  console.log("filePath:", filePath);

  const fileAPI = `https://api.github.com/repos/${USERNAME}/networks/commits?path=${filePath}`;
  console.log("fileAPI:", fileAPI);

  try {
    const response = await fetch(fileAPI, HEADER);
    const commits: any = await response.json();

    if (commits.length > 0) {
      return commits[0].commit.author.date;
    }
    console.error(`[${network}] No commits found for ${filePath}`);
    return null;
  } catch (error: any) {
    console.error(
      `[${network}] Error fetching last modified date: ${error.toString()}`
    );
  }
}

const HEADER = {
  headers: {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
};

let cache: { [key in LitNetwork]?: any } = {};

async function getLitContractABIs(network: LitNetwork) {
  const contractsData = [];

  const path = createPath(source.path, source.branch);
  console.log("path:", path);

  const filesRes = await fetch(path, HEADER);
  const files: any = await filesRes.json();

  if (files.length <= 0) {
    console.log(`[${network}] files length: ${files.length}`);
  }

  for (const file of files) {
    const name = file.name.replace(source.fileExtensionToRemove, "");
    console.log("name:", name);

    if (!Object.values(source.contractNameMap).includes(name)) {
      continue;
    }

    console.log(`[${network}] Getting file ${file.download_url}`);

    const fileRes = await fetch(file.download_url, HEADER);
    const fileData: any = await fileRes.json();

    const getData = (fileData: any, abiSourceInJson: any[]): any => {
      if (abiSourceInJson.length > 0) {
        return abiSourceInJson.reduce((acc, key) => acc[key], fileData);
      }
      return fileData;
    };

    const data = getData(fileData, source.abiSourceInJson);

    if (!data) {
      console.log(`[${network}] No data for ${name}`);
    }

    contractsData.push({
      name: file.name.replace(source.fileExtensionToRemove, ""),
      contractName: fileData.contractName,
      data,
    });
  }

  if (!contractsData.length) {
    console.log(`[${network}] No data`);
  }

  return contractsData;
}

async function updateContractsCache(network: LitNetwork): Promise<void> {
  let API: string;
  let filePath: string;
  let lastModified: string;

  switch (network) {
    case "cayenne":
      filePath = extractPathAfterMain(source.deployedContract.cayenne);
      API = source.deployedContract.cayenne;
      lastModified = await getLastModified(filePath, network);
      break;
    case "internalDev":
      API = source.deployedContract.internalDev;
      filePath = extractPathAfterMain(source.deployedContract.internalDev);
      lastModified = await getLastModified(filePath, network);
      break;
    case "manzano":
      filePath = extractPathAfterMain(source.deployedContract.manzano);
      API = source.deployedContract.manzano;
      lastModified = await getLastModified(filePath, network);
      break;
    case "habanero":
      filePath = extractPathAfterMain(source.deployedContract.habanero);
      API = source.deployedContract.habanero;
      lastModified = await getLastModified(filePath, network);
      break;
    case "datil-dev":
      filePath = extractPathAfterMain(source.deployedContract.datilDev);
      API = source.deployedContract.datilDev;
      lastModified = await getLastModified(filePath, network);
      break;
    case "datil-test":
      filePath = extractPathAfterMain(source.deployedContract.datilTest);
      API = source.deployedContract.datilTest;
      lastModified = await getLastModified(filePath, network);
      break;
    case "datil":
      filePath = extractPathAfterMain(source.deployedContract.datilProd);
      API = source.deployedContract.datilProd;
      lastModified = await getLastModified(filePath, network);
      break;
  }

  let diamonData: any;

  console.log(`[${network}] Trying to get lit contract ABIs`);

  try {
    diamonData = await getLitContractABIs(network);
    console.log(`✅ [${network}] Got diamonData`);
  } catch (e: any) {
    console.log(
      `❌ [${network}] Error getting lit contract ABIs => ${e.toString()}`
    );
  }

  let res: any;

  try {
    res = await fetch(API);
  } catch (e: any) {
    console.log(`❌ [${network}] Error fetching API => ${e.toString()}`);
  }

  let resData: any;

  try {
    resData = await res.json();
  } catch (e: any) {
    console.log(`❌ [${network}] Error parsing res.json() => ${e.toString()}`);
  }

  const data = [];

  if (network !== "cayenne") {
    cache[network] = {
      config: {
        chainId: resData?.chainId ?? null,
        rpcUrl: resData?.rpcUrl ?? null,
        chainName: resData?.chainName ?? null,
        litNodeDomainName: resData?.litNodeDomainName ?? null,
        litNodePort: resData?.litNodePort ?? null,
        rocketPort: resData?.rocketPort ?? null,
      },
      data: [],
    };
  } else {
    cache[network] = {
      data: [],
    };
  }

  for (const [name, address] of Object.entries(resData)) {
    const contractFileName = source.contractNameMap[name];

    if (contractFileName) {
      if (!diamonData) {
        console.error(`❗️❗️ [${network}] diamonData is ${diamonData}`);
      }

      let ABI: any;

      try {
        ABI = diamonData.find(
          (item: { name: string }) => item.name === contractFileName
        );
      } catch (e: any) {
        console.error(
          `❗️❗️ [${network}] Error finding contractFileName in diamonData => ${e.toString()}`
        );
      }

      if (!ABI) {
        console.log(
          `❗️❗️ contractFileName: ${contractFileName} not found in diamonData`
        );
      }

      if (!Object.values(source.contractNameMap).includes(contractFileName)) {
        continue;
      }

      cache[network].data.push({
        name: contractFileName,
        contracts: [
          {
            network: network,
            address_hash: address,
            inserted_at: lastModified,
            ABI: ABI?.data ?? [],
          },
        ],
      });
    } else {
      // console.log(`\x1b[33m%s\x1b[0m`, `❗️ "${name}" is not mapped`);
    }
  }

  console.log(`✅ [${network}] Cache Updated`);

  // Ensure the directory exists
  const dir = `./dist/${process.env.LIT_ABI_SOURCE}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the cache to a file
  fs.writeFileSync(
    `${dir}/${network}.json`,
    JSON.stringify(cache[network], null, 2)
  );

  // find '-', remove it and capitalize the next letter
  let networkName = network
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // lower case the first letter
  networkName = networkName.charAt(0).toLowerCase() + networkName.slice(1);

  // also write a .ts file for the cache, like export const networkName
  fs.writeFileSync(
    `${dir}/${network}.ts`,
    `export const ${networkName} = ${JSON.stringify(
      cache[network],
      null,
      2
    )} as const`
  );

  // also write a .js file for the cache, like export const networkName
  fs.writeFileSync(
    `${dir}/${network}.js`,
    `export const ${networkName} = ${JSON.stringify(cache[network], null, 2)}`
  );

  fs.writeFileSync(
    `${dir}/${network}.cjs`,
    `"use strict";\n\nmodule.exports = ${JSON.stringify(
      cache[network],
      null,
      2
    )};`
  );
}

const litNetworks: LitNetwork[] = [
  "cayenne",
  "internalDev",
  "manzano",
  "habanero",
  "datil-dev",
  "datil-test",
  "datil",
];

// Initial update for all items
litNetworks.forEach(async (network) => {
  await updateContractsCache(network);
});
