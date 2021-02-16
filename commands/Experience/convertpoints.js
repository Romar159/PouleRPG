const { guild } = require("discord.js");
const { db } = require("../../models/user");
const {randomInt} = require('../../util/functions/randominteger');

module.exports.run = async (client, message, args, settings, dbUser) => {
    const points = parseInt(args[0]);
    let final_xp = 0;
    if(points > 30) return message.channel.send("Veuillez entrez un nombre plus petit. (max: 30)");
    if(dbUser.powerpoints < points || dbUser.powerpoints <= 0) return message.reply("Vous n'avez pas assez de points.");
    if(isNaN(points) || points <= 0) return message.channel.send("Vous devez renseigner une quantité de point valide.");

    const m = message.channel.send("Calcul en cours ...").then(async msg => {
        for(let i=0;i<points;i++) {
            console.log("Tour de boucle: " + i + " " + points);
            final_xp = final_xp + randomInt(25, 65);
        }
        await client.setXp(client, message.member, final_xp);

        await client.updateUser(message.member, {"powerpoints": (dbUser.powerpoints - points)})

    
        msg.edit(`Vous avez convertit ${points} point(s) en ${final_xp} xp`);
    });
}

module.exports.help = {
    name: "convertpoints",
    aliases: ['convertpoints', 'cp', 'convertPoints'],
    category: "experience",
    desription: "Convertissez vos points de puissance en xp.",
    usage: '<points>',
    cooldown: 3, 
    permissions: false,
    args: true
};