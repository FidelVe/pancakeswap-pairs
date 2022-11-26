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
exports.getTokenName = exports.getLpToken1 = exports.getLpToken0 = exports.getPkswapFactoryAllPairs = exports.getPkswapFactoryAllPairsLength = exports.getTokenContractObject = exports.abis = exports.contracts = void 0;
// src/utils.ts
const abis = require("./abis");
exports.abis = abis;
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
exports.contracts = contracts;
const rpcNodes = {
    a: {
        path: "/",
        hostname: "data-seed-prebsc-1-s1.binance.org",
        protocol: "https",
        port: 8545
    }
};
const web3 = new Web3(`${rpcNodes.a.protocol}://${rpcNodes.a.hostname}:${rpcNodes.a.port.toString()}${rpcNodes.a.path}`);
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
function getTokenContractObject(contractAddress, abi = abis.defaultToken) {
    return new web3.eth.Contract(abi, contractAddress);
}
exports.getTokenContractObject = getTokenContractObject;
function makeReadonlyQuery(methodName, contractAddress, contractAbi, contractAbiMethod, ...rest) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        const contractObject = getTokenContractObject(contractAddress, contractAbi);
        let encodedData = null;
        const contractMethod = contractObject.methods[methodName];
        if (rest.length === 0) {
            encodedData = contractMethod().encodeABI();
        }
        else {
            encodedData = contractMethod(...rest).encodeABI();
        }
        const query = yield web3.eth.call({
            to: contractAddress,
            data: encodedData
        });
        const parsedResponse = web3.eth.abi.decodeParameters(contractAbiMethod.outputs, query);
        return parsedResponse;
    });
}
function getLpToken0(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        try {
            return yield makeReadonlyQuery("token0", contractAddress, abis.pancakeswap.lp, abis.pancakeswap.misc[0]);
        }
        catch (err) {
            const newError = new Exception(err, `Error running getLpToken0().`);
            return { error: newError.toString() };
        }
    });
}
exports.getLpToken0 = getLpToken0;
function getLpToken1(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        try {
            return yield makeReadonlyQuery("token1", contractAddress, abis.pancakeswap.lp, abis.pancakeswap.misc[1]);
        }
        catch (err) {
            const newError = new Exception(err, `Error running getLpToken1().`);
            return { error: newError.toString() };
        }
    });
}
exports.getLpToken1 = getLpToken1;
function getTokenName(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        try {
            return yield makeReadonlyQuery("name", contractAddress, abis.pancakeswap.defaultToken, abis.pancakeswap.misc[2]);
        }
        catch (err) {
            const newError = new Exception(err, `Error running getTokenName().`);
            return { error: newError.toString() };
        }
    });
}
exports.getTokenName = getTokenName;
function getPkswapFactoryAllPairsLength() {
    return __awaiter(this, void 0, void 0, function* () {
        //
        try {
            return yield makeReadonlyQuery("allPairsLength", contracts.pancakeswap.factory, abis.pancakeswap.factory, abis.pancakeswap.factory[4]);
        }
        catch (err) {
            const newError = new Exception(err, `Error running pkSwapFactoryGetAllPairsLength().`);
            return { error: newError.toString() };
        }
    });
}
exports.getPkswapFactoryAllPairsLength = getPkswapFactoryAllPairsLength;
function getPkswapFactoryAllPairs(index) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        try {
            return yield makeReadonlyQuery("allPairs", contracts.pancakeswap.factory, abis.pancakeswap.factory, abis.pancakeswap.factory[3], index);
        }
        catch (err) {
            const newError = new Exception(err, `Error running pkSwapFactoryAllPairs().`);
            return { error: newError.toString() };
        }
    });
}
exports.getPkswapFactoryAllPairs = getPkswapFactoryAllPairs;
