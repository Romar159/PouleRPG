const {Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const {loadCommands, loadEvents, loadGlobalVariables} = require('./util/loader');
const {TOKEN, PREFIX} = require('./config');
const user = require('./models/user');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.Reaction] });

require("./util/functions/functions")(client);
client.loadDependencies(client);
 
["commands", "cooldowns"].forEach(x => client[x] = new Collection());
 
loadCommands(client);
loadEvents(client);
loadGlobalVariables(client);

client.mongoose.init();


const diagnosticsChannel = require('diagnostics_channel');
diagnosticsChannel.channel('undici:request:create').subscribe(({ request }) => {
  /*console.log('origin', request.origin)
  console.log('completed', request.completed)
  console.log('method', request.method)
  console.log('path', request.path)
  console.log('headers') // array of strings, e.g: ['foo', 'bar']
  request.addHeader('hello', 'world')
  console.log('headers', request.headers) // e.g. ['foo', 'bar', 'hello', 'world']
  */
  console.log("===========================\n## API REQUEST ##");
  console.log("---------------------------");
  console.log('method', request.method)
  console.log('path', request.path)
  console.log("===========================\n");

})

client.rest.on("rateLimited", rate => {
    console.log("LIMITATION: " + rate)
})

/*
setInterval(async () => {
    // vérifie les points d'amitiés de chaque faction : Si au dessus de 0 enlever 10 points (à équilibrer) Si en dessous de 0 : Ajouter 10
    // Si on est en dessous de 10pts mais au dessus de 0 il faudra pas enlever 10pts mais l'équivalent pour atteindre 0 et pareil dans l'autre sens quand on est en chiffre négatif.
}, 240000); 
*/ // toutes les 24h ! (ne fonctionne que si le bot est ON H24 :thinking:).

client.login(TOKEN);
