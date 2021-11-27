const {MessageEmbed} = require("discord.js");

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

            const embed = new MessageEmbed()
            .setAuthor(`Faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}`, ppmaitre.user.displayAvatarURL())
            .addField(`:mortar_board: Maître`, maitre)
            .addField(`:busts_in_silhouette: Nombre de membres`, `${members.size}`, true)
            .addField(`:dart: Points de victoire`, `${faction.ptsvictoire}`, true)
            .addField(`** **`, `** **`);

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
                    embed.addField(`:crossed_swords: ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} est actuellement en guerre contre`, `${faction.ennemy.charAt(0).toUpperCase() + faction.ennemy.slice(1)}`);
                else
                    embed.addField(`:crossed_swords: ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} n'est en guerre contre personne.`, `Relations diplomatiques stables.`, true);    

                if(faction.ally)
                    embed.addField(`:heart: Allié`, `${faction.ally}`, true);
                else
                    embed.addField(`:heart: Allié`, `Aucune faction alliée.`, true);

        
            if(message.channel.id == faction.channelid) {
                embed.addField(`** **`, `** **`)
                .addField(`:bank: Bank`, `${faction.bank}`, true)
                .addField(`:money_with_wings: Taxe`, `${faction.taxe}`, true)
                .addField(`** **`, `** **`);
                
                if(faction.factionid == 0) {            //Epsilon
                    embed.addField(`:blue_heart: Points d'amitié avec Daïros`, `${faction.ptsami_dairos}`, true)
                    .addField(`:green_heart: Points d'amitié avec Lyomah`, `${faction.ptsami_lyomah}`, true)
                    .addField(`:yellow_heart: Points d'amitié avec Alpha`, `${faction.ptsami_alpha}`, true);
                } else if(faction.factionid == 1) {     //Daïros
                    embed.addField(`:orange_heart: Points d'amitié avec Epsilon`, `${faction.ptsami_epsilon}`, true)
                    .addField(`:green_heart: Points d'amitié avec Lyomah`, `${faction.ptsami_lyomah}`, true)
                    .addField(`:yellow_heart: Points d'amitié avec Alpha`, `${faction.ptsami_alpha}`, true);
                } else if(faction.factionid == 2) {     //Lyomah
                    embed.addField(`:orange_heart: Points d'amitié avec Epsilon`, `${faction.ptsami_epsilon}`, true)
                    .addField(`:blue_heart: Points d'amitié avec Daïros`, `${faction.ptsami_dairos}`, true)
                    .addField(`:yellow_heart: Points d'amitié avec Alpha`, `${faction.ptsami_alpha}`, true);
                } else if(faction.factionid == 3) {     //Alpha
                    embed.addField(`:orange_heart: Points d'amitié avec Epsilon`, `${faction.ptsami_epsilon}`, true)
                    .addField(`:blue_heart: Points d'amitié avec Daïros`, `${faction.ptsami_dairos}`, true)
                    .addField(`:green_heart: Points d'amitié avec Lyomah`, `${faction.ptsami_lyomah}`, true);
                }
            }
            message.channel.send(`Lois de la faction en vigueur : ...`);
            message.channel.send(`Gouvernement actuel : Conseillers ; Intendant ; Maréchal ; Chapelain`);

            message.channel.send({embeds:[embed]});
        }
        catch(e) { //Mettre le ICI! <-
            if(args.length)
                message.reply("Faction Inexistante");
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