const metiers = require("../../assets/rpg/metiers/metiers.json");

module.exports.run = async (client, message, args, settings, dbUser) => { 
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    client.checkTaxes(message); //on vérifie l'état des taxes.

    const currentDate = new Date();

    //*noter le caractère "<" dans l'autre sens qui montre qu'il faut que ce soit dans le passé la date activity et non le futur !
    if(dbUser.cooldown_activity.getTime() < currentDate.getTime()) {
        console.log("Est passé")
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

    

    if(dbUser.state_expedition == true) return message.reply("Vous ne pouvez pas travailler si vous êtes en expédition." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - expédition en cours.`, `ERR`);
    if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - actuellement aux cachots.`, `ERR`);
    //if(dbUser.cooldown_mission.getTime() > currentDate.getTime()) return message.reply("Vous êtes en mission, il vous est donc impossible de travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - en mission.`, `ERR`);
    if(dbUser.state_mission == true) return message.reply("Vous êtes en mission, il vous est donc impossible de travailler." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - en mission.`, `ERR`);
    if(dbUser.state_entrainement == true) return message.reply("Vous êtes en train de vous entrainez, vous ne pouvez donc pas travailler." + ` Il vous reste encore **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - entrainement en cours.`, `ERR`); //0x01pa

    if(dbUser.metier == 0) return message.reply('Vous devez d\'abord choisir un métier avec la commande p<métier') & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Métier Invalide || Métier Inexistant`, `ERR`);
   

   let mt = client.filterById(metiers, dbUser.metier);
   
   //if(dbUser.working == 'true') { // travail déjà

    //const dailyCD = dbUser.heure_travail * 3600000;
    
    //const lastDaily = await dbUser.cooldown_metier;
    const lastDaily = await dbUser.cooldown_activity;
    //if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.

    //si le timer métier est plus loin que la date actuelle (donc pas passé)
    
    //if(dbUser.cooldown_metier.getTime() > currentDate.getTime()) {
        if(dbUser.cooldown_activity.getTime() > currentDate.getTime()) {
        
        //const cdTime = dailyCD - (Date.now() - lastDaily);
        //const cdTime = dbUser.cooldown_metier.getTime() - currentDate.getTime();
        const cdTime = dbUser.cooldown_activity.getTime() - currentDate.getTime();

        message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir travailler de nouveau !`);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - wait cooldown : ${Math.floor(cdTime / (1000*60*60) % 24)}:${Math.floor(cdTime / (1000*60) % 60)}:${Math.floor(cdTime / (1000) % 60)} | lastdaily=${lastDaily} | dailycd=${dailyCD} | Date: ${Date.now()}`);

    } else { // Si le cooldown est passé.
        
        
       
    

   //} else { // n'a pas encore commencé à travailler
        if(isNaN(args[0])) return message.reply("Veuillez choisir le nombre d'heures que vous souhaitez travailler. Maximum : " + mt.horaires + " heures.");
        if(args[0] > mt.horaires) return message.reply(`Vous ne pouvez pas travailler plus longtemps que ${mt.horaires} heures.`)



        let salaire = parseInt(args[0]) * mt.salaire;
        console.log(salaire);

        //let random = client.randomFloat(0.6, 1.4); //ancienne formule pré 1.1.0
        let random = client.randomFloat(0.8, 1.2); //nouvelle formule 1.1.0
        //let points_travail = parseInt(parseInt(args[0]) * random); //ancienne formule pré 1.1.0
        let points_travail = parseInt(parseInt(args[0]) * random); //nouvelle formule 1.1.0

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - SALAIRE=${salaire} | RANDOM=${random} | POINTS_TRAVAIL=${points_travail} | HEURE_TRAVAIL=${dbUser.heure_travail}`);

        message.channel.send(`Après avoir travaillé dur pendant **${parseInt(args[0])}** heures, vous récupérez votre salaire qui est de **${salaire}** poyn :coin: et vous gagnez **${points_travail}** points de travail !`);
        await client.setOr(client, message.member, salaire, message);
        await client.editPoint(client, message.member, points_travail, "travail");
        //await client.updateUser(message.member, {working: false});
        //await client.updateUser(message.member, {heure_travail: 0});
        //await client.updateUser(message.member, {cooldown_metier: 0});

        if(mt.prerequis == "/") { // il n'y a pas de condition
        } else {
            var result = eval('(function() {' + mt.prerequis + '}())');
            if(result == true) {

            } // continuer
            else {
                await client.updateUser(message.member, {metier: 0});
                client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Qualifications manquantes. Renvoyé de son travail.`);
                return message.channel.send(`Vous n'avez plus les qualifications nécessaires pour exercer le métier de ${mt.name} vous avez été renvoyé !\n${mt.infos} DEBUG: ${mt.prerequis}`);
            }
        }



        //message.channel.send("Vous commencez à travailler pour " + parseInt(args[0]) + " heures !\n Refaite p<travail lorsque que vous voudrez récupérer votre salaire.");
        //client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Travail débuté. HEURES=${parseInt(args[0])}`);
        //await client.updateUser(message.member, {working: true});
        //await client.updateUser(message.member, {heure_travail: parseInt(args[0])});
        //await client.updateUser(message.member, {cooldown_metier: Date.now()});


        const NewcurrentDate = new Date();
        // Nombre de millisecondes à ajouter (par exemple, 1 heure = 3600 secondes * 1000 millisecondes)
        const millisecondsToAdd = parseInt(args[0]) * 60 * 60 * 1000;

        // Calcul de la nouvelle date
        const newDate = new Date(NewcurrentDate.getTime() + millisecondsToAdd);

        //await client.updateUser(message.member, {cooldown_metier : newDate});
        await client.updateUser(message.member, {cooldown_activity : newDate});
        await client.updateUser(message.member, {state_travail : true});
        //await client.updateUser(message.member, {working : true});
    }
   //}
}

module.exports.help = {
    name: "travail",
    aliases: ['t'],
    category: "economie",
    desription: "Exercez votre métier pour gagner des poyn et des points de travail.",
    usage: '<heures>',
    cooldown: 2, 
    permissions: false,
    args: true,
};