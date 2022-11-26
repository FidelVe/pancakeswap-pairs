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
const web3 = new Web3(`${rpcNodes.a.protocol}://${rpcNodes.a.hostname}:${rpcNodes.a.port.toString()}${rpcNodes.a.path}`);
function customQuery(data) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        return yield sdk.queryMethod(rpcNodes.a.path, data, rpcNodes.a.hostname, true, 8545);
    });
}
function getTokenContractObject(contractAddress, abi = abis.defaultToken) {
    return new web3.eth.Contract(abi, contractAddress);
}
exports.default = {
    contracts,
    abis,
    customQuery,
    getTokenContractObject
};
