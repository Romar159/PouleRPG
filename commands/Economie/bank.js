const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    const embed = new MessageEmbed()
    .setColor('F2DB0C');

    if(message.mentions.users.first()) {
        const mention = message.mentions.members.first();
        const usr_member = message.guild.members.cache.get(message.mentions.users.first().id);
        const usr1 = await client.getUser(usr_member);

        try { // Si l'utilisateur n'existe pas dans la bdd on le crée.
            // if(usr1.or < 0) { // ! Avoir de l'argent en négatif.
            // } // !
            // else { // !
                await client.updateMaxBank(client, usr_member);
                const usr = await client.getUser(usr_member);
                embed.setAuthor(`Banque de ${client.users.cache.get(usr.userID).username}`, client.users.cache.get(usr.userID).displayAvatarURL())
                .setDescription(`:coin: ${usr_member} à **${usr.or}/${usr.maxbank}** or.`);
                return message.channel.send({embeds:[embed]});
            // } // !
        } catch (e) {
            await client.createUser({
                guildID: mention.guild.id,
                guildName: mention.guild.name,
            
                userID: mention.id,
                username: mention.user.tag,
            }); 
            return message.channel.send("L'utilisateur n'existait pas dans la base de donnée.\nEssayez de retaper la commande");
        }
    } else {
        await client.updateMaxBank(client, message.member);
        embed.setAuthor(`Votre banque`, message.author.displayAvatarURL())
        .setDescription(`:coin: Vous avez **${dbUser.or}/${dbUser.maxbank}** or.`);
        return message.channel.send({embeds:[embed]});
    }
};

module.exports.help = {
    name: "banque",
    aliases: ['or'],
    category: "economie",
    desription: "Affiche votre contenu de banque ou celle d'un utilisateur.",
    usage: "[@user]",
    cooldown: 3,
    permissions: false,
    args: false
};