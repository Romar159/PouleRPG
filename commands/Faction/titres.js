const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {

    return message.channel.send("Cette commande est obsolète. D'ailleurs, comment avez-vous fait pour la trouver ?? :O");

    var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
    var est_maitre = false;

    var titres_honorifiques = ['1- Le généreux/La généreuse', '2- Le grand/La grande', '3- Le valeureux/La valeureuse', '4- Le Beau/La belle'];

    for(let y=0; y<roles_maitre.length; y++) {
        if(message.member.roles.cache.has(roles_maitre[y])) {
            est_maitre = true;
            break;
        } else {
            est_maitre = false;
        }
    }
    if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");

    if(!args[0]) {
        const listE = new EmbedBuilder()
        .setColor('FF2FEE')
        .setAuthor({name:`Liste des titres honorifique`, iconURL: client.user.displayAvatarURL()});

        for(i=0;i<titres_honorifiques.length;i++) {

            let usr = await client.getUserTitreHonorifique(titres_honorifiques[i]);
            if(usr != undefined) {
                if(usr.faction == dbUser.faction) {
                    usr = usr.username;
                }
            } else {
                usr = "libre";
            }
            listE.addFields([{name:`** **`, value:`${titres_honorifiques[i]} - **${usr}**`}]);
        }

        return message.channel.send({embeds:[listE]});
    }



    if(!message.mentions.users.first()) return message.reply("Mention invalide.");

    const user = message.guild.members.cache.get(message.mentions.users.first().id);
    const dbMember = await client.getUser(user);
    let action = args[1];
    

    if(user == message.member) return message.reply("vous ne pouvez pas vous accorder un titre à vous même.");
    if(dbMember.faction != dbUser.faction) return message.reply(`cet utilisateur n'est pas dans votre faction.`);
    
    if(user == undefined) return message.reply(`cet utilisateur n'est pas valide.`); // deuxième verif

    if(args[1] != "accorder") {
        if(args[1] != "a") {
            if(args[1] != "révoquer") {
                if(args[1] != "revoquer") {
                    if(args[1] != "r") {
                        return message.reply(`cette action n'existe pas. ICI->**${args[1]}**`);
                    }
                }
            }
        }
    }


    if(action == "r" || action == "revoquer") {
        action = "révoquer"
    }
    if(action == "a") {
        action = "accorder";
    }

    if(action == "révoquer") {
            if(dbMember.titre_honorifique == "NULL") return message.channel.send("Cet utilisateur n'a pas de titre honorifique.");
    
            message.channel.send(`${user} a perdu son titre honorifique "${dbMember.titre_honorifique.slice(3)}" et perd donc 100 prestige.`);
            
            client.updateUser(user, {titre_honorifique : "NULL"});
            client.editPoint(client, user, -100, "prestige"); 
    }   
    
    if((action == "accorder") || (action == "a")) {
        let id_titre = args[2];

        if(isNaN(id_titre)) return message.reply("Veuillez renseigner un identifiant valide.");
        if(id_titre > titres_honorifiques.length) return message.reply("Veuillez renseigner un identifiant valide. ID trop élevée");
        if(id_titre < 1) return message.reply("Veuillez renseigner un identifiant valide. ID trop faible");
        
        let usr = await client.getUserTitreHonorifique(titres_honorifiques[id_titre -1]);
        let info = "";
        if(usr != undefined) {
            if(usr.userID == message.guild.members.cache.get(usr.userID).user.id) {
                return message.reply('Cet utilisateur possède déjà ce titre honorifique.');
            }
            if(usr.faction == dbUser.faction) {
                info = usr.username + ` a déjà ce titre, il le perd donc, ainsi que 100 prestige.`;
                client.editPoint(client, message.guild.members.cache.get(usr.userID), -100, "prestige"); 
            }
        }

        if(dbMember.titre_honorifique != "NULL") info = "Cet utilisateur avait déjà le titre honorifique " + dbMember.titre_honorifique.slice(3) + " il a donc été remplacé."
        
        client.updateUser(user, {titre_honorifique : titres_honorifiques[id_titre -1]});
        
        message.channel.send(`${message.member} a accordé à ${user} le titre honorifique "${titres_honorifiques[id_titre -1].slice(3)}" et ce dernier gagne donc 100 prestige. \n` + info);
        
        client.editPoint(client, user, 100, "prestige"); 
        
    }
}

module.exports.help = {
    name: "titre",
    aliases: ['titres'],
    category: "",
    desription: "Accordez ou révoquez un titre honorifique à un membre de votre faction. 'p<titre' permet de voir les titres disponibles. Deprecated !",
    usage: '[<@USER> <action:accorder/révoquer> <ID_titre>]',
    cooldown: 3, 
    permissions: false,
    args: false,
};