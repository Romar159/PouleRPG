module.exports.run = (client, message, args, settings, dbUser) => {
    message.guild.members.fetch().then(async fetchAll => {

        var faction = await client.getFaction(dbUser.faction);

        var membres_du_conseil;
            
        const epsilon = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
        const dairos = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
        const lyomah = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
        const alpha = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));


        if(!args[0] || args[0] == "ajouter" || args[0] == "retirer") {

            if(faction == undefined) return message.channel.send("Impossible de consulter les membres du conseil de votre faction. Vous n'êtes pas membre d'une faction.");

            if(faction.factionid == 0) {
                membres_du_conseil = epsilon.filter(m => m.roles.cache.get('858117141564096512'));
            }
            else if(faction.factionid == 1) {
                membres_du_conseil = dairos.filter(m => m.roles.cache.get('858117141564096512'));
            }
            else if(faction.factionid == 2) {
                membres_du_conseil = lyomah.filter(m => m.roles.cache.get('858117141564096512'));
            }
            else if(faction.factionid == 3) {
                membres_du_conseil = alpha.filter(m => m.roles.cache.get('858117141564096512'));
            } else {
                return message.channel.send("FATAL ERROR -> conseil.js | Veuillez contacter le développeur.");
            }

            if(!args[0])
                return message.channel.send("Les membres du conseil de votre faction sont : `" + membres_du_conseil.map(m => m.user.tag).join('` • `') + "`.");
        

            if(args[0] == "ajouter") {

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

                // ---

                if(membres_du_conseil.size >= 3) return message.reply("ERREUR, vous ne pouvez avoir plus de 3 membres dans votre conseil.");

                if(!message.mentions.users.first()) return message.reply("ERREUR, Mention invalide.");

                let membre = await client.getUser(message.mentions.users.first());
 
                if(membre.faction != dbUser.faction) return message.reply("ERREUR, cet utilisateur ne fait pas partie de votre faction.");
                if(message.author.id == message.mentions.users.first().id) return message.reply("ERREUR, vous ne pouvez pas vous désigner comme membre du conseil.");

                let mm = message.guild.members.cache.get(message.mentions.users.first().id);

                if(mm.roles.cache.has('858117141564096512')) return message.channel.send("Cet utilisateur est déjà membre de votre conseil.");


                mm.roles.add(message.guild.roles.cache.get('858117141564096512'));
                return message.channel.send(`${mm}` + " Est désormais membre du conseil de la faction " + dbUser.faction.charAt(0).toUpperCase() + dbUser.faction.slice(1))
            }


            if(args[0] == "retirer") {

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

                // ---

                if(!message.mentions.users.first()) return message.reply("ERREUR, Mention invalide.");

                let membre = await client.getUser(message.mentions.users.first());
 
                if(membre.faction != dbUser.faction) return message.reply("ERREUR, cet utilisateur ne fait pas partie de votre faction.");
                if(message.author.id == message.mentions.users.first().id) return message.reply("ERREUR, vous ne pouvez pas être membre du conseil et encore moins le quitter.");

                let mm = message.guild.members.cache.get(message.mentions.users.first().id);

                if(!mm.roles.cache.has('858117141564096512')) return message.channel.send("Cet utilisateur n'est pas membre de votre conseil.");

 
                mm.roles.remove(message.guild.roles.cache.get('858117141564096512'));
                return message.channel.send(`${mm}` + " Est désormais retiré du conseil de la faction " + dbUser.faction.charAt(0).toUpperCase() + dbUser.faction.slice(1))
            }
        }

        if(args[0].toLowerCase() == "epsilon") {
            membres_du_conseil = epsilon.filter(m => m.roles.cache.get('858117141564096512'));
        }
        if(args[0].toLowerCase() == "daïros" || args[0].toLowerCase() == "dairos" ) {
            membres_du_conseil = dairos.filter(m => m.roles.cache.get('858117141564096512'));
        }
        if(args[0].toLowerCase() == "lyomah") {
            membres_du_conseil = lyomah.filter(m => m.roles.cache.get('858117141564096512'));
        }
        if(args[0].toLowerCase() == "alpha") {
            membres_du_conseil = alpha.filter(m => m.roles.cache.get('858117141564096512'));
        }

        message.channel.send("Les membres du conseil de la faction : " + args[0].toLowerCase().charAt(0).toUpperCase() + args[0].toLowerCase().slice(1) + " sont `" + membres_du_conseil.map(m => m.user.tag).join('` • `') + "`.");
    });
}

module.exports.help = {
    name: "conseil",
    aliases: ['c'],
    category: "politique, diplomatie et economie",
    desription: "Gérez ou consultez les conseils.",
    usage: '[<ajouter>|<retirer>|<faction>] [@USER] ',
    cooldown: 3, 
    permissions: false,
    args: false,
};