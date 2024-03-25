const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

const units = require("../../../assets/guerre/units.json");
const fs = require("fs");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {dbUser} dbUser 
 * @description Ce module de la guerre est celui sous Army -> Composition de l'armée. Il permet de gérer ses unités, de les placer dans les flancs de l'armée ou les stocker dans la caserne
 */
const army_edition = async (client, message, dbUser) => {
    
    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. Romar1#8485)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }
    // anciennement : value était égale au nombre dans l'armée et max au nombre dans la caserne
    var value = 10;
    var old_value = value;
    var max = 350;
    var old_max = 0;
    var selected_unit = 0;

    var selected_flanc = 0;
    var selected_flanc_string = "gauche";

    /*
    ces quatres variables
    les deux premières contiennent le fichier final, il est édité à la toute fin lors de la validation.
    Les deux dernières contiennent des fichiers temporaires, ils servent lors de l'affichage et l'édition des armées, ils servent à remplacer (ou non si on annule) les vrais fichiers et à être reset
    
    Ne pas de suite modifier le fichier principal permet une annulation des modification et une approche plus sécuritaire des fichiers d'armée.
    */
    var army = null;
    var caserne = null;
    var temporary_army = null;
    var temporary_caserne = null;

    // army, caserne, tmp_army, tmp_caserne
    var epsilon_files_path = ["./assets/guerre/armies/epsilon_army.json", "./assets/guerre/caserne/epsilon_caserne.json", "assets/guerre/armies/temporary/tmp_epsilon_army.json", "assets/guerre/caserne/temporary/tmp_epsilon_caserne.json"]; 
    var dairos_files_path = ["./assets/guerre/armies/dairos_army.json", "./assets/guerre/caserne/dairos_caserne.json", "assets/guerre/armies/temporary/tmp_dairos_army.json", "assets/guerre/caserne/temporary/tmp_dairos_caserne.json"]; 
    var lyomah_files_path = ["./assets/guerre/armies/lyomah_army.json", "./assets/guerre/caserne/lyomah_caserne.json", "assets/guerre/armies/temporary/tmp_lyomah_army.json", "assets/guerre/caserne/temporary/tmp_lyomah_caserne.json"]; 
    var alpha_files_path = ["./assets/guerre/armies/alpha_army.json", "./assets/guerre/caserne/alpha_caserne.json", "assets/guerre/armies/temporary/tmp_alpha_army.json", "assets/guerre/caserne/temporary/tmp_alpha_caserne.json"]; 


    var files_path = null;

    if(dbUser.faction == "epsilon") {
        files_path = epsilon_files_path
    } else if(dbUser.faction == "daïros") {
        files_path = dairos_files_path
    } else if(dbUser.faction == "lyomah") {
        files_path = lyomah_files_path
    } else if(dbUser.faction == "alpha") {
        files_path = alpha_files_path
    } else {
        return message.channel.send("Vous n'avez pas de faction. C'est probablement une erreur, contactez le développeur <@421400262423347211>.")
    }

        delete require.cache[require.resolve("../../." + files_path[0])];
        delete require.cache[require.resolve("../../." + files_path[1])];
        delete require.cache[require.resolve("../../../" + files_path[2])];
        delete require.cache[require.resolve("../../../" + files_path[3])];

        army = require("../../." + files_path[0])
        caserne = require("../../." + files_path[1])

        fs.writeFileSync("./" + files_path[2], fs.readFileSync(files_path[0]), {encoding:'utf8',flag:'w'})
        fs.writeFileSync("./" + files_path[3], fs.readFileSync(files_path[1]), {encoding:'utf8',flag:'w'})

        temporary_army = require("../../../" + files_path[2])
        temporary_caserne = require("../../../" + files_path[3])
        


    




    const embed_ChoixUnit = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Unité à gérer`)
        .setDescription(`Sélectionnez le type d'unité que vous souhaitez gérer. Ajoutez en dans vos armées ou stockez les dans vos casernes.`);
        // Afficher dans ce embed combien on a d'unité dans chaque flanc !

    const embed_ChoixFlanc = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Flanc à gérer`)
        .setDescription(`Sélectionnez le flanc que vous souhaitez gérer.`);

    const embed_AffichageUnit = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL:message.author.displayAvatarURL()})
        .setTitle(`Flanc ${selected_flanc_string} - ${client.filterById(units, selected_unit).name}`)
        .setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)

    var embed_MenuAffichageAllArmy = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL:message.author.displayAvatarURL()})
        .setTitle(`Composition de l'armée`)
        .addFields({name:"**Flanc gauche**", value: "** **", inline:true}, {name:"**Flanc central**", value: "** **", inline:true}, {name:"**Flanc droit**", value: "** **", inline:true})
        .addFields({name:`🏹 ${temporary_army[0].units[0]} Archers `,          value: `En caserne: ${temporary_caserne[0].units}`, inline:true}, {name:`🏹 ${temporary_army[1].units[0]}`, value: `** **`, inline:true}, {name:`🏹 ${temporary_army[2].units[0]}`, value: `** **`, inline:true})
        .addFields({name:`🗡️ ${temporary_army[0].units[1]} Infanterie légère`, value: `En caserne: ${temporary_caserne[1].units}`, inline:true}, {name:`🗡️ ${temporary_army[1].units[1]}`, value: `** **`, inline:true}, {name:`🗡️ ${temporary_army[2].units[1]}`, value: `** **`, inline:true})
        .addFields({name:`⚔️ ${temporary_army[0].units[2]} Infanterie lourde`, value: `En caserne: ${temporary_caserne[2].units}`, inline:true}, {name:`⚔️ ${temporary_army[1].units[2]}`, value: `** **`, inline:true}, {name:`⚔️ ${temporary_army[2].units[2]}`, value: `** **`, inline:true})
        .addFields({name:`🐴 ${temporary_army[0].units[3]} Cavalerie légère`,  value: `En caserne: ${temporary_caserne[3].units}`, inline:true}, {name:`🐴 ${temporary_army[1].units[3]}`, value: `** **`, inline:true}, {name:`🐴 ${temporary_army[2].units[3]}`, value: `** **`, inline:true})
        .addFields({name:`🐎 ${temporary_army[0].units[4]} Cavalerie lourde`,  value: `En caserne: ${temporary_caserne[4].units}`, inline:true}, {name:`🐎 ${temporary_army[1].units[4]}`, value: `** **`, inline:true}, {name:`🐎 ${temporary_army[2].units[4]}`, value: `** **`, inline:true})
        .addFields({name:`🔪 ${temporary_army[0].units[5]} Piquiers`,          value: `En caserne: ${temporary_caserne[5].units}`, inline:true}, {name:`🔪 ${temporary_army[1].units[5]}`, value: `** **`, inline:true}, {name:`🔪 ${temporary_army[2].units[5]}`, value: `** **`, inline:true})
        .setFooter({text:`Selectionné: flanc ${selected_flanc_string} - ${client.filterById(units, selected_unit).name}`})
        // //.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)

    const filter = i => (
                         i.customId === 'selectUnit' + message.author.id ||
                         i.customId === 'selectFlanc' + message.author.id ||

                         i.customId === 'less100' + message.author.id || 
                         i.customId === 'less50' + message.author.id || 
                         i.customId === 'less10' + message.author.id || 
                         i.customId === 'less1' + message.author.id || 
                         i.customId === 'plus1' + message.author.id ||  
                         i.customId === 'plus10' + message.author.id ||
                         i.customId === 'plus50' + message.author.id || 
                         i.customId === 'plus100' + message.author.id ||
                         i.customId === 'btnmenu' + message.author.id ||
                         i.customId === 'btnretour' + message.author.id ||
                         i.customId === 'ajouter' + message.author.id ||
                         i.customId === 'retirer' + message.author.id ||
                         i.customId === 'btnannuler' + message.author.id ||
                         i.customId === 'btnchoixunits' + message.author.id ||
                         i.customId === 'btnchoixflanc' + message.author.id ||
                         i.customId === 'btnvalider' + message.author.id) && 
                         i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 900000 }); //15 minutes

    const choixUnit = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectUnit' + message.author.id)
					.setPlaceholder('Choisissez une unité à éditer...') 
					.addOptions(     
						{
							label: '🏹 Archers',
							description: 'Selectionnez les Archers',
							value: 'slc_units_arch' + message.author.id,
						},
						{
							label: '🗡️ Infanterie légère',
							description: 'Selectionnez l\'Infanterie légère',
							value: 'slc_units_ileg' + message.author.id,
						},
                        {
							label: '⚔️ Infanterie lourde',
							description: 'Selectionnez l\'Infanterie lourde',
							value: 'slc_units_ilou' + message.author.id,
						},
                        {
							label: '🐴 Cavalerie légère',
							description: 'Selectionnez la Cavalerie légère',
							value: 'slc_units_cleg' + message.author.id,
						},
                        {
							label: '🐎 Cavalerie lourde',
							description: 'Selectionnez la Cavalerie lourde',
							value: 'slc_units_clou' + message.author.id,
						},
                        {
							label: '🔪 Piquiers',
							description: 'Selectionnez les Piquiers',
							value: 'slc_units_piqu' + message.author.id,
						}
					),
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

            



    const rowAjout = new ActionRowBuilder()
    .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`plus1` + message.author.id)
            .setLabel('+1')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`plus10` + message.author.id)
            .setLabel('+10')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`plus50` + message.author.id)
            .setLabel('+50')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`plus100` + message.author.id)
            .setLabel('+100')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Primary)
    ); 

    const rowRetrait = new ActionRowBuilder()
    .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`less1` + message.author.id)
            .setLabel('-1')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`less10` + message.author.id)
            .setLabel('-10')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`less50` + message.author.id)
            .setLabel('-50')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`less100` + message.author.id)
            .setLabel('-100')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Primary)
    );

    const rowEdition = new ActionRowBuilder()
    .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`ajouter` + message.author.id)
            .setLabel('Ajouter')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`retirer` + message.author.id)
            .setLabel('Retirer')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`btnmenu` + message.author.id)
            .setLabel('Armée')
            .setStyle(ButtonStyle.Primary),
        
    );

    const rowMenu = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`btnchoixunits` + message.author.id)
            .setLabel('Changer l\'unité')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnchoixflanc` + message.author.id)
            .setLabel('Changer le flanc')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Édition')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnvalider` + message.author.id)
            .setLabel('Valider et quitter')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`btnannuler` + message.author.id)
            .setLabel('Annuler et quitter')
            .setStyle(ButtonStyle.Danger)
    );


    

    await collector.on('collect', async i => {
        if(i.isButton()) {

            
            // menu 
            if(i.customId == "btnretour" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit], components:[rowEdition]})
            } else if(i.customId == "btnmenu" + i.user.id) {

                embed_MenuAffichageAllArmy = new EmbedBuilder()
                    .setColor('3C4C66')
                    .setAuthor({name: `${message.author.username}`, iconURL:message.author.displayAvatarURL()})
                    .setTitle(`Composition de l'armée`)
                    .addFields({name:"**Flanc gauche**", value: "** **", inline:true}, {name:"**Flanc central**", value: "** **", inline:true}, {name:"**Flanc droit**", value: "** **", inline:true})
                    .addFields({name:`🏹 ${temporary_army[0].units[0]} Archers `,          value: `En caserne: ${temporary_caserne[0].units}`, inline:true}, {name:`🏹 ${temporary_army[1].units[0]}`, value: `** **`, inline:true}, {name:`🏹 ${temporary_army[2].units[0]}`, value: `** **`, inline:true})
                    .addFields({name:`🗡️ ${temporary_army[0].units[1]} Infanterie légère`, value: `En caserne: ${temporary_caserne[1].units}`, inline:true}, {name:`🗡️ ${temporary_army[1].units[1]}`, value: `** **`, inline:true}, {name:`🗡️ ${temporary_army[2].units[1]}`, value: `** **`, inline:true})
                    .addFields({name:`⚔️ ${temporary_army[0].units[2]} Infanterie lourde`, value: `En caserne: ${temporary_caserne[2].units}`, inline:true}, {name:`⚔️ ${temporary_army[1].units[2]}`, value: `** **`, inline:true}, {name:`⚔️ ${temporary_army[2].units[2]}`, value: `** **`, inline:true})
                    .addFields({name:`🐴 ${temporary_army[0].units[3]} Cavalerie légère`,  value: `En caserne: ${temporary_caserne[3].units}`, inline:true}, {name:`🐴 ${temporary_army[1].units[3]}`, value: `** **`, inline:true}, {name:`🐴 ${temporary_army[2].units[3]}`, value: `** **`, inline:true})
                    .addFields({name:`🐎 ${temporary_army[0].units[4]} Cavalerie lourde`,  value: `En caserne: ${temporary_caserne[4].units}`, inline:true}, {name:`🐎 ${temporary_army[1].units[4]}`, value: `** **`, inline:true}, {name:`🐎 ${temporary_army[2].units[4]}`, value: `** **`, inline:true})
                    .addFields({name:`🔪 ${temporary_army[0].units[5]} Piquiers`,          value: `En caserne: ${temporary_caserne[5].units}`, inline:true}, {name:`🔪 ${temporary_army[1].units[5]}`, value: `** **`, inline:true}, {name:`🔪 ${temporary_army[2].units[5]}`, value: `** **`, inline:true})
                    .setFooter({text:`Selectionné: flanc ${selected_flanc_string} - ${client.filterById(units, selected_unit).name}`})
        
                await i.deferUpdate();
                await i.editReply({embeds:[embed_MenuAffichageAllArmy], components:[rowMenu]})
            } else if(i.customId == "ajouter" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit], components:[rowAjout]})
            } else if(i.customId == "retirer" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit], components:[rowRetrait]})
            } 

            else if(i.customId == "btnchoixunits" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_ChoixUnit], components:[choixUnit]})
            }
            else if(i.customId == "btnchoixflanc" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_ChoixFlanc], components:[choixFlanc]})
            }
            
            else if(i.customId == "btnvalider" + i.user.id) {
                
                old_max = max;
                max = max - value;

                await i.deferUpdate();
                //await i.editReply({content:`(pas encore précis à chaque unité) Il y avait ${old_value} dans l'armée, il y a désormais ${value}. Il y avait ${old_max} dans les casernes, il y a désormais ${max}`, components:[]})
                await i.editReply({components:[]});
                
                try {

                    fs.writeFileSync("./" + files_path[0], JSON.stringify(temporary_army), {encoding:'utf8',flag:'w'})
                    fs.writeFileSync("./" + files_path[1], JSON.stringify(temporary_caserne), {encoding:'utf8',flag:'w'})
                    
                    
                    message.reply({content: `Les changements ont été appliqués avec succès.`, ephemeral:true})
                } catch (error) {
                    message.reply("Une erreur est survenue lors de la sauvegarde de vos armées.\n[ERREUR] " + error);
                }
                
                collector.stop();
            } else if(i.customId == "btnannuler" + i.user.id) {
                
                await i.deferUpdate();
                await i.editReply({components:[]})

                

                message.reply({content: `Les changements n'ont pas été pris en compte.`, ephemeral:true})
                collector.stop();
            }


            // boutons édition


            if(i.customId == "less100" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(value < 100) return i.reply({content:"Vous n'avez pas assez d'unité dans ce flanc", ephemeral: true });
                value = value - 100;
                max = max + 100;
                if(value < 0) value = 0;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            }
            else if(i.customId == "less50" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(value < 50) return i.reply({content:"Vous n'avez pas assez d'unité dans ce flanc", ephemeral: true });
                value = value - 50;
                max = max + 50;
                if(value < 0) value = 0;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            } 
            else if(i.customId == "less10" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(value < 10) return i.reply({content:"Vous n'avez pas assez d'unité dans ce flanc", ephemeral: true });
                value = value - 10;
                max = max + 10;
                if(value < 0) value = 0;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            } 
            else if(i.customId == "less1" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(value < 1) return i.reply({content:"Vous n'avez pas assez d'unité dans ce flanc", ephemeral: true });
                value = value - 1;
                max = max + 1;
                if(value < 0) value = 0;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            } 
            else if(i.customId == "plus1" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(max -1 < 0) return i.reply({content:"Vous n'avez pas assez d'unité dans votre caserne", ephemeral: true });
                value = value + 1;
                max = max - 1;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            } 
            else if(i.customId == "plus10" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(max -10 < 0) return i.reply({content:"Vous n'avez pas assez d'unité dans votre caserne", ephemeral: true });
                value = value + 10;
                max = max - 10;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            } 
            else if(i.customId == "plus50" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(max - 50 < 0) return i.reply({content:"Vous n'avez pas assez d'unité dans votre caserne", ephemeral: true });
                value = value + 50;
                max = max - 50;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
            } 
            else if(i.customId == "plus100" + i.user.id) {
                value = temporary_army[selected_flanc].units[selected_unit];
                max = temporary_caserne[selected_unit].units;

                if(max -100 < 0) return i.reply({content:"Vous n'avez pas assez d'unité dans votre caserne", ephemeral: true });
                value = value + 100;
                max = max - 100;

                temporary_army[selected_flanc].units[selected_unit] = value;
                temporary_caserne[selected_unit].units = max;

                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit]})
                // sauvegarder dans des variables temporaires chaque unité changés. Si l'on clique sur le bouton valider, elle remplaceront celle dans les fichiers d'armée/caserne
                // et si on annule/timeout, ça ne changera pas les fichiers !
                // Cependant il faut donc afficher à l'utilisateur ces valeurs temporaire
            } 
            
            
        }

        

        // Choix unité
        if(i.isStringSelectMenu()) { 

            if(i.customId == "selectUnit" + i.user.id) {
                
                if(i.values == "slc_units_arch" + i.user.id) {
                    selected_unit = 0;
                } else if(i.values == "slc_units_ileg" + i.user.id) {
                    selected_unit = 1;
                } else if(i.values == "slc_units_ilou" + i.user.id) {
                    selected_unit = 2;
                } else if(i.values == "slc_units_cleg" + i.user.id) {
                    selected_unit = 3;
                } else if(i.values == "slc_units_clou" + i.user.id) {
                    selected_unit = 4;
                } else if(i.values == "slc_units_piqu" + i.user.id) {
                    selected_unit = 5;
                }

                embed_AffichageUnit.setTitle(`Flanc ${selected_flanc_string} - ${client.filterById(units, selected_unit).name}`)
                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit], components:[rowEdition]})
                
            }
            else if(i.customId == "selectFlanc" + i.user.id) {
                
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

                embed_AffichageUnit.setTitle(`Flanc ${selected_flanc_string} - ${client.filterById(units, selected_unit).name}`)
                embed_AffichageUnit.setDescription(`Dans le flanc ${selected_flanc_string} : **${temporary_army[selected_flanc].units[selected_unit]}** unités \nDans la caserne : **${temporary_caserne[selected_unit].units}** unités`)
                
                await i.deferUpdate();
                await i.editReply({embeds:[embed_AffichageUnit], components:[rowEdition]})
                
            }
        }
    });

    await collector.on('end', async i => { 
        //message.channel.send("DEBUG: COLLECTOR_ENDED | indexof" + global.users_use_guerre_cmd.indexOf(message.author.id) + " | global.users_use_guerre_cmd before: " + global.users_use_guerre_cmd)
        global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
        return;
        //message.channel.send("global.users_use_guerre_cmd after: " + global.users_use_guerre_cmd.join(" - "));
    });


    message.channel.send({embeds:[embed_MenuAffichageAllArmy], components:[rowMenu]})
    //message.channel.send({content:`${client.filterById(units, selected_unit).name} - Valeur Actuel: ${value} ; Disponible : ${max}`, components:[rowMenu]})

}



module.exports = {
    army_edition
}