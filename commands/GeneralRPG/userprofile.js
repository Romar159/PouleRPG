const {MessageEmbed} = require("discord.js");

module.exports.run = (client, message, args, settings, dbUser) => {
        const embed = new MessageEmbed()
        .setTitle(`Profile de ${message.author.tag}`)
        .setColor('FFFFFF')
        .addField(`Faction`, `${dbUser.faction}`)
        .addField(`Classe`, `${dbUser.class}`)
        .addField(`Level`, `${dbUser.level}`)
        .addField(`Experience`, `${dbUser.experience}`)
        .addField(`or`, `${dbUser.or}/${dbUser.maxbank}`)
        .addField(`Point(s) venitienne`, `${dbUser.pointsvenitienne}`)
        .addField(`Point(s) de puissance`, `${dbUser.powerpoints}`)
        .addField(`Position favorite`, `${dbUser.combat_favoriteposition}`)
        .addField(`Position detestée`, `${dbUser.combat_hatedposition}`);
        
        message.channel.send(embed);
}

module.exports.help = {
    name: "userprofile",
    aliases: ['userprofile', 'up', 'userProfile'],
    category: "generalrpg",
    desription: "Affiche votre profile complet.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
};