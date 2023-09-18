module.exports.run = async (client, message, args, settings, dbUser) => {
    //TODO :
    /*
     rendre cette fonction plus intéressante. En gros, au lieu d'envoyer en mission en pigant le joueur, on pourra sélectionner le membre de notre choix
     et en fonction de qui c'est, ses rôles, son métier et tout, différentes missions seront disponibles
     par exemple, le chapelain pourra effectuer des missions relatives à la relgion
     on peut bien sur s'envoyer nous même en mission quand on fait parti du conseil.
     attention cette commande ne sera utilisable que par les conseillers bien sur !
     les membres doivent se soumettre (en alpha du moins, car en bêta peut être qu'il faudra une certaine loi de faction) 
     */
    //* note, ce todo n'est pas le cahier des charges complet. Voir l'entrée du project InDev de PouleRPG

     //* Note de dev: réutilisser le système qui permet de nommer des commandants. Sauf qu'au lieu de nommer on sélectionne pour choisir une mission ensuite.
    return message.reply("Cette commande ne sera disponnible que dans une future mise à jour.");
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

    if(!message.mentions.users.first()) return message.reply("Mention invalide.");

    let member_mention = message.guild.members.cache.get(message.mentions.users.first().id);
    let dbMention = await client.getUser(member_mention);

    try {
        if(dbMention.faction != dbUser.faction) return message.reply("Cet utilisateur n'est pas dans votre faction.");
    } catch(e) {
        return message.channel.send("FATAL ERROR 0x000002")
    }

    if(message.mentions.users.first().id == message.author.id) return message.reply("Vous ne pouvez pas vous même partir en mission.");
}


module.exports.help = {
    name: "mission",
    aliases: ["décision"],
    category: "geography",
    desription: "Effectuez diverses actions ou faites les faire par vos membres.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
    gouvernement: true
};