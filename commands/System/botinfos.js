const {EmbedBuilder} = require("discord.js");
const {VERSION} = require('../../config');
        
module.exports.run = (client, message, args) => {

    const embed = new EmbedBuilder()
    // **Lignes de codes** : 5551 (c'est clairement obsolète il y en a 40x plus ptdr)
    //* AU 14/08/2023 à 22:52 : il y en avait 14137
    //* AU 05/12/2023 à 18h42 : il y en avait 15371 aisni que 167 fichiers
	    .setColor('5E6366')
	    .setAuthor({name: "Infos de PouleRPG", iconURL:client.user.displayAvatarURL()})
	    .setDescription(`**Version actuelle :** ${VERSION}

        **Date de début du projet :** 19/09/2019 - 23:31
        **Date de début de la reprogrammation :** 26/01/2021
        **Date de sortie de la Alpha :** 17/04/2024

        **Crédits**
        • Développement & Conception : <@421400262423347211>
        • Fonctions mathématiques, conseils et arts numériques : <@211911771433205760>
        
        **Sources d'informations principales :** ISBN-9782035053749 | ISBN-2020050749 | ISBN-2-263-02477-8 | Cours d'Histoire ; Divers Livres ; Ainsi que les connaissances approfondies du développeur sur le sujet, qui le passionne | wikipedia.org | paradoxinteractive.com

        **Gestion des Données :** En utilisant nos services, vous acceptez que nous puissions récupérer votre pseudonyme ainsi que toutes les informations que vous fournissez **publiquement** à discord à des fins de développement uniquement.

        PouleRPG possède la norme ISO-14024

        **Lien utiles :**
        [Discord Empire](https://discord.gg/Y4YZw2FK2Q) • [Github](https://github.com/Romar159/PouleRPG) • [Site Web](https://poulerpg.000webhostapp.com)`)

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