const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
module.exports.run = async (client, message, args) => {


    message.guild.members.fetch().then(async fetchAll => {
       
        

        const epsilon = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
        const dairos = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
        const lyomah = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
        const alpha = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));

        const dbEpsilon = await client.getFaction("epsilon");
        const dbDairos = await client.getFaction("daïros");
        const dbLyomah = await client.getFaction("lyomah");
        const dbAlpha = await client.getFaction("alpha");

        //poc
        let faction_array = null;
        let faction_color = "";
        let faction_name = "";
        let maitreiconURL = "";

        let array_de_tous = [];

        //récupération array des factions/membres
        if(!args[0]) {

            array_de_tous.push(Array.from(epsilon));
            array_de_tous.push(Array.from(dairos));
            array_de_tous.push(Array.from(lyomah));
            array_de_tous.push(Array.from(alpha));

            //faction_array = Array.from(epsilon).concat(Array.from(dairos).concat(Array.from(lyomah).concat(Array.from(alpha))));
            faction_color = '5E6366';
            faction_name = "au total dans toutes les factions";

        } else {
            if(args[0].toLowerCase() == "epsilon") {
                faction_color = 'AA3C00';
                faction_array = Array.from(epsilon);
                if(!dbEpsilon.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                else maitreiconURL = message.guild.members.cache.get(dbEpsilon.idmaitre).user.displayAvatarURL();
    
            } else if(args[0].toLowerCase() == "daïros" || args[0].toLowerCase() == "dairos") {
                faction_color = '0078F0';
                faction_array = Array.from(dairos);
                if(!dbDairos.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                else maitreiconURL = message.guild.members.cache.get(dbDairos.idmaitre).user.displayAvatarURL();
    
            } else if(args[0].toLowerCase() == "lyomah") {
                faction_color = '00A00A';
                faction_array = Array.from(lyomah);
                if(!dbLyomah.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                else maitreiconURL = message.guild.members.cache.get(dbLyomah.idmaitre).user.displayAvatarURL();
    
            } else if(args[0].toLowerCase() == "alpha") {
                faction_color = 'F0C800';
                faction_array = Array.from(alpha);
                if(!dbAlpha.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                else maitreiconURL = message.guild.members.cache.get(dbAlpha.idmaitre).user.displayAvatarURL();
            }

            faction_name = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
        }

        //création des embeds
        let embeds_array = [];

        if(!args[0]) { // toutes les factions

             // si on affiche tout, on affiche donc une première page d'info
    
             const embed_firstpage_all = new EmbedBuilder()
                .setAuthor({name:`${Array.from(epsilon).length + Array.from(dairos).length + Array.from(lyomah).length + Array.from(alpha).length} membres dans toutes les factions réunies`, iconURL:client.user.displayAvatarURL()})
                .setColor(faction_color)
                .addFields([{name: `** **`, value:`**${Array.from(epsilon).length}** membres dans **<@&415947454626660366>**`}, {name: `** **`, value:`**${Array.from(dairos).length}** membres dans **<@&415947455582961686>**`}, {name: `** **`, value:`**${Array.from(lyomah).length}** membres dans **<@&415947456342130699>**`}, {name: `** **`, value:`**${Array.from(alpha).length}** membres dans **<@&665340021640921099>**`}])

            embeds_array.unshift(embed_firstpage_all);

            let iter = 0;
            
            //on fait l'execution pour les 4 factions
            array_de_tous.forEach(faction_array => {

                iter++;

                if(iter == 1) { 
                    faction_name = "Epsilon"; 
                    faction_color = 'AA3C00'; 
                    message.channel.send(dbEpsilon.idmaitre)
                    if(!dbEpsilon.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                    else maitreiconURL = message.guild.members.cache.get(dbEpsilon.idmaitre).user.displayAvatarURL();
                }
                else if(iter == 2) { 
                    faction_name = "Daïros"; 
                    faction_color = '0078F0'; 
                    if(!dbDairos.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                    else maitreiconURL = message.guild.members.cache.get(dbDairos.idmaitre).user.displayAvatarURL();
                }
                else if(iter == 3) { 
                    faction_name = "Lyomah"; 
                    faction_color = '00A00A'; 
                    if(!dbLyomah.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                    else maitreiconURL = message.guild.members.cache.get(dbLyomah.idmaitre).user.displayAvatarURL();
                }
                else if(iter == 4) { 
                    faction_name = "Alpha"; 
                    faction_color = 'F0C800'; 
                    if(!dbAlpha.idmaitre) maitreiconURL = client.user.displayAvatarURL();
                    else maitreiconURL = message.guild.members.cache.get(dbAlpha.idmaitre).user.displayAvatarURL();
                }

                let faction_members = [];

                faction_array.forEach(element => {
                    let member = message.guild.members.cache.get(element[0]);
                    if(member.user.id == dbEpsilon.idmaitre || member.user.id == dbDairos.idmaitre || member.user.id == dbLyomah.idmaitre || member.user.id == dbAlpha.idmaitre) {
                        faction_members.push("<@" + member.user.id + "> :crown:");
                    } else {
                        faction_members.push(member);
                    }
                });
    
                let compteur = 0;
                let totalite = 0;
                let array_de_array = [];
                let array_traitement = [];
    
                const limit_per_page = 9; // ce chiffre + 1 = nombre de membre par page
    
                faction_members.forEach(e => {
                    totalite++;
                    compteur++;
    
                    if(faction_members.length == totalite) compteur += limit_per_page;
                    if(compteur > limit_per_page) {
                        array_traitement.push(e);
                        array_de_array.push(array_traitement);
                        array_traitement = [];
                        compteur = 0;
                    } else {
                        array_traitement.push(e);
                    }
                });
    
                let faction_embed = new EmbedBuilder()
                faction_embed.setColor(faction_color);
                
    
                let identifier = 0;
                array_de_array.forEach(e => {
                    
                    identifier++;
                    faction_embed.setAuthor({name:`${faction_members.length} membres ${faction_name}`, iconURL:maitreiconURL});
                    
                    faction_embed.addFields([{name: `** **`, value:` • ${e.join('\n • ')}`}]);
                    faction_embed.setFooter({text:`${identifier}/${array_de_array.length}`})
                    embeds_array.push(faction_embed);
                    faction_embed = new EmbedBuilder();
                    faction_embed.setColor(faction_color);
    
                    
                    
                    
                });
            });
            
        } else { // une seule faction

            let faction_members = [];
        
            faction_array.forEach(element => {
                let member = message.guild.members.cache.get(element[0]);
                if(member.user.id == dbEpsilon.idmaitre || member.user.id == dbDairos.idmaitre || member.user.id == dbLyomah.idmaitre || member.user.id == dbAlpha.idmaitre) {
                    faction_members.push("<@" + member.user.id + "> :crown:");
                } else {
                    faction_members.push(member);
                }
            });

            let compteur = 0;
            let totalite = 0;
            let array_de_array = [];
            let array_traitement = [];

            const limit_per_page = 9; // ce chiffre + 1 = nombre de membre par page

            faction_members.forEach(e => {
                totalite++;
                compteur++;
                

                if(faction_members.length == totalite) compteur += limit_per_page;
                if(compteur > limit_per_page) {
                    array_traitement.push(e);
                    array_de_array.push(array_traitement);
                    array_traitement = [];
                    compteur = 0;
                } else {
                    array_traitement.push(e);
                }
            });

            let faction_embed = new EmbedBuilder()
            faction_embed.setColor(faction_color);
            embeds_array = [];

            let identifier = 0;
            array_de_array.forEach(e => {
                
                identifier++;
                faction_embed.setAuthor({name:`${faction_members.length} membres ${faction_name}`, iconURL:maitreiconURL});
                
                faction_embed.addFields([{name: `** **`, value:` • ${e.join('\n • ')}`}]);
                faction_embed.setFooter({text:`${identifier}/${array_de_array.length}`})
                embeds_array.push(faction_embed);
                faction_embed = new EmbedBuilder();
                faction_embed.setColor(faction_color);
            });
        }
        

        // Affichage
        
        let index = 0;
        let last_index = embeds_array.length - 1;

        if(last_index != 0) { //n'affiche pas les boutons si y'a qu'une page

            const filter = i => (i.customId === 'gauche' || i.customId === 'droite') && i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 }); //2 minutes
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`gauche`)
                        .setLabel('🡠')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`droite`)
                        .setLabel('🡢')
                        .setStyle(ButtonStyle.Secondary)
                ); 
            await collector.on('collect', async i => {
                if(i.user.id != message.author.id) return;
                
                if(i.isButton()) {
                
                    if (i.customId === `gauche`) {
                        await i.deferUpdate();
                        if(index == 0) {
                            index = last_index;
                            await i.editReply({embeds:[embeds_array[index]] , components: [row] });
                        } else {
                            index--;
                            await i.editReply({embeds:[embeds_array[index]] , components: [row] });
                        }
                    }
                    if (i.customId === `droite`) {
                        await i.deferUpdate();
                        if(index == last_index) {
                            index = 0;
                            await i.editReply({embeds:[embeds_array[index]] , components: [row] });
                        } else {
                            index++;
                            await i.editReply({embeds:[embeds_array[index]] , components: [row] });
                        }
                    }
                   
                }
            });
            message.channel.send({embeds:[embeds_array[index]] , components: [row] }); //s'il y a plus d'une page
        } else {
            message.channel.send({embeds:[embeds_array[index]]}); // s'il n'y a qu'une page
        }
   });
}

module.exports.help = {
    name: "liste",
    aliases: ["membres"],
    category: "generalrpg",
    desription: "Renvoie la liste des membres d'une ou des factions.",
    usage: '[faction]',
    cooldown: 9, 
    permissions: false,
    args: false
};