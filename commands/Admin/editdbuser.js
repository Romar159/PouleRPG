module.exports.run = async (client, message, args, settings) => {
    const json_armes = require('../../assets/rpg/armes.json');

    const getSetting = args[1];
    const newSetting = args.slice(2).join(" ");

    const all_elements = ['**class** [string]', '**combat_favoriteposition** [string]', '**combat_hatedposition** [string]', '**level** [int]', '**metier** [int]', 
    '**cooldown_metier** [Date]', '**cooldown_arene** [Date]', '**cooldown_pray** [Date]', '**cooldown_tacty** [Date]', '**cooldown_pari** [Date]', '**cooldown_ennemi** [Date]', '**cooldown_entrainement** [Date]', '**cooldown_expedition** [Date]',
    '**badges_possedes** [string]', '**foundedeastereggs** [string]', '**arene_streak** [int]', '**titre_honorifique** [string]', '**preferences_defaultarene** [string]', '**armefavorite** [int]', '**in_jail** [boolean]',
    '**on_mission** [boolean]', '**conspiring** [boolean]', '**working** [boolean]', '**working** [boolean]']

    if(!args[0]) {
        return message.channel.send(`${all_elements.join(`\n`)}`);
    }

    let member = message.guild.members.cache.get(message.mentions.users.first().id);
    let dbMember = await client.getUser(member);
 
    switch(getSetting) {
        case "class": {
            if(newSetting) {
                await client.updateUser(member, {class: newSetting});
                return message.channel.send(`Class mise à jour : \`${dbMember.class}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.class} \n\nguerrier;archer;cavalier`);
            break;
        }
        case "combat_favoriteposition": {
            if(newSetting) {
                await client.updateUser(member, {combat_favoriteposition: newSetting});
                return message.channel.send(`combat_favoriteposition mise à jour : \`${dbMember.combat_favoriteposition}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.combat_favoriteposition} \n\ngauche;centre;droite`);
            break;
        }
        case "combat_hatedposition": {
            if(newSetting) {
                await client.updateUser(member, {combat_hatedposition: newSetting});
                return message.channel.send(`combat_hatedposition mise à jour : \`${dbMember.combat_hatedposition}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.combat_hatedposition} \n\ngauche;centre;droite`);
            break;
        }
        case "level": {
            if(newSetting) {
                await client.updateUser(member, {level: newSetting});
                return message.channel.send(`level mise à jour : \`${dbMember.level}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.level} \n\n1+`);
            break;
        }
        case "metier": {
            if(newSetting) {
                await client.updateUser(member, {metier: newSetting});
                return message.channel.send(`metier mise à jour : \`${dbMember.metier}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.metier} \n\n1-21;901-904`);
            break;
        }

        case "cooldown_metier": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_metier: newSetting});
                return message.channel.send(`cooldown_metier mise à jour : \`${dbMember.cooldown_metier}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_metier} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_arene": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_arene: newSetting});
                return message.channel.send(`cooldown_arene mise à jour : \`${dbMember.cooldown_arene}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_arene} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_pray": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_pray: newSetting});
                return message.channel.send(`cooldown_pray mise à jour : \`${dbMember.cooldown_pray}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_pray} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_tacty": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_tacty: newSetting});
                return message.channel.send(`cooldown_tacty mise à jour : \`${dbMember.cooldown_tacty}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_tacty} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_pari": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_pari: newSetting});
                return message.channel.send(`cooldown_pari mise à jour : \`${dbMember.cooldown_pari}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_pari} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_ennemi": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_ennemi: newSetting});
                return message.channel.send(`cooldown_ennemi mise à jour : \`${dbMember.cooldown_ennemi}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_ennemi} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_entrainement": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_entrainement: newSetting});
                return message.channel.send(`cooldown_entrainement mise à jour : \`${dbMember.cooldown_entrainement}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_entrainement} \n\nDate;0 (reset)`);
            break;
        }
        case "cooldown_expedition": {
            if(newSetting) {
                await client.updateUser(member, {cooldown_expedition: newSetting});
                return message.channel.send(`cooldown_expedition mise à jour : \`${dbMember.cooldown_expedition}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_expedition} \n\nDate;0 (reset)`);
            break;
        }
        case "badges_possedes": {
            if(newSetting) {
                await client.updateUser(member, {badges_possedes: newSetting});
                return message.channel.send(`badges_possedes mise à jour : \`${dbMember.badges_possedes}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.cooldown_expedition} \n\nDate;0 (reset)`);
            break;
        }
        case "foundedeastereggs": {
            if(newSetting) {
                await client.updateUser(member, {foundedeastereggs: newSetting});
                return message.channel.send(`foundedeastereggs mise à jour : \`${dbMember.foundedeastereggs}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.foundedeastereggs} \n\n0-9`);
            break;
        }
        case "arene_streak": {
            if(newSetting) {
                await client.updateUser(member, {arene_streak: newSetting});
                return message.channel.send(`arene_streak mise à jour : \`${dbMember.arene_streak}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.arene_streak} \n\n0+`);
            break;
        }
        case "titre_honorifique": {
            if(newSetting) {
                await client.updateUser(member, {titre_honorifique: newSetting});
                return message.channel.send(`titre_honorifique mise à jour : \`${dbMember.titre_honorifique}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.titre_honorifique} \n\nNULL;1- Le généreux/La généreuse;2- Le grand/La grande;3- Le valeureux/La valeureuse;4- Le Beau/La belle`);
            break;
        }
        case "preferences_defaultarene": {
            if(newSetting) {
                await client.updateUser(member, {preferences_defaultArene: newSetting});
                return message.channel.send(`preferences_defaultArene mise à jour : \`${dbMember.preferences_defaultArene}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.preferences_defaultArene} \n\ndague;glaive;lance;arbalète;claymore | OUTDATED`);
            break;
        }
        case "armefavorite": {
            if(newSetting) {
                await client.updateUser(member, {armeFavorite: Number(newSetting)});
                return message.channel.send(`armeFavorite mise à jour : \`${dbMember.armeFavorite}\`->\`${Number(newSetting)}\``);
            }
            message.channel.send(`Actuel : ${dbMember.armeFavorite} \n\n${json_armes[0].id};${json_armes[1].id};${json_armes[2].id};${json_armes[3].id};${json_armes[4].id}`);
            break;
        }
        case "in_jail": {
            if(newSetting) {
                await client.updateUser(member, {in_jail: newSetting});
                return message.channel.send(`in_jail mise à jour : \`${dbMember.in_jail}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.in_jail} \n\ntrue;false`);
            break;
        }
        case "conspiring": {
            if(newSetting) {
                await client.updateUser(member, {conspiring: newSetting});
                return message.channel.send(`conspiring mise à jour : \`${dbMember.conspiring}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.conspiring} \n\ntrue;false`);
            break;
        }
        case "working": {
            if(newSetting) {
                await client.updateUser(member, {working: newSetting});
                return message.channel.send(`working mise à jour : \`${dbMember.working}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.working} \n\ntrue;false`);
            break;
        }
        case "training": {
            if(newSetting) {
                await client.updateUser(member, {training: newSetting});
                return message.channel.send(`training mise à jour : \`${dbMember.training}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.training} \n\ntrue;false`);
            break;
        }
        case "on_mission": {
            if(newSetting) {
                await client.updateUser(member, {on_mission: newSetting});
                return message.channel.send(`on_mission mise à jour : \`${dbMember.on_mission}\`->\`${newSetting}\``);
            }
            message.channel.send(`Actuel : ${dbMember.on_mission} \n\ntrue;false`);
            break;
        }
    }
 };
   
 module.exports.help = {
     name: "editdbuser",
     aliases: [],
     category: "admin",
     desription: "Modifie la base de données d'un utilisateur",
     usage: '<@user> <key> <value>',
     cooldown: 0, 
     permissions: true,
     args: false
 };