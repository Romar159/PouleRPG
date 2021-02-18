const {randomInt} = require('../../util/functions/randominteger');
const {MessageEmbed} = require('discord.js');

module.exports.run = (client, message, args) => {
    if(!args[0] || !args[1]) return message.channel.send("Argument(s) attendu(s).");
    const embed = new MessageEmbed()
    .setColor('#BF2F00')
    .setDescription(`:game_die: Résultat : **${parseInt(randomInt(parseInt(args[0]), parseInt(args[1])))}**`);

    message.channel.send(embed);
}

module.exports.help = {
    name: "random",
    aliases: ['random', 'rdm'],
    category: "entertainment",
    desription: "renvoie un entier aléatoire compris entre le minimum et maximum fournit par l'utilisateur.",
    usage: '<minimum> <maximum>',
    cooldown: 1, 
    permissions: false,
    args: true
};