const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

const units = require("../../../assets/guerre/units.json");
const fs = require("fs");

const units_achat = async (client, message, dbUser) => {
    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. Romar1#8485)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }

    var userFaction = await client.getFaction(dbUser.faction) 
    var path = "";

    if(dbUser.faction == "epsilon") {
        path = "./assets/guerre/caserne/epsilon_caserne.json"
    } else if(dbUser.faction == "daïros") {
        path = "./assets/guerre/caserne/dairos_caserne.json"
    } else if(dbUser.faction == "lyomah") {
        path = "../assets/guerre/caserne/lyomah_caserne.json"
    } else if(dbUser.faction == "alpha") {
        path = "./assets/guerre/caserne/alpha_caserne.json"
    }

    delete require.cache[require.resolve("../../." + path)];
    var caserne_file = require("../../." + path);
    var caserne_file_traitement = caserne_file;

    var selected_unit_id = 0;
    var selected_unit_string = "Archers";

    var units_in_panier = [0, 0, 0, 0, 0, 0];

    var embed_Panier = new EmbedBuilder()
        .setColor('00FF00')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Achat d'unité`)
        //.setDescription(`Vous allez acheter\n\n**X** 🏹 Archers - **X** :coin: Poyn \n**X** 🗡️ Infanterie légère - **X** Poyn :coin: \n**X** ⚔️ Infanterie lourde - **X** Poyn :coin: \n**X** 🐴 Cavalerie légère - **X** Poyn :coin: \n**X** 🐎 Cavalerie lourde - **X** Poyn :coin: \n**X** 🔪 Piquiers - **X** Poyn :coin: \n\nTotal: **X** Poyn :coin:`)
        .addFields({name:`**${units_in_panier[0]}** 🏹 Archers`, value:`**${units_in_panier[0] * units[0].prix_achat}** :coin: Poyn`, inline:true}, 
                   {name:`**${units_in_panier[1]}** 🗡️ Infanterie légère`, value:`**${units_in_panier[1] * units[1].prix_achat}** :coin: Poyn`, inline:true},
                   {name:"** **", value:"** **",inline:true},
                   {name:"** **", value:"** **"},
                   {name:`**${units_in_panier[2]}** ⚔️ Infanterie lourde`, value:`**${units_in_panier[2] * units[2].prix_achat}** :coin: Poyn`, inline:true},
                   {name:`**${units_in_panier[3]}** 🐴 Cavalerie légère`, value:`**${units_in_panier[3] * units[3].prix_achat}** :coin: Poyn`, inline:true},
                   {name:"** **", value:"** **",inline:true},
                   {name:"** **", value:"** **"},
                   {name:`**${units_in_panier[4]}** 🐎 Cavalerie lourde`, value:`**${units_in_panier[4] * units[4].prix_achat}** :coin: Poyn`, inline:true},
                   {name:`**${units_in_panier[5]}** 🔪 Piquiers`, value:`**${units_in_panier[5] * units[5].prix_achat}** :coin: Poyn`, inline:true},
                   {name:"** **", value:"** **",inline:true},
                   {name:"** **", value:"** **"},
                   {name:"Total", value:`${(units_in_panier[0] * units[0].prix_achat) + (units_in_panier[1] * units[1].prix_achat) + (units_in_panier[2] * units[2].prix_achat) + (units_in_panier[3] * units[3].prix_achat) + (units_in_panier[4] * units[4].prix_achat) + (units_in_panier[5] * units[5].prix_achat)} :coin: Poyn`,inline:true}
                   )
        .setFooter({text:`${selected_unit_string} selectionné`})
        



        const selectMenu_choixUnit = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectUnit' + message.author.id)
					.setPlaceholder('Choisissez une unité à acheter...') 
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

    var rowEdition = new ActionRowBuilder()
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
            .setCustomId(`btnacheter` + message.author.id)
            .setLabel('Acheter et quitter')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnquitter` + message.author.id)
            .setLabel('Quitter sans acheter')
            .setStyle(ButtonStyle.Secondary),
        
    );

    const rowEditionDefault = new ActionRowBuilder()
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
            .setCustomId(`btnacheter` + message.author.id)
            .setLabel('Acheter et quitter')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnquitter` + message.author.id)
            .setLabel('Quitter sans acheter')
            .setStyle(ButtonStyle.Secondary),
        
    );

    const rowEditionTropCher = new ActionRowBuilder()
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
            .setCustomId(`btnachetertropcher` + message.author.id)
            .setLabel('Trop cher !')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnquitter` + message.author.id)
            .setLabel('Quitter sans acheter')
            .setStyle(ButtonStyle.Secondary),
        
    );


    // il manque ici le collector:
    /*
        Il va premièrement devoir gérer les boutons Ajouter et Retirer pour qu'il affichent les autres row de boutons sans changer l'embed car tout s'affiche dans le même.
        Deuxièmement il doit gérer le SelectMenu, pour que l'unité change (dans le footer c'est visible laquelle c'est)
        Troisièmement il va devoir gérer les boutons Acheter et Quitter
    */

        const filter = i => (
            i.customId === 'selectUnit' + message.author.id ||

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
            i.customId === 'btnacheter' + message.author.id ||
            i.customId === 'btnachetertropcher' + message.author.id ||
            i.customId === 'btnquitter' + message.author.id) && 
            i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 900000 }); //15 minutes

    await collector.on('collect', async i => {
        if(i.isButton()) {
            if(i.customId == "btnretour" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_Panier], components:[selectMenu_choixUnit, rowEdition]})
            }
            else if(i.customId == "ajouter" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_Panier], components:[rowAjout]})
            } else if(i.customId == "retirer" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_Panier], components:[rowRetrait]})
            } 

            if(i.customId == "btnacheter" + i.user.id) { 
                await i.deferUpdate();
                await i.editReply({components:[]});

                var total = (units_in_panier[0] * units[0].prix_achat) + (units_in_panier[1] * units[1].prix_achat) + (units_in_panier[2] * units[2].prix_achat) + (units_in_panier[3] * units[3].prix_achat) + (units_in_panier[4] * units[4].prix_achat) + (units_in_panier[5] * units[5].prix_achat);

                if((userFaction.bank - total) < 0) {
                    // note: cette situation ne doit pas exister mais je la met par sécurité (comme on vérifie déjà l'or avant avec le bouton d'achat qui se grise.)
                    message.reply(`Il n'y a pas assez de poyn dans le coffre de faction.`)
                    collector.stop();
                } else {
    
                    try {
    
                        for(let i = 0; i < 6; i++) {
                            caserne_file_traitement[i].units = caserne_file_traitement[i].units + units_in_panier[i];
                        }

                        fs.writeFileSync(path, JSON.stringify(caserne_file_traitement), {encoding:'utf8',flag:'w'})
                        
                        await client.updateFaction(userFaction.name, {bank: userFaction.bank - total});

                        message.reply({content:`L'achat a bien été effectué. Les nouvelles unités sont maintenant dans votre caserne vous avez dépenser ${total} :coin: Poyn`, ephemeral:true})
                    } catch (error) {
                        message.reply("Une erreur est survenue lors de la sauvegarde de vos armées.\n[ERREUR] " + error);
                    }
    
                    collector.stop();
                }
            } else if(i.customId == "btnquitter" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({components:[]})


                message.reply({content:`L'achat a été annulé. Aucun poyn n'a été débitté.`})
                collector.stop();
            }
            else if(i.customId == "btnachetertropcher" + i.user.id) {
                await i.reply({content:`Il n'y a pas assez de poyn dans votre coffre de faction`, ephemeral:true})
            }


            if(i.customId == "plus1" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] + 1;
                await i.deferUpdate();
            } else if(i.customId == "plus10" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] + 10;
                await i.deferUpdate();
            } else if(i.customId == "plus50" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] + 50;
                await i.deferUpdate();
            } else if(i.customId == "plus100" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] + 100;
                await i.deferUpdate();
            }
            
            if(i.customId == "less1" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] - 1;
                if(units_in_panier[selected_unit_id] < 0) units_in_panier[selected_unit_id] = 0;
                await i.deferUpdate();
            }
            else if(i.customId == "less10" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] - 10;
                if(units_in_panier[selected_unit_id] < 0) units_in_panier[selected_unit_id] = 0;
                await i.deferUpdate();
            }
            else if(i.customId == "less50" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] - 50;
                if(units_in_panier[selected_unit_id] < 0) units_in_panier[selected_unit_id] = 0;
                await i.deferUpdate();
            }
            else if(i.customId == "less100" + i.user.id) {
                units_in_panier[selected_unit_id] = units_in_panier[selected_unit_id] - 100;
                if(units_in_panier[selected_unit_id] < 0) units_in_panier[selected_unit_id] = 0;
                await i.deferUpdate();
            }

            if(i.customId == "plus1" + i.user.id 
            || i.customId == "plus10" + i.user.id
            || i.customId == "plus50" + i.user.id
            || i.customId == "plus100" + i.user.id
            || i.customId == "less1" + i.user.id
            || i.customId == "less10" + i.user.id
            || i.customId == "less50" + i.user.id
            || i.customId == "less100" + i.user.id) {

                embed_Panier = new EmbedBuilder()
                .setColor('00FF00')
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                .setTitle(`Achat d'unité`)
                //.setDescription(`Vous allez acheter\n\n**X** 🏹 Archers - **X** :coin: Poyn \n**X** 🗡️ Infanterie légère - **X** Poyn :coin: \n**X** ⚔️ Infanterie lourde - **X** Poyn :coin: \n**X** 🐴 Cavalerie légère - **X** Poyn :coin: \n**X** 🐎 Cavalerie lourde - **X** Poyn :coin: \n**X** 🔪 Piquiers - **X** Poyn :coin: \n\nTotal: **X** Poyn :coin:`)
                .addFields({name:`**${units_in_panier[0]}** 🏹 Archers`, value:`**${units_in_panier[0] * units[0].prix_achat}** :coin: Poyn`, inline:true}, 
                        {name:`**${units_in_panier[1]}** 🗡️ Infanterie légère`, value:`**${units_in_panier[1] * units[1].prix_achat}** :coin: Poyn`, inline:true},
                        {name:"** **", value:"** **",inline:true},
                        {name:"** **", value:"** **"},
                        {name:`**${units_in_panier[2]}** ⚔️ Infanterie lourde`, value:`**${units_in_panier[2] * units[2].prix_achat}** :coin: Poyn`, inline:true},
                        {name:`**${units_in_panier[3]}** 🐴 Cavalerie légère`, value:`**${units_in_panier[3] * units[3].prix_achat}** :coin: Poyn`, inline:true},
                        {name:"** **", value:"** **",inline:true},
                        {name:"** **", value:"** **"},
                        {name:`**${units_in_panier[4]}** 🐎 Cavalerie lourde`, value:`**${units_in_panier[4] * units[4].prix_achat}** :coin: Poyn`, inline:true},
                        {name:`**${units_in_panier[5]}** 🔪 Piquiers`, value:`**${units_in_panier[5] * units[5].prix_achat}** :coin: Poyn`, inline:true},
                        {name:"** **", value:"** **",inline:true},
                        {name:"** **", value:"** **"},
                        {name:"Total", value:`${(units_in_panier[0] * units[0].prix_achat) + (units_in_panier[1] * units[1].prix_achat) + (units_in_panier[2] * units[2].prix_achat) + (units_in_panier[3] * units[3].prix_achat) + (units_in_panier[4] * units[4].prix_achat) + (units_in_panier[5] * units[5].prix_achat)} :coin: Poyn`,inline:true}
                        )
                .setFooter({text:`${selected_unit_string} selectionné`})
                await i.editReply({embeds:[embed_Panier]})
            }





            

        }
        else if(i.isStringSelectMenu) {
            if(i.customId == "selectUnit" + i.user.id) {
                
                if(i.values == "slc_units_arch" + i.user.id) {
                    selected_unit_id = 0;
                    selected_unit_string = "Archers";
                } else if(i.values == "slc_units_ileg" + i.user.id) {
                    selected_unit_id = 1;
                    selected_unit_string = "Infanterie légère";
                } else if(i.values == "slc_units_ilou" + i.user.id) {
                    selected_unit_id = 2;
                    selected_unit_string = "Infanterie lourde";
                } else if(i.values == "slc_units_cleg" + i.user.id) {
                    selected_unit_id = 3;
                    selected_unit_string = "Cavalerie légère";
                } else if(i.values == "slc_units_clou" + i.user.id) {
                    selected_unit_id = 4;
                    selected_unit_string = "Cavalerie lourde";
                } else if(i.values == "slc_units_piqu" + i.user.id) {
                    selected_unit_id = 5;
                    selected_unit_string = "Piquiers";
                }

                embed_Panier.setFooter({text:`${selected_unit_string} selectionné`});
                
                await i.deferUpdate();
                await i.editReply({embeds:[embed_Panier], components:[selectMenu_choixUnit, rowEdition]})
                
            }
        } 

        if((units_in_panier[0] * units[0].prix_achat) + (units_in_panier[1] * units[1].prix_achat) + (units_in_panier[2] * units[2].prix_achat) + (units_in_panier[3] * units[3].prix_achat) + (units_in_panier[4] * units[4].prix_achat) + (units_in_panier[5] * units[5].prix_achat) > userFaction.bank) {
            rowEdition = rowEditionTropCher;
        } else {
            rowEdition = rowEditionDefault;
        }
    });

    await collector.on('end', async i => { 
        global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
        return;
    });

    message.channel.send({embeds:[embed_Panier], components:[selectMenu_choixUnit, rowEdition]})
        
        
         

}

module.exports = {
    units_achat
}