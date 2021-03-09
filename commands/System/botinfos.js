const {MessageEmbed} = require("discord.js");
const {VERSION} = require('../../config');
        
module.exports.run = (client, message, args) => {

    const embed = new MessageEmbed()
	    .setColor('5E6366')
	    .setAuthor("Infos de PouleRPG", client.user.displayAvatarURL())
	    .setDescription(`**Version actuelle :** ${VERSION}

        **Date de début du projet :** 19/09/2019 - 23:31
        **Date de début de la reprogrammation :** 26/01/2021

        **Programmation :** <@421400262423347211> | **Design Graphique :** <@211911771433205760>`)

    message.channel.send(embed);
}

module.exports.help = {
    name: "botinfos",
    aliases: ['botinfos', 'infos'],
    category: "system",
    desription: "Informations diverses sur le bot.",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false
};