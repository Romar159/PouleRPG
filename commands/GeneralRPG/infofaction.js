const {EmbedBuilder} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    message.guild.members.fetch().then(async fetchAll => {
        try {
            const faction = await client.getFaction(args[0].toLowerCase());
            const members = fetchAll.filter(m => m.roles.cache.get(faction.roleid));
            let maitre;
            let ppmaitre;
            if(faction.idmaitre) {
                maitre = `<@${faction.idmaitre}>`;
                ppmaitre = message.guild.members.cache.get(faction.idmaitre);
            } else {
                maitre = "Vacant";
                ppmaitre = client;
            }

            const embed = new EmbedBuilder()
            .setAuthor({name:`Faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}`, iconURL: ppmaitre.user.displayAvatarURL()})
            .addFields([{name:`:mortar_board: Maître`, value:`${maitre}`}, {name:`:busts_in_silhouette: Nombre de membres`, value:`${members.size}`}, {name:`:dart: Points de victoire`, value:`${faction.ptsvictoire}`}])
            

                //Couleurs
                if(faction.factionid == 0)          //Epsilon
                    embed.setColor('AA3C00');
                else if(faction.factionid == 1)     //Daïros
                    embed.setColor('0078F0');
                else if(faction.factionid == 2)     //Lyomah
                    embed.setColor('00A00A');
                else if(faction.factionid == 3)     //Alpha
                    embed.setColor('F0C800');

                if(faction.en_guerre)
                    embed.addFields([{name:`:crossed_swords: ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} est actuellement en guerre contre`, value:`${faction.ennemy.charAt(0).toUpperCase() + faction.ennemy.slice(1)}`}]);
                else
                    embed.addFields([{name:`:crossed_swords: ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} n'est en guerre contre personne.`, value:`Relations diplomatiques stables.`}]);    

                if(faction.ally)
                    embed.addFields([{name:`:heart: Allié`, value:`${faction.ally}`}]);
                else
                    embed.addFields([{name:`:heart: Allié`, value:`Aucune faction alliée.`}]);

        
            if(message.channel.id == faction.channelid) {
                embed.addFields([{name:`** **`, value:`** **`},{name:`:bank: Bank`, value:`${faction.bank}`},{name:`:money_with_wings: Taxe`, value:`${faction.taxe}`}])
               
                
                if(faction.factionid == 0) {            //Epsilon
                    embed.addFields([{name:`:blue_heart: Points d'amitié avec Daïros`, value:`${faction.ptsami_dairos}`},{name:`:green_heart: Points d'amitié avec Lyomah`, value:`${faction.ptsami_lyomah}`},{name:`:yellow_heart: Points d'amitié avec Alpha`, value:`${faction.ptsami_alpha}`}]);

                    
                    
                    
                    
                } else if(faction.factionid == 1) {     //Daïros
                    embed.addFields([{name:`:blue_heart: Points d'amitié avec Epsilon`, value:`${faction.ptsami_epsilon}`},{name:`:green_heart: Points d'amitié avec Lyomah`, value:`${faction.ptsami_lyomah}`},{name:`:yellow_heart: Points d'amitié avec Alpha`, value:`${faction.ptsami_alpha}`}]);
                    
                } else if(faction.factionid == 2) {     //Lyomah
                    embed.addFields([{name:`:blue_heart: Points d'amitié avec Epsilon`, value:`${faction.ptsami_epsilon}`},{name:`:green_heart: Points d'amitié avec Daïros`, value:`${faction.ptsami_dairos}`},{name:`:yellow_heart: Points d'amitié avec Alpha`, value:`${faction.ptsami_alpha}`}]);
                    
                } else if(faction.factionid == 3) {     //Alpha
                    embed.addFields([{name:`:blue_heart: Points d'amitié avec Epsilon`, value:`${faction.ptsami_epsilon}`},{name:`:green_heart: Points d'amitié avec Daïros`, value:`${faction.ptsami_dairos}`},{name:`:yellow_heart: Points d'amitié avec Lyomah`, value:`${faction.ptsami_lyomah}`}]);
                    
                }
            }
            //message.channel.send(`Lois de la faction en vigueur : ...`);
            //message.channel.send(`Gouvernement actuel : Conseillers ; Intendant ; Maréchal ; Chapelain`);

            message.channel.send({embeds:[embed]});
        }
        catch(e) { //Mettre le ICI! <-
            if(args.length)
                message.reply("Faction Inexistante. " + e);
        }
    });
}

module.exports.help = {
    name: "infosfaction",
    aliases: ['infofaction', 'infosfac', 'infofac'],
    category: "generalrpg",
    desription: "Donne toutes les infos sur une faction.",
    usage: '<faction>',
    cooldown: 3, 
    permissions: false,
    args: true
};