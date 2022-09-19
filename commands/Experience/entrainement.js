module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);


    const dailyCD = dbUser.heure_entrainement * 3600000;
    
    const lastDaily = await dbUser.cooldown_entrainement;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { // cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes d'entrainement !`);
    } else { // Si le cooldown est passé.
        if(dbUser.heure_entrainement != 0) { // fini d'entrainement


            let t = dbUser.heure_entrainement;
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

            message.channel.send(`Après un entraînement de ${dbUser.heure_entrainement} heures, vous venez d'obtenir ${final_xp} experience.`);
            await client.setXp(client, message.member, final_xp);
            await client.updateUser(message.member, {cooldown_entrainement : 0});
            await client.updateUser(message.member, {heure_entrainement : 0});
            await client.updateUser(message.member, {training : false});

        } else { // Commence entrainement

            let t = args[0]
            if(isNaN(t)) return message.reply("Veuillez renseigner un valeur numérique (minimum 2 et maximum 12)");
            if(t < 2 || t > 12) return message.reply("Vous ne pouvez pas vous entrainer plus que 12 heures ou moins de 2.");

            if(dbUser.expedition_duration != 0) return message.reply("Vous ne pouvez pas vous entrainer si vous êtes en expédition.");
            if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas vous entrainer.");
            if(dbUser.on_mission == 'true') return message.reply("Vous êtes en mission, il vous est donc impossible de vous entrainer.");
            if(dbUser.working == 'true') return message.reply("Vous êtes en train de travailler, vous ne pouvez donc pas vous entrainer.");

            await client.updateUser(message.member, {cooldown_entrainement : Date.now()});
            await client.updateUser(message.member, {heure_entrainement : t});
            await client.updateUser(message.member, {training : true});


            message.channel.send(`Vous vous entraînez pour ${t} heures. Refaite \`p<entrainement\` lorsque ce sera terminé pour gagner vos gains.`);
        }
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