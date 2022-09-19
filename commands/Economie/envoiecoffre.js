const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    const list_badges = require('../../assets/rpg/badges.json');

    if(dbUser.faction == "NULL") return message.channel.send("Vous n'êtes pas membre d'une faction.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - faction=NULL`, "err");
    if(isNaN(args[0])) return message.channel.send("Vous devez entrer une valeur numérique.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - nombre invalide MESSAGE=${message.content}`, "err");
    if(dbUser.or < args[0]) return message.channel.send("Vous n'avez pas assez d'or.")  & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - quantité d'or trop faible. NECESSAIRE=${args[0]} | ACTUEL=${dbUser.or} MESSAGE=${message.content}`, "err");
    if(args[0] < 0) return message.channel.send("Vous ne pouvez pas envoyer de l'argent négatif, faut pas être attardé non plus !") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Valeur Négative. MESSAGE=${message.content}`, "err");

    const faction = await client.getFaction(dbUser.faction);
    await client.updateFaction(dbUser.faction, {bank: (faction.bank + parseInt(args[0]))});
    await client.setOr(client, message.member, - args[0], message);
    let ppmaitre = message.guild.members.cache.get(faction.idmaitre);
    const embed = new EmbedBuilder()
    .setColor('5E6366')
    .setAuthor({name: `Envoie effectué`, iconURL: ppmaitre.user.displayAvatarURL()})
    .setDescription(`:bank: ${message.author} a ajouté **${args[0]} or** à son coffre de faction.`);

    message.channel.send({embeds:[embed]});

    client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${message.author.tag} (${message.author.id}) a ajouté ${args[0]} or à la faction ${dbUser.faction}`);

    if(args[0] >= 150) {
        if(await client.addBadge(client, message.member, dbUser, "5")) {
            message.channel.send(`WOW !! ${message.member} vient de gagner le badge **${client.filterById(list_badges, 5).name}** !`);
            client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - badge ID=5 obtenu pour ${message.member}`)
        }
    }
};

module.exports.help = {
    name: "envoiecoffre",
    aliases: ['envcoffre'],
    category: "economie",
    desription: "Envoie de l'or dans votre coffre de faction.",
    usage: "<or>",
    cooldown: 3,
    permissions: false,
    args: true
};