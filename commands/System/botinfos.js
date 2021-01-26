const {MessageEmbed} = require("discord.js");
const {VERSION} = require('../../config');
        
module.exports.run = (client, message, args) => {

    const embed = new MessageEmbed()
			.setColor([200, 100, 0])
			.setAuthor("Infos de PouleRPG", client.user.displayAvatarURL())
			.setDescription(`Version : ** ${VERSION} **\nProgrammation : **Romar1** ; Design Graphique : **DraxyDow**`) // TODO : DraxyNote : Si tu peux ajouter la date de début du développement (19/09/2019  23:31) de manière belle grapgiquement ^^

        message.channel.send(embed);
}

module.exports.help = {
    name: "botinfos",
    aliases: ['botinfos'],
    category: "system",
    desription: "Infos sur le bot.",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false
};