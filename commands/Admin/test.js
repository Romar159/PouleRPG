const { MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const {PREFIX} = require('../../config');

module.exports.run = async (client, message, args, settings, dbUser) => {

};
  
module.exports.help = {
    name: "test",
    aliases: ['test'],
    category: "admin",
    desription: "un fichier pour faire des tests rapidos.",
    usage: '',
    wiki: 'https://romar159.github.io/poulerpg.github.io/',
    cooldown: 2,  
    permissions: true,
    args: false
};