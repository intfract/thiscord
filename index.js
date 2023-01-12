const { Bot, Intents } = require('./dist/index');

const client = new Bot({
  intents: Intents.All
})

