const {EmbedBuilder} = require("discord.js");
const {VERSION} = require('../../config');
        
module.exports.run = (client, message, args) => {

    const embed = new EmbedBuilder()
    // **Lignes de codes** : 5551
	    .setColor('5E6366')
	    .setAuthor({name: "Infos de PouleRPG", iconURL:client.user.displayAvatarURL()})
	    .setDescription(`**Version actuelle :** ${VERSION}


        **Date de début du projet :** 19/09/2019 - 23:31
        **Date de début de la reprogrammation :** 26/01/2021
        **Date de Bêta :** TBA

        **Développement :** <@421400262423347211> | **Aide à la conception :** <@211911771433205760>
        
        **Sources d'information principales :** ISBN-9782035053749 | Cours d'Histoire ; divers livres ; ainsi que les connaissances du Romar | wikipedia.org | Paradox Interactive

        **Lien utiles :**
        [Discord Empire](https://discord.gg/Y4YZw2FK2Q) • [Github](https://github.com/Romar159/PouleRPG) • [Site](https://romar159.github.io/PouleRPGweb/)`)

    message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "botinfos",
    aliases: ['infos'],
    category: "system",
    desription: "Informations diverses sur le bot.",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false
};