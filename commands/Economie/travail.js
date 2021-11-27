const metiers = require("../../assets/rpg/metiers/metiers.json");

module.exports.run = async (client, message, args, settings, dbUser) => {
   if(dbUser.metier == 0) return message.reply('Vous devez d\'abord choisir un métier avec la commande p<métier');
   

   let mt = client.filterById(metiers, dbUser.metier);
   
   if(dbUser.working == 'true') { // travail déjà

    const dailyCD = dbUser.heure_travail * 3600000;
    
    const lastDaily = await dbUser.cooldown_metier;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) < 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes de travail !`);
    } else { // Si le cooldown est passé.
        
        let salaire = dbUser.heure_travail * mt.salaire;
        let points_travail = parseInt(dbUser.heure_travail * client.randomFloat(1.15, 1.95));

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
                return message.channel.send(`Vous n'avez plus les qualifications nécessaires pour exercer le métier de ${mt.name} vous avez été renvoyé !\n${mt.infos}`);
            }
        }
       
    }

   } else { // n'a pas encore commencé à travailler
        if(isNaN(args[0])) return message.reply("Veuillez choisir le nombre d'heures que vous souhaitez travailler. Maximum : " + mt.horaires + " heures.");
        if(args[0] > mt.horaires) return message.reply(`Vous ne pouvez pas travailler plus longtemps que ${mt.horaires} heures.`)

        message.channel.send("Vous commencez à travailler pour " + parseInt(args[0]) + " heures !\n Refaite p<travail lorsque que vous voudrez récupérer votre salaire.");
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