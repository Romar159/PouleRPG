const {randomInt} = require('../../util/functions/randominteger');
const {Message} = require('discord.js');

module.exports.run = (client, message, args) => {
    if (!args[0] || !args[1]) return message.channel.send("Argument(s) attendu(s).");
    message.channel.send(`${parseInt(randomInt(parseInt(args[0]), parseInt(args[1])))}`);
}

module.exports.help = {
    name: "random",
    aliases: ['random'],
    category: "entertainment",
    desription: "renvoie un entier aléatoire compris entre le minimum et maximum fournit par l'utilisateur.",
    usage: '<minimum> <maximum>',
    cooldown: 1, 
    permissions: false,
    args: true
};