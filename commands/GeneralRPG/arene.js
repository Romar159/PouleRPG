const {guild, EmbedBuilder} = require("discord.js");
const {PREFIX} = require('../../config');


module.exports.run = async (client, message, args, settings, dbUser, command) => {

    //if(dbUser.expedition_duration != 0) return message.reply("Vous ne pouvez pas combattre dans l'arène si vous êtes en expédition.");
    if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas combattre dans l'arène.");
    if(dbUser.on_mission == 'true') return message.reply("Vous êtes en mission, il vous est donc impossible de combattre dans l'arène.");
    //if(dbUser.working == 'true') return message.reply("Vous êtes en train de travailler, vous ne pouvez donc pas vous battre dans l'arène.");


    const list_badges = require('../../assets/rpg/badges.json');
    const armes = require('../../assets/rpg/armes.json');
    const dailyCD = 300000;
    let user_weapon;
    let bot_weapon = armes[client.randomInt(0, 4)];
    //let bot_weapon_name = "";
    /*if(bot_weapon == 1) bot_weapon_name = "la dague";             //> 3 & 5  •  < 2 & 4
    else if(bot_weapon == 2) bot_weapon_name = "le glaive";       //> 1 & 4  •  < 3 & 5
    else if(bot_weapon == 3) bot_weapon_name = "la lance";        //> 2 & 5  •  < 1 & 4
    else if(bot_weapon == 4) bot_weapon_name = "l'arbalète";      //> 1 & 3  •  < 2 & 5
    else if(bot_weapon == 5) bot_weapon_name = "la claymore";     //> 2 & 4  •  < 1 & 3*/
    let bot_weapon_name = bot_weapon.arene_name;

    const xp_defaite = dbUser.level;
    const xp_egalite = dbUser.level;
    const xp_win = (dbUser.level * 2);
    const or_win = 3; 

    //const weapon_name = ["la dague", "le glaive", "la lance", "l'arbalète", "la claymore"];


    const embed = new EmbedBuilder()
    .setAuthor({name:`Un combat a lieu !`, iconURL: message.author.displayAvatarURL()});

    let userWeaponID = dbUser.armeFavorite;
    if(args[0]) usr_c = args[0].toLowerCase();

    if(!dbUser.or) await client.updateUser(message.member, {or: 0});
    if(!dbUser.experience) await client.updateUser(message.member, {experience: 0});
    if(!dbUser.level) await client.updateUser(message.member, {level: 1});


    const lastDaily = await dbUser.cooldown_arene;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il reste **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de retourner dans l'arène. :hourglass:`);
    } else { // Si le cooldown est passé.

        // Calcul de l'arme choisit par l'utilisateur.
        //let user_weapon_name = "";

        if(args[0]) {
            if(usr_c.startsWith("é")) {
                userWeaponID = 0;
            } else if(usr_c.startsWith("a")) {
                userWeaponID = 1;
            } else if(usr_c.startsWith("p")) {
                userWeaponID = 2;
            } else if(usr_c.startsWith("b")) {
                userWeaponID = 3;
            } else if(usr_c.startsWith("m")) {
                userWeaponID = 4;
            }
        }

        let userWeapon = armes[userWeaponID];

        
        
        //Combat:

        /*if(user_weapon == 1 && bot_weapon == 5 || user_weapon == 1 && bot_weapon == 3
        || user_weapon == 2 && bot_weapon == 1 || user_weapon == 2 && bot_weapon == 4
        || user_weapon == 3 && bot_weapon == 2 || user_weapon == 3 && bot_weapon == 5
        || user_weapon == 4 && bot_weapon == 1 || user_weapon == 4 && bot_weapon == 3
        || user_weapon == 5 && bot_weapon == 4 || user_weapon == 5 && bot_weapon == 2) {*/ // Gagner
        if(userWeapon.fort[0] == bot_weapon.id || userWeapon.fort[1] == bot_weapon.id) {
            //victoire
			if(client.randomInt(1, 5) == 5) {
				embed.setDescription(`Vous utilisez **${userWeapon.arene_name}** et prenez l'avantage alors que votre adversaire utilise **${bot_weapon.arene_name}** !\nVous **gagnez**, **+${xp_win}xp** et **+${or_win} poyn :coin:**.`);
				await client.setOr(client, message.member, or_win, message);
			} else {
				embed.setDescription(`Vous utilisez **${userWeapon.arene_name}** et prenez l'avantage alors que votre adversaire utilise **${bot_weapon.arene_name}** !\nVous **gagnez**, **+${xp_win}xp**.`);
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
        else if(userWeapon.id == bot_weapon.id) { // égalité
            embed.setDescription(`Vous utilisez **${userWeapon.arene_name}**, l'adversaire aussi !\nC'est une **égalité**, **+${xp_egalite}xp**.`)
            .setColor('5E6366');
            message.channel.send({embeds:[embed]});
            await client.setXp(client, message.member, xp_egalite);
            await client.updateUser(message.member, {arene_streak: 0});
        }
        else { // defaite
            embed.setDescription(`Vous êtes en désavantage en utilisant **${userWeapon.arene_name}** tandis que votre adversaire utilise **${bot_weapon.arene_name}** !\nVous **perdez**... **-${xp_defaite}xp**.`)
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
    desription: "Entraînez-vous dans l'arène pour gagner de l'xp... ou en perdre.",
    usage: '[épée/arc/pique/bouclier/marteau]',
    cooldown: 3, 
    permissions: false,
    args: false
};