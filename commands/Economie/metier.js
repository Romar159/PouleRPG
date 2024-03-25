const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const metiers = require("../../assets/rpg/metiers/metiers.json");


module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    const filter = i => (i.customId === 'postuler' || i.customId == 'demission') && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('postuler')
            .setLabel('Postuler')
            .setStyle(ButtonStyle.Primary),
    );
    const rowDm = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('demission')
            .setLabel('Démissionner')
            .setStyle(ButtonStyle.Danger),
    );
    
    if(!args[0]) { 
        let string_metier = "";
        metiers.forEach(e => {
                if(e.id != 0) {
                    if(e.id == dbUser.metier) {
                        string_metier = string_metier + `🛠️ **${e.name}** 🛠️\n`;
                    } else {
                        string_metier = string_metier + `*${e.name}*\n`;            
                    }
                }
        });
        client.writeLog(`Commande ${this.help.name}: ${message.author.tag} (${message.author.id}) - ${metiers.length} métiers listés.`);
        return message.channel.send("Liste des métiers : \n" + string_metier);
    } 

    

    let metier = args[0];
    metier = metier[0].toUpperCase() + metier.slice(1).toLowerCase()
    
    if(args[1]) { // formation du métier pour la recherche.
        metier = args[0] + " " + args[1];
        if(args[2]) {
            metier = metier + " " + args[2];
            if(args[3]) {
                metier = metier + " " + args[3];
            }
        }
    }

    try {
        let mt;
        if(args[0] == "moi") {
            mt = await client.filterById(metiers, dbUser.metier);
        } else {
            mt = await client.filterByName(metiers, metier);
        }

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Métier initial: ${client.filterById(metiers, dbUser.metier).id}`);
             
        
        collector.on('collect', async i => {
            if (i.customId === 'postuler') {
                await i.deferUpdate();
                await collector.stop("time");

                if(mt.prerequis == "/") { // il n'y a pas de condition
                } else {
                    var result = eval('(function() {' + mt.prerequis + '}())');
                    if(result == true) {} // continuer
                    else return await i.editReply({ content:`Vous n'avez pas les qualifications nécessaires !\n${mt.infos}`, components: [] }) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - qualités nécéssaires manquantes pour le métier ${mt.name}`, "err");
                    
                }
                if(dbUser.metier > 900) {
                    return await i.editReply({ content:`Vous ne pouvez pas exercer un autre métier que celui définit par votre poste au conseil ou si vous êtes maître de faction !`, components: [] }) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - possède un métier obligatoire. METIER_ID=${dbUser.metier}`, "err");;
                }

                await i.editReply({ content:`Vous exercez à présent le métier de **${mt.name}**. Pour commencer, consultez la commande p<travail !`, components: [] });
                return await client.updateUser(message.member, {metier: mt.id}) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${mt.name} commencé`, "err");;
            }
            if(i.customId === 'demission') {
                await i.deferUpdate();
                await collector.stop("time");
                await i.editReply({ content:`Vous avez démissioné du métier de **${mt.name}**.`, components: [] });
                return await client.updateUser(message.member, {metier: 0}) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${mt.name} démissioné`, "err");;
            }
        });
        if(mt.id == dbUser.metier) { // a déjà ce métier
            if(mt.id > 900 || mt.id == 0) { // métier non démisionable ainsi
                message.channel.send({content: `**${mt.name}**\n${mt.description}\nVous exercez ce métier.\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`, components: [] });
            } else {
                message.channel.send({content: `**${mt.name}**\n${mt.description}\nVous exercez ce métier.\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`, components: [rowDm] });
            }
        } else {
            if(mt.id > 900 || mt.id == 0) { // métier ne peut pas être pratiqué ainsi
                message.channel.send({content: `**${mt.name}**\n${mt.description}\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`});
            } else {
                message.channel.send({content: `**${mt.name}**\n${mt.description}\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`, components: [row] });

            }
        }

    } catch (error) {
        message.channel.send("Ce métier n'existe pas.");
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Métier inexistant OU Erreur. ${error}`, "err");
        console.log(error);
    }
};

module.exports.help = {
    name: "métier",
    aliases: ["metiers", "metier", "métiers"],
    category: "economie",
    desription: "Trouvez un métier.",
    usage: "[metier/moi]",
    cooldown: 3,
    permissions: false,
    args: false
};