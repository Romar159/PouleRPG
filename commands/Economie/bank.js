module.exports.run = async (client, message, args, settings, dbUser) => {
    if(message.mentions.users.first()) {
        const usr_member = message.guild.member(message.mentions.users.first())
        await client.updateMaxBank(client, usr_member);
        const usr = await client.getUser(usr_member);
        return message.channel.send(`${usr.username} à ${usr.or}/${usr.maxbank} or.`);
    } else {
        await client.updateMaxBank(client, message.member);
        return message.channel.send(`${dbUser.username} à ${dbUser.or}/${dbUser.maxbank} or.`);
    }
};

module.exports.help = {
    name: "bank",
    aliases: ['or', 'banque'],
    category: "economie",
    desription: "Affiche le contenu de la banque d'un utilisateur",
    usage: "[@user]",
    cooldown: 3,
    permissions: false,
    args: false
};