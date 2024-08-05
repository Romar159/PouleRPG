const {EmbedBuilder} = require("discord.js");
const {VERSION} = require("../../config.js");

        
module.exports.run = (client, message, args) => {

    const embed = new EmbedBuilder()
    // **Lignes de codes** : 5551
	    .setColor('1ABC9C')
	    .setAuthor({name: "Changelog", iconURL:client.user.displayAvatarURL()})
	    .setDescription(`**Version :** ${VERSION}
            
            > **Commande p<jetteunepieceatonsdf**
            • Ajout d'un alias "sdf"
            • Cooldown réduit
            • Nouveaux gains : points de moral

            > **Commande p<arène**
            • Nouvel équilibrage pour le gain d'or

            > **Commande p<travail**
            • Nouvel équilibrage pour le gain de points de travail

            > **Commande p<pari**
            • Nouvel équilibrage pour le gain de points de richesse
            • Il n'est plus possible de gagner des points de prestige

            > **Equilibrage Expérience**
            • Le niveau maximal passe à 200 au lieu de 9 223 372 036 854 775 807 !
            • Message lors du passage de niveau et améliorations graphiques diverses

            > **Bug Fix**
            • Le p<état n'affiche plus que l'on ne peut faire aucune autre activité que celle que l'on vient de terminer
            • Le p<poulet prend maintenant en compte tous les poulets même spammés

            > **Améliorations diverses**
            • Nouveaux easter-eggs :)
            • Patch et nerf sur certains events
            • le p<préférences est à présent un peu plus compréhensible
            • Les points négatifs ont maintenant un emote spécial
        
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