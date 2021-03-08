const {MessageEmbed} = require("discord.js");
const {VERSION} = require('../../config');
        
module.exports.run = (client, message, args) => {

    const embed = new MessageEmbed()
			.setColor([200, 100, 0])
			.setAuthor("Infos de PouleRPG", client.user.displayAvatarURL())
			.setDescription(`Version : ** ${VERSION} **\nProgrammation : **Romar1** ; Design Graphique : **DraxyDow**`) // TODO : DraxyNote : Si tu peux ajouter la date de début du développement (19/09/2019  23:31) de manière belle grapgiquement ^^ EDIT:  l'ancienne date est celle du début du développement de la première version, celle recodé c'est celle-ci : 26/01/2021 ; Donc si tu veux caler les deux pour quand même ne pas oublier tout ce qui as été fait avant.

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