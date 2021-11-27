const {MessageEmbed} = require("discord.js");

let events = require("../../assets/rpg/events/events.json");

module.exports = async (client, message, args, settings) => { 


    let general_events_rarity = [4000, 5000, 5250];
    let cachot_events_rarity = [1000, 900];


    let rarity_sorting = general_events_rarity; // de base on prend les events généraux.
    var array_ran = [];

    const dbUser = await client.getUser(message.member);

    if(dbUser.in_jail) { // Si l'utilisateur est au cachot on utilise le json des events de cachot (et ses raretés)
        events = require("../../assets/rpg/events/events_cachots.json");
        rarity_sorting = cachot_events_rarity; // on prend donc les raretés des events cachots.
    }

    // Selecteur d'event

    for(var i = 0; i < rarity_sorting.length; i++) {
        let x = rarity_sorting[i] * client.randomFloat(0, 1); //multiplication de chaque rareté par un random entre 0 et 1
        if(x != 0) array_ran.push(x); //Ajout à l'array pour utilisation future
    }


    const min = array_ran.reduce((a, b) => Math.min(a, b))
    const final_rarity = rarity_sorting[array_ran.indexOf(min)];
    // message.channel.send("output minimal : " + min + "\nOutput total : " + array_ran + "\nOutput ID : " + array_ran.indexOf(min) + "\nOutput final : " + final_rarity); // debug


    let dat_event = client.eventFilterByRarity(events, final_rarity);
    
    // message.channel.send(`out map : ${dat_event.map(m => m.id)} \nout final: ${client.getRandomKeyOfMap(dat_event.map(m => m.id))}`); // debug

    let final_event = client.filterById(events, client.getRandomKeyOfMap(dat_event.map(m => m.id)));
    // message.channel.send(`${final_event.name}`); // debug 
    
    if(client.randomInt(0, final_event.rarete) == 1) { // faire le random entre 0 et final_event.rarete
        if(final_event.condition == "/") { // il n'y a pas de condition
        } else {
            // la condition doit ressembler à ça dans le json : "if(dbUser.faction == 'epsilon') return true;" (pas de else, pas d'accolades)
            var result = eval('(function() {' + final_event.condition + '}())');
            if(result == true) {} // continuer
            else return;
        }
    } else {
        return;
    }

    //message.channel.send(`${final_event.name}\n\n${final_event.description} \n reactions : ${final_event.reactions} \n commands : ${final_event.commands}`); // debug

    if(final_event.reactions == "/") { // On affiche l'event mais on ne gère par les réactions, on se contente d'executer la première commande du array commands (dans la logique il n'y à qu'une seule entrée dans ce array dans ce cas)
        message.channel.send(`${final_event.name}\n\n${final_event.description}`);
        eval(final_event.commands[0]);
    } else { // On affiche l'event et on gère les réactions.

        let msg_ev = await message.channel.send(`${final_event.name}\n\n${final_event.description}`);

        for(let i = 0; i < final_event.reactions.length; i++) {
            msg_ev.react(`${final_event.reactions[i]}`);
        }

        const filter = (reaction, user) => { 
            return (final_event.reactions.includes(reaction.emoji.name) && user.id === message.author.id);
        }

        msg_ev.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then((collected) => {
            const reaction = collected.first();

            //message.channel.send(`reaction : ${reaction.emoji.name} \n ID React : ${final_event.reactions.indexOf(reaction.emoji.name)}`); // debug
            let id_react = final_event.reactions.indexOf(reaction.emoji.name);

            if(reaction != undefined) {
                if(id_react >= final_event.reactions.length) return message.channel.send("FATAL ERROR: 0x200001");
                if(final_event.commands[id_react] == undefined) return message.channel.send("FATAL ERROR: 0x200002")

                eval(final_event.commands[id_react]);
                //eval('(function() {' + final_event.commands[id_react] + '}())');
            }
        });
    }   
}

/* JSON Exemple events.json
    {
        "id" : 0,
        "name" : "Event de test 1",
        "rarete" : 4000,
        "condition" : "if(dbUser.faction == 'epsilon') return true;'" // si la condition est "cachot" celà est pour tester si l'utilisateur est au cachot
        "description" : "Descrition de l'event 1",
        "reactions" : ['💰', '💸'],
        "commands" : ['message.channel.send("Hello");', 'message.channel.send("Goodbye");']
    },
*/


