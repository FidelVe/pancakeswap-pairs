const utils = require("./utils/utils");

async function app() {
  const query = await utils.getPkswapFactoryAllPairsLength();
  console.log(query);

  const query1 = await utils.getPkswapFactoryAllPairs(0);
  console.log(query1);

  const query2 = await utils.getLpToken0(query1["0"]);
  console.log(query2);

  const query3 = await utils.getTokenName(query2["0"]);
  console.log(query3);
}

// run async app
app();
