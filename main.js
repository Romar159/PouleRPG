const {Client, Collection} = require('discord.js');
const {loadCommands, loadEvents} = require('./util/loader');
const {TOKEN, PREFIX} = require('./config');
//const fetch = require('node-fetch');
const client = new Client();

require("./util/functions/functions")(client);
client.loadDependencies(client);

["commands", "cooldowns"].forEach(x => client[x] = new Collection());

loadCommands(client);
loadEvents(client);
client.mongoose.init();

// setInterval(async () => {
//     await fetch('https://poulerpgfail.glitch.me').then(console.log("pinged"));
//   }, 240000);

client.login(TOKEN);