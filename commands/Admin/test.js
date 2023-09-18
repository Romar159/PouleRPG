const { ActionRowBuilder, ButtonBuilder, MessageCollector, EmbedBuilder, Client } = require("discord.js");
const {PREFIX} = require('../../config');

const metiers = require("../../assets/rpg/metiers/metiers.json");

const casusb = require("../../assets/guerre/casusbelli.json");




module.exports.run = async (client, message, args, settings, dbUser) => {

    message.reply("Wesh alors");
    return;
    const factionCible = await client.getFaction("lyomah");
    const faction = await client.getFaction(dbUser.faction);

    await client.addCasusBelli(factionCible, faction, "1")

    return;

    message.channel.send(`Initiale redoutabilité: ${dbUser.redoutabilite}`)
    await client.editPoint(client, message.member, Math.floor(-dbUser.redoutabilite + (dbUser.redoutabilite * 0.90)), "redoutabilite")
    message.channel.send(`maintenant : ${dbUser.redoutabilite}`)

    return;

    function pourcentageDePerte(quantiteOr, A, B) {
        return A * (1 - Math.exp(-B * quantiteOr));
    }
      
      
      const A = 0.2; // plus ce sera grand plus le pourcentage maximal perdu sera élevé
      const B = 0.001; // plus ce sera petit plus la décroissance sera progressive.
      const quantiteOrPersonne1 = 10000; // bank faction1.
      const quantiteOrPersonne2 = 50000; // bank faction2.
      
      const pertePersonne1 = pourcentageDePerte(quantiteOrPersonne1, A, B);
      const pertePersonne2 = pourcentageDePerte(quantiteOrPersonne2, A, B);
      
      console.log(`Personne 1 a ${quantiteOrPersonne1} perd ${pertePersonne1 * 100}% de son or. soit : ${Math.floor(quantiteOrPersonne1 * pertePersonne1)}`);
      console.log(`Personne 2 a ${quantiteOrPersonne2} perd ${pertePersonne2 * 100}% de son or. soit : ${Math.floor(quantiteOrPersonne2 * pertePersonne2)}`);


    return; 
    message.channel.send(`:crossed_swords: La guerre entre **Epsilon** et **Daïros** est terminée ! :crossed_swords:\n\n**Epsilon** a gagné !\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par Daïros. Ce fut une réussite, un pacte de non-agression a également été signé entre les deux factions !\nEEpsilon a gagné beaucoup de redoutabilité et de prestige ainsi que des poyns, volés à la faction adverse ! Tandis que Daïros a perdu, en plus de ces poyns, du prestige et évidemment de la redoutabilité...`)


    return;

    let ep = await client.getFaction("epsilon");
    let al = await client.getFaction("alpha");
    await client.editRelation(ep, al, 0)
    //excepted : arrayalpha: 3 0 0 0 | arrayepsilon = 0 0 4 3

    return;

    // embed_declarerGuerreMenu = new EmbedBuilder()
    //         .setColor('3C4C66')
    //         .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    //         .setTitle(`Déclarer la guerre !`)
    //         .setDescription(`Sélectionnez le casus belli de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
    //         .addFields([
    //             {name:`Cible: XXX`, value:`Titre - Description`}, 
    //             {name:`Cible2: XXX2`, value:`Titre2 - Description2`}, 
    //         ])

    // message.channel.send({embeds:[embed_declarerGuerreMenu]})


    // embed_declarerGuerreMenu = new EmbedBuilder()
    // .setColor('3C4C66')
    // .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    // .setTitle(`Déclarer la guerre !`)
    // .setDescription(`Sélectionnez le casus belli de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
    // .addFields([
    //     {name:`** **`, value:`** **`}, 
    //     {name:`${casusb[1].name} • Contre : **Daïros**`, value:`${casusb[1].description}`}, 
    // ])
    
    

    // message.channel.send({embeds:[embed_declarerGuerreMenu]})


    // return;

    

    await client.updateFaction("epsilon", {casusbelli: [{"id":"1","cible":"lyomah"}, {"id":"0","cible":"lyomah"}, {"id":"1","cible":"daïros"}, {"id":"2","cible":"alpha"}]})

    //const faction = await client.getFaction("epsilon");
    //message.channel.send(`data: ${client.filterById(casusb, faction.casusbelli[1].id).name} ${faction.casusbelli[1].cible}`);

    // const faction = await client.getFaction("epsilon");

    // let tmp = faction.casusbelli;

    // tmp.push({"id":"1","cible":"lyomah"});

    // await client.updateFaction("epsilon", {casusbelli: tmp})
    // //const faction = await client.getFaction("epsilon");
    // message.channel.send(`data: ${client.filterById(casusb, faction.casusbelli[1].id).name} ${faction.casusbelli[1].cible}`);

    return;
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