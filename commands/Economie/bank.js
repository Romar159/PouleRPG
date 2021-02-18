const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    const embed = new MessageEmbed()
    .setColor('#F2DB0C')
    .setTitle(':bank: Banque personnelle');

    if(message.mentions.users.first()) {
        const usr_member = message.guild.member(message.mentions.users.first())
        await client.updateMaxBank(client, usr_member);
        const usr = await client.getUser(usr_member);
        embed.setDescription(`${usr_member} à **${usr.or}/${usr.maxbank}** or dans sa banque.`);
        return message.channel.send(embed);
    } else {
        await client.updateMaxBank(client, message.member);
        embed.setDescription(`Vous avez **${dbUser.or}/${dbUser.maxbank}** or dans votre banque.`);
        return message.channel.send(embed);
    }
};

module.exports.help = {
    name: "bank",
    aliases: ['or', 'banque'],
    category: "economie",
    desription: "Affiche votre contenu de banque ou celle d'un utilisateur.",
    usage: "[@user]",
    cooldown: 3,
    permissions: false,
    args: false
};