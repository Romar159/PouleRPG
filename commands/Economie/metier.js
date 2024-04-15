const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const metiers = require("../../assets/rpg/metiers/metiers.json");


module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('prec' + message.author.id)
            .setLabel('⟵')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('suiv' + message.author.id)
            .setLabel('⟶')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('postuler' + message.author.id)
            .setLabel('Postuler')
            .setStyle(ButtonStyle.Success)
    );
    const rowDm = new ActionRowBuilder()
    .addComponents(
        
        new ButtonBuilder()
            .setCustomId('prec' + message.author.id)
            .setLabel('⟵')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('suiv' + message.author.id)
            .setLabel('⟶')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('demission' + message.author.id)
            .setLabel('Démisionner')
            .setStyle(ButtonStyle.Danger)
    );

    const filter = i => (i.customId === 'postuler' + message.author.id 
                      || i.customId == 'demission' + message.author.id
                      || i.customId == 'suiv' + message.author.id
                      || i.customId == 'prec' + message.author.id
                      ) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 250000 });

    let metiers_ID_selector;
    let mt;
    
    if(!args[0]) {
        mt = await client.filterById(metiers, dbUser.metier);
        metiers_ID_selector = mt.id;
    } else {
        let recherche = args[0];
        if(args[1]) { // formation du métier pour la recherche.
            recherche = args[0] + " " + args[1];
            if(args[2]) {
                recherche = recherche + " " + args[2];
                if(args[3]) {
                    recherche = recherche + " " + args[3];
                }
            }
        }

        mt = await client.filterByName(metiers, recherche);
        metiers_ID_selector = mt.id;
    }
    

    var embed_Metiers = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`${mt.name}`)
        .setDescription(`${mt.description}`)
        .addFields([{name:`**Salaire**`, value:`${mt.salaire} :coin: poyn de l'heure`, inline:true}, {name:`**Horaire maximale**`, value:`${mt.horaires}`, inline:true}, {name:`** **`, value:`** **`, inline:true}])
        .addFields([{name:"**Prérequis**", value:`${mt.infos}`}])
        .setFooter({text:`${mt.id > 900 ? mt.id - 874 : mt.id} / 30`})
        
    collector.on('collect', async i => { 
        
        if(i.customId === 'suiv' + i.user.id) {
            await i.deferUpdate();
            if(metiers_ID_selector == 26) metiers_ID_selector = 901
            else if(metiers_ID_selector == 904) metiers_ID_selector = 0;
            else metiers_ID_selector++;
            
            mt = await client.filterById(metiers, metiers_ID_selector);
            //mt = await client.filterById(metiers, 15);
            console.log(metiers_ID_selector);

            embed_Metiers = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`${mt.name}`)
        .setDescription(`${mt.description}`)
        .addFields([{name:`**Salaire**`, value:`${mt.salaire} :coin: poyn de l'heure`, inline:true}, {name:`**Horaire maximale**`, value:`${mt.horaires}`, inline:true}, {name:`** **`, value:`** **`, inline:true}])
        .addFields([{name:"**Prérequis**", value:`${mt.infos}`}])
        .setFooter({text:`${mt.id > 900 ? mt.id - 874 : mt.id} / 30`})

            if(dbUser.metier == mt.id) {
                await i.editReply({embeds:[embed_Metiers], components:[rowDm]})
            } else {
                await i.editReply({embeds:[embed_Metiers], components:[row]})
            }
        }

        if(i.customId === 'prec' + i.user.id) {
            await i.deferUpdate();
            if(metiers_ID_selector == 0) metiers_ID_selector = 904
            else if(metiers_ID_selector == 901) metiers_ID_selector = 26;
            else metiers_ID_selector--;
            
            mt = await client.filterById(metiers, metiers_ID_selector);

            embed_Metiers = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`${mt.name}`)
        .setDescription(`${mt.description}`)
        .addFields([{name:`**Salaire**`, value:`${mt.salaire} :coin: poyn de l'heure`, inline:true}, {name:`**Horaire maximale**`, value:`${mt.horaires}`, inline:true}, {name:`** **`, value:`** **`, inline:true}])
        .addFields([{name:"**Prérequis**", value:`${mt.infos}`}])
        .setFooter({text:`${mt.id > 900 ? mt.id - 874 : mt.id} / 30`})

            if(dbUser.metier == mt.id) {
                await i.editReply({embeds:[embed_Metiers], components:[rowDm]})
            } else {
                await i.editReply({embeds:[embed_Metiers], components:[row]})
            }
        }
        

        if (i.customId === 'postuler' + i.user.id) {
            await i.deferUpdate();
            await collector.stop("time");

            if(mt.prerequis == "/") { // il n'y a pas de condition
            } else {
                var result = eval('(function() {' + mt.prerequis + '}())');
                if(result == true) {} // continuer
                else return await i.editReply({ embeds:[], content:`Vous n'avez pas les qualifications nécessaires !\n${mt.infos}`, components: [] }) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - qualités nécessaires manquantes pour le métier ${mt.name}`, "err");
                
            }
            if(dbUser.metier > 900) {
                return await i.editReply({ embeds:[], content:`Vous ne pouvez pas exercer un autre métier que celui définit par votre poste au conseil ou si vous êtes maître de faction !`, components: [] }) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - possède un métier obligatoire. METIER_ID=${dbUser.metier}`, "err");
            }

            await i.editReply({ content:`Vous exercez à présent le métier de **${mt.name}**. Pour commencer, consultez la commande p<travail !`, components: [] });
            return await client.updateUser(message.member, {metier: mt.id}) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${mt.name} commencé`, "err");
        }
        if(i.customId === 'demission' + i.user.id) {
            await i.deferUpdate();
            await collector.stop("time");
            if(dbUser.metier > 900) {
                await i.editReply({ embeds:[], content:`Vous ne pouvez pas démissioner du métier de **${mt.name}** car il est relatif à votre place au gouvernement de votre faction.`, components: [] });
                client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${mt.name} démission refusé. Membre du gouvernement`, "err");
                return;
            } else {
                await i.editReply({ embeds:[], content:`Vous avez démissioné du métier de **${mt.name}**.`, components: [] });
                return await client.updateUser(message.member, {metier: 0}) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${mt.name} démissioné`, "err");
            }
        }
    });

    if(mt.id == dbUser.metier) {
        message.channel.send({embeds:[embed_Metiers], components:[rowDm]})
    } else {
        message.channel.send({embeds:[embed_Metiers], components:[row]})
    }

};

module.exports.help = {
    name: "métier",
    aliases: ["metiers", "metier", "métiers"],
    category: "economie",
    desription: "Affichez et choisissez un métier.",
    usage: "[métier]",
    cooldown: 3,
    permissions: false,
    args: false
};