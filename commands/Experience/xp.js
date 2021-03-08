const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    const embed = new MessageEmbed()
    .setColor('#3F992D');

    if(message.mentions.users.first()) {
        const mention = message.mentions.members.first();
        const member = message.guild.member(message.mentions.users.first());
        const usr1 = await client.getUser(member);
        try {
            if(usr1.or < 0) { // Si l'utilisateur n'existe pas dans la bdd on le crée. (en passant dans le catch).
            } else {
                const usr = await client.getUser(member);
                const needxp_usr = Math.round((((700 * parseInt(usr.level)) / Math.sqrt(parseInt(usr.level))) - 200));
                embed.setAuthor(`Experience de ${member.user.username}`, member.user.displayAvatarURL());
                embed.setDescription(`:bar_chart: Niveau : **${usr.level}**\n\n:test_tube: XP : **${usr.experience}/${needxp_usr}**`);
                message.channel.send(embed);
            }
        } catch(e) {
             await client.createUser({
                guildID: mention.guild.id,
                guildName: mention.guild.name,
            
                userID: mention.id,
                username: mention.user.tag,
            });
            return message.channel.send("L'utilisateur n'existait pas dans la base de donnée.\nEssayez de retaper la commande");
        }
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
    usage: "[@user]", // ? DraxyNote: Je précis de faire attention quand il y l'utilisation comme ça, les paramètres obligatoires sont entre "<>" et facultatifs entre "[]". Et ici par exemple, c'est bien facultatif car on peut ne pas le renseigner, fait juste attention à cela quand tu vas éditer tout ça.
    cooldown: 1,
    permissions: false,
    args: false
};