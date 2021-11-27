const { MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    let points = ["puissance", "piete", "prestige", "richesse", "travail", "forme", "savoir", "moral"]
    if(!message.mentions.users.first()) return message.reply('Veuillez renseigner un utilisateur valide.');

    let memb = message.guild.members.cache.get(message.mentions.users.first().id);

    if(isNaN(args[2])) return message.reply(`Veuillez renseigner une valeur numérique.`);
    
    for(let i = 0; i < points.length; i++) {
        if(args[1] != points[i]) {
            if(i >= 7) {
                return message.reply("Le type de point n'est pas valide. " + points); 
            }
        } else {
            break;
        }
    }
    
   
    
    await client.editPoint(client, memb, parseInt(args[2]), args[1]);
    message.channel.send(`${parseInt(args[2])} points de ${args[1]} édité à ${memb.user.username}`);
    
};
  
module.exports.help = {
    name: "setpoint",
    aliases: [],
    category: "admin",
    desription: "Editez les points d'un utilisateur.",
    usage: '<@USER> <point> <quantité>',
    cooldown: 2, 
    permissions: true,
    args: true
};