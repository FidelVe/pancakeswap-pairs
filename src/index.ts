const utils = require("./utils/utils");

async function app() {
  const query = await utils.pkSwapFactoryGetAllPairsLength();
  console.log(query);
}

// run async app
app();
