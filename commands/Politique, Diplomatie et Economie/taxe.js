const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
    var est_maitre = false;

    const taxeEmbed = new MessageEmbed()
    .setColor('F2F23C');

    for(let y=0; y<roles_maitre.length; y++) {
        if(message.member.roles.cache.has(roles_maitre[y])) {
            est_maitre = true;
            break;
        } else {
            est_maitre = false;
        }
    }
    if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");


    

    if(args[0] == "prélever" || args[0] == "prelever") {

        let faction = await client.getFaction(dbUser.faction);

        let or_avant = faction.bank; // contient l'or d'origine de la faction
        const taxe_value = parseInt(faction.taxe); // Contient la valeur de la taxe définit par le maître de faction.

        const dailyCD = 8.64e+7 * 7; // Une semaine.
        const lastDaily = faction.cooldown_taxe; // Dernière fois qu'on a récup la taxe
        var weeks = Math.round((Date.now()-lastDaily)/ 604800000) - 1; // - 1 car sinon ça compte la semaine en cours.

        if(weeks < 0) weeks = 1; // Pour éviter un chiffre négatif et que la multiplication retourne 0.

        var final_quantity = taxe_value * weeks; //Calcul la quantité final à taxer pour chaque utilisateur.
        
            
        if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
            const cdTime = dailyCD - (Date.now() - lastDaily);
            
            message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 7)}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir de nouveau récupérer les taxes. :hourglass:`);
        
        } else { // Si le cooldown est passé.
            message.guild.members.fetch().then(async fetchAll => {
            
                const epsilon = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
                const dairos = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
                const lyomah = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
                const alpha = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));

                var array;
                if(faction.factionid == 0) {
                    array = Array.from(epsilon, ([name, value]) => ({ name, value }));
                }
                else if(faction.factionid == 1) {
                    array = Array.from(dairos, ([name, value]) => ({ name, value }));
                }
                else if(faction.factionid == 2) {
                    array = Array.from(lyomah, ([name, value]) => ({ name, value }));
                }
                else if(faction.factionid == 3) {
                    array = Array.from(alpha, ([name, value]) => ({ name, value }));
                } else {
                    return message.channel.send("FATAL ERROR | **0x000001**");
                }

                var ceux_dans_le_rouge = [];
                var ceux_dans_le_vert = [];
                var canpaid = [];
                var total = 0;
                var pos = 0;
                var taille_array = array.length;
                
                array.forEach(async function(item, index, array) {
                    let usr = await client.getUser(item.value);

                    if(usr.or < final_quantity) { // Si l'utilisateur va arriver dans le rouge
                        ceux_dans_le_rouge.push(usr);
                        var fdlr;

                        if(!usr.fois_dans_le_rouge) {
                            fdlr = 0;
                        } else {
                            fdlr = usr.fois_dans_le_rouge;
                        }
                        await client.updateUser(item.value, {fois_dans_le_rouge: fdlr + 1});


                        canpaid.push(item.value.user.username);

                        await client.updateUser(item.value, {or: usr.or - final_quantity});
                        total = total + final_quantity;

                    } else {
                        canpaid.push(item.value.user.username);
                        ceux_dans_le_vert.push(usr);

                        await client.updateUser(item.value, {or: usr.or - final_quantity});
                        await client.updateUser(item.value, {fois_dans_le_rouge: 0});
                        total = total + final_quantity;
                        //console.log(total);
                    }

                    pos = pos + 1;
                    if(taille_array == pos) {
                        
                        if(ceux_dans_le_rouge.length >= 1) {
                            
                            message.channel.send(`${ceux_dans_le_rouge.map(m => `• :red_square: ${final_quantity} or :coin: taxé à \`` + m.username + `\` ${m.fois_dans_le_rouge} fois dans le rouge.`).join('\n')}`);

                            /*for(let id = 0; id < ceux_dans_le_rouge.length; id++) {
                                message.channel.send(`Ceux là sont dans le rouge : ${ceux_dans_le_rouge[id].username} et ça fait ${ceux_dans_le_rouge[id].fois_dans_le_rouge} fois.`);
                            }*/
                        }
                
                        if(canpaid.length == 1) {
                            message.channel.send(`${canpaid} a payé ${final_quantity} or pour un total de ${total} or taxé.`); 

                        } else if (canpaid.length > 1) {
                            //message.channel.send(`${canpaid} ont payé ${final_quantity} or pour un total de ${total} or taxé.`);
                            message.channel.send(`\n${ceux_dans_le_vert.map(m => `• :green_square: ${final_quantity} or :coin: taxé à \`` + m.username + `\``).join('\n')} \n\n**Total** : ${total} or taxé.`);
                            
                        }
                        await client.updateFaction(faction.name, {bank: faction.bank + total});

                    }
                }); 
            });

            await client.updateFaction(faction.name, {cooldown_taxe: Date.now()});
        }


    } else if (args[0] == "établir" || args[0] == "etablir") {

        if(isNaN(args[1])) return message.reply("vous devez renseigner une valeur numérique.");
        if(args[1] < 0) return message.reply("le montant des taxes ne peut être négatif.");

        let faction = await client.getFaction(dbUser.faction);

        taxeEmbed.setAuthor(`La taxe vient d'être établie !`, message.author.displayAvatarURL());
        taxeEmbed.setDescription(`Elle est désormais de **${args[1]}** :coin:`);

        message.channel.send(taxeEmbed);
        await client.updateFaction(faction.name, {taxe: parseInt(args[1])});
        
    }

};


module.exports.help = {
    name: "taxe",
    aliases: ['taxe'],
    category: "politique, diplomatie et economie",
    desription: "Gérer les taxes de votre faction.",
    usage: "<action:prélever/établir> <montant>",
    cooldown: 3,
    permissions: false,
    args: true,
};
