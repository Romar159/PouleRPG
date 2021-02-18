const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    const embed = new MessageEmbed()
    .setColor('#3F992D');


    if(message.mentions.users.first()) {
        const member = message.guild.member(message.mentions.users.first());
        const usr = await client.getUser(member);
        const needxp_usr = await Math.round((((700 * parseInt(usr.level)) / Math.sqrt(parseInt(usr.level))) - 200));
        embed.setAuthor(`Experience de ${member.user.username}`, member.user.displayAvatarURL());
        embed.setDescription(`:bar_chart: Niveau : **${usr.level}**\n\n:test_tube: XP : **${usr.experience}/${needxp_usr}**`);
        message.channel.send(embed);
    } else {
        const needxp_dbuser = Math.round((((700 * parseInt(dbUser.level)) / Math.sqrt(parseInt(dbUser.level))) - 200));
        embed.setAuthor(`Votre experience`, message.author.displayAvatarURL());
        embed.setDescription(`:bar_chart: Niveau :** ${dbUser.level}**\n\n:test_tube: XP : **${dbUser.experience}/${needxp_dbuser}**`);
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "xp",
    aliases: ['xp'],
    category: "experience",
    desription: "Affiche l'experience actuelle d'un utilisateur.",
    usage: "<@user>",
    cooldown: 1,
    permissions: false,
    args: false
};