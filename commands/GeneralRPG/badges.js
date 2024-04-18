const { EmbedBuilder } = require('discord.js');

module.exports.run = (client, message, args, settings, dbUser) => {
    const list_badges = require('../../assets/rpg/badges.json');

    let badges_embed = new EmbedBuilder()
    .setColor('BF2F00')
    .setAuthor({name: `Badges`, iconURL:client.user.displayAvatarURL()});


    for(let i = 0 ; i < list_badges.length ; i++) {
        badges_embed.addFields([{name:`${(dbUser.badges_possedes.includes(i)) ? "🏅" : "⚫"} - ${client.filterById(list_badges, i).name}`, value:`${client.filterById(list_badges, i).description}`}])
        //message.channel.send(`${(dbUser.badges_possedes.includes(i)) ? "Possédé" : "Non possédé"} | ${client.filterById(list_badges, i).name} - ${client.filterById(list_badges, i).description}`);
    }
    message.channel.send({embeds:[badges_embed]});
}

module.exports.help = {
    name: "badges",
    aliases: ['b'],
    category: "generalrpg",
    desription: "Affiche vos badges possédés ou non.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false, 
};