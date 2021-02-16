const { guild } = require("discord.js");
const {randomInt} = require('../../util/functions/randominteger');

module.exports.run = async (client, message, args, settings, dbUser) => {
    
}

module.exports.help = {
    name: "expedition",
    aliases: ['expedition', 'e'],
    category: "generalrpg",
    desription: "Partez en éxpedition pour gagner richesses, experience et items.",
    usage: '<or>',
    cooldown: 3, 
    permissions: false,
    args: true
};