const {guild, MessageEmbed} = require("discord.js");
const {PREFIX} = require('../../config');


module.exports.run = async (client, message, args, settings, dbUser, command) => {
    const list_badges = require('../../assets/rpg/badges.json');
    const dailyCD = 60000;
    let user_weapon;
    let bot_weapon = client.randomInt(1, 5);
    let bot_weapon_name = "";
    if(bot_weapon == 1) bot_weapon_name = "la dague";             //> 3 & 5  •  < 2 & 4
    else if(bot_weapon == 2) bot_weapon_name = "le glaive";       //> 1 & 4  •  < 3 & 5
    else if(bot_weapon == 3) bot_weapon_name = "la lance";        //> 2 & 5  •  < 1 & 4
    else if(bot_weapon == 4) bot_weapon_name = "l'arbalète";      //> 1 & 3  •  < 2 & 5
    else if(bot_weapon == 5) bot_weapon_name = "la claymore";     //> 2 & 4  •  < 1 & 3

    const xp_defaite = 3;
    const xp_egalite = 3;
    const xp_win = 8;
    const or_win = 1; 

    const weapon_name = ["la dague", "le glaive", "la lance", "l'arbalète", "la claymore"];


    const embed = new MessageEmbed()
    .setAuthor(`Un combat a lieu !`, message.author.displayAvatarURL());

    let usr_c = dbUser.preferences_defaultArene;
    if(args[0]) usr_c = args[0].toLowerCase();

    if(!dbUser.or) await client.updateUser(message.member, {or: 0});
    if(!dbUser.experience) await client.updateUser(message.member, {experience: 0});
    if(!dbUser.level) await client.updateUser(message.member, {level: 1});


    const lastDaily = await dbUser.cooldown_arene;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il reste **${Math.floor(cdTime / (1000) % 60)}** secondes avant de retourner dans l'arène. :hourglass:`);
    } else { // Si le cooldown est passé.

        // Calcul de l'arme choisit par l'utilisateur.
        let user_weapon_name = "";

        if(usr_c.startsWith("d")) {
            user_weapon = 1;
            user_weapon_name = "la dague";
        } else if(usr_c.startsWith("g")) {
            user_weapon = 2;
            user_weapon_name = "le glaive";
        } else if(usr_c.startsWith("l")) {
            user_weapon = 3;
            user_weapon_name = "la lance";
        } else if(usr_c.startsWith("a")) {
            user_weapon = 4;
            user_weapon_name = "l'arbalète";
        } else if(usr_c.startsWith("c")) {
            user_weapon = 5;
            user_weapon_name = "la claymore";
        } else {
            /*let noArgsReply = `Synthax Error ${message.author}`;
            if(command.help.usage) noArgsReply += `\nSyntaxe : \`${PREFIX}${command.help.name} ${command.help.usage}\``;
                return message.channel.send(noArgsReply);*/
            user_weapon = client.randomInt(1, 5);
            user_weapon_name = weapon_name[user_weapon - 1];
        }
        
        //Combat:

        if(user_weapon == 1 && bot_weapon == 5 || user_weapon == 1 && bot_weapon == 3
        || user_weapon == 2 && bot_weapon == 1 || user_weapon == 2 && bot_weapon == 4
        || user_weapon == 3 && bot_weapon == 2 || user_weapon == 3 && bot_weapon == 5
        || user_weapon == 4 && bot_weapon == 1 || user_weapon == 4 && bot_weapon == 3
        || user_weapon == 5 && bot_weapon == 4 || user_weapon == 5 && bot_weapon == 2) { // Gagner
		
			if(client.randomInt(1, 3) == 3) {
				embed.setDescription(`Vous utilisez **${user_weapon_name}** et prenez l'avantage alors que votre adversaire utilise **${bot_weapon_name}** !\nVous **gagnez**, **+${xp_win}xp** et **+${or_win}:coin:**.`);
				await client.setOr(client, message.member, or_win, message);
			} else {
				embed.setDescription(`Vous utilisez **${user_weapon_name}** et prenez l'avantage alors que votre adversaire utilise **${bot_weapon_name}** !\nVous **gagnez**, **+${xp_win}xp**.`);
			}
			
            embed.setColor('3F992D');
			message.channel.send({embeds:[embed]});
			await client.setXp(client, message.member, xp_win);
            
            await client.updateUser(message.member, {arene_streak: dbUser.arene_streak + 1});

            if((dbUser.arene_streak + 1) == 5) {
                if(await client.addBadge(client, message.member, dbUser, "0")) {
                    message.channel.send(`WOW !! ${message.member} vient de gagner le badge **${client.filterById(list_badges, 0).name}** !`);
                }
            }
        }
        else if(user_weapon == bot_weapon) { // égalité
            embed.setDescription(`Vous utilisez **${user_weapon_name}**, l'adversaire aussi !\nC'est une **égalité**, **+${xp_egalite}xp**.`)
            .setColor('5E6366');
            message.channel.send({embeds:[embed]});
            await client.setXp(client, message.member, xp_egalite);
            await client.updateUser(message.member, {arene_streak: 0});
        }
        else { // defaite
            embed.setDescription(`Vous êtes en désavantage en utilisant **${user_weapon_name}** tandis que votre adversaire utilise **${bot_weapon_name}** !\nVous **perdez**... **-${xp_defaite}xp**.`)
            .setColor('BF2F00');
            message.channel.send({embeds:[embed]});
            await client.setXp(client, message.member, -xp_defaite);
            await client.updateUser(message.member, {arene_streak: 0});
        }

        client.updateUser(message.member, {cooldown_arene: Date.now()});
    }

}

module.exports.help = {
    name: "arène",
    aliases: ['arene'],
    category: "generalrpg",
    desription: "Entraînez-vous dans l'arène.",
    usage: '[dague/glaive/lance/arbalète/claymore]',
    cooldown: 3, 
    permissions: false,
    args: false
};