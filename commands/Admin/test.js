const { ActionRowBuilder, ButtonBuilder, MessageCollector, EmbedBuilder, Client } = require("discord.js");
const {PREFIX} = require('../../config');

const metiers = require("../../assets/rpg/metiers/metiers.json");




module.exports.run = async (client, message, args, settings, dbUser) => {

    
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`)

    message.channel.send(client.filterById(metiers, 1).description);



    // require("../../util/objects/armes")(client);

    // let poney = new animal("Poulet", 42);
    // message.channel.send(poney.getAge());


    /*let jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    message.reply(jours[new Date().getDay()]);*/

    // si c'est 6 c'est samedi
/*
    const filter = m => (message.author.id === m.author.id);
    var final = `{\n`;

    message.channel.send("ID");
    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
            final = final + `"id" : ${collected.first().content},\n`;
            
            message.channel.send("NAME");
            message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                final = final + `"name" : "${collected.first().content}",\n`;
                    message.channel.send("RARETE");
                    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                        final = final + `"rarete" : ${collected.first().content},\n`;
                            message.channel.send("DESCRIPTION");
                            message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                                final = final + `"description" : "${collected.first().content}",\n`;
                                    message.channel.send("REACTIONS");
                                    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                                        let array_reacts = collected.first().content.split(" ");
                                        let final_array = `[\\${array_reacts[0]}`;
                                        for(let i = 1; i < array_reacts.length; i++) {
                                            final_array = final_array + `, '\\${array_reacts[i]}'`;
                                        }
                                        final_array = final_array + `]`;
                                        final = final + `"reactions" : ${final_array},\n`;
                                        
                                        message.channel.send(final)
                                            
                                    }).catch(() => {
                                            message.reply('timeout.');
                                    });
                            }).catch(() => {
                                    message.reply('timeout.');
                            });
                    }).catch(() => {
                            message.reply('timeout.');
                    });
            }).catch(() => {
                    message.reply('timeout.');
            });

    }).catch(() => {
            message.reply('timeout.');
    }); */


    //if(dbUser.training == true) message.reply("OUI ! D'accord ! Il s'entraine.");

    /*
    client.channels.cache.get("415947202649653249").messages.fetch("930886480895823892")
    .then(message => message.react(`❄️`))
    .catch(console.error); */



    /*let nb_gains = client.randomInt(1, 3);

    for(i=0, i<nb_gains, i++) {
        let id_gain = client.randomInt(1, 3);
        let buffer = id_gain;
        if(id_gain = 0)
    }*/


/* GAINS MULTIPLE ENNEMIS
    //xp = 1, or = 2, piete = 3
    let a = [1, 2, 3];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    let final_array = a.slice(0, client.randomInt(1, 3)).sort();
    let gagner = ` `;
    for(i=0; i<final_array.length; i++) {
        if(final_array[i] == 1) { gagner = gagner + `+50xp`; client.setXp(client, message.member, 50)}
        if(final_array[i] == 2) { gagner = gagner + `+2 or`; client.setOr(client, message.member, 2, message)}
        if(final_array[i] == 3) { gagner = gagner + `+5 piété `; client.editPoint(client, message.member, 5, `piete`)}
        if(i<final_array.length - 1) gagner = gagner + " | ";
    }
    message.channel.send(`${gagner}`);
*/

//message.channel.send(`Coucou`);
// let epsilon = await client.getFaction('epsilon');
// let dairos = await client.getFaction('daïros');
// let lyomah = await client.getFaction('lyomah');
// let alpha = await client.getFaction('alpha');

/*let array = epsilon.joueurs_sur_le_territoire;
array.push(dbUser.userID.toString());
message.channel.send("DBG: " + array);
await client.updateFaction(epsilon.name, {joueurs_sur_le_territoire: array});
*/
//message.channel.send(`${faction.joueurs_sur_le_territoire}`);
//await client.updateFaction(faction, {joueurs_sur_le_territoire: faction.joueurs_sur_le_territoire.push(dbUser.userID)});
//message.channel.send(`Ep: ${epsilon.joueurs_sur_le_territoire} Da: ${dairos.joueurs_sur_le_territoire} Ly: ${lyomah.joueurs_sur_le_territoire} Al: ${alpha.joueurs_sur_le_territoire}`);


            /*let arr = epsilon.joueurs_sur_le_territoire;
            arr = arr.filter(e => e !== dbUser.userID);
            message.channel.send("data: " + arr + " debug: " + dbUser.userID);*/
};
  
module.exports.help = {
    name: "test",
    aliases: ['test'],
    category: "admin",
    desription: "un fichier pour faire des tests rapidos.",
    usage: '',
    wiki: 'https://romar159.github.io/poulerpg.github.io/',
    cooldown: 2,  
    permissions: true,
    args: false
};