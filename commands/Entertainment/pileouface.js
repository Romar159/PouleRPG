const {randomInt} = require("../../util/functions/randominteger");

module.exports.run = async (client, message, args) => {

    if(!args[0]) {
        if(randomInt(1,2) == 1)
            return message.channel.send(`:coin: **PILE !**`);
        else   
            return message.channel.send(`**FACE !** :coin:`);
    }

    if(!message.mentions.users.first() || message.mentions.users.first().id == message.author.id) return message.reply("ERROR, mention invalide");
    if(isNaN(args[1]) || args[1] <= 0) return message.reply("ERROR, valeur invalide");

    let memberp2 = message.guild.member(message.mentions.users.first());

    let player1 = await client.getUser(message.member); // BDD du player 1
    let player2 = await client.getUser(memberp2);

    let or_parie = args[1];

    let choix_p1, choix_p2;
    let choix_p2_nom;

    if(or_parie > player1.or || or_parie > player2.or) return message.reply("ERROR, un ou les deux membres n'ont pas assez d'or");

    if(args[2].toLowerCase() != "pile" || args[2].toLowerCase() != "face") return message.reply("ERROR, cette face de la pièce n'existe pas.");
    
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


    message.channel.send(`${player2}, ${player1} vous a défié au pile ou face ! (envoyez "accepter" pour parier sur ${choix_p2_nom} !)`);
    const filter = m => (player2.user.id === m.author.id);
        const userEntry = await message.channel.awaitMessages(filter, {
            max:1, time:10000, errors: ['time']
        });
    
    if(userEntry.first().content.toLowerCase() === "accepter") {
        if(randomInt(1,2) == 1) {
            // Pile
            if(choix_p1 == 1 && choix_p2 == 2) return message.channel.send(`PILE, ${player1} GAGNE`);
            if(choix_p2 == 1 && choix_p1 == 2) return message.channel.send(`PILE, ${player2} GAGNE`);

        } else {
            if(choix_p1 == 1 && choix_p2 == 2) return message.channel.send(`FACE, ${player1} GAGNE`);
            if(choix_p2 == 1 && choix_p1 == 2) return message.channel.send(`FACE, ${player2} GAGNE`);
            // Face
        }
    }
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