const {EmbedBuilder} = require("discord.js");
const {VERSION} = require('../../config');
        
module.exports.run = (client, message, args) => {

    const embed = new EmbedBuilder()
    // **Lignes de codes** : 5551 (c'est clairement obsolète il y en a 40x plus ptdr)
    //* AU 14/08/2023 à 22:52 : il y en avait 14137
	    .setColor('5E6366')
	    .setAuthor({name: "Infos de PouleRPG", iconURL:client.user.displayAvatarURL()})
	    .setDescription(`**Version actuelle :** ${VERSION}

        **Date de début du projet :** 19/09/2019 - 23:31
        **Date de début de la reprogrammation :** 26/01/2021
        **Date de sortie de la Alpha :** TBA

        **Crédits**
        • Développement & Conception : <@421400262423347211>
        • Aide aux fonctions mathématiques et conseils : <@211911771433205760>
        
        **Sources d'informations principales :** ISBN-9782035053749 | ISBN-2020050749 | Cours d'Histoire ; divers livres ; ainsi que les nombreuses connaissances du sujet du développeur qui le passionnent | wikipedia.org | paradoxinteractive.com

        **Gestion des Données :** En utilisant nos services, vous acceptez que nous puissions récupérer votre pseudonyme à des fins de développement uniquement.

        **Lien utiles :**
        [Discord Empire](https://discord.gg/Y4YZw2FK2Q) • [Github](https://github.com/Romar159/PouleRPG) • [Site](https://poulerpg.000webhostapp.com)`)

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