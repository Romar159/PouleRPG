const metiers = require("../../assets/rpg/metiers/metiers.json");

module.exports.run = async (client, message, args, settings, dbUser) => { 
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    client.checkTaxes(message); //on vérifie l'état des taxes.

    if(dbUser.expedition_duration != 0) return message.reply("Vous ne pouvez pas travailler si vous êtes en expédition.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - expédition en cours.`, `ERR`);
    if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - actuellement aux cachots.`, `ERR`);
    if(dbUser.on_mission == 'true') return message.reply("Vous êtes en mission, il vous est donc impossible de travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - en mission.`, `ERR`);
    if(dbUser.training == true) return message.reply("Vous êtes en train de vous entrainez, vous ne pouvez donc pas travailler.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ne peut pas travailler - entrainement en cours.`, `ERR`); //0x01pa

    if(dbUser.metier == 0) return message.reply('Vous devez d\'abord choisir un métier avec la commande p<métier') & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Métier Invalide || Métier Inexistant`, `ERR`);
   

   let mt = client.filterById(metiers, dbUser.metier);
   
   if(dbUser.working == 'true') { // travail déjà

    const dailyCD = dbUser.heure_travail * 3600000;
    
    const lastDaily = await dbUser.cooldown_metier;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes de travail !`);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - wait cooldown : ${Math.floor(cdTime / (1000*60*60) % 24)}:${Math.floor(cdTime / (1000*60) % 60)}:${Math.floor(cdTime / (1000) % 60)} | lastdaily=${lastDaily} | dailycd=${dailyCD} | Date: ${Date.now()}`);

    } else { // Si le cooldown est passé.
        
        let salaire = dbUser.heure_travail * mt.salaire;
        let random = client.randomFloat(0.6, 1.4);
        let points_travail = parseInt(dbUser.heure_travail * random);

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - SALAIRE=${salaire} | RANDOM=${random} | POINTS_TRAVAIL=${points_travail} | HEURE_TRAVAIL=${dbUser.heure_travail}`);

        message.channel.send(`Après avoir travaillé dur pendant **${dbUser.heure_travail}** heures, vous récupérez votre salaire qui est de **${salaire}** :coin: et vous gagnez **${points_travail}** points de travail !`);
        await client.setOr(client, message.member, salaire, message);
        await client.editPoint(client, message.member, points_travail, "travail");
        await client.updateUser(message.member, {working: false});
        await client.updateUser(message.member, {heure_travail: 0});
        await client.updateUser(message.member, {cooldown_metier: 0});

        if(mt.prerequis == "/") { // il n'y a pas de condition
        } else {
            var result = eval('(function() {' + mt.prerequis + '}())');
            if(result == true) {

            } // continuer
            else {
                await client.updateUser(message.member, {metier: 0});
                client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Qualifications manquantes. Renvoyé de son travail.`);
                return message.channel.send(`Vous n'avez plus les qualifications nécessaires pour exercer le métier de ${mt.name} vous avez été renvoyé !\n${mt.infos}`);
            }
        }
       
    }

   } else { // n'a pas encore commencé à travailler
        if(isNaN(args[0])) return message.reply("Veuillez choisir le nombre d'heures que vous souhaitez travailler. Maximum : " + mt.horaires + " heures.");
        if(args[0] > mt.horaires) return message.reply(`Vous ne pouvez pas travailler plus longtemps que ${mt.horaires} heures.`)

        message.channel.send("Vous commencez à travailler pour " + parseInt(args[0]) + " heures !\n Refaite p<travail lorsque que vous voudrez récupérer votre salaire.");
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Travail débuté. HEURES=${parseInt(args[0])}`);
        await client.updateUser(message.member, {working: true});
        await client.updateUser(message.member, {heure_travail: parseInt(args[0])});
        await client.updateUser(message.member, {cooldown_metier: Date.now()});
   }
}

module.exports.help = {
    name: "travail",
    aliases: ['t'],
    category: "economie",
    desription: "Exercez votre métier pour gagner de l'or et des points de travail.",
    usage: '[heures]',
    cooldown: 2, 
    permissions: false,
    args: false,
};