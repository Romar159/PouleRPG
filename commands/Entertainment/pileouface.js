const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports.run = async (client, message, args) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    

    if(!args[0]) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Pile ou Face solo.`);

        if(client.randomInt(1,2) == 1)
            return message.channel.send(`:coin: **PILE !**`);
        else   
            return message.channel.send(`**FACE !** :coin:`);
    }

    if(!message.mentions.users.first() || message.mentions.users.first().id == message.author.id) return message.reply("ERROR, mention invalide") &client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Mention Invalide. MESSAGE=${message.content}.`, "err");
    if(isNaN(args[1]) || args[1] <= 0) return message.reply("ERROR, valeur invalide") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Valeur Invalide. MESSAGE=${mesasge.content}.`, "err");

    let memberp2 = message.guild.members.cache.get(message.mentions.users.first().id);

    let player1 = await client.getUser(message.member); // BDD du player 1
    let player2 = await client.getUser(memberp2);

    let or_parie = args[1];

    let choix_p1, choix_p2;
    let choix_p2_nom;

    if(or_parie > player1.or || or_parie > player2.or) return message.reply("ERROR, un ou les deux membres n'ont pas assez d'or") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Un membre ou les deux n'a pas assez d'or. OR=${or_parie} | OR_J1=${player1.or} | OR_J2=${player2.or}. MESSAGE=${message.content}`, "err");

    if(!args[2]) return message.reply("Veuillez choisir pile ou face");
    if(args[2].toLowerCase() != "pile") {
        if(args[2].toLowerCase() != "face") {
            client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Face de pièce inexistante. MESSAGE=${message.content}`, "err");
            return message.reply("ERROR, cette face de la pièce n'existe pas.");
        }
    }  
    
    if(args[2].toLowerCase() == "pile") {
        choix_p1 = 1; 
        choix_p2 = 2;

        choix_p2_nom = "face";
    }

    else if(args[2].toLowerCase() == "face") {
        choix_p1 = 2; 
        choix_p2 = 1;

        choix_p2_nom = "pile";
    }

    const filter = i => (i.customId === 'confirmation' || i.customId === 'refus') && i.user.id === message.mentions.users.first().id;
    
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('confirmation')
            .setLabel('Oui !')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('refus')
            .setLabel('Non')
            .setStyle(ButtonStyle.Danger),
    );

    collector.on('collect', async i => {
        if (i.customId === 'confirmation') {
            await i.deferUpdate();

            if(client.randomInt(1,2) == 1) {
                // Pile
                if(choix_p1 == 1 && choix_p2 == 2) {
                    await client.setOr(client, message.member, or_parie, message);
                    await client.setOr(client, memberp2, -or_parie, message);
                    await i.editReply({ content:`PILE, ${player1.username} GAGNE et récupère ${or_parie} :coin: à ${player2.username}`, components: [] });
                } 
                if(choix_p2 == 1 && choix_p1 == 2) {
                    
                    await client.setOr(client, message.member, -or_parie, message);
                    await client.setOr(client, memberp2, or_parie, message);
                    await i.editReply({ content:`PILE, ${player2.username} GAGNE et récupère ${or_parie} :coin: à ${player1.username}`, components: [] });
                    
                } 
    
            } else {
                // Face
                if(choix_p1 == 1 && choix_p2 == 2) {
    
                    await client.setOr(client, message.member, -or_parie, message);
                    await client.setOr(client, memberp2, or_parie, message);
                    await i.editReply({ content:`FACE, ${player2.username} GAGNE et récupère ${or_parie} :coin: à ${player1.username}`, components: [] });
                } 
                if(choix_p2 == 1 && choix_p1 == 2) {
                    
                    await client.setOr(client, message.member, or_parie, message);
                    await client.setOr(client, memberp2, -or_parie, message);
                    await i.editReply({ content:`FACE, ${player1.username} GAGNE et récupère ${or_parie} :coin: à ${player2.username}`, components: [] });
                } 
                
            }
        }
        else if(i.customId === 'refus') {
            await i.deferUpdate();
            await i.editReply({ content:`${player2.username} ne veut pas parier ! Il a sûrement trop peur de perdre :)`, components: [] });

        }
    });

    message.channel.send({content: `<@${player2.userID}>, <@${player1.userID}> vous a défié au pile ou face ! Voulez vous parier **${or_parie}** :coin: sur **${choix_p2_nom}** ?`, components: [row]});
    
}

module.exports.help = {
    name: "pileouface",
    aliases: ['pof'],
    category: "entertainment",
    desription: "Lance une pièce pour faire un pile ou face. Ou pariez de l'or avec un membre.",
    usage: "[@USER] [or] [pile/face]",
    cooldown: 1,
    permissions: false,
    args: false
};