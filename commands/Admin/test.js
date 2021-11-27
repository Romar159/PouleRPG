const { MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
};
  
module.exports.help = {
    name: "test",
    aliases: ['test'],
    category: "admin",
    desription: "un fichier pour faire des tests rapidos.",
    usage: '',
    cooldown: 2, 
    permissions: true,
    args: false
};