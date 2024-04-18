const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {

    let faction = await client.getFaction(dbUser.faction);
    let channel;
    

    if(!args[0]) {
        if(faction == undefined) return message.reply(`Vous n'êtes pas membre d'une faction, veuillez préciser la faction dont vous souhaitez connaître le conseil. (p<conseil <faction>)`);
        
        var embed_ConseilList = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Conseil de la faction ${faction.displayname}`)
        .addFields([{name:`**Maréchal**`, value:`${faction.marechal == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.marechal)}`, inline:true}, 
                   {name:`**Intendant**`, value:`${faction.intendant == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.intendant)}`, inline:true}, 
                   {name:`**Chapelain**`, value:`${faction.chapelain == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.chapelain)}`, inline:true}])
        
        return message.channel.send({embeds:[embed_ConseilList]});
        
        //return message.channel.send(`**${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}**\n\nMaréchal: ${faction.marechal == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.marechal).user.username} \nIntendant: ${faction.intendant == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.intendant).user.username} \nChapelain: ${faction.chapelain == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.chapelain).user.username}`)
    }
    let arg1 = args[0].toLowerCase();
    
    if(faction != undefined) {
        channel = await client.channels.cache.get(faction.channelid);
    }

    if(arg1 == "nommer") {
        var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
        var est_maitre = false;

        for(let y=0; y<roles_maitre.length; y++) {
            if(message.member.roles.cache.has(roles_maitre[y])) {
                est_maitre = true;
                break;
            } else {
                est_maitre = false;
            }
        }
        if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");
        // --

        if(!message.mentions.users.first()) return message.reply('Mention invalide.');
        if(message.mentions.users.first().id == message.member.user.id) return message.reply("Vous ne pouvez pas vous nommer vous-même à un poste du conseil.");

        let nouveau_conseiller = message.guild.members.cache.get(message.mentions.users.first().id);
        let dbNouveauConseiller = await client.getUser(nouveau_conseiller);
        if(dbNouveauConseiller.faction != dbUser.faction) return message.reply("Cet utilisateur n'est pas membre de votre faction.");

        let id_titre = 0; // 1 -> Maréchal ; 2 -> Intendant ; 3 -> Chapelain ; 0 -> NULL
        let info = "";
        let ancien_conseiller;

        if(!args[2]) return message.reply("Vous devez définir un titre (Maréchal/Intendant/Chapelain)");

        if(args[2].toLowerCase() == "maréchal" || args[2].toLowerCase() == "marechal") {
            if(dbNouveauConseiller.userID == faction.marechal) return message.reply('Cet utilisateur fait déjà parti du conseil sous ce rôle.');
            if(dbNouveauConseiller.userID == faction.intendant) {
                await client.editPoint(client, nouveau_conseiller, -200, "prestige");
                await client.updateFaction(dbUser.faction, {intendant: "NULL"});
            }
            if(dbNouveauConseiller.userID == faction.chapelain) {
                await client.editPoint(client, nouveau_conseiller, -200, "prestige");
                await client.updateFaction(dbUser.faction, {chapelain: "NULL"});
            }

            // Maréchal
            if(faction.marechal != "NULL") {
                ancien_conseiller = message.guild.members.cache.get(faction.marechal);
                await client.editPoint(client, ancien_conseiller, -200, "prestige");
                await client.updateUser(ancien_conseiller, {metier: 0});
                info = "<@" + ancien_conseiller.user.id + ">" + " vient d'être retiré(e) du conseil, il ou elle perd donc 200 prestige. Son rôle de Maréchal est desormais exercé par " + "<@" + nouveau_conseiller.user.id + ">";
            }
            await client.editPoint(client, nouveau_conseiller, 200, "prestige");
            await client.updateFaction(dbUser.faction, {marechal: nouveau_conseiller.user.id});
            await client.updateUser(nouveau_conseiller, {metier: 901});
            //return message.channel.send(`${nouveau_conseiller.user.username} vient d'être nommé(e) Maréchal de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}. Il ou elle gagne 200 prestige.\n` + info);
            return channel.send(`${nouveau_conseiller.user.username} vient d'être nommé(e) Maréchal de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}. Il ou elle gagne 200 prestige.\n` + info);

        }

        else if(args[2].toLowerCase() == "intendant") {
            if(dbNouveauConseiller.userID == faction.intendant) return message.reply('Cet utilisateur fait déjà parti du conseil sous ce rôle.');
            if(dbNouveauConseiller.userID == faction.marechal) {
                await client.editPoint(client, nouveau_conseiller, -200, "prestige");
                await client.updateFaction(dbUser.faction, {marechal: "NULL"});
            }
            if(dbNouveauConseiller.userID == faction.chapelain) {
                await client.editPoint(client, nouveau_conseiller, -200, "prestige");
                await client.updateFaction(dbUser.faction, {chapelain: "NULL"});
            }

            // Intendant
            if(faction.intendant != "NULL") {
                ancien_conseiller = message.guild.members.cache.get(faction.intendant);
                await client.editPoint(client, ancien_conseiller, -200, "prestige");
                await client.updateUser(ancien_conseiller, {metier: 0});
                info = "<@" + ancien_conseiller.user.id + ">" + " vient d'être retiré(e) du conseil, il ou elle perd donc 200 prestige. Son rôle d'Intendant(e) est desormais exercé par " + "<@" + nouveau_conseiller.user.id + ">";
            }
            await client.editPoint(client, nouveau_conseiller, 200, "prestige");
            await client.updateFaction(dbUser.faction, {intendant: nouveau_conseiller.user.id});
            await client.updateUser(nouveau_conseiller, {metier: 902});
            //return message.channel.send(`${nouveau_conseiller.user.username} vient d'être nommé(e) Intendant(e) de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}. Il ou elle gagne 200 prestige.\n` + info);
            return channel.send(`${nouveau_conseiller.user.username} vient d'être nommé(e) Intendant(e) de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}. Il ou elle gagne 200 prestige.\n` + info);

        }
        else if(args[2].toLowerCase() == "chapelain") {
            if(dbNouveauConseiller.userID == faction.chapelain) return message.reply('Cet utilisateur fait déjà parti du conseil sous ce rôle.');
            if(dbNouveauConseiller.userID == faction.marechal) {
                await client.editPoint(client, nouveau_conseiller, -200, "prestige");
                await client.updateFaction(dbUser.faction, {marechal: "NULL"});
            }
            if(dbNouveauConseiller.userID == faction.intendant) {
                await client.editPoint(client, nouveau_conseiller, -200, "prestige");
                await client.updateFaction(dbUser.faction, {intendant: "NULL"});
            }

            // Chapelain
            if(faction.chapelain != "NULL") {
                ancien_conseiller = message.guild.members.cache.get(faction.chapelain);
                await client.editPoint(client, ancien_conseiller, -200, "prestige");
                await client.updateUser(ancien_conseiller, {metier: 0});
                info = "<@" + ancien_conseiller.user.id + ">" + " vient d'être retiré(e) du conseil, il ou elle perd donc 200 prestige. Son rôle de Chapelain est desormais exercé par " + "<@" + nouveau_conseiller.user.id + ">";
            }
            await client.editPoint(client, nouveau_conseiller, 200, "prestige");
            await client.updateFaction(dbUser.faction, {chapelain: nouveau_conseiller.user.id});
            await client.updateUser(nouveau_conseiller, {metier: 903});
            //return message.channel.send(`${nouveau_conseiller.user.username} vient d'être nommé(e) Chapelain de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}. Il ou elle gagne 200 prestige.\n` + info);
            return channel.send(`${nouveau_conseiller.user.username} vient d'être nommé(e) Chapelain de la faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}. Il ou elle gagne 200 prestige.\n` + info);

        }
        else return message.reply(`Ce titre n'existe pas. (Maréchal/Intendant/Chapelain)`);
        
    } // Fin nommer


    // ---

    else if(arg1 == "retirer") {
        var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
        var est_maitre = false;

        for(let y=0; y<roles_maitre.length; y++) {
            if(message.member.roles.cache.has(roles_maitre[y])) {
                est_maitre = true;
                break;
            } else {
                est_maitre = false;
            }
        }
        if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");
        // --
        let member;

        // par titre
        if(!message.mentions.users.first()) {
            if(args[1].toLowerCase() == "maréchal" || args[1].toLowerCase() == "marechal") {
                member = message.guild.members.cache.get(faction.marechal);

                if(faction.marechal == "NULL") return message.reply("Il n'y a pas de Maréchal dans votre faction.");

                await client.updateFaction(dbUser.faction, {marechal: "NULL"});
                await client.editPoint(client, member, -200, "prestige");
                await client.updateUser(member, {metier: 0});

                //return message.reply(`${member} vient d'être retiré(e) de ses fonction de Maréchal et perd donc 200 prestige.`); 
                return channel.send(`${member} vient d'être retiré(e) de ses fonction de Maréchal et perd donc 200 prestige.`); 
            }
            else if(args[1].toLowerCase() == "intendant") {
                member = message.guild.members.cache.get(faction.intendant);

                if(faction.intendant == "NULL") return message.reply("Il n'y a pas d'Intendant dans votre faction.");

                await client.updateFaction(dbUser.faction, {intendant: "NULL"});
                await client.editPoint(client, member, -200, "prestige");
                await client.updateUser(member, {metier: 0});

                //return message.reply(`${member} vient d'être retiré(e) de ses fonction d'Intendant et perd donc 200 prestige.`);
                return channel.send(`${member} vient d'être retiré(e) de ses fonction d'Intendant et perd donc 200 prestige.`);

            }
            else if(args[1].toLowerCase() == "chapelain") {
                member = message.guild.members.cache.get(faction.chapelain);

                if(faction.chapelain == "NULL") return message.reply("Il n'y a pas de Chapelain dans votre faction.");

                await client.updateFaction(dbUser.faction, {chapelain: "NULL"});
                await client.editPoint(client, member, -200, "prestige");
                await client.updateUser(member, {metier: 0});

                //return message.reply(`${member} vient d'être retiré(e) de ses fonction de Chapelain et perd donc 200 prestige.`);
                return channel.send(`${member} vient d'être retiré(e) de ses fonction de Chapelain et perd donc 200 prestige.`);
            } else {
                return message.reply('Mention invalide.');
            }
        } 

        // par mention
        let conseiller = message.guild.members.cache.get(message.mentions.users.first().id);
        let dbConseiller = await client.getUser(conseiller);
        if(dbConseiller.faction != dbUser.faction) return message.reply("Cet utilisateur n'est pas membre de votre faction.");

        if(conseiller.user.id == faction.marechal) {

            await client.updateFaction(dbUser.faction, {marechal: "NULL"});
            await client.editPoint(client, conseiller, -200, "prestige");
            await client.updateUser(conseiller, {metier: 0});

            //return message.reply(`${conseiller} vient d'être retiré(e) de ses fonction de Maréchal et perd donc 200 prestige.`); 
            return channel.send(`${conseiller} vient d'être retiré(e) de ses fonction de Maréchal et perd donc 200 prestige.`); 
        }
        else if(conseiller.user.id == faction.intendant) {
            await client.updateFaction(dbUser.faction, {intendant: "NULL"});
            await client.editPoint(client, conseiller, -200, "prestige");
            await client.updateUser(conseiller, {metier: 0});

            //return message.reply(`${conseiller} vient d'être retiré(e) de ses fonction d'Intendant et perd donc 200 prestige.`); 
            return channel.send(`${conseiller} vient d'être retiré(e) de ses fonction d'Intendant et perd donc 200 prestige.`); 
        }
        else if(conseiller.user.id == faction.chapelain) {
            await client.updateFaction(dbUser.faction, {chapelain: "NULL"});
            await client.editPoint(client, conseiller, -200, "prestige");
            await client.updateUser(conseiller, {metier: 0});

            //return message.reply(`${conseiller} vient d'être retiré(e) de ses fonction de Chapelain et perd donc 200 prestige.`); 
            return channel.send(`${conseiller} vient d'être retiré(e) de ses fonction de Chapelain et perd donc 200 prestige.`); 
        }
        else return message.reply(`Ce membre ne fait pas parti de votre conseil.`);
    } // fin retrait

    // affichage par faction
    else {
        if(arg1 == "epsilon")                         faction = await client.getFaction("epsilon");
        else if(arg1 == "daïros" || arg1 == "dairos") faction = await client.getFaction("daïros");
        else if(arg1 == "lyomah")                     faction = await client.getFaction("lyomah");
        else if(arg1 == "alpha")                      faction = await client.getFaction("alpha");
        else {
            if(faction == undefined) return message.reply("Cette faction n'existe pas.");
        }

        var embed_ConseilList = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Conseil de la faction ${faction.displayname}`)
        .addFields([{name:`**Maréchal**`, value:`${faction.marechal == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.marechal).user.username}`, inline:true}, 
                   {name:`**Intendant**`, value:`${faction.intendant == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.intendant).user.username}`, inline:true}, 
                   {name:`**Chapelain**`, value:`${faction.chapelain == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.chapelain).user.username}`, inline:true}])
        
        return message.channel.send({embeds:[embed_ConseilList]});
        //return message.channel.send(`**${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}**\n\nMaréchal: ${faction.marechal == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.marechal).user.username} \nIntendant: ${faction.intendant == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.intendant).user.username} \nChapelain: ${faction.chapelain == "NULL" ? "Vaccant" : message.guild.members.cache.get(faction.chapelain).user.username}`)    
    }
}

module.exports.help = {
    name: "conseil",
    aliases: ['c', 'conseiller'],
    category: "faction",
    desription: "Gérez ou consultez les conseils. 'p<conseil <faction>' pour lister les conseillers d'une faction.",
    usage: '[<nommer/retirer> <@USER> <titre:Maréchal/Intendant/Chapelain>]',
    cooldown: 3, 
    permissions: false,
    args: false,
    wiki: 'https://poulerpg.000webhostapp.com/wiki/Faction/conseil.html'
};