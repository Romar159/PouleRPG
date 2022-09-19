const {EmbedBuilder} = require("discord.js");
module.exports.run = (client, message, args) => {
    message.guild.members.fetch().then(fetchAll => {
       
        const epsilon = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
        const dairos = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
        const lyomah = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
        const alpha = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));
        
        const embed = new EmbedBuilder()
        
        // Si aucun argument n'est passé, envoyer la liste de toutes les factions.
        if(!args.length) {
            embed.setColor('5E6366')
            embed.setAuthor({name:`Listes des factions`, iconURL:client.user.displayAvatarURL()});
            embed.addFields([{name:`:regional_indicator_e: Membres de la faction Epsilon`, value:`\`${epsilon.map(m => m.user.tag).join('` • `')}\``},{name:`:regional_indicator_d: Membres de la faction Daïros`, value:`\`${dairos.map(m => m.user.tag).join('` • `')}\``},{name:`:regional_indicator_l: Membres de la faction Lyomah`, value:`\`${lyomah.map(m => m.user.tag).join('` • `')}\``},{name:`:regional_indicator_a: Membres de la faction Alpha`, value:`\`${alpha.map(m => m.user.tag).join('` • `')}\``}]);

            return message.channel.send({embeds:[embed]});
        }
        
        // Sinon, on analyse les arguments pour chaque faction.
        if(args[0].toLowerCase() == "epsilon") {
            embed.setColor('AA3C00')
            embed.setAuthor({name:`Liste d'Epsilon`, iconURL: client.user.displayAvatarURL()});
            embed.addFields([{name:`:regional_indicator_e: Membres de la faction Epsilon : ${epsilon.size}`, value:`\`${epsilon.map(m => m.user.tag).join('` • `')}\``}]);
            message.channel.send({embeds:[embed]});
        }
        if(args[0].toLowerCase() == "daïros") {
            embed.setColor('0078F0')
            embed.setAuthor({name:`Liste de Daïros`, iconURL: client.user.displayAvatarURL()});
            embed.addFields([{name:`:regional_indicator_d: Membres de la faction Daïros : ${dairos.size}`, value:`\`${dairos.map(m => m.user.tag).join('` • `')}\``}]);
            message.channel.send({embeds:[embed]});
        }
        if(args[0].toLowerCase() == "lyomah") {
            embed.setColor('00A00A')
            embed.setAuthor({name:`Liste de Lyomah`, iconURL: client.user.displayAvatarURL()});
            embed.addFields([{name:`:regional_indicator_l: Membres de la faction Lyomah : ${lyomah.size}`, value:`\`${lyomah.map(m => m.user.tag).join('` • `')}\``}]);
            message.channel.send({embeds:[embed]});
        }
        if(args[0].toLowerCase() == "alpha") {
            embed.setColor('F0C800')
            embed.setAuthor({name:`Liste d'Alpha`, iconURL: client.user.displayAvatarURL()});
            embed.addFields([{name:`:regional_indicator_a: Membres de la faction Alpha : ${alpha.size}`, value:`\`${alpha.map(m => m.user.tag).join('` • `')}\``}]);
            message.channel.send({embeds:[embed]});
        }
        
   });
}

module.exports.help = {
    name: "liste",
    aliases: [],
    category: "generalrpg",
    desription: "Renvoie la liste des membres d'une ou des factions.",
    usage: '[faction]',
    cooldown: 3, 
    permissions: false,
    args: false
};