const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

const units = require("../../../assets/guerre/units.json");
const fs = require("fs");
const casusbellijson = require("../../../assets/guerre/casusbelli.json")

const diplomatie = async (client, message, dbUser) => {
    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. Romar1#8485)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }

     /* Valeurs reelations
            0 = Neutre
            1 = Non-Agression
            2 = Commercial
            3 = Alliance
            4 = Ennemie
    */


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

    var embed_declarerGuerreMenu = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Déclarer la guerre !`)
        .setDescription(`Sélectionnez le casus belli (votre raison et objectif de guerre) de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
        .addFields([
            {name:`** **`, value:`** **`}, 
            {name:`** ** • Contre : ** **`, value:`** **`}, 
        ])

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
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnquit` + message.author.id)
            .setLabel('Quitter')
            .setStyle(ButtonStyle.Danger)
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


    const rowChoixCasusBelli = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnflechegauche` + message.author.id)
            .setLabel('🡠')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnflechedroite` + message.author.id)
            .setLabel('🡢')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btndeclarer` + message.author.id)
            .setLabel('Déclarer !')
            .setStyle(ButtonStyle.Danger)
            ,
        new ButtonBuilder()
            .setCustomId(`btnretour` + message.author.id)
            .setLabel('Retour')
            .setStyle(ButtonStyle.Secondary)
    );

    var index_choix_casusBelli = 0;
    var faccasbel = await client.getFaction(dbUser.faction);






    const filter = i => (
        i.customId === 'selectTraite' + message.author.id ||
        i.customId === 'selectFaction' + message.author.id ||
        i.customId === 'btnquit' + message.author.id ||

        i.customId === 'btnsigner' + message.author.id || 
        i.customId === 'btnbriser' + message.author.id || 
        i.customId === 'btnbriserfake' + message.author.id ||
        i.customId === 'btndeclarerguerre' + message.author.id || 
        i.customId === 'btndeclarer' + message.author.id ||
        i.customId === 'btnflechedroite' + message.author.id ||
        i.customId === 'btnflechegauche' + message.author.id ||
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

            if(i.customId == "btnquit" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({components:[]});
                collector.stop();
            }

            if(i.customId == "btntraite" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_traitesMenu], components:[selectMenu_choixFaction, selectMenu_choixTraite, rowChoixActionTraite]})
            }

            
            if(i.customId == "btndeclarerguerre" + i.user.id) {
                await i.deferUpdate();

                if(faccasbel.casusbelli.length <= 0) {

                    embed_declarerGuerreMenu = new EmbedBuilder()
                    .setColor('3C4C66')
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`Déclarer la guerre !`)
                    .setDescription(`Sélectionnez le casus belli (votre raison et objectif de guerre) de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
                    .addFields([
                        {name:`** **`, value:`** **`}, 
                        {name:`Vous ne possédez aucun casus belli`, value:`** **`}, 
                    ])
                    
                    await i.editReply({embeds:[embed_declarerGuerreMenu], components:[rowChoixCasusBelli]})
                    //await i.editReply({embeds:[embed_declarerGuerreMenu], components:[selectMenu_choixFactionDeclarerGuerre, selectMenu_choixCasusBeli, rowChoixActionDeclarerGuerre]})
                

                } else {
                    embed_declarerGuerreMenu = new EmbedBuilder()
                    .setColor('3C4C66')
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                    .setTitle(`Déclarer la guerre !`)
                    .setDescription(`Sélectionnez le casus belli (votre raison et objectif de guerre) de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
                    .addFields([
                        {name:`** **`, value:`** **`}, 
                        {name:`${casusbellijson[faccasbel.casusbelli[index_choix_casusBelli].id].name} • Contre : **${faccasbel.casusbelli[index_choix_casusBelli].cible.charAt(0).toUpperCase() + faccasbel.casusbelli[index_choix_casusBelli].cible.slice(1)}**`, value:`${casusbellijson[faccasbel.casusbelli[index_choix_casusBelli].id].description}`}, 
                    ])
                    
                    await i.editReply({embeds:[embed_declarerGuerreMenu], components:[rowChoixCasusBelli]})
                    //await i.editReply({embeds:[embed_declarerGuerreMenu], components:[selectMenu_choixFactionDeclarerGuerre, selectMenu_choixCasusBeli, rowChoixActionDeclarerGuerre]})
                
                }

            }

            

            if(i.customId == "btnretour" + i.user.id) {
                await i.deferUpdate();
                await i.editReply({embeds:[embed_diplomatieMenu], components:[rowChoixDiplomatie]})
            }

            if(i.customId == "btnbriserfake" + i.user.id) {
                await i.reply({content:`Vous n'avez pas de traité à briser avec cette faction.`, ephemeral:true})
            }




            // --- debut btnsigner ---
            if(i.customId == "btnsigner" + i.user.id) {
                await i.deferUpdate();

                const factionCible = await client.getFaction(selected_faction_string.toLowerCase());
                const faction = await client.getFaction(dbUser.faction);

                if(selected_traite_id == 0 && factionCible.relations[faction.factionid] != 0) //non-agression que si on est neutre 
                {
                    message.reply("La faction cible n'est pas neutre. Un pacte de non-agression ne peut être signée si vous possédez un traité plus puissant ou si vous êtes en guerre avec la faction cible.")
                    collector.stop();
                    return;
                } 
                else if(selected_traite_id == 1) //alliance
                {
                    //on peut alliance que si l'on est pas ennemie ou déjà allié
                    if(factionCible.relations[faction.factionid] == 3) {
                        message.reply("La faction cible est déjà votre alliée. Une alliance ne peut donc pas être signée à nouveau.")
                        collector.stop();
                        return;
                    } else if(factionCible.relations[faction.factionid] == 4) {
                        message.reply("La faction cible est votre ennemie. Une alliance ne peut donc pas être signée tant que vous serez en guerre.")
                        collector.stop();
                        return;
                    }
                }

                if(factionCible.idmaitre == "") {
                    message.reply("La faction cible n'a pas de maître. Aucun traité ne peut être signé.")
                    collector.stop();
                    return;
                } else {


                    const rowChoixSigner = new ActionRowBuilder()
                    .addComponents(
                    
                    new ButtonBuilder()
                        .setCustomId(`btnaccepter` + factionCible.idmaitre)
                        .setLabel('Accepter')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`btnrefuser` + factionCible.idmaitre)
                        .setLabel('Refuser')
                        .setStyle(ButtonStyle.Danger)
                    );

                    const filterSigner = i2 => (
                        i2.customId === 'btnaccepter' + factionCible.idmaitre ||
                        i2.customId === 'btnrefuser' + factionCible.idmaitre) && 
                        i2.user.id === factionCible.idmaitre;
                    const collectorSigner = message.channel.createMessageComponentCollector({ filterSigner, time: 60000 }); //1 minutes
                
                    let message_demande = message.channel.send({content:`<@${factionCible.idmaitre}> la faction ${dbUser.faction} souhaite établir une ${selected_traite_string}.`, components:[rowChoixSigner]})
                        //console.log("i.user.id = " + i2.user.id)

                    await collectorSigner.on('collect', async i2 => {
                        console.log("i.user.id = " + i2.user.id)

                        if(i2.isButton()) {
                            if(i2.customId == "btnaccepter" + i2.user.id) {
                                i2.deferUpdate();
                                
                                message.reply(`La demande a été accepter ! Les factions ${dbUser.faction.charAt(0).toUpperCase() + dbUser.faction.slice(1)} et ${factionCible.displayname} ont signé ${(selected_traite_id == 0) ? "un pacte de non-agression" : "une alliance" }.`)
                                

                                

                                let arrayTmp = faction.relations;
                                let arrayTmpFactionCible = factionCible.relations;


                                if(selected_traite_id == 0) { //non-aggression
                                    arrayTmp[factionCible.factionid] = 1;
                                    arrayTmpFactionCible[faction.factionid] = 1;
                                } 
                                else if(selected_traite_id == 1) { //alliance
                                    arrayTmp[factionCible.factionid] = 3;
                                    arrayTmpFactionCible[faction.factionid] = 3;
                                }

                                //console.log("selectedTraiteId = " + selected_traite_id + "\n ArrayTMP = " + arrayTmp);


                                await client.updateFaction(dbUser.faction, {relations: arrayTmp})
                                await client.updateFaction(factionCible.name, {relations: arrayTmpFactionCible})

                                
                                collectorSigner.stop();
                                collector.stop();
                                return;
                            }
                            if(i2.customId == "btnrefuser" + i2.user.id) {
                                i2.deferUpdate();
                                collectorSigner.stop();
                                message.reply("La demande a été rejeter.")
                                collector.stop();
                            }
                        }
                    });


                }

            }

            // --- fin btnsigner ---








            if(i.customId == "btnbriser" + i.user.id) {

                await i.deferUpdate();

                const factionCible = await client.getFaction(selected_faction_string.toLowerCase());
                const faction = await client.getFaction(dbUser.faction);

                if(selected_traite_id == 0 && factionCible.relations[faction.factionid] != 1) //check si on a non-agression vraiment
                {
                    await i.reply({content:`Vous ne possédez pas de pacte de non-agression avec cette faction.`, ephemeral:true})
                    //collector.stop();
                    //return;
                } 
                else if(selected_traite_id == 1 && factionCible.relations[faction.factionid] != 3) //alliance
                {
                    await i.reply({content:`Vous ne possédez pas d'alliance avec cette faction.`, ephemeral:true})
                    //collector.stop();
                    //return;
                    
                } else {

                    const rowChoixBriser = new ActionRowBuilder()
                    .addComponents(
                    
                    new ButtonBuilder()
                        .setCustomId(`btnoui` + message.author.id)
                        .setLabel('Oui')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`btnnon` + message.author.id)
                        .setLabel('Non')
                        .setStyle(ButtonStyle.Danger)
                    );

                    const filterSigner = i3 => (
                        i3.customId === 'btnoui' + message.author.id ||
                        i3.customId === 'btnnon' + message.author.id) && 
                        i3.user.id === message.author.id;
                    const collectorBriser = message.channel.createMessageComponentCollector({ filterSigner, time: 60000 }); //1 minutes
                
                    let message_confirmation = message.channel.send({content:`Voulez-vous vraiment briser votre ${selected_traite_string} avec ${factionCible.name} ?`, components:[rowChoixBriser]})
                        //console.log("i.user.id = " + i2.user.id)

                    await collectorBriser.on('collect', async i3 => { 
                        if(i3.isButton()) {
                            if(i3.customId == "btnoui" + i3.user.id) {
                                //faire les trucs
                                i3.deferUpdate();
                                message.reply(`Votre ${selected_traite_string} avec ${factionCible.name} est maintenant brisé(e) ! ${(selected_traite_id == 1) ? `\nLa faction ${factionCible.name} possède désormais un casus beli contre votre faction ! \nVous avez **perdu 1500** points de **prestige** et gagné **200** points de **redoutabilité**` : "Vous avez **perdu 500** points de **prestige** et gagné **25** points de **redoutabilité** !"}`)
                                
                                let arrayTmp = faction.relations;
                                let arrayTmpFactionCible = factionCible.relations;


                                if(selected_traite_id == 0) { //non-aggression
                                    arrayTmp[factionCible.factionid] = 0;
                                    arrayTmpFactionCible[faction.factionid] = 0;

                                    await client.editPoint(client, message.member, -500, "prestige");
                                    await client.editPoint(client, message.member, 25, "redoutabilite");
                                } 


                                else if(selected_traite_id == 1) { //alliance
                                    arrayTmp[factionCible.factionid] = 0;
                                    arrayTmpFactionCible[faction.factionid] = 0;

                                    await client.editPoint(client, message.member, -1500, "prestige");
                                    await client.editPoint(client, message.member, 200, "redoutabilite");

                                    await client.addCasusBelli(factionCible, faction, "1");
                                }


                                await client.updateFaction(dbUser.faction, {relations: arrayTmp})
                                await client.updateFaction(factionCible.name, {relations: arrayTmpFactionCible})

                                

                               




                                collectorBriser.stop();
                                collector.stop();
                            }
                            if(i3.customId == "btnnon" + i3.user.id) {
                                await i.reply({content:`Votre ${selected_traite_string} n'a pas été brisé.`, ephemeral:true})
                                collectorBriser.stop();
                            }
                        }
                    });
                }
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

        // --- FIN Traités ---






        
        // Declarer Guerre

       

            if(i.isButton()) {

                if(faccasbel.casusbelli.length <= 0) {
                    //rien
                } else {

                    


                    if(i.customId == "btnflechegauche" + i.user.id) {

                        
                        
                        if(index_choix_casusBelli == 0) {
                            index_choix_casusBelli = faccasbel.casusbelli.length - 1;
                        } else {
                            index_choix_casusBelli--;
                        }

                        //securité
                        if(index_choix_casusBelli < 0) 
                                index_choix_casusBelli = 0;
                        

                        embed_declarerGuerreMenu = new EmbedBuilder()
                        .setColor('3C4C66')
                        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                        .setTitle(`Déclarer la guerre !`)
                        .setDescription(`Sélectionnez le casus belli (votre raison et objectif de guerre) de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
                        .addFields([
                            {name:`** **`, value:`** **`}, 
                            {name:`${casusbellijson[faccasbel.casusbelli[index_choix_casusBelli].id].name} • Contre : **${faccasbel.casusbelli[index_choix_casusBelli].cible.charAt(0).toUpperCase() + faccasbel.casusbelli[index_choix_casusBelli].cible.slice(1)}**`, value:`${casusbellijson[faccasbel.casusbelli[index_choix_casusBelli].id].description}`}, 
                        ])

                        await i.deferUpdate();
                        await i.editReply({embeds:[embed_declarerGuerreMenu]});
                    }

                    if(i.customId == "btnflechedroite" + i.user.id) {

                        if(index_choix_casusBelli == faccasbel.casusbelli.length - 1) {
                            index_choix_casusBelli = 0;
                        } else {
                            index_choix_casusBelli++;
                        }


                        //securité
                        if(index_choix_casusBelli >= faccasbel.casusbelli.length) 
                                index_choix_casusBelli = 0;
                        
                            
                        embed_declarerGuerreMenu = new EmbedBuilder()
                        .setColor('3C4C66')
                        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                        .setTitle(`Déclarer la guerre !`)
                        .setDescription(`Sélectionnez le casus belli (votre raison et objectif de guerre) de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
                        .addFields([
                            {name:`** **`, value:`** **`}, 
                            {name:`${casusbellijson[faccasbel.casusbelli[index_choix_casusBelli].id].name} • Contre : **${faccasbel.casusbelli[index_choix_casusBelli].cible.charAt(0).toUpperCase() + faccasbel.casusbelli[index_choix_casusBelli].cible.slice(1)}**`, value:`${casusbellijson[faccasbel.casusbelli[index_choix_casusBelli].id].description}`}, 
                        ])

                        await i.deferUpdate();
                        await i.editReply({embeds:[embed_declarerGuerreMenu]});

                    }

                    if(i.customId == "btndeclarer" + i.user.id) {

                        //* En Alpha, on ne peut pas gérer plusieurs guerres en même temps. Mais dans le futur, il sera très probable que l'on puisse être en guerre avec
                        //* Plus d'une faction à la fois. se battre sur plusieurs front pourrait être intéressant, dangereux mais un gameplay cool !

                        //* TODO: Voir si on permet à une faction de faire la guerre à une faction qui ne possède pas de maître de faction.
                        //! IL FAUT ABSOLUMENT PAS QU'ON PUISSE (en tout cas en alpha !!)
                        // * CE TODO A ETE FAIT
                        //*FAIT TODO: CE TODO LA N'A PAS ETE FAIT. Draxy avec Daïros à bien pu déclarer la guerre même si j'étais en guerre avec Lyomah.
                        // * DERNIERE MAJ : C'est bon corrigé en ajoutant une condition qui vérifie si la faction cible est pas déjà en state 4

                        if(faccasbel.relations.indexOf(4) != -1) {
                            i.reply({content:`Vous êtes déjà en guerre contre une faction !`, ephemeral:true})
                            //collector.stop();
                        } else {
                            
                            const faction_ennemy = await client.getFaction(faccasbel.casusbelli[index_choix_casusBelli].cible);

                            if(faction_ennemy.idmaitre == "") {
                                i.reply({content:`La faction adverse n'a aucun maître qui gouverne. Il est donc impossible de lui déclarer la guerre.`});
                            } else {
                                if(faccasbel.relations[faction_ennemy.factionid] != 0) { //si la faction cible n'est PAS neutre AVEC NOUS
                                    i.reply({content:`Vous possédez un traité avec cette faction. Tant qu'il ne sera pas brisé vous ne pourrait pas déclarer la guerre à cette faction !`, ephemeral:true})
                                    //collector.stop();
                                } else if(faction_ennemy.relations.indexOf(4) != -1) { //chercher si la faction cible à pas une relation 4 (donc en guerre). Si elle en a (donc PAS -1) on empêche
                                    i.reply({content:`Vous ne pouvez pas déclarer la guerre à cette faction. Elle est actuellement en guerre avec une autre faction.`, ephemeral:true})
                                } else {
                                    let temp_relations_facenn = faction_ennemy.relations;
                                    let temps_relations_fac = faccasbel.relations;
        
                                    temp_relations_facenn[faccasbel.factionid] = 4;
                                    temps_relations_fac[faction_ennemy.factionid] = 4;
        
                                    await client.updateFaction(faction_ennemy.name, {relations:temp_relations_facenn});
                                    await client.updateFaction(faccasbel.name, {relations:temps_relations_fac});
    
                                    await client.updateFaction(faction_ennemy.name, {en_guerre:true});
                                    await client.updateFaction(faccasbel.name, {en_guerre:true});
    
                                    await client.updateFaction(faction_ennemy.name, {attaquant:faccasbel.name});
                                    await client.updateFaction(faccasbel.name, {attaquant:faccasbel.name});
    
                                    await client.updateFaction(faction_ennemy.name, {defensseur:faction_ennemy.name});
                                    await client.updateFaction(faccasbel.name, {defensseur:faction_ennemy.name});
    
                                    await client.updateFaction(faction_ennemy.name, {casusbelli_utilise:faccasbel.casusbelli[index_choix_casusBelli].id});
                                    await client.updateFaction(faccasbel.name, {casusbelli_utilise:faccasbel.casusbelli[index_choix_casusBelli].id});

                                    await client.updateFaction(faction_ennemy.name, {date_debut_guerre: new Date()})
                                    await client.updateFaction(faccasbel.name, {date_debut_guerre: new Date()})
        
                                    i.deferUpdate();
                                    message.reply({content:`:crossed_swords: La guerre est déclarée entre ${faccasbel.displayname} et ${faction_ennemy.displayname}`});
                                    //TODO envoyer ça dans le décision_rpg
                                    collector.stop();
                                }
                            }
                            
                            
                        }

                        //! NB : C'est pas là que le casus belli est supprimé ! Il n'est supprimé qu'après. Au cas où on fait une paix blanche il est gardé !
                    }

                    
                }    
            }
            

            

        // --- FIN Déclarer Guerre ---
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