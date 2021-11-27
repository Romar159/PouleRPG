const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const metiers = require("../../assets/rpg/metiers/metiers.json");

module.exports.run = async (client, message, args, settings, dbUser) => {

    const filter = i => (i.customId === 'postuler' || i.customId == 'demission') && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('postuler')
            .setLabel('Postuler')
            .setStyle('PRIMARY'),
    );
    const rowDm = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('demission')
            .setLabel('Démissionner')
            .setStyle('DANGER'),
    );
    
    if(!args[0]) { 
        let string_metier = "";
        metiers.forEach(e => {
                if(e.id == dbUser.metier) {
                    string_metier = string_metier + `🛠️ **${e.name}** 🛠️\n`;
                } else {
                    string_metier = string_metier + `*${e.name}*\n`;            
                }
        });
        return message.channel.send("Liste des métiers : \n" + string_metier);
    }

    

    let metier = args[0];
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
            mt = client.filterById(metiers, dbUser.metier);
        } else {
            mt = client.filterByName(metiers, metier);
        }
             
        
        collector.on('collect', async i => {
            if (i.customId === 'postuler') {
                await i.deferUpdate();

                if(mt.prerequis == "/") { // il n'y a pas de condition
                } else {
                    var result = eval('(function() {' + mt.prerequis + '}())');
                    if(result == true) {} // continuer
                    else return await i.editReply({ content:`Vous n'avez pas les qualifications nécessaires !\n${mt.infos}`, components: [] });
                    
                }
                if(dbUser.metier > 900) {
                    return await i.editReply({ content:`Vous ne pouvez pas exercez un autre métier que celui défini par votre titre politique ou si vous êtes maître de faction !`, components: [] });
                }

                await i.editReply({ content:`Vous exercez à présent le métier de **${mt.name}**. Pour commencer, consultez la commande p<travail !`, components: [] });
                return await client.updateUser(message.member, {metier: mt.id});
            }
            if(i.customId === 'demission') {
                await i.deferUpdate();
                await i.editReply({ content:`Vous avec démissioné du métier de **${mt.name}**.`, components: [] });
                return await client.updateUser(message.member, {metier: 0});
            }
        });
        if(mt.id == dbUser.metier) { // a déjà ce métier
            if(mt.id > 900) { // métier non démisionable ainsi
                message.channel.send({content: `**${mt.name}**\n${mt.description}\nVous exercez ce métier.\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`, components: [] });
            } else {
                message.channel.send({content: `**${mt.name}**\n${mt.description}\nVous exercez ce métier.\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`, components: [rowDm] });
            }
        } else {
            if(mt.id > 900) { // métier ne peut pas être pratiqué ainsi
                message.channel.send({content: `**${mt.name}**\n${mt.description}\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`});
            } else {
                message.channel.send({content: `**${mt.name}**\n${mt.description}\n**${mt.salaire}** :coin: de l'heure\n**${mt.horaires}** heures d'affilées maximum.\n\n${mt.infos}`, components: [row] });

            }
        }

    } catch (error) {
        message.channel.send("Ce métier n'existe pas.");
    }
};

module.exports.help = {
    name: "métier",
    aliases: ["metiers", "metier"],
    category: "economie",
    desription: "Trouvez un métier.",
    usage: "[metier/moi]",
    cooldown: 3,
    permissions: false,
    args: false
};