const {Client, Collection, Intents} = require('discord.js');
const {loadCommands, loadEvents} = require('./util/loader');
const {TOKEN, PREFIX} = require('./config');
const user = require('./models/user');

//const fetch = require('node-fetch');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES] });


require("./util/functions/functions")(client);
client.loadDependencies(client);

["commands", "cooldowns"].forEach(x => client[x] = new Collection());
 
loadCommands(client);
loadEvents(client);

client.mongoose.init();


// setInterval(async () => {
//     await fetch('https://poulerpgfail.glitch.me').then(console.log("pinged"));
//   }, 240000);

/*setInterval(async () => {
    // vérifie les points d'amitiés de chaque faction : Si au dessus de 0 enlever 10 points (à équilibrer) Si en dessous de 0 : Ajouter 10
    // Si on est en dessous de 10pts mais au dessus de 0 il faudra pas enlever 10pts mais l'équivalent pour atteindre 0 et pareil dans l'autre sens quand on est en chiffre négatif.
    
  }, 240000); */ // toutes les 24h ! (ne fonctionne que si le bot est ON H24 :thinking:).

client.login(TOKEN);