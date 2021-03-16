const { guild, MessageEmbed } = require("discord.js");
const {randomInt} = require('../../util/functions/randominteger');
const {PREFIX} = require('../../config');


module.exports.run = async (client, message, args, settings, dbUser, command) => {
    const dailyCD = 60000;
    let user_weapon;
    let bot_weapon = randomInt(1, 5);
    let bot_weapon_name = "";
    if(bot_weapon == 1) bot_weapon_name = "le tomahawk";
    else if(bot_weapon == 2) bot_weapon_name = "la lance";
    else if(bot_weapon == 3) bot_weapon_name = "la masse";
    else if(bot_weapon == 4) bot_weapon_name = "arene.arme4.name";
    else if(bot_weapon == 5) bot_weapon_name = "arene.arme5.name";

    const xp_defaite = 2;
    const xp_egalite = 2;
    const xp_win = 7;
    const or_win = 1; 


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
            user_weapon_name = "le tomahawk";
        } else if(usr_c.startsWith("l")) {
            user_weapon = 2;
            user_weapon_name = "la lance";
        } else if(usr_c.startsWith("m")) {
            user_weapon = 3;
            user_weapon_name = "la masse";
        } else if(usr_c.startsWith("arme4")) {
            user_weapon = 4;
            user_weapon_name = "l'arme4";
        } else if(usr_c.startsWith("arme5")) {
            user_weapon = 5;
            user_weapon_name = "l'arme5";
        } else {
            let noArgsReply = `Synthax Error ${message.author}`;
            if(command.help.usage) noArgsReply += `\nSyntaxe : \`${PREFIX}${command.help.name} ${command.help.usage}\``;
                return message.channel.send(noArgsReply);
        }
        
        //Combat:

        if(user_weapon == 1 && bot_weapon == 5 || user_weapon == 1 && bot_weapon == 3
        || user_weapon == 2 && bot_weapon == 1 || user_weapon == 2 && bot_weapon == 4
        || user_weapon == 3 && bot_weapon == 2 || user_weapon == 3 && bot_weapon == 5
        || user_weapon == 4 && bot_weapon == 1 || user_weapon == 4 && bot_weapon == 3
        || user_weapon == 5 && bot_weapon == 4 || user_weapon == 5 && bot_weapon == 2) { // Gagner
		
			if(randomInt(1, 3) == 3) {
				embed.setDescription(`Vous utilisez **${user_weapon_name}** et prenez l'avantage sur votre adversaire qui utilise **${bot_weapon_name}** !\nVous **gagnez**, **+${xp_win}xp** et **+${or_win}or**.`);
				await client.setOr(client, message.member, or_win, message);
			} else {
				embed.setDescription(`Vous utilisez **${user_weapon_name}** et prenez l'avantage sur votre adversaire qui utilise **${bot_weapon_name}** !\nVous **gagnez**, **+${xp_win}xp**.`);
			}
			
			await client.setXp(client, message.member, xp_win);
			message.channel.send(embed);
        }
        else if(user_weapon == bot_weapon) { // égalité
            embed.setDescription(`Vous utilisez **${user_weapon_name}**, l'adversaire aussi !\nC'est une **égalité**, **+${xp_egalite}xp**.`);
            message.channel.send(embed);
            await client.setXp(client, message.member, xp_egalite);
        }
        else { // defaite
            embed.setDescription(`Vous êtes en désavantage en utilisant **${user_weapon_name}** tandis que votre adversaire utilise **${bot_weapon_name}** !\nVous **perdez**... **-${xp_defaite}xp**.`);
            message.channel.send(embed);
            await client.setXp(client, message.member, -xp_defaite);
        }

        client.updateUser(message.member, {cooldown_arene: Date.now()});
    }

}

module.exports.help = {
    name: "arene",
    aliases: ['arene'],
    category: "generalrpg",
    desription: "Entraînez-vous dans l'arène.",
    usage: '<tomahawk/lance/masse/arme4/arme5>',
    cooldown: 3, 
    permissions: false,
    args: true
};