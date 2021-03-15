const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    const faction = await client.getFaction(dbUser.faction);
    
    /* TODO : Faire un nouveau truc dans le user profil :
     * On peut customizer l'emote de la faction ainsi que celle de la position favorite parmi une bdd */

    let emote = "";
    if(dbUser.class == "NULL") emote = ":hole:";
    else if(dbUser.class == "cavalier") emote = ":horse_racing:";
    else if(dbUser.class == "guerrier") emote = ":crossed_swords:";
    else if(dbUser.class == "archer") emote = ":bow_and_arrow:";

    const embed = new MessageEmbed()
    .setAuthor(`Profil de ${message.author.username}`, message.author.displayAvatarURL())
    .setColor('BF2F00')
    .addField(`:european_castle: **Faction**`, `<@&${faction.roleid}>`, true)
    .addField(`${emote} **Classe**`, `${dbUser.class.charAt(0).toUpperCase() + dbUser.class.slice(1)}`, true)
    .addField(`** **`, `** **`)
    .addField(`:bar_chart: **Niveau**`, dbUser.level, true)
    .addField(`:test_tube: **Expérience**`, dbUser.experience, true)
    .addField(`** **`, `** **`)
    .addField(`**:coin: Or**`, dbUser.or, true)
    .addField(`** **`, `** **`)
    .addField(`:heart: **Position favorite**`, `${dbUser.combat_favoriteposition.charAt(0).toUpperCase() + dbUser.combat_favoriteposition.slice(1)}`, true)
    .addField(`:broken_heart: **Position détestée**`, `${dbUser.combat_hatedposition.charAt(0).toUpperCase() + dbUser.combat_hatedposition.slice(1)}`, true)
    .addField(`** **`, `** **`)
    .addField(`:woman_red_haired: **Points(s) vénitienne**`, dbUser.pointsvenitienne, true)
    .addField(`:dart: **Point(s) de puissance**`, dbUser.powerpoints, true);
        
    message.channel.send(embed);
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