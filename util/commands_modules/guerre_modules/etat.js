const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

const units = require("../../../assets/guerre/units.json");
const fs = require("fs");
const casusbellijson = require("../../../assets/guerre/casusbelli.json")

let decision_id = 0;
let faction_decision_id = 0;

const etat = async (client, message, dbUser) => {
    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. @romar1)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }

    const faction = await client.getFaction(dbUser.faction);
    const faction_adverse = await client.getFaction(client.getFactionNameByRelationId(faction, 4));

    var selected_decision = "paix"; //défaut car c'est pas un truc grave si jamais ça bug.

    if(!faction.en_guerre) {
        var embed_etatMenu = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`État de la guerre`)
        .addFields([{name:`Vous n'êtes pas en guerre !`, value:`Vous ne pouvez effectuer aucune action ici tant que votre faction sera en paix.`, inline:true}])

        message.channel.send({embeds:[embed_etatMenu]});

        global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
        return;
    } 
     
    

    const selectMenu_decisionDeGuerre = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('selectDecision' + message.author.id)
            .setPlaceholder('Choisissez une décision...') 
            .addOptions(   
                {
                    label: '⚔️ Appuyer les exigeances',
                    description: 'Obtenez ce que vous souhaitiez.',
                    value: 'slc_decision_exigeances' + message.author.id,
                },  
                {
                    label: '🕊️ Paix Blanche',
                    description: 'Proposez à la faction adverse d\'arrêter la guerre.',
                    value: 'slc_decision_paix' + message.author.id,
                },
                {
                    label: '🏳️ Se rendre',
                    description: 'Rendez-vous pour stopper la guerre.',
                    value: 'slc_decision_rendre' + message.author.id,
                }
            ),
    );

    const rowConfirmDecision = new ActionRowBuilder()
    .addComponents(
    
    new ButtonBuilder()
        .setCustomId(`btnannuler` + message.author.id)
        .setLabel('Annuler')
        .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
        .setCustomId(`btnconfirmer` + message.author.id)
        .setLabel('Confirmer')
        .setStyle(ButtonStyle.Success)
    );

    const rowDemandePaix = new ActionRowBuilder()
    .addComponents(
    
    new ButtonBuilder()
        .setCustomId(`btn_accepter_paix` + faction_adverse.idmaitre)
        .setLabel('Accepter')
        .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
        .setCustomId(`btn_refuser_paix` + faction_adverse.idmaitre)
        .setLabel('Refuser')
        .setStyle(ButtonStyle.Danger)
    );


    const rowQuit = new ActionRowBuilder()
    .addComponents(
    
    new ButtonBuilder()
        .setCustomId(`btnquit` + message.author.id)
        .setLabel('Quitter')
        .setStyle(ButtonStyle.Danger)
    );





   

    
    const faction_ennemy = await client.getFaction(client.getFactionNameById(faction.relations.indexOf("4")));

    var embed_etatMenu = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`État de la guerre`)
        .addFields([{name:`${(faction.score_guerre < 0) ? ":red_circle:" : ":green_circle:"} **${faction.score_guerre}**% • **${client.upperCaseFirstChar(faction.name)}** ${(faction.name == faction.attaquant) ? "<:faction_attaquante:1148271789638697081>" : "<:faction_defenseuse:1148271842625339422>"}`, value:`** **`, inline:true}, {name:` ** ** `, value:`** **`, inline:true}, {name:`${(faction_ennemy.name == faction.attaquant) ? "<:faction_attaquante:1148271789638697081>" : "<:faction_defenseuse:1148271842625339422>"} **${client.upperCaseFirstChar(faction_ennemy.name)}** • **${faction_ennemy.score_guerre}**% ${(faction_ennemy.score_guerre < 0) ? ":red_circle:" : ":green_circle:"}`, value:`** **`, inline:true}])
        .addFields([{name:` ** ** `, value:`** **`}])
        .addFields([{name:`Guerre déclarée le`, value:`${client.getSimplifiedDate(faction.date_debut_guerre)}`, inline:true},{name:` ** ** `, value:`** **`, inline:true},{name:`Dure depuis`, value:`${client.daysUntilDate(faction.date_debut_guerre)} jours`, inline:true}])
        .addFields([{name:` ** ** `, value:`** **`}])
        .addFields([{name:`**Décisions**`, value:`⚔️ **Appuyer les exigeances** - Obtenez ce que vous souhaitiez, si vous avez atteint 100% de score de guerre. Si vous êtes la faction défensive vous gagnerez des réparations de guerre.`}])
        .addFields([{name:`** **`, value:`🕊️ **Paix Blanche** - Proposez à la faction adverse d'arrêter la guerre. Attention, l'attaquant conserve son casus belli.`}])
        .addFields([{name:`** **`, value:`:flag_white: **Se rendre** - Rendez-vous à la faction adverse pour stopper la guerre. Attention si la faction adverse est l'attaquant elle obtiendra ce qu'elle voulait. Et si vous êtes l'attaquant, les défenseurs auront un gros avantage !`}])
      
        
        const filter = i => (
            i.customId === 'selectDecision' + message.author.id ||
            i.customId === 'btnquit' + message.author.id ||
    
            i.customId === 'btnannuler' + message.author.id ||
            i.customId === 'btnconfirmer' + message.author.id) && 
            i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 600000 }); //10 minutes
    
        await collector.on('collect', async i => {
            if(i.isButton()) {

                if(i.customId == "btnquit" + i.user.id) {
                    await i.deferUpdate();
                    await i.editReply({components:[]});
                    collector.stop();
                }

                if(i.customId == "btnannuler" + i.user.id) {
                    await i.deferUpdate();
                    await i.editReply({embeds:[embed_etatMenu], components:[selectMenu_decisionDeGuerre, rowQuit], content:``});
                    
                }
                if(i.customId == "btnconfirmer" + i.user.id) {
                    await i.deferUpdate();
                   
                    //message.channel.send("TROP BG IL SE PASSE CA !!!!! : " + selected_decision);

                    

                    
                    let db_faction_att = await client.getFaction(faction.attaquant);
                    let db_faction_def = await client.getFaction(faction.defensseur);
                    //console.log("DEBUG: " + db_faction_def.name)
                    let used_casusbelli = faction.casusbelli_utilise;

                    if(selected_decision == "exigeances") {
                        if(faction.score_guerre == 100) {
                            client.resultat_guerre(used_casusbelli, decision_id, faction_decision_id, db_faction_att, db_faction_def, message);
                            collector.stop();
                        } else {
                            message.channel.send(`Vous n'avez pas 100% de score de guerre.`);
                            await i.editReply({embeds:[embed_etatMenu], components:[selectMenu_decisionDeGuerre, rowQuit], content:``});
                        }
                    }

                    if(selected_decision == "paix") {
                        
                        message.channel.send({content: `<@${faction_adverse.idmaitre}>, la faction **${faction.displayname}** vous propose une **paix blanche**. 🕊️\nSi vous acceptez, la guerre s'arrête. Vous ne **perdez rien** ; La faction **${client.upperCaseFirstChar(faction.attaquant)}** conserve son **casus belli**.`, components:[rowDemandePaix]});
                        
                        const filter = i => (
                            i.customId === 'btn_accepter_paix' + faction_adverse.idmaitre ||
                            i.customId === 'btn_refuser_paix' + faction_adverse.idmaitre) && 
                            i.user.id === faction_adverse.idmaitre;

                        const collector_demande_paix = message.channel.createMessageComponentCollector({ filter, time: 300000 }); //5 minutes
                        
                        await collector_demande_paix.on('collect', async i => { 
                            if(i.isButton()) {
                                if(i.customId == "btn_accepter_paix" + i.user.id) {
                                    //await i.deferUpdate();
                                    await i.reply(`${message.author}, <@${faction_adverse.idmaitre}> a **accepté** votre proposition de paix blanche ! 🕊️`)
                                    collector_demande_paix.stop();
                                    client.resultat_guerre(used_casusbelli, decision_id, faction_decision_id, db_faction_att, db_faction_def, message);
                                } 
                                if(i.customId == "btn_refuser_paix" + i.user.id) {
                                    //await i.deferUpdate();
                                    await i.reply(`${message.author}, <@${faction_adverse.idmaitre}> a **refusé** votre proposition de paix blanche ! :crossed_swords:`);
                                    collector_demande_paix.stop();
                                } 
                            }
                        });

                    }

                    if(selected_decision == "rendre") {
                        client.resultat_guerre(used_casusbelli, decision_id, faction_decision_id, db_faction_att, db_faction_def, message);
                    }
                    
                    collector.stop();
                    
                }
            }

            if(i.isStringSelectMenu()) {
                if(i.customId == "selectDecision" + i.user.id) {
                    await i.deferUpdate();
                    if(i.values == "slc_decision_exigeances" + i.user.id) {
                        selected_decision = "exigeances";
                        decision_id = 0;
                        
                        if(dbUser.faction == faction.attaquant) {
                            faction_decision_id = 0;
                            await i.editReply({embeds:[], content:`**Appuyer les Exigeances**\n\nPour **${client.upperCaseFirstChar(faction.name)}** : \n${casusbellijson[faction.casusbelli_utilise].ae_a_att.join("\n")} \n\nPour **${client.upperCaseFirstChar(faction_adverse.name)}** : \n${casusbellijson[faction.casusbelli_utilise].ae_a_def.join("\n")}`, components:[rowConfirmDecision]})
                        } else {
                            faction_decision_id = 1;
                            await i.editReply({embeds:[], content:`**Appuyer les Exigeances**\n\nPour **${client.upperCaseFirstChar(faction.name)}** : \n${casusbellijson[faction.casusbelli_utilise].ae_d_def.join("\n")} \n\nPour **${client.upperCaseFirstChar(faction_adverse.name)}** : \n${casusbellijson[faction.casusbelli_utilise].ae_d_att.join("\n")}`, components:[rowConfirmDecision]})
                        }
                        //await i.editReply({embeds:[], content:`**Appuyer les Exigeances**\n\nPour **${client.upperCaseFirstChar(faction.name)}** : \n- machin \n- Machin2 \n\nPour **${client.upperCaseFirstChar(faction_adverse.name)}** : \n- Truc\n- TrucNumero2`, components:[rowConfirmDecision]})
                    
                    } else if(i.values == "slc_decision_paix" + i.user.id) {
                        selected_decision = "paix";
                        decision_id = 1;

                        if(dbUser.faction == faction.attaquant) faction_decision_id = 0;
                        if(dbUser.faction == faction.defensseur) faction_decision_id = 1;

                        await i.editReply({embeds:[], content:`**Paix Blanche**\n\nPour **${client.upperCaseFirstChar(faction.attaquant)}** : \n${casusbellijson[faction.casusbelli_utilise].pb_att.join("\n")} \n\nPour **${client.upperCaseFirstChar(faction.defensseur)}** : \n${casusbellijson[faction.casusbelli_utilise].pb_def.join("\n")}`, components:[rowConfirmDecision]})
                        
                    } else if(i.values == "slc_decision_rendre" + i.user.id) {
                        selected_decision = "rendre";
                        decision_id = 2;

                        if(dbUser.faction == faction.attaquant) {
                            faction_decision_id = 0;
                            await i.editReply({embeds:[], content:`**Se rendre**\n\nPour **${client.upperCaseFirstChar(faction.name)}** : \n${casusbellijson[faction.casusbelli_utilise].sr_a_att.join("\n")} \n\nPour **${client.upperCaseFirstChar(faction_adverse.name)}** : \n${casusbellijson[faction.casusbelli_utilise].sr_a_def.join("\n")}`, components:[rowConfirmDecision]})
                        } else {
                            faction_decision_id = 1;
                            await i.editReply({embeds:[], content:`**Se rendre**\n\nPour **${client.upperCaseFirstChar(faction.name)}** : \n${casusbellijson[faction.casusbelli_utilise].sr_d_def.join("\n")} \n\nPour **${client.upperCaseFirstChar(faction_adverse.name)}** : \n${casusbellijson[faction.casusbelli_utilise].sr_d_att.join("\n")}`, components:[rowConfirmDecision]})
                        }
                    } 
                    
                }
            }
        });

        await collector.on('end', async i => {
            global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
            return;
        });


    message.channel.send({embeds:[embed_etatMenu], components:[selectMenu_decisionDeGuerre, rowQuit]});



}

module.exports = {
    etat
}