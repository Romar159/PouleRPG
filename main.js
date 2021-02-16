const {Client, Collection} = require('discord.js');
const {loadCommands, loadEvents} = require('./util/loader');
const {TOKEN, PREFIX} = require('./config');

const client = new Client();

client.config = require("./config");
require("./util/functions/functions")(client);
require("./util/functions/setXp")(client);
require("./util/functions/setOr")(client);
require("./util/functions/updateMaxBank")(client);

client.mongoose = require("./util/mongoose");
["commands", "cooldowns"].forEach(x => client[x] = new Collection());

loadCommands(client);
loadEvents(client);
client.mongoose.init();

client.login(TOKEN);
