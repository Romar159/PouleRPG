const {EmbedBuilder} = require("discord.js");
const {VERSION} = require("../../config.js");

        
module.exports.run = (client, message, args) => {

    const embed = new EmbedBuilder()
    // **Lignes de codes** : 5551
	    .setColor('1ABC9C')
	    .setAuthor({name: "Changelog", iconURL:client.user.displayAvatarURL()})
	    .setDescription(`**Version :** ${VERSION}

            - Cette version est la première Alpha. Les prochaines notes des mises à jour s'afficherons ici lorsqu'il y en aura.
        
        `)

    message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "changelog",
    aliases: ['changements', 'news', 'update-note'],
    category: "system",
    desription: "Informations sur les changements apportés par la mise à jour Actuelle",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false
};