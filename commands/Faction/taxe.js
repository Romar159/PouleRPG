const { EmbedBuilder } = require("discord.js");
const faction = require("../../models/faction");
const metiers = require("../../assets/rpg/metiers/metiers.json");

module.exports.run = async (client, message, args, settings, dbUser) => {

    client.checkTaxes(message); // on vérifie d'abord l'état des taxes de cette faction.

    // S'il n'y a pas d'argument
    if(!args[0]) {
        if(dbUser.faction == 'NULL') return message.reply('Vous n`êtes pas membre d\'une faction.');

        let faction = await client.getFaction(dbUser.faction); // get db Faction
        return message.reply(`Le taux de taxe de votre faction est actuellement de ${faction.taxe}% du revenue max\nChaque semaine vous devez ${(faction.taxe * (client.filterById(metiers, dbUser.metier).salaire * client.filterById(metiers, dbUser.metier).horaires)) / 100} Poyn :coin:`);
    } 

    // Si l'on choisit de définir la taxe
    if(args[0] == "définir" || args[0] == "definir" || args[0] == "d") {
       
        if(!client.isMaster(message)) return message.reply("Commande utilisable que par les maîtres de faction.");  //verification maître.

        
        if(isNaN(args[1])) return message.reply("Veuillez renseigner une valeur numérique.");
        if(args[1] < 0) return message.reply("La taxe ne peut être négative.");
        if(args[1] > 100) return message.reply("La taxe ne peut être supérieur à 100% du revenue"); //temp pré-bêta

        let faction = await client.getFaction(dbUser.faction);
        let taxe = parseInt(args[1]);

        await client.updateFaction(faction.name, {taxe: taxe});
        return message.channel.send(`La faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} à désormais une taxe de ${taxe}% revenue max.`);
    }

    if(args[0] == "endettement") {
        return message.channel.send("Vous êtes endetté personnellement à hauteur de: " + dbUser.endettement + " :coin:"); //oui c'est une ref à Pécresse 2022
    }

    
    if(args[0] == "comptes") {
        
        
        message.guild.members.fetch().then(async fetchAll => { 
            
            let members;
            var itemsProcessed = 0;
            var total = 0;
            var arrayComptes = [];

            if(faction.name = "epsilon") members = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
            else if(faction.name = "daïros") members = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
            else if(faction.name = "lyomah") members = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
            else if(faction.name = "alpha") members = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));

            
            await members.forEach(async element => {
                let usr = await client.getUser(element);
                itemsProcessed++;
                if(usr !== undefined) {
                    
                    total = total + usr.endettement;
                    if(usr.endettement > 0) {
                        arrayComptes.push(`${element.user.username} doit **${usr.endettement}** poyn :coin:`);
                    }
                }
                if(itemsProcessed === members.size) {
                    return message.channel.send(arrayComptes.join("\n") + "\n\nAu total les membres doivent **" + total + "** poyn :coin: à la faction");
                }
            });
        });
    }
}

module.exports.help = {
    name: "taxe",
    aliases: ['tx'],
    category: "faction",
    desription: "Gérez tout ce qui s'apporte aux taxes. Chaque semaine chaque membre doit le pourcentage de la taxe de son salaire maximum. Ils peuvent payer avec la commande envoiecoffre et leur endettement baissera. S'ils ne payent pas, l'endettement augmente.",
    usage: '[endettement/comptes/[{définir} {montant}]]',
    cooldown: 3, 
    permissions: false,
    args: false,
};