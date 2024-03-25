const {EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder} = require("discord.js");

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

            
            const faction_points = await client.getAllFactionPoints(faction.name, message);
            //const faction_points = [1, 2, 3, 4, 5, 6, 7, 8]

            const embedPoints = new EmbedBuilder()
                .setAuthor({name:`Points de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}`, iconURL: ppmaitre.user.displayAvatarURL()})
                .addFields({name:`:crown: **Prestige**`, value: `${faction_points[0]}`, inline:true})
                .addFields({name:`:pray: **Piété**`, value: `${faction_points[1]}`, inline:true})
                .addFields({name:'** **', value:'** **'})

                .addFields({name:`:gem: **Richesse**`, value:`${faction_points[2]}`, inline:true})
                .addFields({name:`:dart: **Redoutabilité**`, value:`${faction_points[3]}`, inline:true})
                .addFields({name:'** **', value:'** **'})

                .addFields({name:`:muscle: **Forme**`, value:`${faction_points[4]}`, inline:true})
                .addFields({name:`:sunflower: **Moral**`, value:`${faction_points[5]}`, inline:true})
                .addFields({name:'** **', value:'** **'})

                .addFields({name:`:pick: **Travail**`, value:`${faction_points[6]}`, inline:true})
                .addFields({name:`:brain: **Savoir**`, value:`${faction_points[7]}`, inline:true})
            


            const embed = new EmbedBuilder()
            .setAuthor({name:`Faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}`, iconURL: ppmaitre.user.displayAvatarURL()})
            .addFields([{name:`:mortar_board: Maître`, value:`${maitre}`, inline:true}, {name:`:busts_in_silhouette: Nombre de membres`, value:`${members.size}`, inline:true}, {name:`** **`, value:`** **`, inline:true}])
            .addFields([{name:`:coin: Intendant`, value:`${(faction.intendant != "NULL") ? `<@${faction.intendant}>` : "Vacant"}`, inline:true},  {name:`:dagger: Maréchal`, value:`${(faction.marechal != "NULL") ? `<@${faction.marechal}>` : "Vacant"}`, inline:true},{name:`:pray: Chapelain`, value:`${(faction.chapelain != "NULL") ? `<@${faction.chapelain}>` : "Vacant"}`, inline:true}, {name:`** **`, value:`** **`}])
            
             
             
            
                //Couleurs
                if(faction.factionid == 0)   {       //Epsilon
                    embed.setColor('AA3C00');
                    embedPoints.setColor('AA3C00');
                }
                else if(faction.factionid == 1) {    //Daïros
                    embed.setColor('0078F0');
                    embedPoints.setColor('0078F0');
                }
                else if(faction.factionid == 2) {    //Lyomah
                    embed.setColor('00A00A');
                    embedPoints.setColor('00A00A');
                }
                else if(faction.factionid == 3){     //Alpha
                    embed.setColor('F0C800');
                    embedPoints.setColor('F0C800');
                }

        
            if(message.channel.id == faction.channelid) {
                //embed.addFields([{name:`** **`, value:`** **`, inline:true}]);
                embed.addFields([{name:`:moneybag: Coffre`, value:`${faction.bank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Poyn :coin:`, inline:true}, {name:`:money_with_wings: Taxe`, value:`${faction.taxe}%`, inline:true}])
               
            
                
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
                embed.addFields([{name:`:money_with_wings: Taxe`, value:`${faction.taxe}%`}]);
            }
            //lois de faction Pas encore en vigueur dans cette version
            //message.channel.send(`Lois de la faction en vigueur : ...`);

            const rel_e = await client.getRelation(faction.name, "epsilon");
            const rel_d = await client.getRelation(faction.name, "daïros");
            const rel_l = await client.getRelation(faction.name, "lyomah");
            const rel_a = await client.getRelation(faction.name, "alpha");

            const fields = [
                [
                    {name:`Daïros`,value:`**${rel_d.display_name}** \n${rel_d.description}`, inline:true},
                    {name:`Lyomah`,value:`**${rel_l.display_name}** \n${rel_l.description}`, inline:true},
                    {name:`Alpha`,value:`**${rel_a.display_name}** \n${rel_a.description}`, inline:true}
                ],
                [
                    {name:`Epsilon`,value:`**${rel_e.display_name}** \n${rel_e.description}`, inline:true},
                    {name:`Lyomah`,value:`**${rel_l.display_name}** \n${rel_l.description}`, inline:true},
                    {name:`Alpha`,value:`**${rel_a.display_name}** \n${rel_a.description}`, inline:true}
                ],
                [
                    {name:`Epsilon`,value:`**${rel_e.display_name}** \n${rel_e.description}`, inline:true},
                    {name:`Daïros`,value:`**${rel_d.display_name}** \n${rel_d.description}`, inline:true},
                    {name:`Alpha`,value:`**${rel_a.display_name}** \n${rel_a.description}`, inline:true}
                ],
                [
                    {name:`Epsilon`,value:`**${rel_e.display_name}** \n${rel_e.description}`, inline:true},
                    {name:`Daïros`,value:`**${rel_d.display_name}** \n${rel_d.description}`, inline:true},
                    {name:`Lyomah`,value:`**${rel_l.display_name}** \n${rel_l.description}`, inline:true}
                ]
            ]

            embed.addFields({name:"** **", value:"** **"},{name:"RELATIONS", value:"** **"});
            embed.addFields(fields[faction.factionid]);
            

            const pages = [embed, embedPoints];
            index = 0;

            const filter = i => (i.customId === `infofacgauche` + message.author.id + dateActuel || i.customId === `infofacdroite` + message.author.id + dateActuel) && i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 }); //1 minute

            const dateActuel = new Date();

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`infofacgauche` + message.author.id + dateActuel)
                        .setLabel('🡠')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`infofacdroite` + message.author.id + dateActuel)
                        .setLabel('🡢')
                        .setStyle(ButtonStyle.Secondary)
                ); 


            await collector.on('collect', async i => {
                //console.log(`Debug: isButton : ${i.isButton()} | isSelectMenu: ${i.isSelectMenu()} | i.user.id: ${i.user.id} | message.author.id: ${message.author.id} | i.customId: ${i.customId} | endsWith: ${i.customId.endsWith(i.user.id)}`);
                if(i.user.id != message.author.id) return;
                
                if(i.isButton()) {
                    //console.log("Button");
                    if (i.customId === `infofacgauche` + i.user.id + dateActuel || i.customId === `infofacdroite` + i.user.id + dateActuel) {
                            await i.deferUpdate();
                            await i.editReply({embeds:[pages[(index == 0) ? 1 : 0]], components: [row] });
                            //console.log(client.getAllFactionPoints("epsilon", message)[0]);

                            if(index == 0) index = 1;
                            else index = 0;
                    }
                }
            });
            
            message.channel.send({embeds:[embed], components:[row]});
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