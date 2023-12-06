module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);
    
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
    

    if(dbUser.state_expedition == true) return message.reply("Vous ne pouvez pas vous entrainer si vous êtes en expédition." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - expédition en cours.`, `ERR`);
    if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas vous entrainer.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - actuellement aux cachots.`, `ERR`);
    //if(dbUser.cooldown_mission.getTime() > currentDate.getTime()) return message.reply("Vous êtes en mission, il vous est donc impossible de travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - en mission.`, `ERR`);
    if(dbUser.state_mission == true) return message.reply("Vous êtes en mission, il vous est donc impossible de vous entrainer." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - en mission.`, `ERR`);
    if(dbUser.state_travail == true) return message.reply("Vous êtes en train de travailler, vous ne pouvez donc pas vous entrainer." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - entrainement en cours.`, `ERR`); //0x01pa

    
    //const lastDaily = await dbUser.cooldown_entrainement;
    //*INUTILE mais on laisse tkt
    //if(dbUser.cooldown_entrainement.getTime() > currentDate.getTime()) {
    if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) {

        
    //if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { // cooldown pas encore passé.
        //const cdTime = dailyCD - (Date.now() - lastDaily);
        //const cdTime = dbUser.cooldown_entrainement.getTime() - currentDate.getTime();
        const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();

        message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir vous entraîner !`);
    } else { // Si le cooldown est passé.


            let t = args[0]
            if(isNaN(t)) return message.reply("Veuillez renseigner un valeur numérique (minimum 2 et maximum 12)");
            if(t < 2 || t > 12) return message.reply("Vous ne pouvez pas vous entrainer plus que 12 heures ou moins de 2.");



            t = parseInt(t);
            let f = dbUser.forme;
            let s = dbUser.savoir;
            let m = dbUser.moral;
            let x = dbUser.level;
    
    
            let clc_forme = (f * client.randomFloat(0.75, 2)) / Math.sqrt(f);
            let clc_savoir = (s * client.randomFloat(0.75, 2)) / Math.sqrt(s);
            let clc_moral = (m * client.randomFloat(0.75, 2)) / Math.sqrt(m);
    
            if(f <= 0) clc_forme = 0;
            if(s <= 0) clc_savoir = 0;
            if(m <= 0) clc_moral = 0;
    
            
    
            let final_xp = Math.round(client.randomFloat(0.9, 1.2) * (((t * x * client.randomFloat(10, 12)) / Math.sqrt(x)) + clc_forme + clc_savoir + clc_moral));

            let ran = client.randomFloat(0.6, 1.4);
            let points_forme = parseInt(t * ran);

            message.channel.send(`Après un entraînement de ${t} heures, vous venez d'obtenir ${final_xp} experience et ${points_forme} points de forme.`);
            await client.setXp(client, message.member, final_xp);
            await client.editPoint(client, message.member, points_forme, "forme");


            const NewcurrentDate = new Date();
            // Nombre de millisecondes à ajouter (par exemple, 1 heure = 3600 secondes * 1000 millisecondes)
            const millisecondsToAdd = t * 60 * 60 * 1000;

            // Calcul de la nouvelle date
            const newDate = new Date(NewcurrentDate.getTime() + millisecondsToAdd);

            await client.updateUser(message.member, {cooldown_activity : newDate});
            await client.updateUser(message.member, {state_entrainement : true});

            //await client.updateUser(message.member, {cooldown_entrainement : 0});
            //await client.updateUser(message.member, {heure_entrainement : 0});
            //await client.updateUser(message.member, {training : false});



            //await client.updateUser(message.member, {cooldown_entrainement : Date.now()});
            //await client.updateUser(message.member, {heure_entrainement : t});
            //await client.updateUser(message.member, {training : true});


        // if(dbUser.heure_entrainement != 0) { // fini d'entrainement


        //     let t = dbUser.heure_entrainement;
        //     let f = dbUser.forme;
        //     let s = dbUser.savoir;
        //     let m = dbUser.moral;
        //     let x = dbUser.level;
    
    
        //     let clc_forme = (f * client.randomFloat(0.75, 2)) / Math.sqrt(f);
        //     let clc_savoir = (s * client.randomFloat(0.75, 2)) / Math.sqrt(s);
        //     let clc_moral = (m * client.randomFloat(0.75, 2)) / Math.sqrt(m);
    
        //     if(f <= 0) clc_forme = 0;
        //     if(s <= 0) clc_savoir = 0;
        //     if(m <= 0) clc_moral = 0;
    
            
    
        //     let final_xp = Math.round(client.randomFloat(0.9, 1.2) * (((t * x * client.randomFloat(10, 12)) / Math.sqrt(x)) + clc_forme + clc_savoir + clc_moral));

        //     let ran = client.randomFloat(0.6, 1.4);
        //     let points_forme = parseInt(dbUser.heure_entrainement * ran);

        //     message.channel.send(`Après un entraînement de ${dbUser.heure_entrainement} heures, vous venez d'obtenir ${final_xp} experience et ${points_forme} points de forme.`);
        //     await client.setXp(client, message.member, final_xp);
        //     await client.editPoint(client, message.member, points_forme, "forme");
        //     await client.updateUser(message.member, {cooldown_entrainement : 0});
        //     await client.updateUser(message.member, {heure_entrainement : 0});
        //     await client.updateUser(message.member, {training : false});

        // } else { // Commence entrainement

        //     let t = args[0]
        //     if(isNaN(t)) return message.reply("Veuillez renseigner un valeur numérique (minimum 2 et maximum 12)");
        //     if(t < 2 || t > 12) return message.reply("Vous ne pouvez pas vous entrainer plus que 12 heures ou moins de 2.");

        //     const currentDate = new Date();


        //     if(dbUser.expedition_duration != 0) return message.reply("Vous ne pouvez pas vous entrainer si vous êtes en expédition.");
        //     if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas vous entrainer.");
        //     if(dbUser.cooldown_mission.getTime() > currentDate.getTime()) return message.reply("Vous êtes en mission, il vous est donc impossible de vous entrainer.");
        //     if(dbUser.cooldown_metier.getTime() > currentDate.getTime()) return message.reply("Vous êtes en train de travailler, vous ne pouvez donc pas vous entrainer.");

        //     await client.updateUser(message.member, {cooldown_entrainement : Date.now()});
        //     await client.updateUser(message.member, {heure_entrainement : t});
        //     await client.updateUser(message.member, {training : true});


        //     message.channel.send(`Vous vous entraînez pour ${t} heures. Refaite \`p<entrainement\` lorsque ce sera terminé pour gagner vos gains.`);
        // }
    }
}

module.exports.help = {
    name: "entrainement",
    aliases: ["en"],
    category: "experience",
    desription: "Entrainez vous pour gagner de l'xp !.",
    usage: '<durée>',
    cooldown: 1, 
    permissions: false,
    args: false,
};