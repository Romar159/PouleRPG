const { EmbedBuilder } = require("discord.js");
let events = require("../../assets/rpg/events/events.json");

//TODO: Bien sur, ajouter PLUS d'events
//TODO: Equilibrer la rareté !
//TODO: Ajouter plus de commande EV++ notamment : la possiblité d'executer par random. avoir une chance sur X que quelque chose s'execute.
//TODO: Ajouter des trucs pour modifier des états comme sortir de prison par exemple.

//TODO: Ajouter également le listage automatique des raretés. Au lieu de stocker dans une variable on scan tous les fichiers avant. (niveau perf ça fait quoi ?)

function isDiscordEmoji(text) {
    // Expression régulière pour les emojis Discord
    const discordEmojiRegex = /:[a-zA-Z0-9_]+:/g;
    return discordEmojiRegex.test(text);
}

module.exports = async (client, message, args, settings) => {

    // Mapping des actions
    const actions = {
        "Msg": (message, content) => message.channel.send(content),
        "SetPoyn": (message, amount) => {

            //TODO: Ici, il faut CHECK si le joueur a ASSEZ de Poyn ! Si non il faut tout cancel et dire qu'on a pas assez d'argent
            //*NOTE: Probablement pas pour la Alpha c'est pass logique pour les autres events, c'est spécifiques aux achats.
            client.writeLog(`Event: gameEvent : ${message.author.tag} (${message.author.id}) - Execution d'action Event : SetOr. Message=${message.content} - ContentData= quantité : ${amount}, member: ${message.member}`);

            client.setOr(client, message.member, parseInt(amount), message);
        },
        "SetXP": (message, amount) => {
            client.writeLog(`Event: gameEvent : ${message.author.tag} (${message.author.id}) - Execution d'action Event : SetXp. Message=${message.content} - ContentData= quantité : ${amount}, member: ${message.member}`);

            client.setXp(client, message.member, parseInt(amount));
        },
        "SetPoint": (message, type_point, amount) => {
            // Logique pour définir les points pour le membre
            // Assurez-vous d'avoir la référence au membre ici pour pouvoir manipuler ses points
            client.writeLog(`Event: gameEvent : ${message.author.tag} (${message.author.id}) - Execution d'action Event : SetPoint. Message=${message.content} - ContentData= Point: ${type_point}, quantité : ${amount}, member: ${message.member}`);

            client.editPoint(client, message.member, parseInt(amount), type_point);
        }
        // Ajoutez d'autres actions au besoin
    };

    let general_events_rarity = [60, 115, 100, 80, 75, 41, 6969, 69];
    let cachot_events_rarity = [50];
    let mission_events_rarity = [30000, 67];
    let working_events_rarity = [60];
    let expedition_events_rarity = [150];
    let conspiring_events_rarity = [10];


    let rarity_sorting = general_events_rarity; // de base on prend les events généraux.
    var array_ran = [];

    const dbUser = await client.getUser(message.member);
    if(dbUser.faction != "NULL") {
        const faction = await client.getFaction(dbUser.faction);
    }

    const currentDate = new Date();


    if (dbUser.in_jail == 'true') { // Si l'utilisateur est au cachot on utilise le json des events de cachot (et ses raretés)
        events = require("../../assets/rpg/events/events_cachots.json");
        rarity_sorting = cachot_events_rarity; // on prend donc les raretés des events cachots.
    }

    //*Pour les états d'activity, il faut donc vérifier l'activité en cours pour choisir le JSON mais SURTOUT si on est toujours en train de la faire ou si c'est terminé avec le activity_cooldown

    else if (dbUser.cooldown_activity.getTime() > currentDate.getTime() && dbUser.state_mission == true) {
        events = require("../../assets/rpg/events/events_mission.json");
        rarity_sorting = mission_events_rarity; // on prend donc les raretés des events mission.
    }

    else if (dbUser.cooldown_activity.getTime() > currentDate.getTime() && dbUser.state_travail == true) {
        events = require("../../assets/rpg/events/events_work.json");
        rarity_sorting = working_events_rarity; // on prend donc les raretés des events travail.
    }

    else if (dbUser.cooldown_activity.getTime() > currentDate.getTime() && dbUser.state_expedition == true) {
        events = require("../../assets/rpg/events/events_expedition.json");
        rarity_sorting = expedition_events_rarity; // on prend donc les raretés des events expédition.
    }

    else if (dbUser.conspiring == 'true') {
        events = require("../../assets/rpg/events/events_conspiration.json");
        rarity_sorting = conspiring_events_rarity; // on prend donc les raretés des events expédition.
    } else {
        events = require("../../assets/rpg/events/events.json");
        rarity_sorting = general_events_rarity;

    }

    // Selecteur d'event

    for (var i = 0; i < rarity_sorting.length; i++) {
        let x = rarity_sorting[i] * client.randomFloat(0, 1); //multiplication de chaque rareté par un random float entre 0 et 1
        if (x != 0) array_ran.push(x); // Ajout à l'array pour utilisation future
    }


    const min = array_ran.reduce((a, b) => Math.min(a, b))
    const final_rarity = rarity_sorting[array_ran.indexOf(min)];
    // message.channel.send("output minimal : " + min + "\nOutput total : " + array_ran + "\nOutput ID : " + array_ran.indexOf(min) + "\nOutput final : " + final_rarity); // debug

    //console.log(`DEBUG: final_rarity ${final_rarity}`)
    let dat_event = client.eventFilterByRarity(events, final_rarity);

    // message.channel.send(`out map : ${dat_event.map(m => m.id)} \nout final: ${client.getRandomKeyOfMap(dat_event.map(m => m.id))}`); // debug

    let ran_key = await client.getRandomKeyOfMap(dat_event.map(m => m.id));
    let final_event = client.filterById(events, ran_key);
    //console.log(`DEBUG: ${final_event.name}`); // debug 
    //console.log(`DEBUG: ${ran_key}`);

    //console.log(final_event);
    if (client.randomInt(0, final_event.rarete) == 1) { // faire le random entre 0 et final_event.rarete pour définir si on lance l'event ou non.
        if (final_event.condition == "/") { // il n'y a pas de condition
        } else {
            // la condition doit ressembler à ça dans le json : "if(dbUser.faction == 'epsilon') return true;" (pas de else, pas d'accolades)
            try {
                var result = eval('(function() {' + final_event.condition + '}())');
                if (result == true) { } // continuer
                else return;
            } catch(e) {
                console.log(e);
                return;
            }
            
        }
    } else {
        return;
    }

    //message.channel.send(`${final_event.name}\n\n${final_event.description} \n reactions : ${final_event.reactions} \n commands : ${final_event.commands}`); // debug

    if (final_event.reactions == "/") { // On affiche l'event mais on ne gère pas les réactions, on se contente d'exécuter les commandes
        message.channel.send(`${final_event.name}\n\n${final_event.description}`);
        final_event.commands.forEach(command => {
            if (typeof command === 'string') {
                const [actionName, ...args] = command.split("(");
                const functionName = actionName.trim();
                if (actions.hasOwnProperty(functionName)) {
                    const cleanArgs = args.map(arg => arg.replace(/[)]/g, "").trim());
                    const argsArray = cleanArgs.map(arg => arg.split("§").map(arg => arg.trim()));
                    actions[functionName](message, ...argsArray.flat());
                } else {
                    console.error(`La fonction ${functionName} n'existe pas.`);
                }
            } else {
                console.error(`La commande n'est pas une chaîne de caractères.`);
            }
        });
    } else { // On affiche l'event et on gère les réactions.

        var embed_event = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `Event - ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`${final_event.name}`)
        .setDescription(`${final_event.description}`);
    

        //let msg_ev = await message.channel.send(`${final_event.name}\n\n${final_event.description}`);
        let msg_ev = await message.channel.send({embeds:[embed_event]});

        for (let i = 0; i < final_event.reactions.length; i++) {
            /*if(isDiscordEmoji(final_event.reactions[i]) == true) {
                console.log(final_event.reactions[i].slice(1, -1));
                const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === final_event.reactions[i].slice(1, -1));
                msg_ev.react(`${reactionEmoji}`);
            } else {
                msg_ev.react(`${final_event.reactions[i]}`);
            }*/
            msg_ev.react(`${final_event.reactions[i]}`);
            //TODO: Supporter (même si c'est pas possible visiblement) les émojis au format discord.
            //*NOTE: Si on le fait c'est vraiment en méga pas important, draxy à trouvé un moyen d'utiliser tous les emotes.
        }

        const filter = (reaction, user) => {
            return (final_event.reactions.includes(reaction.emoji.name) && user.id === message.author.id);
        }

            msg_ev.awaitReactions({ filter, max: 1, time: 75000, errors: ['time'] })
                .then((collected) => {
                    const reaction = collected.first();
                    let id_react = final_event.reactions.indexOf(reaction.emoji.name);

                    if (reaction != undefined && id_react != -1) {
                        let commands = final_event.commands[id_react];
                        commands.forEach(command => {
                            const [actionName, args] = command.split("(");
                            const functionName = actionName.trim();
                            const argsArray = args.replace(/[)]/g, "").split("§").map(arg => arg.trim());

                            if (actions.hasOwnProperty(functionName)) {
                                actions[functionName](message, ...argsArray);
                            } else {
                                console.error(`La fonction ${functionName} n'existe pas.`);
                            }
                        });
                    }
                });

           
    }
}





