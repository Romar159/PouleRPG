const { MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args) => {

    

    if(!args[0]) {
        if(client.randomInt(1,2) == 1)
            return message.channel.send(`:coin: **PILE !**`);
        else   
            return message.channel.send(`**FACE !** :coin:`);
    }

    if(!message.mentions.users.first() || message.mentions.users.first().id == message.author.id) return message.reply("ERROR, mention invalide");
    if(isNaN(args[1]) || args[1] <= 0) return message.reply("ERROR, valeur invalide");

    let memberp2 = message.guild.members.cache.get(message.mentions.users.first().id);

    let player1 = await client.getUser(message.member); // BDD du player 1
    let player2 = await client.getUser(memberp2);

    let or_parie = args[1];

    let choix_p1, choix_p2;
    let choix_p2_nom;

    if(or_parie > player1.or || or_parie > player2.or) return message.reply("ERROR, un ou les deux membres n'ont pas assez d'or");

    if(!args[2]) return message.reply("Veuillez choisir pile ou face");
    if(args[2].toLowerCase() != "pile") {
        if(args[2].toLowerCase() != "face") {
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
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('confirmation')
            .setLabel('Oui !')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('refus')
            .setLabel('Non')
            .setStyle('DANGER'),
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