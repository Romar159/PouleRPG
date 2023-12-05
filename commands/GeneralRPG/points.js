const {EmbedBuilder} = require("discord.js");
const armes = require("../../assets/rpg/armes.json")
const metiers = require("../../assets/rpg/metiers/metiers.json")

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(message.mentions.users.first()) {
        dbUser = await client.getUser(message.guild.members.cache.get(message.mentions.users.first().id));
        message.author = message.mentions.users.first();
    }
    

    const embed = new EmbedBuilder()
    .setAuthor({name:`Points de ${message.author.username}`, iconURL:message.author.displayAvatarURL()});
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

    embed.addFields({name:`:crown: **Prestige**`, value: `${dbUser.prestige}`, inline:true})
    .addFields({name:`:pray: **Piété**`, value: `${dbUser.piete}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:gem: **Richesse**`, value:`${dbUser.richesse}`, inline:true})
    .addFields({name:`:dart: **Redoutabilité**`, value:`${dbUser.redoutabilite}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:muscle: **Forme**`, value:`${dbUser.forme}`, inline:true})
    .addFields({name:`:sunflower: **Moral**`, value:`${dbUser.moral}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:pick: **Travail**`, value:`${dbUser.travail}`, inline:true})
    .addFields({name:`:brain: **Savoir**`, value:`${dbUser.savoir}`, inline:true})

    message.channel.send({embeds:[embed]});
}

module.exports.help = {
    name: "points",
    aliases: ['pts'],
    category: "generalrpg",
    desription: "Affiche vos points ou ceux d'un autre utilisateur.",
    usage: "p<points [@user]",
    cooldown: 3,
    permissions: false,
    args: false
}; 