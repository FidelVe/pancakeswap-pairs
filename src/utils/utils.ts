// src/utils.ts
const abis = require("./abis");
// const EspaniconSDK = require("@espanicon/espanicon-sdk");
const Web3 = require("web3");
const Exception = require("./exception");
const fs = require("fs");
const customPath = require("./customPath");
const dataPath = "data.json";
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

async function getLpToken0(contractAddress: string) {
  //
  try {
    return await makeReadonlyQuery(
      "token0",
      contractAddress,
      abis.pancakeswap.lp,
      abis.pancakeswap.misc[0]
    );
  } catch (err) {
    const newError = new Exception(err, `Error running getLpToken0().`);
    return { error: newError.toString() };
  }
}

async function getLpToken1(contractAddress: string) {
  //
  try {
    return await makeReadonlyQuery(
      "token1",
      contractAddress,
      abis.pancakeswap.lp,
      abis.pancakeswap.misc[1]
    );
  } catch (err) {
    const newError = new Exception(err, `Error running getLpToken1().`);
    return { error: newError.toString() };
  }
}

async function getTokenName(contractAddress: string) {
  //
  try {
    return await makeReadonlyQuery(
      "name",
      contractAddress,
      abis.pancakeswap.defaultToken,
      abis.pancakeswap.misc[2]
    );
  } catch (err) {
    const newError = new Exception(err, `Error running getTokenName().`);
    return { error: newError.toString() };
  }
}

async function getPkswapFactoryAllPairsLength() {
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

async function getPkswapFactoryAllPairs(index: number) {
  //
  try {
    return await makeReadonlyQuery(
      "allPairs",
      contracts.pancakeswap.factory,
      abis.pancakeswap.factory,
      abis.pancakeswap.factory[3],
      index
    );
  } catch (err) {
    const newError = new Exception(
      err,
      `Error running pkSwapFactoryAllPairs().`
    );
    return { error: newError.toString() };
  }
}

function readDb(path: string = dataPath) {
  try {
    if (fs.existsSync(customPath(path))) {
      const dbBuffer = fs.readFileSync(customPath(path), "utf-8");
      const db = JSON.parse(dbBuffer);

      return db;
    } else {
      console.log(`Error accessing db file: "${path}"`);
      return null;
    }
  } catch (err) {
    console.log(`Error reading database at "${path}"`);
    console.log(err);
    return null;
  }
}

function writeDb(data: any, path: string = dataPath) {
  try {
    if (fs.existsSync(path)) {
      console.log(`File "${path}" already exists. File will be overwritten.`);
      fs.unlinkSync(path);
    }

    fs.writeFileSync(path, JSON.stringify(data));
    console.log(`File "${path}" created.`);
  } catch (err) {
    console.log(`Unexpected error trying to create "${path}" file`);
    console.log(err);
  }
}

export {
  contracts,
  abis,
  // customQuery,
  getTokenContractObject,
  getPkswapFactoryAllPairsLength,
  getPkswapFactoryAllPairs,
  getLpToken0,
  getLpToken1,
  getTokenName,
  readDb,
  writeDb
};
