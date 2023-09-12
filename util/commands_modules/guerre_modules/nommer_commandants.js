const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

let epsilon = "";

//cahier des charges (fait !):
/*
    - Gérer toutes les faction, pas que epsilon
    - Gérer plusieurs pages de membres. Ne pas faire en page mais en genre de scroll (en gros n'afficher que les 5 premiers mais si on descends ça va afficher un de plus en bas mais un de moins en haut et inversement)
    - Faire en sorte que si on monte alors qu'on est tout en haut, on arrive tout en bas.
    - Et bien sur le bouton "Nommer"
    - Et ajouter un bouton "Démettre" (destituer de sa fonction de commandant)
*/

const nommer_commandants = async (client, message, dbUser) => {

    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. Romar1#8485)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }

    const roleEpsilon = message.guild.roles.cache.get('415947454626660366');
    const roleDairos = message.guild.roles.cache.get('415947455582961686');
    const roleLyomah = message.guild.roles.cache.get('415947456342130699');
    const roleAlpha = message.guild.roles.cache.get('665340021640921099');



    let faction = await client.getFaction(dbUser.faction);
    var selected_flanc = 0;
    var selected_flanc_string = "gauche";

    let membersFaction = "";


    if(dbUser.faction == "epsilon") membersFaction = roleEpsilon.members.map(member => member);
    if(dbUser.faction == "daïros") membersFaction = roleDairos.members.map(member => member);
    if(dbUser.faction == "lyomah") membersFaction = roleLyomah.members.map(member => member);
    if(dbUser.faction == "alpha") membersFaction = roleAlpha.members.map(member => member);
    //console.log(membersWithRole);


    // for(let x = 0; x < 9; x++) {

    //     if(x == index) {
    //         fields.push({name:`** **`, value:`-> ${x}`});
    //     } else {
    //         fields.push({name:`** **`, value:`${x}`});
    //     }
    // }

    const rowChoixUtilisateur = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnhaut` + message.author.id)
            .setLabel('Avant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnbas` + message.author.id)
            .setLabel('Après')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnnommer` + message.author.id)
            .setLabel('Nommer')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`btndestituer` + message.author.id)
            .setLabel('Destituer')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Secondary)
    ); 

    const choixFlanc = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectFlanc' + message.author.id)
					.setPlaceholder('Choisissez un flanc à éditer...') 
					.addOptions(     
						{
							label: '⬅️ Gauche',
							description: 'Selectionnez le flanc gauche',
							value: 'slc_flanc_gauche' + message.author.id,
						},
						{
							label: '⬆️ Central',
							description: 'Selectionnez le flanc central',
							value: 'slc_flanc_centre' + message.author.id,
						},
                        {
							label: '➡️ Droit',
							description: 'Selectionnez le flanc droit',
							value: 'slc_flanc_droit' + message.author.id,
						}
					),
			);

    var fields = [];

    var index = 0;
    var iterations = 0;

    // Faire comme les persos mudae pour afficher les membres. en mode $mmi
        // membersEpsilon.forEach(element => {
        //     //let member = message.guild.members.cache.get(element[0]);
        //         if(iterations == index) {
        //             fields.push({name:`** **`, value:`:point_right: **${element}** ${(faction.commandants.indexOf(element.user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(element.user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(element.user.id) == 2) ? " **- Commandant flanc droit**" : ""}`});
        //         } else {
        //             fields.push({name:`** **`, value:`${element} ${(faction.commandants.indexOf(element.user.id) == 0) ? " - Commandant flanc gauche" : ""} ${(faction.commandants.indexOf(element.user.id) == 1) ? " - Commandant flanc central" : ""} ${(faction.commandants.indexOf(element.user.id) == 2) ? " - Commandant flanc droit" : ""}`});
        //         }
        //         iterations++;
            
        // });

        var embed_commandants = new EmbedBuilder()
            .setColor('3C4C66')
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
            .setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`)
            .setDescription(`${membersFaction[index]} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 2) ? " **- Commandant flanc droit**" : ""}`)
            .setImage(membersFaction[index].user.displayAvatarURL())
    
        
        


    const filter = i => (
        i.customId === 'btnhaut' + message.author.id || 
        i.customId === 'btnbas' + message.author.id || 
        i.customId === 'btnnommer' + message.author.id ||
        i.customId === 'btndestituer' + message.author.id ||

        i.customId === 'selectFlanc' + message.author.id ||
        i.customId === 'btnretour' + message.author.id) && 
        i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 900000 }); //15 minutes

    await collector.on('collect', async i => {

        if(i.isButton()) {
            if(i.customId == "btnretour" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({components:[]})

                message.reply({content: `S'il y a eu des changements ils ont bien été pris en compte.`, ephemeral:true})
                collector.stop();
            }


            if(i.customId == "btnnommer" + i.user.id) {
                await i.deferUpdate();

                let dbCommandants = faction.commandants;
                console.log(dbCommandants);

                let newDbCommandants = dbCommandants;
                newDbCommandants[selected_flanc] = membersFaction[index].user.id;

                await client.updateFaction(dbUser.faction, {commandants: newDbCommandants});
                faction = await client.getFaction(dbUser.faction);

                embed_commandants = new EmbedBuilder()
                    .setColor('3C4C66')
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`)
                    .setDescription(`${membersFaction[index]} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 2) ? " **- Commandant flanc droit**" : ""}`)
                    .setImage(membersFaction[index].user.displayAvatarURL())

 
                await i.editReply({embeds:[embed_commandants], components:[rowChoixUtilisateur, choixFlanc]}) 

            }

            if(i.customId == "btndestituer" + i.user.id) {
                

                let dbCommandants = faction.commandants;
                console.log(dbCommandants);

                let newDbCommandants = dbCommandants;

                if(dbCommandants.indexOf(membersFaction[index].user.id) != -1) {
                    newDbCommandants[dbCommandants.indexOf(membersFaction[index].user.id)] = "NULL";
                

                    await client.updateFaction(dbUser.faction, {commandants: newDbCommandants});
                    faction = await client.getFaction(dbUser.faction);

                    embed_commandants = new EmbedBuilder()
                        .setColor('3C4C66')
                        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                        .setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`)
                        .setDescription(`${membersFaction[index]} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 2) ? " **- Commandant flanc droit**" : ""}`)
                        .setImage(membersFaction[index].user.displayAvatarURL())

                    await i.deferUpdate();
                    await i.editReply({embeds:[embed_commandants], components:[rowChoixUtilisateur, choixFlanc]}) 
                } else {
                    await i.reply({content:`Cet utilisateur n'est commandant d'aucune de vos armées.`, ephemeral: true})
                }

            }

            if(i.customId == "btnhaut" + i.user.id) {

                await i.deferUpdate();
                index--;
                if(index < 0) index = 0;
                fields = [];
                iterations = 0;

                // membersEpsilon.forEach(element => {
                //     //let member = message.guild.members.cache.get(element[0]);
                //     if(iterations == index) {
                //         fields.push({name:`** **`, value:`:point_right: **${element}** ${(faction.commandants.indexOf(element.user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(element.user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(element.user.id) == 2) ? " **- Commandant flanc droit**" : ""}`});
                //     } else {
                //         fields.push({name:`** **`, value:`${element} ${(faction.commandants.indexOf(element.user.id) == 0) ? " - Commandant flanc gauche" : ""} ${(faction.commandants.indexOf(element.user.id) == 1) ? " - Commandant flanc central" : ""} ${(faction.commandants.indexOf(element.user.id) == 2) ? " - Commandant flanc droit" : ""}`});
                //     }
                //     iterations++;
                // });
        
                embed_commandants = new EmbedBuilder()
                    .setColor('3C4C66')
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`)
                    .setDescription(`${membersFaction[index]} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 2) ? " **- Commandant flanc droit**" : ""}`)
                    .setImage(membersFaction[index].user.displayAvatarURL())

 
                await i.editReply({embeds:[embed_commandants], components:[rowChoixUtilisateur, choixFlanc]})   
            }
            if(i.customId == "btnbas" + i.user.id) {

                await i.deferUpdate();
                index++;
                
                if(index > membersFaction.length - 1) index = 0;
                fields = [];
                iterations = 0;
        
                // embed_commandants = new EmbedBuilder()
                //     .setColor('3C4C66')
                //     .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                //     .setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`)
                //     .addFields(fields);
                embed_commandants = new EmbedBuilder()
                    .setColor('3C4C66')
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`)
                    .setDescription(`${membersFaction[index]} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 0) ? " **- Commandant flanc gauche**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 1) ? " **- Commandant flanc central**" : ""} ${(faction.commandants.indexOf(membersFaction[index].user.id) == 2) ? " **- Commandant flanc droit**" : ""}`)
                    .setImage(membersFaction[index].user.displayAvatarURL())
 
                await i.editReply({embeds:[embed_commandants], components:[rowChoixUtilisateur, choixFlanc]})   
            }
            
        }

        if(i.isStringSelectMenu()) { 

            if(i.customId == "selectFlanc" + i.user.id) {
                
                if(i.values == "slc_flanc_gauche" + i.user.id) {
                    selected_flanc = 0;
                    selected_flanc_string = "gauche"
                } else if(i.values == "slc_flanc_centre" + i.user.id) {
                    selected_flanc = 1;
                    selected_flanc_string = "central"
                } else if(i.values == "slc_flanc_droit" + i.user.id) {
                    selected_flanc = 2;
                    selected_flanc_string = "droit"
                }
    
                embed_commandants.setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`);
                
                await i.deferUpdate();
                await i.editReply({embeds:[embed_commandants], components:[rowChoixUtilisateur, choixFlanc]})
                
            }
        }
        
    });

    await collector.on('end', async i => {
        global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
        return;
    });

    message.channel.send({embeds:[embed_commandants], components:[rowChoixUtilisateur, choixFlanc]});



    

    






}

module.exports = {
    nommer_commandants
}