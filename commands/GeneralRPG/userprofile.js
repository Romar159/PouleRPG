const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    const faction = await client.getFaction(dbUser.faction);

    let emote = "";
    if(dbUser.class == "NULL") emote = ":hole:";
    else if(dbUser.class == "cavalier") emote = ":horse_racing:";
    else if(dbUser.class == "guerrier") emote = ":crossed_swords:";
    else if(dbUser.class == "archer") emote = ":bow_and_arrow:";

    const emote_faction = dbUser.profil_emote_faction;
    const emote_position = dbUser.profil_emote_position;


    const embed = new MessageEmbed()
    .setAuthor(`Profil de ${message.author.username}`, message.author.displayAvatarURL());
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
        embed.addField(`${emote_faction} **Faction**`, `Vous n'avez pas rejoint de faction.`, true);
    else
        embed.addField(`${emote_faction} **Faction**`, `**<@&${faction.roleid}>**`, true);

    embed.addField(`${emote} **Classe**`, `${dbUser.class.charAt(0).toUpperCase() + dbUser.class.slice(1)}`, true)
    .addField(`** **`, `** **`)
    .addField(`:bar_chart: **Niveau**`, dbUser.level.toString(), true)
    .addField(`:test_tube: **Expérience**`, dbUser.experience.toString(), true)
    .addField(`** **`, `** **`)
    .addField(`**:coin: Or**`, dbUser.or.toString(), true)
    .addField(`** **`, `** **`)
    .addField(`${emote_position} **Position favorite**`, `${dbUser.combat_favoriteposition.charAt(0).toUpperCase() + dbUser.combat_favoriteposition.slice(1)}`, true)
    .addField(`:broken_heart: **Position détestée**`, `${dbUser.combat_hatedposition.charAt(0).toUpperCase() + dbUser.combat_hatedposition.slice(1)}`, true)
    .addField(`** **`, `** **`);
    if(message.author.id == '421400262423347211')
        embed.addField(`:woman_red_haired: **Points(s) vénitienne**`, `∞`, true);
    else
        embed.addField(`:woman_red_haired: **Points(s) vénitienne**`, dbUser.pointsvenitienne.toString(), true);
    embed.addField(`:dart: **Point(s) de puissance**`, dbUser.powerpoints.toString(), true);
        
    message.channel.send(`Piété : ${dbUser.piete} \nPrestige : ${dbUser.prestige} \nRichesse : ${dbUser.richesse} \nTravail : ${dbUser.travail} \nForme : ${dbUser.forme} \nSavoir : ${dbUser.savoir} \nMoral : ${dbUser.moral}`); // ? DraxyNote: Ici faut ajouter au embed.
    message.channel.send({embeds:[embed]});
}

module.exports.help = {
    name: "profil",
    aliases: ['utilisateur'],
    category: "generalrpg",
    desription: "Affiche votre profil complet.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
};