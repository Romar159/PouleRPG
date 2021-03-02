const { guild, MessageEmbed } = require("discord.js");
const {randomInt} = require('../../util/functions/randominteger');
const {PREFIX} = require('../../config');


module.exports.run = async (client, message, args, settings, dbUser, command) => {
    const dailyCD = 60000;
    let user_weapon;
    let bot_weapon = parseInt(randomInt(1, 3));

    let usr_c = args[0].toLowerCase();

    if(!dbUser.or) await client.updateUser(message.member, {or: 0});
    if(!dbUser.experience) await client.updateUser(message.member, {experience: 0});
    if(!dbUser.level) await client.updateUser(message.member, {level: 1});


    const lastDaily = await dbUser.cooldown_arene;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il reste ${Math.floor(cdTime / (1000) % 60)} secondes avant de retourner dans l'arène.`);
    } else { // Si le cooldown est passé.

        // Calcul de l'arme choisit par l'utilisateur.
        if(usr_c.startsWith("t")) {
            user_weapon = 1;
        } else if(usr_c.startsWith("l")) {
            user_weapon = 2;
        } else if(usr_c.startsWith("m")) {
            user_weapon = 3;
        } else {
      
            let noArgsReply = `Synthax Error ${message.author}`;

            if(command.help.usage) noArgsReply += `\nSyntaxe: \`${PREFIX}${command.help.name} ${command.help.usage}\``;
                return message.channel.send(noArgsReply);

        }

        //Combat:

        if(user_weapon == bot_weapon) {
            message.channel.send("Egalité. +2 xp");
            await client.setXp(client, message.member, 2);
        } 
        else if(user_weapon == 1 && bot_weapon == 2 
                || user_weapon == 2 && bot_weapon == 3 
                || user_weapon == 3 && bot_weapon == 1) {

                message.channel.send("Win. +7 xp +1 or");
               // client.updateUser(message.member, {experience: parseInt(dbUser.experience) + 7, or: parseInt(dbUser.or) + 1});
               //client.setOr(message.member, 1);
               await client.setOr(client, message.member, 1, message);
               await client.setXp(client, message.member, 7);

        } 
        else if(user_weapon == 1 && bot_weapon == 3
                || user_weapon == 2 && bot_weapon == 1
                || user_weapon == 3 && bot_weapon == 2) {

                message.channel.send("Lose. -2 xp");
                await client.setXp(client, message.member, -2);
        }
        client.updateUser(message.member, {cooldown_arene: Date.now()});
    }

}

module.exports.help = {
    name: "arene",
    aliases: ['arene'],
    category: "generalrpg",
    desription: "Entrainez vous dans l'arène.",
    usage: '<tomahawk/lance/masse>',
    cooldown: 3, 
    permissions: false,
    args: true
};