const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    //* NOTE: Noter qu'il existe un bug connu ici. On peut se donner soit même des poyn. Mais parce que je trouve ça drôle et que ça casse rien, je laisse.
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    if(isNaN(args[1]) || args[1] < 1) return message.reply("vous devez définir un nombre valide.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Nombre Invalide. MESSAGE=${message.content}`, "err");
    if(!message.mentions.users.first()) return message.reply("vous devez spécifier un utilisateur.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Utilisateur Invalide. MESSAGE=${message.content}`, "err");
    if(dbUser.or < parseInt(args[1])) return message.reply("vous n'avez pas assez de poyn dans votre banque pour en donner autant.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Poyn Insuffisant. MESSAGE=${message.content} - poyn=${dbUser.or}`, "err");

    const mention = message.guild.members.cache.get(message.mentions.users.first().id);
    const embed = new EmbedBuilder()
    .setColor('5E6366')
    .setAuthor({name: `Virement effectué`, iconURL: message.author.displayAvatarURL()})
    .setDescription(`:money_with_wings: ${message.author} a envoyé **${args[1]} poyn** à ${mention}.`)

    message.channel.send({embeds:[embed]});

    await client.setOr(client, message.member, - parseInt(args[1]), message);
    await client.setOr(client, mention, parseInt(args[1]), message);

    let usr = await client.getUser(mention);
    client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Transaction effectué depuis ${message.member.user.tag} (${message.member.user.id}) -> ${mention.user.tag} (${mention.user.id}) | Montant=${parseInt(args[1])}. BANQUE_SOURCE=${dbUser.or - parseInt(args[1])} | BANQUE_RECEPTION=${usr.or}`);

    // ? Ici peut être améliorer les relations diplomatiques en ajoutant des points d'amitié si c'est entre deux factions différentes ?
};

module.exports.help = {
    name: "virement",
    aliases: ["givepoyn", "giveor", "vir"],
    category: "economie",
    desription: "Envoie des poyn à un utilisateur.",
    usage: "<@user> <poyn>",
    cooldown: 3,
    permissions: false,
    args: true
};