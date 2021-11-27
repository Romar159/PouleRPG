module.exports.run = async (client, message, args, settings, dbUser) => {

    if(!args[0]) { // consultation
        let nombre = 0;
        client.getUsersInjail().then(p => { 
            p.forEach(e => { 
                nombre++;
                if(e.faction == dbUser.faction) { 
                   message.channel.send(`${e.username} se trouve dans les cachots de votre faction.`); // ? DraxyNote : on pourra ici faire comme avec les points vénitienne, un embed pour que ça fasse un seul et beau message.
                }
            }) 
        }).catch(c => {message.channel.send("Il n'y a personne dans les cachots de votre faction.");});

        

    } else { // enfermer ou libération cachot

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
        // lois : post lois, implémenter la possibilité par le conseil etc...
        


 
        if(!message.mentions.users.first()) return message.reply("Erreur, mention invalide.");
        let cMembre = message.guild.members.cache.get(message.mentions.users.first().id);
        let dbMembre = await client.getUser(cMembre);
        console.log(dbMembre.in_jail);
        if(dbMembre.faction != dbUser.faction) return message.channel.send("Cet utilisateur n'est pas membre de votre faction.");
        
        if(args[0].toLowerCase() == "enfermer") {
            if(dbMembre.in_jail == "true") return message.channel.send("Cet utilisateur est déjà aux cachots.");

                client.updateUser(cMembre, {in_jail: true});
                message.channel.send(`${cMembre} a été enfermé dans les cachots de la faction ${dbUser.faction} par <@${dbUser.userID}>`);
            
        }
        else if(args[0].toLowerCase() == "libérer" || args[0].toLowerCase() == "liberer") {
            if(dbMembre.in_jail == "false") return message.channel.send("Cet utilisateur n'est pas dans vos cachots. Vous ne vouliez pas plutôt l'enfermer ? **:)**");

            
                await client.updateUser(cMembre, {in_jail: false});
                message.channel.send(`${cMembre} a été libéré des cachots de la faction ${dbUser.faction} par <@${dbUser.userID}>`)
                       
        } else {
            return message.reply("action invalide.");
        } 

    }

}

module.exports.help = {
    name: "cachots",
    aliases: ['cachot', 'prison'],
    category: "politique, diplomatie et economie",
    desription: "Gestion des cachots",
    usage: '<enfermer/libérer> <@USER>',
    cooldown: 3,  
    permissions: false,
    args: false,
};