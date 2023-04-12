const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

const units = require("../../../assets/guerre/units.json");
const fs = require("fs");

const diplomatie = async (client, message, dbUser) => {
    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. Romar1#8485)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }


    var selected_faction_id = 0;
    var selected_faction_string = "Epsilon"
    var selected_traite_id = 0;
    var selected_traite_string = "Non-agression"

    var factions_to_select = [];

    const e_selectFac = [
        {
            label: 'Daïros',
            description: 'Selectionnez la faction Daïros',
            value: 'slc_faction_dairos' + message.author.id,
        },
        {
            label: 'Lyomah',
            description: 'Selectionnez la faction Lyomah',
            value: 'slc_faction_lyomah' + message.author.id,
        },
        {
            label: 'Alpha',
            description: 'Selectionnez la faction Alpha',
            value: 'slc_faction_alpha' + message.author.id,
        }
    ]
    const d_selectFac = [
        {
            label: 'Epsilon',
            description: 'Selectionnez la faction Epsilon',
            value: 'slc_faction_epsilon' + message.author.id,
        },
        {
            label: 'Lyomah',
            description: 'Selectionnez la faction Lyomah',
            value: 'slc_faction_lyomah' + message.author.id,
        },
        {
            label: 'Alpha',
            description: 'Selectionnez la faction Alpha',
            value: 'slc_faction_alpha' + message.author.id,
        }
    ]
    const l_selectFac = [
        {
            label: 'Epsilon',
            description: 'Selectionnez la faction Epsilon',
            value: 'slc_faction_epsilon' + message.author.id,
        },
        {
            label: 'Daïros',
            description: 'Selectionnez la faction Daïros',
            value: 'slc_faction_dairos' + message.author.id,
        },
        {
            label: 'Alpha',
            description: 'Selectionnez la faction Alpha',
            value: 'slc_faction_alpha' + message.author.id,
        }
    ]
    const a_selectFac = [
        {
            label: 'Epsilon',
            description: 'Selectionnez la faction Epsilon',
            value: 'slc_faction_epsilon' + message.author.id,
        },
        {
            label: 'Daïros',
            description: 'Selectionnez la faction Daïros',
            value: 'slc_faction_dairos' + message.author.id,
        },
        {
            label: 'Lyomah',
            description: 'Selectionnez la faction Lyomah',
            value: 'slc_faction_lyomah' + message.author.id,
        }
    ]

    if(dbUser.faction == "epsilon") {
        factions_to_select = e_selectFac;
        selected_faction_id = 1;
        selected_faction_string = "Daïros"
    }
    else if(dbUser.faction == "daïros") {
        factions_to_select = d_selectFac;
        selected_faction_id = 0;
    }
    else if(dbUser.faction == "lyomah") {
        factions_to_select = l_selectFac;
        selected_faction_id = 0;
    }
    else if(dbUser.faction == "alpha") {
        factions_to_select = a_selectFac;
        selected_faction_id = 0;
    }

    


    var embed_diplomatieMenu = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Diplomatie`)
        .addFields([{name:`**Signer ou Briser un traité**`, value:`Proposez différents traités avec les autres factions.`, inline:true}, {name:`**Déclarer une Guerre**`, value:`Déclarez la guerre à une faction pour obtenir ce que vous désirez... Seulement, il faut y être préparé !`, inline:true}])


    var embed_traitesMenu = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Traités avec ${selected_faction_string}`)
        .setDescription(`Sélectionnez la faction avec qui vous souhaitez signer un traité. Choisissez le traité de votre choix puis cliquez sur un des boutons pour le briser ou pour envoyer la demande à la faction en question.`)
        .addFields([
            {name:`${(selected_traite_id == 0) ? "👉" : ""} **Pacte de non-agression**`, value:`Signer un pacte de non-agression empêche deux faction de se déclarer la guerre. \n\nCe traité peut être brisé sans l'accord de la faction adverse mais vous perdrez du prestige.`, inline:true}, 
            {name:`${(selected_traite_id == 1) ? "👉" : ""} **Alliance**`, value:`Forger une alliance engage les deux factions à s'entre-aider en cas de conflit avec des factions tierces. \nAucune guerre ne peut être déclarer entre les deux. \n\nCe traité peut être brisé sans l'accord de la faction adverse. Mais attention, en plus d'y perdre beaucoup de prestige, votre ancien allié obtiendra un casus belli contre vous !`, inline:true}
        ])
        .setFooter({text:`${selected_faction_string} - ${selected_traite_string}`})


    //row Menu

    const rowChoixDiplomatie = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btntraite` + message.author.id)
            .setLabel('Signer ou Briser un traité')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btndeclarerguerre` + message.author.id)
            .setLabel('Déclarer une Guerre')
            .setStyle(ButtonStyle.Secondary)
    ); 


    //row traités

    const selectMenu_choixFaction = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectFaction' + message.author.id)
					.setPlaceholder('Choisissez une faction...') 
					.addOptions(factions_to_select),
			);

    const selectMenu_choixTraite = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectTraite' + message.author.id)
                    .setPlaceholder('Choisissez un traité...') 
                    .addOptions(
                    {
                        label: 'Pacte de non-agression',
                        description: 'Selectionnez le pacte de non-agression',
                        value: 'slc_traite_nonagression' + message.author.id,
                    },
                    {
                        label: 'Alliance',
                        description: 'Selectionnez l\'alliance',
                        value: 'slc_traite_alliance' + message.author.id,
                    }),
        );

    const rowChoixActionTraitePeutBriser = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnsigner` + message.author.id)
            .setLabel('Signer')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`btnbriser` + message.author.id)
            .setLabel('Briser')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Secondary)
    );

    const rowChoixActionTraitePeutPasBriser = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnsigner` + message.author.id)
            .setLabel('Signer')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`btnbriserfake` + message.author.id)
            .setLabel('Briser')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Secondary)
    );

    var rowChoixActionTraite = rowChoixActionTraitePeutBriser;







    const filter = i => (
        i.customId === 'selectTraite' + message.author.id ||
        i.customId === 'selectFaction' + message.author.id ||

        i.customId === 'btnsigner' + message.author.id || 
        i.customId === 'btnbriser' + message.author.id || 
        i.customId === 'btndeclarerguerre' + message.author.id || 
        i.customId === 'btntraite' + message.author.id ||
        i.customId === 'btnretour' + message.author.id) && 
        i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 900000 }); //15 minutes

    await collector.on('collect', async i => {

        // let dbFaction = await client.getFaction(dbUser.faction);
        // //si nous n'avons pas le traité selectionné dans nos relation de la dbFaction alors on grise le "briser"
        // console.log(`[DEBUG] : ${dbFaction.relations[selected_faction_id]} != ${selected_traite_id + 1}`)
        // if(dbFaction.relations[selected_faction_id] != selected_traite_id + 1) {
            
        //     rowChoixActionTraite = rowChoixActionTraitePeutPasBriser;
        //     // await i.deferUpdate();
        //     // await i.editReply({embeds:[embed_traitesMenu], components:[selectMenu_choixFaction, selectMenu_choixTraite, rowChoixActionTraite]})
        // }


        if(i.isButton()) {
            if(i.customId == "btntraite" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_traitesMenu], components:[selectMenu_choixFaction, selectMenu_choixTraite, rowChoixActionTraite]})
            }

            if(i.customId == "btnretour" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_diplomatieMenu], components:[rowChoixDiplomatie]})
            }

            if(i.customId == "btnbriserfake" + i.user.id) {
                await i.reply({content:`Vous n'avez pas de traité à briser avec cette faction.`, ephemeral:true})
            }
        }
        if(i.isStringSelectMenu()) {
            if(i.customId == "selectFaction" + i.user.id) {
                
                if(i.values == "slc_faction_epsilon" + i.user.id) {
                    selected_faction_id = 0;
                    selected_faction_string = "Epsilon";
                } else if(i.values == "slc_faction_dairos" + i.user.id) {
                    selected_faction_id = 1;
                    selected_faction_string = "Daïros";
                } else if(i.values == "slc_faction_lyomah" + i.user.id) {
                    selected_faction_id = 2;
                    selected_faction_string = "Lyomah";
                } else if(i.values == "slc_faction_alpha" + i.user.id) {
                    selected_faction_id = 3;
                    selected_faction_string = "Alpha";
                }
            }
            else if(i.customId == "selectTraite" + i.user.id) {
                
                if(i.values == "slc_traite_nonagression" + i.user.id) {
                    selected_traite_id = 0;
                    selected_traite_string = "Non-agression";
                } else if(i.values == "slc_traite_alliance" + i.user.id) {
                    selected_traite_id = 1;
                    selected_traite_string = "Alliance";
                }
            }

            embed_traitesMenu = new EmbedBuilder()
            .setColor('3C4C66')
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
            .setTitle(`Traités avec ${selected_faction_string}`)
            .setDescription(`Sélectionnez la faction avec qui vous souhaitez signer un traité. Choisissez le traité de votre choix puis cliquez sur un des boutons pour le briser ou pour envoyer la demande à la faction en question.`)
            .addFields([
                {name:`${(selected_traite_id == 0) ? "👉" : ""} **Pacte de non-agression**`, value:`Signer un pacte de non-agression empêche deux faction de se déclarer la guerre. \n\nCe traité peut être brisé sans l'accord de la faction adverse mais vous perdrez du prestige.`, inline:true}, 
                {name:`${(selected_traite_id == 1) ? "👉" : ""} **Alliance**`, value:`Forger une alliance engage les deux factions à s'entre-aider en cas de conflit avec des factions tierces. \nAucune guerre ne peut être déclarer entre les deux. \n\nCe traité peut être brisé sans l'accord de la faction adverse. Mais attention, en plus d'y perdre beaucoup de prestige, votre ancien allié obtiendra un casus belli contre vous !`, inline:true}
            ])
            .setFooter({text:`${selected_faction_string} - ${selected_traite_string}`})
                
                await i.deferUpdate();
                await i.editReply({embeds:[embed_traitesMenu]})
        }
    });

    await collector.on('end', async i => {
        global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
        return;
    });

    


    message.channel.send({embeds:[embed_diplomatieMenu], components:[rowChoixDiplomatie]})
    //message.channel.send({embeds:[embed_traitesMenu], components:[selectMenu_choixFaction, selectMenu_choixTraite, rowChoixActionTraite]})

        
}

module.exports = {
    diplomatie
}