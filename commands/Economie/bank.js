const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    //client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);
    client.logCommandExecution(message, this);

    const embed = new EmbedBuilder()
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
                embed.setAuthor({ name:`Banque de ${client.users.cache.get(usr.userID).username}`, iconURL: client.users.cache.get(usr.userID).displayAvatarURL()})
                .setDescription(`:coin: ${usr_member} à **${usr.or}/${usr.maxbank}** poyn.`);

                client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) : a  ${usr.or}/${usr.maxbank} poyn ${client.users.cache.get(usr.userID).tag} (${client.users.cache.get(usr.userID).id})`);

                return message.channel.send({embeds:[embed]});
            // } // !
        } catch (e) {
            await client.createUser({
                guildID: mention.guild.id,
                guildName: mention.guild.name,
            
                userID: mention.id,
                username: mention.user.tag,
            }); 
            client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) : Utilisateur Inexistant dans la BDD crée ${mention.username} (${mention.id})`, `warn`);
            return message.channel.send("Erreur, l'utilisateur n'existait probablement pas dans la base de donnée.\nEssayez de retaper la commande");
        }
    } else {
        await client.updateMaxBank(client, message.member);
        const dbmembre = await client.getUser(message.member);

        embed.setAuthor({name: `Votre banque`, iconURL: message.author.displayAvatarURL()})
        .setDescription(`:coin: Vous avez **${dbmembre.or}/${dbmembre.maxbank}** poyn.`);

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) : a  ${dbmembre.or}/${dbmembre.maxbank} poyn ${message.author.tag} (${message.author.id})`);

        return message.channel.send({embeds:[embed]});
    }
};

module.exports.help = {
    name: "banque",
    aliases: ['poyn', 'or'],
    category: "economie",
    desription: "Affiche votre quantité de poyn ou celle d'un utilisateur.",
    usage: "[@user]",
    cooldown: 3,
    permissions: false,
    args: false
};