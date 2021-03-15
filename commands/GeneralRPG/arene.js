const { guild, MessageEmbed } = require("discord.js");
const {randomInt} = require('../../util/functions/randominteger');
const {PREFIX} = require('../../config');


module.exports.run = async (client, message, args, settings, dbUser, command) => {
    const dailyCD = 60000;
    let user_weapon;
    let bot_weapon = parseInt(randomInt(1, 3));
    let bot_weapon_name = "";
    if(bot_weapon == 1) bot_weapon_name = "le tomahawk";
    else if(bot_weapon == 2) bot_weapon_name = "la lance";
    else if(bot_weapon == 3) bot_weapon_name = "la masse";

    /* TODO : Rajouter 2 autres armes et rajouter le fait que l'xp est stocké dans une variable pour pouvoir la changer avec les rôels bans */

    const embed = new MessageEmbed()
    .setColor('BF2F00')
    .setAuthor(`Un combat a lieu !`, client.user.displayAvatarURL());

    let usr_c = args[0].toLowerCase();

    if(!dbUser.or) await client.updateUser(message.member, {or: 0});
    if(!dbUser.experience) await client.updateUser(message.member, {experience: 0});
    if(!dbUser.level) await client.updateUser(message.member, {level: 1});


    const lastDaily = await dbUser.cooldown_arene;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`il reste **${Math.floor(cdTime / (1000) % 60)}** secondes avant de retourner dans l'arène. :hourglass:`);
    } else { // Si le cooldown est passé.

        // Calcul de l'arme choisit par l'utilisateur.
        let user_weapon_name = "";

        if(usr_c.startsWith("t")) {
            user_weapon = 1;
        } else if(usr_c.startsWith("l")) {
            user_weapon = 2;
        } else if(usr_c.startsWith("m")) {
            user_weapon = 3;
        } else {

        let noArgsReply = `Synthax Error ${message.author}`;

        if(command.help.usage) noArgsReply += `\nSyntaxe : \`${PREFIX}${command.help.name} ${command.help.usage}\``;
            return message.channel.send(noArgsReply);
        }
        
        if(user_weapon == 1) user_weapon_name = "le tomahawk";
        else if(user_weapon == 2) user_weapon_name = "la lance";
        else if(user_weapon == 3) user_weapon_name = "la masse";

        //Combat:

        if(user_weapon == bot_weapon) {
            embed.setDescription(`Vous utilisez **${user_weapon_name}**, l'adversaire fait de même !\nC'est une **égalité**, **+2xp**.`);
            message.channel.send(embed);
            await client.setXp(client, message.member, 2);
        } 
        else if(user_weapon == 1 && bot_weapon == 2 
                || user_weapon == 2 && bot_weapon == 3 
                || user_weapon == 3 && bot_weapon == 1) {
            
                embed.setDescription(`Vous utilisez **${user_weapon_name}** et prenez l'avantage sur votre adversaire qui utilise **${bot_weapon_name}** !\nVous **gagnez**, **+7xp** et **+1or**.`);
                message.channel.send(embed);
               // client.updateUser(message.member, {experience: parseInt(dbUser.experience) + 7, or: parseInt(dbUser.or) + 1});
               //client.setOr(message.member, 1);
               await client.setOr(client, message.member, 1, message);
               await client.setXp(client, message.member, 7);

        } 
        else if(user_weapon == 1 && bot_weapon == 3
                || user_weapon == 2 && bot_weapon == 1
                || user_weapon == 3 && bot_weapon == 2) {

                embed.setDescription(`Vous êtes en désavantage en utilisant **${user_weapon_name}** tandis que votre adversaire utilise **${bot_weapon_name}** !\nVous **perdez**... **-2xp**.`);
                message.channel.send(embed);
                await client.setXp(client, message.member, -2);
        }
        client.updateUser(message.member, {cooldown_arene: Date.now()});
    }

}

module.exports.help = {
    name: "arene",
    aliases: ['arene'],
    category: "generalrpg",
    desription: "Entraînez-vous dans l'arène.",
    usage: '<tomahawk/lance/masse>',
    cooldown: 3, 
    permissions: false,
    args: true
};