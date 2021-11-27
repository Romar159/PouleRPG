const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    /*
    ? TODO    Vérifie le nombre de points d'amitié -> POST BETA ?
    ? TODO    S'il est suffisant POUR LES DEUX factions -> faire une demande d'alliance
    */
    const embed = new MessageEmbed()
    .setColor('41D8D8');

    if(message.channel.id != "616652710942343222") return message.reply('cette commande ne peut être executée que dans le salon <#616652710942343222>.');

    const faction = await client.getFaction(dbUser.faction);
    const factionToAlly = args[0].charAt(0).toUpperCase() + args[0].slice(1);
    const factionUserUPPER = faction.name.charAt(0).toUpperCase() + faction.name.slice(1);

    switch(factionToAlly) {
        case "Epsilon":
            break;

        case "Daïros":
            break;

        case "Lyomah":
            break;

        case "Alpha":
            break;

        default:
            return message.reply("veuillez entrer une faction valide.");
    }

    const faction2 = await client.getFaction(factionToAlly.toLowerCase());

    if(args[1] == "briser") {
        if(factionUserUPPER == factionToAlly) return message.reply("vous ne pouvez pas briser une alliance avec votre propre faction.");
        if(faction.ally == "") return message.reply(`votre faction n'a aucune alliance forgée.`);
        if(faction.ally != args[0].toLowerCase()) return message.reply(`votre faction n'est pas alliée à ${factionToAlly}.`);

        
        await client.updateFaction(dbUser.faction, {ally: ""});
        await client.updateFaction(args[0].toLowerCase(), {ally: ""});
        
        embed.setAuthor(`Alliance brisée !`, client.user.displayAvatarURL());
        embed.setDescription(`**<@&${faction.roleid}>** a brisé son alliance avec **<@&${faction2.roleid}>** !\n **<@${message.author.id}>** perd **500** points de prestige.`);
        client.editPiete(client, message.member, -500);

        return message.channel.send({ embeds: [embed] });
    
    }

    if(factionUserUPPER == factionToAlly) return message.reply("vous ne pouvez pas vous allier à votre propre faction.");
    if(faction.ally != "") return message.reply(`votre faction est déjà alliée à ${faction.ally.charAt(0).toUpperCase() + faction.ally.slice(1)}.`);
    
    if(faction2.ally != "") return message.reply(`${faction2.name.charAt(0).toUpperCase() + faction2.name.slice(1)} est déjà alliée à ${faction2.ally.charAt(0).toUpperCase() + faction2.ally.slice(1)}.`);
    if(!faction2.idmaitre) return message.reply(`la faction n'a pas de maître. Sans maître aucune alliance ne peut être forgée.`);

    try {
        message.channel.send(`<@${faction2.idmaitre}>, voulez-vous vraiment vous allier à **${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}** ? (accepter)`);
        
        const filter = m => (faction2.idmaitre === m.author.id);
        const userEntry = await message.channel.awaitMessages(filter, {
            max:1, time:30000, errors: ['time']
        });

        if(userEntry.first().content.toLowerCase() === "accepter") {
            embed.setAuthor(`Nouvelle alliance !`, client.user.displayAvatarURL())
            embed.setDescription(`**<@&${faction.roleid}>** est désormais alliée à **<@&${faction2.roleid}>** !`);
            
            message.channel.send({ embeds: [embed] });

            await client.updateFaction(dbUser.faction, {ally: args[0].toLowerCase()});
            await client.updateFaction(args[0].toLowerCase(), {ally: faction.name});
        }
    } catch(e) {
        message.channel.send(`Temps écoulé.`);
    }
};

module.exports.help = {
    name: "alliance",
    aliases: ['alliance'],
    category: "politique, diplomatie et economie",
    desription: "Forge une alliance entre deux factions.",
    usage: "<faction> [briser]",
    cooldown: 3,
    permissions: false,
    args: true,
};