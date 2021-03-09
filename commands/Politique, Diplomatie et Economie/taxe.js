const {MessageEmbed} = require('discord.js');

var total_taxe = 0;

module.exports.run = async (client, message, args, settings, dbUser) => {

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
    if(!est_maitre) return message.reply("Commande utilisable que par les maîtres de faction.");

    if(args[0] == "prélever") {

        let faction = await client.getFaction(dbUser.faction);
        let or_avant = faction.bank;
        const taxe_value = parseInt(faction.taxe);

        const dailyCD = 8.64e+7 * 7; // Une semaine.
        const lastDaily = faction.cooldown_taxe;
        var weeks = Math.round((Date.now()-lastDaily)/ 604800000) - 1; // - 1 car sinon ça compte la semaine en cour.

        if(weeks < 0) weeks = 1; // Pour éviter un chiffre négatif et que la multiplication retourne 0.

        //message.channel.send(`Multiplicateur (nombre de semaines): ${weeks}`);
        
        if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
            const cdTime = dailyCD - (Date.now() - lastDaily);
           
            message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 7)}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir de nouveau récupérer les taxes. :hourglass:`);
        } else { // Si le cooldown est passé.

            await client.getUsers(message.guild).then(p => {
            
                // const em = new MessageEmbed()
                // .setColor("FFFFFF")
                // .setTitle("Liste des cons sans fric");

                p.forEach(async e => {
                    var a = message.guild.members.cache.get(e.userID);
                    if(a.roles.cache.get(faction.roleid)) {
                        var mbm = await client.getUser(a);
                        //message.channel.send("DEBUG: or: " + mbm.or + " taxe: " + (taxe_value * weeks));
                        if(mbm.or > (taxe_value * weeks)) { // si il a assez d'argent.
                            if(mbm.userID == faction.idmaitre) {

                            } else {
                                await client.setOr(client, a, - (taxe_value * weeks), message);
                                total_taxe = total_taxe + (taxe_value * weeks);
    
                                faction = await client.getFaction(faction.name);
                                //message.channel.send(`UPDATE: ${faction.bank + (taxe_value * weeks)}`);
                                await client.updateFaction(faction.name, {bank: parseInt(faction.bank + (taxe_value * weeks))});
                            }

                        } else {
                            //em.addField(`${a.user.username}`, "n'as pas assez d'argent pour payer la taxe.");
                            message.channel.send(`**${a.user.username} n'as pas assez d'argent pour payer la taxe.**`);
                        }
                    }
                });
                //message.channel.send(em);

            });

            message.guild.members.fetch().then(async fetchAll => {
                const members = fetchAll.filter(m => m.roles.cache.get(faction.roleid));
                faction = await client.getFaction(faction.name);
               // message.channel.send("Or avant: " + or_avant + " FACTION BANK: " + faction.bank);
               // message.channel.send(`Or total taxé à <@&${faction.roleid}> : ${faction.bank - or_avant }`); 
            });

            message.channel.send("Taxe prélevée.");
            await client.updateFaction(faction.name, {cooldown_taxe: Date.now()});
        }
    }
    else if(args[0] == "établir") {
        if(isNaN(args[1])) return message.reply("Vous devez renseigner une valeur numérique.");
        if(args[1] < 0) return message.reply("Le montant des taxes ne peut être négatif.");

        let faction = await client.getFaction(dbUser.faction);

        message.channel.send("La taxe est maintenant de " + args[1]);
        await client.updateFaction(faction.name, {taxe: parseInt(args[1])});
    }
};

module.exports.help = {
    name: "taxe",
    aliases: ['taxe'],
    category: "Politique, Diplomatie et Economie",
    desription: "Gérer les taxes de votre faction.",
    usage: "<action:prélever/etablir> <montant>",
    cooldown: 3,
    permissions: false,
    args: true,
};