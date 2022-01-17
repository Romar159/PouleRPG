const { MessageEmbed } = require("discord.js");
const faction = require("../../models/faction");

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(!args[0]) {
        if(dbUser.faction == 'NULL') return message.reply('Vous n`êtes pas membre d\'une faction.');
        let faction = await client.getFaction(dbUser.faction);
        return message.reply(`Le taux de taxe de votre faction est actuellement de ${faction.taxe}% revenue/semaine`);
    }

    if(args[0] == "définir" || args[0] == "definir" || args[0] == "d") {
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
        
        if(isNaN(args[1])) return message.reply("Veuillez renseigner une valeur numérique.");
        if(args[1] < 0) return message.reply("La taxe ne peut être négative.");
        if(args[1] > 100) return message.reply("La taxe ne peut être supérieur à 100% du revenue");

        let faction = await client.getFaction(dbUser.faction);
        let taxe = parseInt(args[1]);
        
        message.channel.send(`La faction ${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)} à désormais une taxe de ${taxe}% revenue/semaine.`);
        await client.updateFaction(faction.name, {taxe: taxe});
    }

    if(args[0] == "prélever" || args[0] == "prelever" || args[0] == "p") {

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

        let faction = await client.getFaction(dbUser.faction);
        

        const dailyCD = 8.64e+7 * 7; // Une semaine.
        const lastDaily = faction.cooldown_taxe; // Dernière fois qu'on a récup la taxe
        
            
        if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
            const cdTime = dailyCD - (Date.now() - lastDaily);
            
            message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 7)}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir de nouveau récupérer les taxes. :hourglass:`);
        
        } else { // Si le cooldown est passé.
            

            
            const metiers = require("../../assets/rpg/metiers/metiers.json");
            let mt;

            let nombre = 0;

            const taxeEmbed = new MessageEmbed()
            .setColor('BF2F00')
            .setAuthor(`Taxe`, client.user.displayAvatarURL());

            client.getUsersByFaction(dbUser.faction).then(p => { 
                p.forEach(async e => { 
                    
                    
                    if(e.metier != 0) {
                        if(e.metier != 904) {
                            nombre++;
                            mt = client.filterById(metiers, e.metier);
                            let max = mt.salaire * mt.horaires;
                            let debit = Math.round(((faction.taxe / 100) * max));
                            if(e.or < debit) {
                                taxeEmbed.addField(`** **`, `<@${e.userID}> n'a pas assez d'or pour payer la taxe (${debit}).`)
                            } else {
                                taxeEmbed.addField(`** **`, `<@${e.userID}> paye ${debit} or de taxe.`); 
                                await client.setOr(client, message.guild.members.cache.get(e.userID), -debit, message);
                                await client.updateFaction(dbUser.faction, {bank : faction.bank + debit});
                            }
                        }
                    }
                }); 
                if(nombre == 0) return message.channel.send("Il n'y a personne dans cette faction.");
                
                message.channel.send({embeds:[taxeEmbed]});

            }).catch(c => {message.channel.send("Une erreur s'est produite : " + c);});
            await client.updateFaction(dbUser.faction, {cooldown_taxe: Date.now()});
        }
    }
}

module.exports.help = {
    name: "taxeindev",
    aliases: ['tx'],
    category: "faction",
    desription: "Gérez tout ce qui s'apporte aux taxes.",
    usage: '[définir/prélever] [montant]',
    cooldown: 3, 
    permissions: false,
    args: false,
};