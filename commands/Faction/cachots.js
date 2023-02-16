const {EmbedBuilder} = require('discord.js');
const factionModel = require('../../models/faction');

module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    try {
        var faction = await client.getFaction(dbUser.faction);
    } catch (error) {
        return message.reply("Vous n'avez pas de faction.");
    }
    

    if(!args[0]) { // consultation
        const embed = new EmbedBuilder()
        .setAuthor({name : `Personnes présentes dans les cachots ${dbUser.faction} :`, iconURL: message.author.displayAvatarURL()})
        .setColor('303133');

        if(faction.cachot.length < 1) {
            return message.channel.send("Il n'y a personne dans les cachots de votre faction.");
        }
        let totalite = [];
        faction.cachot.forEach(element => {
            totalite.push(message.guild.members.cache.get(element));
        }); 
        embed.setDescription(totalite.join("\n"))

        return message.channel.send({embeds:[embed]});
        

        /*
        var nombre = 0;
        client.getUsersInjail().then(p => { 
            p.forEach(e => { 
                nombre++;
                if(e.faction == dbUser.faction) { 
                    embed.addField(`** **`, `${e.username}`, true);
                    //message.channel.send(`${e.username} se trouve dans les cachots de votre faction.`);
                }
            }) 
            if(nombre == 0) return message.channel.send("Il n'y a personne dans les cachots de votre faction.");
            else return message.channel.send({embeds:[embed]}); // ? RomarNote
        }).catch(c => {message.channel.send("Il n'y a personne dans les cachots de votre faction. Ou une erreur s'est produite : " + c);});
        */
       
        

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
        if(message.author.id == message.mentions.users.first().id) return message.reply("Vous ne pouvez pas vous enfermer ou vous libérer vous même des cachots.");
        let cMembre = message.guild.members.cache.get(message.mentions.users.first().id);
        let dbMembre = await client.getUser(cMembre);
        // console.log(dbMembre.in_jail); // debug
        if(dbMembre.faction != dbUser.faction) {
            if(faction.joueurs_sur_le_territoire.indexOf(dbMembre.userID) == -1) {
                return message.channel.send("Cet utilisateur n'est pas sur votre territoire.");
            }
        }
        //if(dbMembre.faction != dbUser.faction ) return message.channel.send("Cet utilisateur n'est pas membre de votre faction ou n'est pas sur votre territoire.");
        
        if(args[0].toLowerCase() == "enfermer") {
            if(dbMembre.in_jail == "true") return message.channel.send("Cet utilisateur est déjà dans des cachots.");

                await client.updateUser(cMembre, {in_jail: true});

                let new_array = faction.cachot;
                new_array.push(dbMembre.userID.toString());

                await client.updateFaction(faction.name, {cachot: new_array});
                message.channel.send(`${cMembre} de ${dbMembre.faction} a été enfermé dans les cachots de la faction ${dbUser.faction} par <@${dbUser.userID}>`);
        }
        else if(args[0].toLowerCase() == "libérer" || args[0].toLowerCase() == "liberer") {
                if(dbMembre.in_jail == "false") return message.channel.send("Cet utilisateur n'est pas dans vos cachots. Vous ne vouliez pas plutôt l'enfermer ? **:)**");

                await client.updateUser(cMembre, {in_jail: false});

                let arr = faction.cachot;
                arr = arr.filter(e => e !== dbMembre.userID);

                await client.updateFaction(faction.name, {cachot: arr});

                message.channel.send(`${cMembre} de ${dbMembre.faction} a été libéré des cachots de la faction ${dbUser.faction} par <@${dbUser.userID}>`)
                       
        } else {
            return message.reply("action invalide.");
        } 
    }
}

module.exports.help = {
    name: "cachots",
    aliases: ['cachot', 'prison'],
    category: "faction",
    desription: "Permet de gérer les cachots de votre faction. Soit enfermer, soit libérer quelqu'un.",
    usage: '<enfermer/libérer> <@USER>',
    cooldown: 3,  
    permissions: false,
    args: false,
};