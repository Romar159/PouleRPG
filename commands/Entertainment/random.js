const {EmbedBuilder} = require('discord.js');

module.exports.run = (client, message, args) => {
    
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);


    if(!args[0] || !args[1]) return message.channel.send("Argument(s) attendu(s).") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Arguments Attendus. MESSAGE=${message.content}`, "err");
    ;
    const embed = new EmbedBuilder()
    .setColor('BF2F00')
    .setDescription(`:game_die: Résultat : **${parseInt(client.randomInt(parseInt(args[0]), parseInt(args[1])))}**`);

    message.channel.send({embeds:[embed]});
}

module.exports.help = {
    name: "aléatoire",
    aliases: ['aleatoire', 'aléa', 'alea', 'random'],
    category: "entertainment",
    desription: "Renvoie un entier aléatoire compris entre le minimum et maximum définis.",
    usage: '<minimum> <maximum>',
    cooldown: 1, 
    permissions: false,
    args: true
};