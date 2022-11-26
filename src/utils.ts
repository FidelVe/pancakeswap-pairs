// src/utils.ts
const abis = require("./abis");
const EspaniconSDK = require("@espanicon/espanicon-sdk");
const Web3 = require("web3");
const sdk = new EspaniconSDK();

const contracts = {
  pancakeswap: {
    factory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
    router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
  }
};

const rpcNodes = {
  a: {
    path: "/",
    hostname: "data-seed-prebsc-1-s1.binance.org",
    protocol: "https",
    port: 8545
  }
};

const web3 = new Web3(
  `${rpcNodes.a.protocol}://${
    rpcNodes.a.hostname
  }:${rpcNodes.a.port.toString()}${rpcNodes.a.path}`
);

async function customQuery(data: any) {
  //
  return await sdk.queryMethod(
    rpcNodes.a.path,
    data,
    rpcNodes.a.hostname,
    true,
    8545
  );
}

function getTokenContractObject(
  contractAddress: string,
  abi: any = abis.defaultToken
) {
  return new web3.eth.Contract(abi, contractAddress);
}

export default {
  contracts,
  abis,
  customQuery,
  getTokenContractObject
};
