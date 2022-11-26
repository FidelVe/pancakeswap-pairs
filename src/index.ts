const utils = require("./utils/utils");

const decorator = "|------------ ";

function getPairDataTemplate(
  token0: string,
  token1: string,
  t0Contract: string,
  t1Contract: string,
  lpContract: string
) {
  //
  return {
    name: `${token0} / ${token1}`,
    lp: lpContract,
    token0: t0Contract,
    token1: t1Contract
  };
}

async function app() {
  if (process.argv[0] === "rebuild") {
    console.log(`${decorator}Rebuilding local data. Initiating data fetching`);
    const allData = await fetchAll();
    utils.writeDb(allData);
    console.log(`${decorator}Pancakeswap LP pairs:\n${allData.names}`);
  } else {
    if (utils.readDb() == null) {
      console.log(`Data file not found. Initiating data fetching`);
      const allData = await fetchAll();
      utils.writeDb(allData);
      console.log(`${decorator}Pancakeswap LP pairs:\n${allData.names}`);
    } else {
      const data = utils.readDb();
      console.log(`${decorator}Pancakeswap LP pairs:\n${data.names}`);
    }
  }
}

async function fetchAll(start: number = 0, end: number = 10) {
  const amountOfPairsQuery = await utils.getPkswapFactoryAllPairsLength();
  const amountOfPairs = amountOfPairsQuery["0"];
  const allNames = [];
  const allData = [];

  if (end < parseInt(amountOfPairs) && start <= end) {
    console.log(`${decorator}Fetching all pairs data.\n`);
    for (let i = start; i <= end; i++) {
      console.log(`${decorator}Fetching pair in index ${i}.\n`);
      const lpContract = await utils.getPkswapFactoryAllPairs(i);
      const token0Contract = await utils.getLpToken0(lpContract["0"]);
      const token1Contract = await utils.getLpToken1(lpContract["0"]);
      const name0 = await utils.getTokenName(token0Contract["0"]);
      console.log(`Token0 name: ${name0["0"]}`);
      const name1 = await utils.getTokenName(token1Contract["0"]);
      console.log(`Token1 name: ${name1["0"]}`);

      const lpData = getPairDataTemplate(
        name0["0"],
        name1["0"],
        token0Contract["0"],
        token1Contract["0"],
        lpContract["0"]
      );
      allNames.push(lpData.name);
      allData.push(lpData);
    }
  } else {
    throw new Error(`Invalid query range`);
  }
  return {
    names: allNames,
    data: allData
  };
}

// run async app
app();
