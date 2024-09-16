const {EmbedBuilder, Message} = require('discord.js')
const levenshtein = require('js-levenshtein');

module.exports.run = async (client, message, args, settings, dbUser) => {

    const currentDate = new Date();
    //const dailyCD = dbUser.heure_entrainement * 3600000;

    //*noter le caractère "<" dans l'autre sens qui montre qu'il faut que ce soit dans le passé la date activity et non le futur !

    if(dbUser.cooldown_activity.getTime() < currentDate.getTime()) {
        await client.updateUser(message.member, {state_travail: false});
        await client.updateUser(message.member, {state_entrainement: false});
        await client.updateUser(message.member, {state_expedition: false});

        let localisation_fac = dbUser.localisation_expedition;

        if(dbUser.localisation_expedition != "NULL") {
            // retire le membre des joueurs sur le territoire de la faction.
            let faction_exped = await client.getFaction(localisation_fac);
            if(faction_exped.name != dbUser.faction) {

                let arr = faction_exped.joueurs_sur_le_territoire;
                arr = arr.filter(e => e !== dbUser.userID);

                await client.updateFaction(faction_exped.name, {joueurs_sur_le_territoire: arr});
            }
        }

        await client.updateUser(message.member, {localisation_expedition: "NULL"});
        await client.updateUser(message.member, {state_mission: false});
    }
    
    dbUser = await client.getUser(message.member);

    const cooldown_remain = dbUser.cooldown_activity.getTime() - currentDate.getTime();
    

    if(dbUser.state_entrainement == true) return message.reply("Vous ne pouvez pas partir en expédition si vous vous entrainez." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas expedition - entrainement en cours.`, `ERR`);
    if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas partir (ou revenir hehe) d'expédition.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - actuellement aux cachots.`, `ERR`);
    //if(dbUser.cooldown_mission.getTime() > currentDate.getTime()) return message.reply("Vous êtes en mission, il vous est donc impossible de travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - en mission.`, `ERR`);
    if(dbUser.state_mission == true) return message.reply("Vous êtes en mission, il vous est donc impossible de partir en expédition." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas expedition - en mission.`, `ERR`);
    if(dbUser.state_travail == true) return message.reply("Vous êtes en train de travailler, il vous est donc impossible de partir en expédition." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas expedition - travail en cours.`, `ERR`); //0x01pa



    if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) {

        
        //if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { // cooldown pas encore passé.
            //const cdTime = dailyCD - (Date.now() - lastDaily);
            //const cdTime = dbUser.cooldown_entrainement.getTime() - currentDate.getTime();
            const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();
    
            message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir partir en expédition !`);
    } else {

        const expedition_duration = client.randomInt(8, 10) * 3600000; // random entre 8 et 10 heures (en ms);
        let or_apporter = parseInt(args[0]);

        if(!or_apporter && or_apporter != 0) return message.reply("vous devez renseigner une valeur numérique.");
        if(or_apporter > 100) or_apporter = 100;
        if(or_apporter < 10) or_apporter = 0; // Ici c'est défini à 0 pour l'affichage.
        if(or_apporter > dbUser.or) return message.reply("vous n'avez pas assez de poyn.");
        //if(!args[1]) return message.reply("vous devez sélectionner le pays")

        /*let localisation;

        if(!args[1]) {
            localisation = dbUser.faction;
        } else {
            localisation = args[1].toLowerCase();
            
            if(localisation != "epsilon") {
                if(localisation != "daïros") {
                    if(localisation != "lyomah") {
                        if(localisation != "alpha") {
                            localisation = dbUser.faction;
                        }
                    }
                }
            }
        }*/

            
        let localisation;

        if (!args[1]) {
            localisation = dbUser.faction;
        } else {
            localisation = args[1].toLowerCase();
            
            const factions = ["epsilon", "daïros", "lyomah", "alpha"];
            let closestMatch = null;
            let minDistance = Infinity;
            const strictThreshold = 2; // Seuil strict pour une correspondance acceptable
            const maxDistance = 5; // Seuil maximum au-delà duquel on considère que c'est "trop éloigné"

            factions.forEach(faction => {
                const distance = levenshtein(localisation, faction);
                if (distance < minDistance) {
                    minDistance = distance;
                    //message.channel.send("[DEBUG] distance lev: " + distance)
                    closestMatch = faction;
                }
            });

            if (minDistance <= strictThreshold) {
                localisation = closestMatch;
                message.reply(`T'écris n'importe comment mais okay c'est parti pour ${client.upperCaseFirstChar(localisation)} ! <:EP_trop_classe:711231715225501776>`);
            } else if (minDistance <= maxDistance) {
                return message.reply(`Je crois que tu voulais dire ${closestMatch}, mais comme je suis pas sûr, réessaie !`);
            } else {
                return message.reply(`J'ai rien compris où tu voulais aller faire ton expédition, réessaie ! ~~t'écris n'importe comment...~~`);
                //localisation = dbUser.faction; // Optionnel, si on veut revenir à la faction par défaut
            }
        }

        
        await client.setOr(client, message.member, - or_apporter, message);
        await client.updateUser(message.member, {expedition_duration: expedition_duration, or_expedition: or_apporter});

        //nouveautés amélioration expédition.
        await client.updateUser(message.member, {localisation_expedition: localisation});
        if(localisation != dbUser.faction) {
            let faction = await client.getFaction(localisation);
            let new_array = faction.joueurs_sur_le_territoire;
            new_array.push(dbUser.userID.toString());
            await client.updateFaction(faction.name, {joueurs_sur_le_territoire: new_array});
        }



            const initial_or_apporter = or_apporter;
            if(or_apporter < 10) or_apporter = 0; // Ici c'est défini à 4 car comme ça le calcul de bonus sera * 1 donc aucun bonus.
            else or_apporter = or_apporter;

            const bonus_or = 0.125 * or_apporter;
            const level_user = dbUser.level;
            const time = Math.floor(expedition_duration / (1000*60*60) % 24);
            console.log(time);
            
            const final_xp = Math.round((12.5 * (time * level_user + (bonus_or * level_user / 3))/ Math.sqrt(level_user)));
            const final_or = Math.round(10 - initial_or_apporter * 0.10);
            const final_savoir = parseInt(time * client.randomFloat(0.6, 1.4));
            
            let faction_exped = await client.getFaction(localisation);
            
            var finEmbed = new EmbedBuilder()
            .setColor('3F992D')
            .setAuthor({name:`Expédition`, iconURL:message.author.displayAvatarURL()})
            .addFields([{name: `** **`, value:`**:test_tube: +${final_xp} XP**`},{name: `** **`, value: `:coin: **+${final_or} Poyn**`},{name: `** **`, value: `:brain: **+${final_savoir} points de savoir**`}])
            
            if(faction_exped.name != dbUser.faction) { //si on est ailleurs que notre territoire on a de meilleurs bonus
                finEmbed = new EmbedBuilder()
                .setColor('3F992D')
                .setAuthor({name:`Expédition en territoire ennemi !`, iconURL:message.author.displayAvatarURL()})
                .addFields([{name: `** **`, value:`**:test_tube: +${Math.round(final_xp * 1.15)} XP**`},{name: `** **`, value: `:coin: **+${Math.round(final_or * 1.15)} Poyn**`},{name: `** **`, value: `:brain: **+${Math.round(final_savoir * 1.15)} points de savoir**`}, {name: `** **`, value: `👑 **+1 point de prestige**`}])    
            
                await client.setOr(client, message.member, initial_or_apporter, message);
                await client.editPoint(client, message.member, Math.round(final_savoir * 1.15), "savoir");
                await client.editPoint(client, message.member, 1, "prestige");
                await client.updateUser(message.member, {expedition_duration: 0, or_expedition: 0}); //! obsolète je crois
                await client.setXp(client, message.member, Math.round(final_xp * 1.15));
                await client.setOr(client, message.member, Math.round(final_or * 1.15), message);

            } else {
                await client.setOr(client, message.member, initial_or_apporter, message);
                await client.editPoint(client, message.member, final_savoir, "savoir");
                await client.updateUser(message.member, {expedition_duration: 0, or_expedition: 0}); //! obsolète je crois
                await client.setXp(client, message.member, final_xp);
                await client.setOr(client, message.member, final_or, message);
            }

            
            

            message.channel.send({embeds:[finEmbed]});

            

            const NewcurrentDate = new Date();
            // Nombre de millisecondes à ajouter (par exemple, 1 heure = 3600 secondes * 1000 millisecondes)
            const millisecondsToAdd = expedition_duration;

            // Calcul de la nouvelle date
            const newDate = new Date(NewcurrentDate.getTime() + millisecondsToAdd);

            await client.updateUser(message.member, {cooldown_activity : newDate});
            await client.updateUser(message.member, {state_expedition : true});


    }

/*
    //const currentDate = new Date();

    // if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas partir (ou revenir hehe) d'expédition.");
    // if(dbUser.cooldown_mission.getTime() > currentDate.getTime()) return message.reply("Vous êtes en mission, il vous est donc impossible de partir en expédition.");
    // if(dbUser.cooldown_metier.getTime() > currentDate.getTime()) return message.reply("Vous êtes en train de travailler, vous ne pouvez donc pas partir en expédition.");
    // if(dbUser.training == true) return message.reply("Vous êtes en train de vous entrainez, vous ne pouvez donc pas partir en expédition.");

    let or_apporter = parseInt(args[0]);
    if(dbUser.expedition_duration == 0) { // Si la duration est égale à 0 c'est qu'il n'y a pas d'éxpedition en cours.
        const expedition_duration = client.randomInt(8, 10) * 3600000; // random entre 8 et 10 heures (en ms);
        let or_apporter = parseInt(args[0]);

        if(!or_apporter && or_apporter != 0) return message.reply("vous devez renseigner une valeur numérique.");
        if(or_apporter > 100) or_apporter = 100;
        if(or_apporter < 10) or_apporter = 0; // Ici c'est défini à 0 pour l'affichage.
        if(or_apporter > dbUser.or) return message.reply("vous n'avez pas assez de poyn.");
        //if(!args[1]) return message.reply("vous devez sélectionner le pays")

        let localisation;

        if(!args[1]) {
            localisation = dbUser.faction;
        } else {
            localisation = args[1].toLowerCase();
            
            if(localisation != "epsilon") {
                if(localisation != "daïros") {
                    if(localisation != "lyomah") {
                        if(localisation != "alpha") {
                            localisation = dbUser.faction;
                        }
                    }
                }
            }
        }
        
        await client.setOr(client, message.member, - or_apporter, message);

        const debutEmbed = new EmbedBuilder()
        .setColor('5E6366')
        .setAuthor({name: `Expédition lancée !`, iconURL: message.author.displayAvatarURL()})
        .setDescription(`L'expédition va durer **${expedition_duration / 3600000}h** avec **${or_apporter}** poyn sur les terres de la faction ${localisation} !`);

        message.channel.send({embeds:[debutEmbed]});
        await client.updateUser(message.member, {expedition_duration: expedition_duration, or_expedition: or_apporter, cooldown_expedition: Date.now()});

        //nouveautés amélioration expédition.
        await client.updateUser(message.member, {localisation_expedition: localisation});
        if(localisation != dbUser.faction) {
            let faction = await client.getFaction(localisation);
            let new_array = faction.joueurs_sur_le_territoire;
            new_array.push(dbUser.userID.toString());
            await client.updateFaction(faction.name, {joueurs_sur_le_territoire: new_array});
        }
        
        

    } else { // Si la duration n'est pas égale à 0 c'est qu'il y a une éxpedition en cours OU terminée où on peut récup les loots.

        if(dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition) < 0) {
            if(dbUser.or_expedition < 10) or_apporter = 0; // Ici c'est défini à 4 car comme ça le calcul de bonus sera * 1 donc aucun bonus.
            else or_apporter = dbUser.or_expedition;

            const bonus_or = 0.125 * or_apporter;
            const level_user = dbUser.level;
            const time = Math.floor(dbUser.expedition_duration / (1000*60*60) % 24);
            console.log(time);
            
            const final_xp = Math.round((12.5 * (time * level_user + (bonus_or * level_user / 3))/ Math.sqrt(level_user)));
            const final_or = Math.round(10 - dbUser.or_expedition * 0.10);
            const final_savoir = parseInt(time * client.randomFloat(0.6, 1.4));
            
            
            const finEmbed = new EmbedBuilder()
            .setColor('3F992D')
            .setAuthor({name:`Expédition terminée !`, iconURL:message.author.displayAvatarURL()})
            .addFields([{name: `** **`, value:`**:test_tube: +${final_xp} XP**`},{name: `** **`, value: `:coin: **+${final_or} Poyn**`},{name: `** **`, value: `:brain: **+${final_savoir} points de savoir**`}])
            

            message.channel.send({embeds:[finEmbed]});
            await client.setOr(client, message.member, dbUser.or_expedition, message);
            await client.editPoint(client, message.member, final_savoir, "savoir");
            await client.updateUser(message.member, {expedition_duration: 0, or_expedition: 0, cooldown_expedition: 0});
            await client.setXp(client, message.member, final_xp);
            await client.setOr(client, message.member, final_or, message);

            

            // retire le membre des joueurs sur le territoire de la faction.
            let faction_exped = await client.getFaction(dbUser.localisation_expedition);
            if(faction_exped.name != dbUser.faction) {

                let arr = faction_exped.joueurs_sur_le_territoire;
                arr = arr.filter(e => e !== dbUser.userID);

                await client.updateFaction(faction_exped.name, {joueurs_sur_le_territoire: arr});
            }

        } else {
            const cdTime = dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition);
            message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de revenir d'expédition. :hourglass:`);
        }    
    } */
};

module.exports.help = {
    name: "expédition",
    aliases: ['e', 'expedition', 'expe', 'expé'],
    category: "generalrpg",
    desription: "Partez en expédition pour gagner richesses, expériences et items. Sélectionnez le nombre de poyn à emmener avec vous, et choisissez si vous le souhaitez un autre territoire que le vôtre pour gagner plus... mais attention aux représailles.",
    usage: '<poyn> [localisation:epsilon/daïros/lyomah/alpha]',
    cooldown: 3, 
    permissions: false,
    args: false
};