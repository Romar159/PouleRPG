const {EmbedBuilder} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    
    message.guild.members.fetch().then(async fetchAll => {
        try {
            let faction = await client.getFaction(dbUser.faction);
            if(args[0]) {
                faction = await client.getFaction(args[0].toLowerCase());
            }
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

            //message.channel.send(`Gouvernement actuel : Conseillers ; Intendant ; Maréchal ; Chapelain`);

            const embed = new EmbedBuilder()
            .setAuthor({name:`Faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}`, iconURL: ppmaitre.user.displayAvatarURL()})
            .addFields([{name:`:mortar_board: Maître`, value:`${maitre}`, inline:true}, {name:`:busts_in_silhouette: Nombre de membres`, value:`${members.size}`, inline:true}, {name:`** **`, value:`** **`, inline:true}])
            .addFields([{name:`:coin: Intendant`, value:`${(faction.intendant != "NULL") ? `<@${faction.intendant}>` : "Vacant"}`, inline:true},  {name:`:dagger: Maréchal`, value:`${(faction.marechal != "NULL") ? `<@${faction.marechal}>` : "Vacant"}`, inline:true},{name:`:pray: Chapelain`, value:`${(faction.chapelain != "NULL") ? `<@${faction.chapelain}>` : "Vacant"}`, inline:true}, {name:`** **`, value:`** **`}])
            
             
             
            
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
                    embed.addFields([{name:`:crossed_swords: Guerre`, value:`${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} est actuellement en guerre contre ${faction.ennemy.charAt(0).toUpperCase() + faction.ennemy.slice(1)}`, inline:true}]);
                else
                    embed.addFields([{name:`:crossed_swords: Guerre`, value:`${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} n'est en guerre contre personne.`, inline:true}]);    

                //embed.addFields([{name:"** **", value:"** **", inline:true}]);

                if(faction.ally)
                    embed.addFields([{name:`:handshake: Alliance`, value:`${faction.ally}`, inline:true}]);
                else
                    embed.addFields([{name:`:handshake: Alliance`, value:`Aucune faction alliée.`, inline:true}]);

        
            if(message.channel.id == faction.channelid) {
                //embed.addFields([{name:`** **`, value:`** **`, inline:true}]);
                embed.addFields([{name:`** **`, value:`** **`},{name:`:moneybag: Coffre`, value:`${faction.bank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Poyn :coin:`, inline:true}, {name:`:money_with_wings: Taxe`, value:`${faction.taxe}%`, inline:true}])
               
            
                
                // points de faction. Pas encore en vigueur dans cette version
                // if(faction.factionid == 0) {            //Epsilon
                //     embed.addFields([{name:`:blue_heart: Points d'amitié avec Daïros`, value:`${faction.ptsami_dairos}`},{name:`:green_heart: Points d'amitié avec Lyomah`, value:`${faction.ptsami_lyomah}`},{name:`:yellow_heart: Points d'amitié avec Alpha`, value:`${faction.ptsami_alpha}`}]);
                    
                // } else if(faction.factionid == 1) {     //Daïros
                //     embed.addFields([{name:`:blue_heart: Points d'amitié avec Epsilon`, value:`${faction.ptsami_epsilon}`},{name:`:green_heart: Points d'amitié avec Lyomah`, value:`${faction.ptsami_lyomah}`},{name:`:yellow_heart: Points d'amitié avec Alpha`, value:`${faction.ptsami_alpha}`}]);
                    
                // } else if(faction.factionid == 2) {     //Lyomah
                //     embed.addFields([{name:`:blue_heart: Points d'amitié avec Epsilon`, value:`${faction.ptsami_epsilon}`},{name:`:green_heart: Points d'amitié avec Daïros`, value:`${faction.ptsami_dairos}`},{name:`:yellow_heart: Points d'amitié avec Alpha`, value:`${faction.ptsami_alpha}`}]);
                    
                // } else if(faction.factionid == 3) {     //Alpha
                //     embed.addFields([{name:`:blue_heart: Points d'amitié avec Epsilon`, value:`${faction.ptsami_epsilon}`},{name:`:green_heart: Points d'amitié avec Daïros`, value:`${faction.ptsami_dairos}`},{name:`:yellow_heart: Points d'amitié avec Lyomah`, value:`${faction.ptsami_lyomah}`}]);
                    
                // }
            } else {
                embed.addFields([{name:`** **`, value:`** **`, inline:true},{name:`:money_with_wings: Taxe`, value:`${faction.taxe}%`}]);
            }
            //lois de faction Pas encore en vigueur dans cette version
            //message.channel.send(`Lois de la faction en vigueur : ...`);

            

            message.channel.send({embeds:[embed]});
        }
        catch(e) { //Mettre le ICI! <-
            if(args.length)
                message.reply("Faction Inexistante.");
            client.writeLog(`Commande ${this.help.name} par ${message.author.tag} (${message.author.id}) | erreur catch: ${e} | (cette erreur provient souvent de l'argument qui n'est pas reconnu par le bot pour cette commande)`, "err");
        }
    });
}

module.exports.help = {
    name: "infosfaction",
    aliases: ['infofaction', 'infosfac', 'infofac'],
    category: "generalrpg",
    desription: "Donne toutes les infos sur une faction.",
    usage: '[faction]',
    cooldown: 3, 
    permissions: false,
    args: false
};