// src/utils.ts
const abis = require("./abis");
// const EspaniconSDK = require("@espanicon/espanicon-sdk");
const Web3 = require("web3");
const Exception = require("./exception");
// const sdk = new EspaniconSDK();

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

//async function customQuery(data: any) {
//  //
//  return await sdk.queryMethod(
//    rpcNodes.a.path,
//    data,
//    rpcNodes.a.hostname,
//    true,
//    8545
//  );
//}

function getTokenContractObject(
  contractAddress: string,
  abi: any = abis.defaultToken
) {
  return new web3.eth.Contract(abi, contractAddress);
}

async function makeReadonlyQuery(
  methodName: string,
  contractAddress: string,
  contractAbi: any,
  contractAbiMethod: any,
  ...rest: any[]
) {
  //
  const contractObject = getTokenContractObject(contractAddress, contractAbi);

  let encodedData = null;
  const contractMethod = contractObject.methods[methodName];
  if (rest.length === 0) {
    encodedData = contractMethod().encodeABI();
  } else {
    encodedData = contractMethod(...rest).encodeABI();
  }
  const query = await web3.eth.call({
    to: contractAddress,
    data: encodedData
  });

  const parsedResponse = web3.eth.abi.decodeParameters(
    contractAbiMethod.outputs,
    query
  );
  return parsedResponse;
}

async function pkSwapFactoryGetAllPairsLength() {
  //
  try {
    return await makeReadonlyQuery(
      "allPairsLength",
      contracts.pancakeswap.factory,
      abis.pancakeswap.factory,
      abis.pancakeswap.factory[4]
    );
  } catch (err) {
    const newError = new Exception(
      err,
      `Error running pkSwapFactoryGetAllPairsLength().`
    );
    return { error: newError.toString() };
  }
}

export {
  contracts,
  abis,
  // customQuery,
  getTokenContractObject,
  pkSwapFactoryGetAllPairsLength
};
