const {MessageEmbed} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    message.guild.members.fetch().then(async fetchAll => {
        try {
            const faction = await client.getFaction(args[0].toLowerCase());
            const members = fetchAll.filter(m => m.roles.cache.get(faction.roleid));
            let maitre;
            if(faction.idmaitre) maitre = `<@${faction.idmaitre}>`;
            else maitre = "Vacant";

            const embed = new MessageEmbed()
                .setTitle(`Faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}`)
                .setColor('FFFFFF')
                .addField(`Maître`, maitre)
                .addField(`Nombre de membres`, `${members.size}`)
                .addField(`Points de victoire`, `${faction.ptsvictoire}`);
            
        
            if (message.channel.id == faction.channelid) {
                embed.addField(`Bank`, `${faction.bank}`);

                if(faction.factionid == 0) {
                    embed.addField(`Points d'amitié avec Daïros`, `${faction.ptsami_dairos}`)
                    .addField(`Points d'amitié avec Lyomah`, `${faction.ptsami_lyomah}`)
                    .addField(`Points d'amitié avec Alpha`, `${faction.ptsami_alpha}`);
                } else if(faction.factionid == 1) {
                    embed.addField(`Points d'amitié avec Epsilon`, `${faction.ptsami_epsilon}`)
                    .addField(`Points d'amitié avec Lyomah`, `${faction.ptsami_lyomah}`)
                    .addField(`Points d'amitié avec Alpha`, `${faction.ptsami_alpha}`);
                } else if(faction.factionid == 2) {
                    embed.addField(`Points d'amitié avec Epsilon`, `${faction.ptsami_epsilon}`)
                    .addField(`Points d'amitié avec Daïros`, `${faction.ptsami_dairos}`)
                    .addField(`Points d'amitié avec Alpha`, `${faction.ptsami_alpha}`);
                } else if(faction.factionid == 3) {
                    embed.addField(`Points d'amitié avec Epsilon`, `${faction.ptsami_epsilon}`)
                    .addField(`Points d'amitié avec Daïros`, `${faction.ptsami_dairos}`)
                    .addField(`Points d'amitié avec Lyomah`, `${faction.ptsami_lyomah}`);
                }
            }    
            message.channel.send(embed);
        }
        catch(e) {
            if(args.length)
                message.reply("Faction Inexistante");
        }
    });
}

module.exports.help = {
    name: "infofaction",
    aliases: ['infofaction', 'infoFaction'],
    category: "generalrpg",
    desription: "Donne toutes les infos sur une faction.",
    usage: '<faction>',
    cooldown: 3, 
    permissions: false,
    args: true
};