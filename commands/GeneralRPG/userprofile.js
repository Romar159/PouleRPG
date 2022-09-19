const {EmbedBuilder} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    const faction = await client.getFaction(dbUser.faction);

    let emote = "";
    if(dbUser.class == "NULL") emote = ":hole:";
    else if(dbUser.class == "cavalier") emote = ":horse_racing:";
    else if(dbUser.class == "guerrier") emote = ":crossed_swords:";
    else if(dbUser.class == "archer") emote = ":bow_and_arrow:";

    const emote_faction = dbUser.profil_emote_faction;
    const emote_position = dbUser.profil_emote_position;


    const embed = new EmbedBuilder()
    .setAuthor({name:`Profil de ${message.author.username}`, iconURL:message.author.displayAvatarURL()});
    if(dbUser.faction == "epsilon")
        embed.setColor('AA3C00');
    if(dbUser.faction == "daïros")
        embed.setColor('0078F0');
    if(dbUser.faction == "lyomah")
        embed.setColor('00A00A');
    if(dbUser.faction == "alpha")
        embed.setColor('F0C800');
    if(dbUser.faction == "NULL")
        embed.setColor('5E6366');

    if(dbUser.faction == "NULL")
        embed.addFields({name:`${emote_faction} **Faction**`, value:`Vous n'avez pas rejoint de faction.`});
    else
        embed.addFields({name:`${emote_faction} **Faction**`, value:`**<@&${faction.roleid}>**`});

    embed.addFields({name:`${emote} **Classe**`, value:`${dbUser.class.charAt(0).toUpperCase() + dbUser.class.slice(1)}`})
    .addFields({name:`** **`, value:`** **`})
    .addFields({name:`:bar_chart: **Niveau**`, value:dbUser.level.toString()})
    .addFields({name:`:test_tube: **Expérience**`, value:dbUser.experience.toString()})
    .addFields({name:`** **`, value:`** **`})
    .addFields({name:`**:coin: Or**`, value:dbUser.or.toString()})
    .addFields({name:`** **`, value:`** **`})
    .addFields({name:`${emote_position} **Position favorite**`, value:`${dbUser.combat_favoriteposition.charAt(0).toUpperCase() + dbUser.combat_favoriteposition.slice(1)}`})
    .addFields({name:`:broken_heart: **Position détestée**`, value:`${dbUser.combat_hatedposition.charAt(0).toUpperCase() + dbUser.combat_hatedposition.slice(1)}`})
    .addFields({name:`** **`, value:`** **`});
    if(message.author.id == '421400262423347211')
        embed.addFields({name:`:woman_red_haired: **Points(s) vénitienne**`, value:`∞`});
    else
        embed.addFields({name:`:woman_red_haired: **Points(s) vénitienne**`, value:dbUser.pointsvenitienne.toString()});
    embed.addFields({name:`:dart: **Point(s) de puissance**`, value:dbUser.powerpoints.toString()});
        
    message.channel.send(`Piété : ${dbUser.piete} \nPrestige : ${dbUser.prestige} \nRichesse : ${dbUser.richesse} \nTravail : ${dbUser.travail} \nForme : ${dbUser.forme} \nSavoir : ${dbUser.savoir} \nMoral : ${dbUser.moral}`); // ? DraxyNote: Ici faut ajouter au embed.
    message.channel.send({embeds:[embed]});
}

module.exports.help = {
    name: "profil",
    aliases: ['utilisateur', 'pr'],
    category: "generalrpg",
    desription: "Affiche votre profil complet.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
}; 