const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    const embed = new MessageEmbed()
    .setColor('3F992D');

    if(message.mentions.users.first()) {
        const mention = message.mentions.members.first();
        const member = message.guild.members.cache.get(message.mentions.users.first().id);
        const usr1 = await client.getUser(member);
        try {
            if(usr1.or < 0) { // Si l'utilisateur n'existe pas dans la bdd on le crée. (en passant dans le catch).
            } else {
                const usr = await client.getUser(member);
                const needxp_usr = Math.round((700 * parseInt(usr.level)) / Math.sqrt(parseInt(usr.level)));
                embed.setAuthor(`Experience de ${member.user.username}`, member.user.displayAvatarURL());
                embed.setDescription(`:bar_chart: Niveau : **${usr.level}**\n\n:test_tube: XP : **${usr.experience}/${needxp_usr}**`);
                message.channel.send({embeds:[embed]});
            }
        } catch(e) {
             await client.createUser({
                guildID: mention.guild.id,
                guildName: mention.guild.name,
            
                userID: mention.id,
                username: mention.user.tag,
            });
            return message.channel.send("L'utilisateur n'existait pas dans la base de donnée.\nEssayez de retaper la commande.");
        }
    } else {
        const needxp_dbuser = Math.round((700 * parseInt(dbUser.level)) / Math.sqrt(parseInt(dbUser.level)));
        embed.setAuthor(`Votre experience`, message.author.displayAvatarURL());
        embed.setDescription(`:bar_chart: Niveau :** ${dbUser.level}**\n\n:test_tube: XP : **${dbUser.experience}/${needxp_dbuser}**`);
        message.channel.send({embeds:[embed]});
    }
};

module.exports.help = {
    name: "xp",
    aliases: ['niveau', 'expérience', 'experience'],
    category: "experience",
    desription: "Affiche votre niveau et votre expérience actuelle ou celle d'un utilisateur.",
    usage: "[@user]",
    cooldown: 1,
    permissions: false,
    args: false
};