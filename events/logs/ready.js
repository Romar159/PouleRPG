const {message} = require("discord.js");

module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get('415945814045884427').send("``Bot lancé``");
    client.user.setPresence({ activity: { name: 'comment fonctionne p<aide', type: 'WATCHING'} });
}