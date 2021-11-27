const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings) => {
    const embed = new MessageEmbed()
    .setColor('E58B16')
    .setAuthor(`Nombre de poulets`, client.user.displayAvatarURL());

    settings.poulet++;
    await client.updateGuild(message.guild, {poulet: settings.poulet});
    await client.getGuild(message.guild);

    embed.setDescription(`:chicken: **${settings.poulet}** :chicken:`);
    message.channel.send({embeds:[embed]});
}

module.exports.help = {
    name: "poulet",
    aliases: ['chicken'],
    category: "entertainment",
    desription: "Augmente le nombre de poulet de 1 🐔 chaque utilisation et l'affiche.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
};