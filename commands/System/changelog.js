const {EmbedBuilder} = require("discord.js");
const {VERSION} = require("../../config.js");

        
module.exports.run = (client, message, args) => {

    const embed = new EmbedBuilder()
    // **Lignes de codes** : 5551
	    .setColor('1ABC9C')
	    .setAuthor({name: "Changelog", iconURL:client.user.displayAvatarURL()})
	    .setDescription(`**Version :** ${VERSION}

            > **Bug Fix**
            • Le second choix sur l'event "sommeil tumultueux" peut maintenant être selectionné 
            • Le temps restant avant de jeter une pièce à un sdf à nouveau correspond maintenant correctement entre le p<état et le p<sdf

            > **Améliorations diverses**
            • PouleRPG supporte à présent le préfix majuscule et minuscule.
            • Amélioration techniques du p<commentaire, vos commentaires seront maintenant plus facilement traités par les administrateurs.
            • Les erreurs de frappes sont maintenant traités lors du choix de la faction du p<expédition
        
        `)

    message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "changelog",
    aliases: ['changements', 'news', 'update-note'],
    category: "system",
    desription: "Informations sur les changements apportés par la mise à jour actuelle",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false
};