const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    
    /*
     rendre cette fonction plus intéressante. En gros, au lieu d'envoyer en mission en pigant le joueur, on pourra sélectionner le membre de notre choix
     et en fonction de qui c'est, ses rôles, son métier et tout, différentes missions seront disponibles
     par exemple, le chapelain pourra effectuer des missions relatives à la relgion
     on peut bien sur s'envoyer nous même en mission quand on fait parti du conseil.
     attention cette commande ne sera utilisable que par les conseillers bien sur !
     les membres doivent se soumettre (en alpha du moins, car en bêta peut être qu'il faudra une certaine loi de faction) 
     */
    //* note, ce todo n'est pas le cahier des charges complet. Voir l'entrée du project InDev de PouleRPG

     //* Note de dev: réutilisser le système qui permet de nommer des commandants. Sauf qu'au lieu de nommer on sélectionne pour choisir une mission ensuite.
    //message.reply("Cette commande ne sera disponnible que dans une future mise à jour.");

    //TODO Bêta: Il faudra également une sous-commande pour lister les membres partis en mission, pour combien de temps ils en ont encore, et évidemment s'ils ont finit cela donne les "récompenses" et "résultats".
    
    

    const roleEpsilon = message.guild.roles.cache.get('415947454626660366');
    const roleDairos = message.guild.roles.cache.get('415947455582961686');
    const roleLyomah = message.guild.roles.cache.get('415947456342130699');
    const roleAlpha = message.guild.roles.cache.get('665340021640921099');

    let faction = await client.getFaction(dbUser.faction);
    
    let membersFaction = "";


    if(dbUser.faction == "epsilon") membersFaction = roleEpsilon.members.map(member => member);
    if(dbUser.faction == "daïros") membersFaction = roleDairos.members.map(member => member);
    if(dbUser.faction == "lyomah") membersFaction = roleLyomah.members.map(member => member);
    if(dbUser.faction == "alpha") membersFaction = roleAlpha.members.map(member => member);
   

    const rowChoixUtilisateur = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnprevious` + message.author.id)
            .setLabel('Précédant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnnext` + message.author.id)
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnselect` + message.author.id)
            .setLabel('Sélectionner')
            .setStyle(ButtonStyle.Success),
        
        new ButtonBuilder()
            .setCustomId(`btnquitter` + message.author.id)
            .setLabel('Quitter')
            .setStyle(ButtonStyle.Danger)
    ); 


    // const missions_chapelain  = new ActionRowBuilder()
	// 		.addComponents(
	// 			new StringSelectMenuBuilder()
	// 				.setCustomId('selectMission_chapelain' + message.author.id)
	// 				.setPlaceholder('Choisissez une mission à faire...') 
	// 				.addOptions(     
	// 					{
	// 						label: 'Fabriquer casus belli hérésie',
	// 						description: 'Fabriquer un casus belli envers une faction hérétique.',
	// 						value: 'slc_casbel_heresie' + message.author.id,
	// 					},
	// 					{
	// 						label: 'Faire du prosélitysme',
	// 						description: 'Tentez d\'améliorer les relations religieuses des membres de votre faction',
	// 						value: 'slc_proselitysme' + message.author.id,
	// 					}
	// 				),
	// 		);

    



    var index = 0;
    var iterations = 0;

    //console.log(membersFaction[index]);
        var embed_mission = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Choisissez un membre à envoyer en mission.`)
        .setDescription(`${membersFaction[index]} ${(await client.isConseiller(membersFaction[index], 901) == true) ? "- **Maréchal** :dagger:" : ""} ${(await client.isConseiller(membersFaction[index], 902) == true) ? "- **Intendant** :coin:" : ""} ${(await client.isConseiller(membersFaction[index], 903) == true) ? "- **Chapelain** :pray:" : ""} ${(await client.isMaitre(membersFaction[index]) == true) ? "- **Maître " + dbUser.faction + "** :mortar_board:" : ""}`)
        .setImage(membersFaction[index].user.displayAvatarURL())
         
    
        
        


    const filter = i => (
        i.customId === 'btnprevious' + message.author.id || 
        i.customId === 'btnnext' + message.author.id || 
        i.customId === 'btnselect' + message.author.id ||
        i.customId === 'btnquitter' + message.author.id ||

        i.customId === 'selectMission_chapelain' + message.author.id) && 
        i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 }); //2 minutes

    await collector.on('collect', async i => {

        if(i.isButton()) {

            if(i.customId == "btnquitter" + i.user.id)  {
                await i.deferUpdate();
                embed_mission = new EmbedBuilder()
                .setColor('3C4C66')
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setTitle(`Choisissez un membre à envoyer en mission.`)
                .setDescription(`${membersFaction[index]} ${(await client.isConseiller(membersFaction[index], 901) == true) ? "- **Maréchal** :dagger:" : ""} ${(await client.isConseiller(membersFaction[index], 902) == true) ? "- **Intendant** :coin:" : ""} ${(await client.isConseiller(membersFaction[index], 903) == true) ? "- **Chapelain** :pray:" : ""} ${(await client.isMaitre(membersFaction[index]) == true) ? "- **Maître " + dbUser.faction + "** :mortar_board:" : ""}`)
                .setImage(membersFaction[index].user.displayAvatarURL())
                 

 
                await i.editReply({embeds:[embed_mission], components:[]}) 
                collector.stop();

                return;
            }
            
            if(i.customId == "btnprevious" + i.user.id) {

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
        
                embed_mission = new EmbedBuilder()
                .setColor('3C4C66')
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setTitle(`Choisissez un membre à envoyer en mission.`)
                .setDescription(`${membersFaction[index]} ${(await client.isConseiller(membersFaction[index], 901) == true) ? "- **Maréchal** :dagger:" : ""} ${(await client.isConseiller(membersFaction[index], 902) == true) ? "- **Intendant** :coin:" : ""} ${(await client.isConseiller(membersFaction[index], 903) == true) ? "- **Chapelain** :pray:" : ""} ${(await client.isMaitre(membersFaction[index]) == true) ? "- **Maître " + dbUser.faction + "** :mortar_board:" : ""}`)
                .setImage(membersFaction[index].user.displayAvatarURL())
                 

 
                await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur]})   
            }
            if(i.customId == "btnnext" + i.user.id) {

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
                embed_mission = new EmbedBuilder()
                .setColor('3C4C66')
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setTitle(`Choisissez un membre à envoyer en mission.`)
                .setDescription(`${membersFaction[index]} ${(await client.isConseiller(membersFaction[index], 901) == true) ? "- **Maréchal** :dagger:" : ""} ${(await client.isConseiller(membersFaction[index], 902) == true) ? "- **Intendant** :coin:" : ""} ${(await client.isConseiller(membersFaction[index], 903) == true) ? "- **Chapelain** :pray:" : ""} ${(await client.isMaitre(membersFaction[index]) == true) ? "- **Maître " + dbUser.faction + "** :mortar_board:" : ""}`)
                .setImage(membersFaction[index].user.displayAvatarURL())
                 
                
                 
                
                await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur]})   
            }

            if(i.customId == "btnselect" + i.user.id) {

                await i.deferUpdate();

                embed_mission = new EmbedBuilder()
                .setColor('3C4C66')
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setTitle(`Choisissez un membre à envoyer en mission.`)
                .setDescription(`${membersFaction[index]} ${(await client.isConseiller(membersFaction[index], 901) == true) ? "- **Maréchal** :dagger:" : ""} ${(await client.isConseiller(membersFaction[index], 902) == true) ? "- **Intendant** :coin:" : ""} ${(await client.isConseiller(membersFaction[index], 903) == true) ? "- **Chapelain** :pray:" : ""} ${(await client.isMaitre(membersFaction[index]) == true) ? "- **Maître " + dbUser.faction + "** :mortar_board:" : ""}`)
                .setImage(membersFaction[index].user.displayAvatarURL())
                 
                
                // if(faction.marechal == membersFaction[index].user.id) {
                //     await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur, missions_marechal]})   

                // }
                // if(faction.intendant == membersFaction[index].user.id) {
                //     await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur, missions_intendant]})   

                // }
                if(faction.chapelain == membersFaction[index].user.id) { //si on selectionne le chapelain
                    //await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur, missions_chapelain]})   

                }
                // if(faction.idmaitre == membersFaction[index].user.id) {
                //     await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur, missions_maitre]})   
                // }
                //collector.stop();
                await SelectMission(membersFaction[index], faction, client, message, args, settings, dbUser, i, membersFaction, index, collector);
        
                
                
                
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
    
                //embed_mission.setTitle(`Nommer Commandant flanc : ${selected_flanc_string}`);
                
                await i.deferUpdate();
                await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur]})
                
            }
        }
        
    });

    await collector.on('end', async i => {
        //return;
    });

    message.channel.send({embeds:[embed_mission], components:[rowChoixUtilisateur]});


}

module.exports.help = {
    name: "mission",
    aliases: ["décision", "tache"],
    category: "geography",
    desription: "Effectuez diverses actions ou faites les faire par vos membres.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
    gouvernement: true
};


async function SelectMission(selected_member, dbFaction, client, message, args, settings, dbUser, interaction, membersFaction, index_selectedMember, first_coll) {

    //ROW pour les MISSIONS, donc la liste des missions.
    const rowSelector = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnprec` + message.author.id)
            .setLabel('Précédant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnsuiv` + message.author.id)
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnsel` + message.author.id)
            .setLabel('Sélectionner')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`btnret` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Danger)
    ); 
    const rowSelectorNoMission = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setCustomId(`btnret` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Danger)
    ); 

    //Row pour le RETOUR, donc la liste des membres
    const rowChoixUtilisateur = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnprevious` + message.author.id)
            .setLabel('Précédant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnnext` + message.author.id)
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnselect` + message.author.id)
            .setLabel('Sélectionner')
            .setStyle(ButtonStyle.Success),
        
        new ButtonBuilder()
            .setCustomId(`btnquitter` + message.author.id)
            .setLabel('Quitter')
            .setStyle(ButtonStyle.Danger)
    );
    
    var liste_missions = require("../../assets/rpg/missions/missions_users.json");
    var type_of_mission_file = "users";

    if(selected_member.user.id == dbFaction.chapelain) {
        liste_missions = require("../../assets/rpg/missions/missions_chapelain.json");
        type_of_mission_file = "chapelain";
    } else if(selected_member.user.id == dbFaction.marechal) {
        liste_missions = require("../../assets/rpg/missions/missions_marechal.json");
        type_of_mission_file = "marechal";
    } else if(selected_member.user.id == dbFaction.intendant) {
        liste_missions = require("../../assets/rpg/missions/missions_intendant.json");
        type_of_mission_file = "intendant";
    } else if(selected_member.user.id == dbFaction.idmaitre) {
        liste_missions = require("../../assets/rpg/missions/missions_maitre.json");
        type_of_mission_file = "maitre";
    }

    var selec_id_mission = 0;


    //TODO-Réflexion: Mais du coup en Alpha on devrait aussi pouvoir en tant que membre faire des missions "users" ?? En vu des missions des métiers (remarque ces derniers auront leur fichier à part évidemment.)

    var embed_liste_missions = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${selected_member.user.username}`, iconURL: selected_member.user.displayAvatarURL()}) 
        .setTitle(`Choisissez une mission pour ce membre.`)
        .setDescription(`**${liste_missions[selec_id_mission].name}**\n\n${liste_missions[selec_id_mission].description}\n\nDurée: **${Math.floor(liste_missions[selec_id_mission].duration_ms / (1000*60*60))}** heures, **${Math.floor((liste_missions[selec_id_mission].duration_ms % (1000*60*60)) / (1000*60))}** minutes et **${Math.floor((liste_missions[selec_id_mission].duration_ms % (1000*60)) / 1000)}** secondes`);
        //.setImage(membersFaction[index].user.displayAvatarURL())
    
    var embed_liste_no_mission = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${selected_member.user.username}`, iconURL: selected_member.user.displayAvatarURL()})
        .setTitle(`Ce membre n'a aucune mission qu'il puisse faire`)
        .setDescription(`Choisissez un autre membre.`);
        //.setImage(membersFaction[index].user.displayAvatarURL())
    
         
    if(liste_missions[selec_id_mission].id == -1) { //valeur qui définit qu'il n'y a PAS de mission
        await interaction.editReply({embeds:[embed_liste_no_mission], components:[rowSelectorNoMission]})   
    } else {
        await interaction.editReply({embeds:[embed_liste_missions], components:[rowSelector]})   
    }


    let index = index_selectedMember;
    let embed_mission = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Choisissez un membre à envoyer en mission.`)
        .setDescription(`${membersFaction[index]} ${(await client.isConseiller(membersFaction[index], 901) == true) ? "- **Maréchal** :dagger:" : ""} ${(await client.isConseiller(membersFaction[index], 902) == true) ? "- **Intendant** :coin:" : ""} ${(await client.isConseiller(membersFaction[index], 903) == true) ? "- **Chapelain** :pray:" : ""} ${(await client.isMaitre(membersFaction[index]) == true) ? "- **Maître " + dbUser.faction + "** :mortar_board:" : ""}`)
        .setImage(membersFaction[index].user.displayAvatarURL())
                 


        const filter = i => (
            i.customId === 'btnprec' + message.author.id ||
            i.customId === 'btnsuiv' + message.author.id ||
            i.customId === 'btnret' + message.author.id ||
            i.customId === 'btnsel' + message.author.id) && 
            i.user.id === message.author.id;
        const second_collector = message.channel.createMessageComponentCollector({ filter, time: 120000 }); //2 minutes
    
        await second_collector.on('collect', async i => {
    
            if(i.isButton()) {
                
                if(i.customId == "btnret" + i.user.id) {
    
                    await i.deferUpdate();
                    await i.editReply({embeds:[embed_mission], components:[rowChoixUtilisateur]});
                    second_collector.stop();
                }

                if(i.customId == "btnprec" + i.user.id) {
    
                    await i.deferUpdate();

                    //console.log(liste_missions.length);
                    selec_id_mission = selec_id_mission - 1;
                    if(selec_id_mission < 0) selec_id_mission = liste_missions.length -1;

                    embed_liste_missions = new EmbedBuilder()
                        .setColor('3C4C66')
                        .setAuthor({name: `${selected_member.user.username}`, iconURL: selected_member.user.displayAvatarURL()})
                        .setTitle(`Choisissez une mission pour ce membre.`)
                        .setDescription(`**${liste_missions[selec_id_mission].name}**\n\n${liste_missions[selec_id_mission].description}\n\nDurée: **${Math.floor(liste_missions[selec_id_mission].duration_ms / (1000*60*60))}** heures, **${Math.floor((liste_missions[selec_id_mission].duration_ms % (1000*60*60)) / (1000*60))}** minutes et **${Math.floor((liste_missions[selec_id_mission].duration_ms % (1000*60)) / 1000)}** secondes`);
                        //.setImage(membersFaction[index].user.displayAvatarURL())

                    await i.editReply({embeds:[embed_liste_missions], components:[rowSelector]});
                    
                }
                if(i.customId == "btnsuiv" + i.user.id) {
    
                    await i.deferUpdate();

                    selec_id_mission = selec_id_mission + 1;
                    if(selec_id_mission > liste_missions.length -1) selec_id_mission = 0;

                    embed_liste_missions = new EmbedBuilder()
                        .setColor('3C4C66')
                        .setAuthor({name: `${selected_member.user.username}`, iconURL: selected_member.user.displayAvatarURL()})
                        .setTitle(`Choisissez une mission pour ce membre.`)
                        .setDescription(`**${liste_missions[selec_id_mission].name}**\n\n${liste_missions[selec_id_mission].description}\n\nDurée: **${Math.floor(liste_missions[selec_id_mission].duration_ms / (1000*60*60))}** heures, **${Math.floor((liste_missions[selec_id_mission].duration_ms % (1000*60*60)) / (1000*60))}** minutes et **${Math.floor((liste_missions[selec_id_mission].duration_ms % (1000*60)) / 1000)}** secondes`);
                        //.setImage(membersFaction[index].user.displayAvatarURL())

                    await i.editReply({embeds:[embed_liste_missions], components:[rowSelector]});
                    
                    
                }
                if(i.customId == "btnsel" + i.user.id) {
                    await i.deferUpdate();

                    let dbSelectedUser = await client.getUser(selected_member);
                    const dt = new Date();

                    //Modifie ICI les states si on a terminé le timer.
                    //*noter le caractère "<" dans l'autre sens qui montre qu'il faut que ce soit dans le passé la date activity et non le futur !
                    if(dbSelectedUser.cooldown_activity.getTime() < dt.getTime()) {
                        console.log("La date est passé ! " + dbSelectedUser.cooldown_activity.getTime() + " DT: " + dt.getTime())
                        await client.updateUser(selected_member, {state_travail: false});
                        await client.updateUser(selected_member, {state_entrainement: false});
                        await client.updateUser(selected_member, {state_expedition: false});

                        let localisation_fac = dbUser.localisation_expedition;

                        if(dbUser.localisation_expedition != "NULL") {
                            // retire le membre des joueurs sur le territoire de la faction.
                            let faction_exped = await client.getFaction(localisation_fac);
                            if(faction_exped.name != dbUser.faction) {

                                let arr = faction_exped.joueurs_sur_le_territoire;
                                arr = arr.filter(e => e !== dbUser.userID);

                                await client.updateFaction(faction_exped.name, {joueurs_sur_le_territoire: arr});
                            }
                        }
        
        await client.updateUser(message.member, {localisation_expedition: "NULL"});



                        await client.updateUser(selected_member, {state_mission: false});
                    }

                    //reload la db
                    dbSelectedUser = await client.getUser(selected_member);
                    const remaining_time_ms = dbSelectedUser.cooldown_activity.getTime() - dt.getTime();
                    const remaining_time_str = `**${Math.floor(remaining_time_ms / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(remaining_time_ms / (1000*60*60) % 24)}** heures, **${Math.floor(remaining_time_ms / (1000*60) % 60)}** minutes et **${Math.floor(remaining_time_ms / (1000) % 60)}** secondes`

                     
                    //if(dbSelectedUser.expedition_duration != 0) {
                    if(dbSelectedUser.state_expedition == true) {
                        await i.editReply({content: "Vous ne pouvez pas envoyer ce joueur en mission il est en expédition. Il reviendra dans: " + remaining_time_str, embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;
                    }
                    
                    if(dbSelectedUser.in_jail == 'true') {
                        await i.editReply({content: "Vous ne pouvez pas envoyer ce joueur en mission il est aux cachots.", embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;
                    }

                    //TEMP DEV RETOURNER LE >
                    //if(dbSelectedUser.cooldown_mission.getTime() > dt.getTime()) {
                    if(dbSelectedUser.state_mission == true) {
                        await i.editReply({content: "Vous ne pouvez pas envoyer ce joueur en mission il est déjà en mission. Il reviendra dans: " + remaining_time_str, embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;
                    }

                    if(dbSelectedUser.state_entrainement == true) {
                        await i.editReply({content: "Vous ne pouvez pas envoyer ce joueur en mission car il s'entraine. Il aura terminé dans: " + remaining_time_str, embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;
                    }

                    if(dbSelectedUser.state_travail == true) {
                        await i.editReply({content: "Vous ne pouvez pas envoyer ce joueur en mission car il travail Il aura terminé dans: " + remaining_time_str, embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;
                    }

                    


                    
                    

                    if(type_of_mission_file == "marechal" && dbUser.metier != 901 && dbUser.metier != 904) { //si on est maréchal et qu'on choisis autre chose que maréchal
                        await i.editReply({content: 'En tant que Maréchal vous ne pouvez envoyer personne d\'autre que vous en mission.', embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;

                    } else if(type_of_mission_file == "intendant" && dbUser.metier != 902 && dbUser.metier != 904) { //si on est intendant et qu'on choisis autre chose que intendant
                        await i.editReply({content: 'En tant qu\'Intendant vous ne pouvez envoyer personne d\'autre que vous en mission.', embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;

                    } else if(type_of_mission_file == "chapelain" && dbUser.metier != 903 && dbUser.metier != 904) { //si on est chapelain et qu'on choisis autre chose que chapelain
                        await i.editReply({content: 'En tant que Chapelain vous ne pouvez envoyer personne d\'autre que vous en mission.', embeds:[], components:[]});
                        first_coll.stop(); //stop le premier collector de membre.
                        second_collector.stop();
                        return;

                    }

                    


                    const currentDate = new Date();
                    // Nombre de millisecondes à ajouter (par exemple, 1 heure = 3600 secondes * 1000 millisecondes)
                    const millisecondsToAdd = liste_missions[selec_id_mission].duration_ms;

                    // Calcul de la nouvelle date
                    const newDate = new Date(currentDate.getTime() + millisecondsToAdd);

                    //await client.updateUser(selected_member, {cooldown_mission : newDate}); //!obsolète
                    await client.updateUser(selected_member, {cooldown_activity : newDate});
                    //await client.updateUser(selected_member, {on_mission : true}); //!obsolète
                    await client.updateUser(selected_member, {state_mission : true});       




                    //* Chapelain
                      //* Fabriquer casus belli hérésie
                        if(liste_missions[selec_id_mission].global_mission_id == 1) {

                            let faction_heretiques = [];

                            let epsilonChapelain = "NULL";
                            const dbFactionEpsilon = await client.getFaction("epsilon");
                            epsilonChapelain = dbFactionEpsilon.chapelain;
                            if(epsilonChapelain == "NULL") epsilonChapelain = dbFactionEpsilon.idmaitre;
                            if(epsilonChapelain == "" || epsilonChapelain == undefined) epsilonChapelain = "NULL";

                            if(epsilonChapelain != "NULL") {
                                epsilonChapelain = await client.getUser(message.guild.members.cache.get(epsilonChapelain));
                                if(epsilonChapelain.piete < -200) faction_heretiques.push(dbFactionEpsilon);
                            }

                            let dairosChapelain = "NULL";
                            const dbFactionDairos = await client.getFaction("daïros");
                            dairosChapelain = dbFactionDairos.chapelain;
                            if(dairosChapelain == "NULL") dairosChapelain = dbFactionDairos.idmaitre;
                            if(dairosChapelain == "" || dairosChapelain == undefined) dairosChapelain = "NULL";

                            if(dairosChapelain != "NULL") {
                                dairosChapelain = await client.getUser(message.guild.members.cache.get(dairosChapelain));
                                console.log(dairosChapelain.piete);
                                if(dairosChapelain.piete < -200) faction_heretiques.push(dbFactionDairos);
                            }


                            let lyomahChapelain = "NULL";
                            const dbFactionLyomah = await client.getFaction("lyomah");
                            lyomahChapelain = dbFactionLyomah.chapelain;
                            if(lyomahChapelain == "NULL") lyomahChapelain = dbFactionLyomah.idmaitre;
                            if(lyomahChapelain == "" || lyomahChapelain == undefined) lyomahChapelain = "NULL";

                            if(lyomahChapelain != "NULL") {
                                lyomahChapelain = await client.getUser(message.guild.members.cache.get(lyomahChapelain));
                                if(lyomahChapelain.piete < -200) faction_heretiques.push(dbFactionLyomah);
                            }


                            let alphaChapelain = "NULL";
                            const dbFactionAlpha = await client.getFaction("alpha");
                            alphaChapelain = dbFactionAlpha.chapelain;
                            if(alphaChapelain == "NULL") alphaChapelain = dbFactionAlpha.idmaitre;
                            if(alphaChapelain == "" || alphaChapelain == undefined) alphaChapelain = "NULL";

                            if(alphaChapelain != "NULL") {
                                alphaChapelain = await client.getUser(message.guild.members.cache.get(alphaChapelain));
                                if(alphaChapelain.piete < -200) faction_heretiques.push(dbFactionAlpha);
                            }

                            //TODO: En bêta back-end update : Ajouter à l'objet Faction, une fonction qui récupère juste les points de la faction, empêchant de spam ce truc dégueu
                            //TODO: En bêta back-end update : de toute façon il faudra énormément améliorer les commandes à choix de ce genre. C'est trop "hardcodé compliqué". Tout ce qui est missions, décision_de_guerre etc...
                            //toutes les factions hérétiques (-200 de piété)
                            if(faction_heretiques.length <= 0) {
                                await i.editReply({content: 'La mission a échouée, aucune faction n\'est hérétique actuellement. Le chapelain perd -25 points de piété pour cette erreur.', embeds:[], components:[]});
                                
                                client.editPoint(client, selected_member, -25, "piete");
                                
                                first_coll.stop(); //stop le premier collector de membre.
                                second_collector.stop();
                                return;

                            } else {
                                const faction_cible = faction_heretiques[client.randomInt(0, faction_heretiques.length - 1)]; //prend une faction hérétique au hasard


                                var chance = Math.max(0, Math.min(2500, dbSelectedUser.piete)) / 2500 * 95;

                                //chance sera entre 0 et 95, alors plus elle est élevé plus il y a de chance que le random soit en dessous de cette valeur
                                if(client.randomInt(1, 100) < chance) {

                                    client.editPoint(client, selected_member, 25, "piete");

                                    const objetRecherche = {
                                        "id":"3",
                                        "cible":faction_cible.name
                                    }

                                    if(!dbFaction.casusbelli.some(objet => {
                                        // Comparaison des propriétés id et cible
                                        return objet.id === objetRecherche.id && objet.cible === objetRecherche.cible;
                                    })) {
                                        client.addCasusBelli(dbFaction, faction_cible, "3");
                                        await i.editReply({content: `La mission a réussie ! ${faction_cible.displayname} est hérétique. Le chapelain gagne 25 points de piété, et ${dbSelectedUser.faction} gagne un casus belli pour hérésie contre ${faction_cible.displayname}.`, embeds:[], components:[]});


                                    } else {
                                        await i.editReply({content: `La mission a réussie ! ${faction_cible.displayname} est hérétique. Le chapelain gagne 25 points de piété. Vous aviez déjà un casus belli contre ${faction_cible.displayname}, vous ne conservez alors que celui-ci.`, embeds:[], components:[]});

                                    }
                                    
                                    

                                    first_coll.stop(); //stop le premier collector de membre.
                                    second_collector.stop();
                                    return;
                                } else {
                                    await i.editReply({content: `La mission a échouée ! Le chapelain n'a pas réussi à prouver que ${faction_cible.displayname} soit hérétique. Il perd donc -25 points de piété pour cet échec. Aucun casus belli n'a été obtenu`, embeds:[], components:[]});
                                    client.editPoint(client, selected_member, -25, "piete");

                                    first_coll.stop(); //stop le premier collector de membre.
                                    second_collector.stop();
                                    return;
                                }

                            }
                        }

                        //* Faire du prosélytisme
                        if(liste_missions[selec_id_mission].global_mission_id == 2) {

                            var chance = Math.max(0, Math.min(1500, dbSelectedUser.piete)) / 1500 * 95;

                                //chance sera entre 0 et 95, alors plus elle est élevé plus il y a de chance que le random soit en dessous de cette valeur
                                if(client.randomInt(1, 100) < chance) {

                                    await i.editReply({content: `La mission a réussie ! Le chapelain a fait gagné 20 points de piété a toute sa faction !`, embeds:[], components:[]});
                                    
                                    const fac_id = await client.getFaction(dbSelectedUser.faction);

                                    await message.guild.members.fetch() //cache all members in the server
                                    const role = message.guild.roles.cache.find(role => role.id === fac_id.roleid) //the role to check
                                    const totalRole = role.members.map(m => m) // array of user IDs who have the role
                                    const totalMembers = totalRole.length // how many users have the role

                                    const arrayMembers = Array.from(totalRole);

                                    for (const m of arrayMembers) {
                                           // console.log("ICI 2");
                                            //message.guild.members.cache.get(m.userId)
                                            await client.editPoint(client, m, 20, "piete");
                                        }

                                    first_coll.stop(); //stop le premier collector de membre.
                                    second_collector.stop();
                                    return;
                                } else {
                                    await i.editReply({content: `La mission a échouée ! Le chapelain a fait perdre 8 points de piété a toute sa faction !`, embeds:[], components:[]});
                                    
                                    const fac_id = await client.getFaction(dbSelectedUser.faction);

                                    await message.guild.members.fetch() //cache all members in the server
                                    const role = message.guild.roles.cache.find(role => role.id === fac_id.roleid) //the role to check
                                    const totalRole = role.members.map(m => m) // array of user IDs who have the role
                                    const totalMembers = totalRole.length // how many users have the role

                                    const arrayMembers = Array.from(totalRole);

                                    for (const m of arrayMembers) {
                                            //console.log("ICI 2");
                                            //message.guild.members.cache.get(m.userId)
                                            await client.editPoint(client, m, -8, "piete");
                                        }

                                    first_coll.stop(); //stop le premier collector de membre.
                                    second_collector.stop();
                                    return;
                                }
                        }
                    
                }
            }
        });

 
   


}

