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
const utils = require("./utils/utils");
const decorator = "|------------ ";
function getPairDataTemplate(token0, token1, t0Contract, t1Contract, lpContract) {
    //
    return {
        name: `${token0} / ${token1}`,
        lp: lpContract,
        token0: t0Contract,
        token1: t1Contract
    };
}
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv[0] === "rebuild") {
            console.log(`${decorator}Rebuilding local data. Initiating data fetching`);
            const allData = yield fetchAll();
            utils.writeDb(allData);
            console.log(`${decorator}Pancakeswap LP pairs:\n${allData.names}`);
        }
        else {
            if (utils.readDb() == null) {
                console.log(`Data file not found. Initiating data fetching`);
                const allData = yield fetchAll();
                utils.writeDb(allData);
                console.log(`${decorator}Pancakeswap LP pairs:\n${allData.names}`);
            }
            else {
                const data = utils.readDb();
                console.log(`${decorator}Pancakeswap LP pairs:\n${data.names}`);
            }
        }
    });
}
function fetchAll(start = 0, end = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        const amountOfPairsQuery = yield utils.getPkswapFactoryAllPairsLength();
        const amountOfPairs = amountOfPairsQuery["0"];
        const allNames = [];
        const allData = [];
        if (end < parseInt(amountOfPairs) && start <= end) {
            console.log(`${decorator}Fetching all pairs data.\n`);
            for (let i = start; i <= end; i++) {
                console.log(`${decorator}Fetching pair in index ${i}.\n`);
                const lpContract = yield utils.getPkswapFactoryAllPairs(i);
                const token0Contract = yield utils.getLpToken0(lpContract["0"]);
                const token1Contract = yield utils.getLpToken1(lpContract["0"]);
                const name0 = yield utils.getTokenName(token0Contract["0"]);
                console.log(`Token0 name: ${name0["0"]}`);
                const name1 = yield utils.getTokenName(token1Contract["0"]);
                console.log(`Token1 name: ${name1["0"]}`);
                const lpData = getPairDataTemplate(name0["0"], name1["0"], token0Contract["0"], token1Contract["0"], lpContract["0"]);
                allNames.push(lpData.name);
                allData.push(lpData);
            }
        }
        else {
            throw new Error(`Invalid query range`);
        }
        return {
            names: allNames,
            data: allData
        };
    });
}
// run async app
app();
