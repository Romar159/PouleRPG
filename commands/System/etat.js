module.exports.run = async (client, message, args, settings, dbUser) => {

    const currentDate = new Date();

    let dailyCD = 0;

    let infos_travail, infos_arene, infos_tacty, infos_pari, infos_ennemi, infos_entrainement, infos_expedition, infos_prison, infos_streak_arene, infos_mission;

    //let dailyCD = dbUser.heure_travail * 3600000;
    
    let lastDaily = await dbUser.cooldown_activity;
    //if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
    if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) {
        //let cdTime = dailyCD - (Date.now() - lastDaily);
        const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();
        infos_travail = `Vous ne pouvez **pas** travailler actuellement ${(dbUser.state_travail ? "car vous **travaillez** déjà" : dbUser.state_expedition ? "car vous êtes en **expédition**" : dbUser.state_mission ? "car vous êtes en **mission**" : dbUser.state_entrainement ? "car vous vous **entraînez**" : "")}. Il vous reste **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant d'avoir terminé.`;
    } else {
        
        infos_travail = `Vous **pouvez** travailler.`;

        

        if(dbUser.in_jail == 'true' || dbUser.state_mission == true || dbUser.state_entrainement == true || dbUser.state_expedition == true) {
            infos_travail = `Vous ne pouvez **pas** travailler.`;
        }
    }

    if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) {
        //let cdTime = dailyCD - (Date.now() - lastDaily);
        const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();
        infos_mission = `Vous ne pouvez **pas** partir en mission ${(dbUser.state_travail ? "car vous **travaillez**" : dbUser.state_expedition ? "car vous êtes en **expédition**" : dbUser.state_mission ? "car vous êtes déjà en **mission**" : dbUser.state_entrainement ? "car vous vous **entraînez**" : "")}. Il vous reste **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant d'avoir terminé.`;
    } else {
        
        infos_mission = `Vous **pouvez** partir en mission.`;

        

        if(dbUser.in_jail == 'true' || dbUser.state_travail == true || dbUser.state_entrainement == true || dbUser.state_expedition == true) {
            infos_mission = `Vous ne pouvez **pas** partir en mission.`;
        }
    }

    dailyCD = 300000;

    lastDaily = await dbUser.cooldown_arene;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        cdTime = dailyCD - (Date.now() - lastDaily);
        infos_arene = `Vous ne pouvez **pas** retourner dans l'**arène** avant encore **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes.`;
    } else { 
        infos_arene = `Vous **pouvez** retourner dans l'**arène**.`

    }

    dailyCD = 36000000;

    lastDaily = await dbUser.cooldown_tacty;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        cdTime = dailyCD - (Date.now() - lastDaily);
        infos_tacty = `Vous ne pouvez **pas** jeter de pièce à un SDF avant encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes.`;
    } else { 
        infos_tacty = `Vous **pouvez** jeter un sous à un **SDF**.`
    }

    dailyCD = 7200000;

    lastDaily = await dbUser.cooldown_pari;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        cdTime = dailyCD - (Date.now() - lastDaily);
        infos_pari = `Vous ne pouvez **pas** parier avant encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes.`;
    } else { 
        infos_pari = `Vous **pouvez** parier.`;
    }

    dailyCD = 3600000 * 2;

    lastDaily = await dbUser.cooldown_ennemi;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        cdTime = dailyCD - (Date.now() - lastDaily);
        infos_ennemi = `Vous ne pouvez **pas** combattre un ennemi avant encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes.`;
    } else { 
        infos_ennemi = `Vous **pouvez** combattre un ennemi.`;
    }

    dailyCD = dbUser.heure_entrainement * 3600000;

    lastDaily = await dbUser.cooldown_activity;
    if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) { //cooldown pas encore passé.
        //cdTime = dailyCD - (Date.now() - lastDaily);
        const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();
        infos_entrainement = `Vous ne pouvez **pas** vous entrainer ${(dbUser.state_travail ? "car vous **travaillez**" : dbUser.state_expedition ? "car vous êtes en **expédition**" : dbUser.state_mission ? "car vous êtes en **mission**" : dbUser.state_entrainement ? "car vous vous **entraînez** déjà" : "")}. Il vous reste **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant d'avoir terminé.`;
    } else { 
        infos_entrainement = `Vous **pouvez** vous entrainer.`;

        if(dbUser.in_jail == 'true' || dbUser.state_mission == true || dbUser.state_travail == true || dbUser.state_expedition == true) {
            infos_entrainement = `Vous ne pouvez **pas** vous entrainer.`;
        }
    }

    lastDaily = await dbUser.cooldown_activity;
    if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) { //cooldown pas encore passé.
        //cdTime = dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition);
        const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();

        infos_expedition = `Vous ne pouvez **pas** partir en expédition ${(dbUser.state_travail ? "car vous **travaillez**" : dbUser.state_expedition ? "car vous êtes déjà en **expédition**" : dbUser.state_mission ? "car vous êtes en **mission**" : dbUser.state_entrainement ? "car vous vous **entraînez**" : "")}. Il vous reste **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant d'avoir terminé.`;
    } else { 
        infos_expedition = `Vous **pouvez** partir en expédition.`;

        if(dbUser.in_jail == 'true' || dbUser.state_mission == true || dbUser.state_travail == true || dbUser.state_entrainement == true) {
            infos_expedition = `Vous ne pouvez **pas** partir en expédition.`;
        }
    }



    infos_streak_arene = `Vous avez gagner **${dbUser.arene_streak} fois de suite** dans l'arène.`;

    
    if(dbUser.in_jail == 'true') {
        var factions = ['epsilon', 'daïros', 'lyomah', 'alpha'];
        var item_processed = 0;
        factions.forEach(async e => {
            item_processed++;

            var faction = await client.getFaction(e);
            faction.cachot.forEach(element => {
                if(message.member == message.guild.members.cache.get(element)) {
                    infos_prison = `Vous **êtes** en prison dans les geôles de **${e}**`; 
                }
            }) 

            if(item_processed == e.length - 1) {
                finality();
            }
        })
        
    } else {
        infos_prison = `Vous **n'êtes pas** en prison`;
        finality();
    }



    function finality() {
        message.channel.send(`${infos_travail} \n${infos_mission} \n${infos_entrainement} \n${infos_expedition} \n\n${infos_arene} \n${infos_streak_arene} \n\n${infos_tacty} \n${infos_pari} \n${infos_ennemi} \n${infos_prison}`); //? DraxyNote, tu peux évidemment changer les phrases d'affichage et les mots en gras, j'ai mit un truc générique pour l'instant.
    }
}

module.exports.help = {
    name: "état",
    aliases: ['et', 'tu'],
    category: "system",
    desription: "Donne des informations sur les timers et l'état d'un utilisateur.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};