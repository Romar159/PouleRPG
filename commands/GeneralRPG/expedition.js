const {randomInt} = require('../../util/functions/randominteger');

module.exports.run = async (client, message, args, settings, dbUser) => {

    let or_apporter = parseInt(args[0]);
    if(dbUser.expedition_duration == 0) { // Si la duration est égale à 0 c'est qu'il n'y a pas d'éxpedition en cours.
        const expedition_duration = randomInt(8, 10) * 3600000; // random entre 8 et 10 heures (en ms);
        let or_apporter = parseInt(args[0]);

        if(!or_apporter) return message.reply("Vous devez renseigner une valeur numérique.");
        if(or_apporter > 100) or_apporter = 100;
        if(or_apporter < 10) or_apporter = 0; // Ici c'est défini à 0 pour l'affichage.
        if(or_apporter > dbUser.or) return message.reply("Vous n'avez pas assez d'argent.");
    
        message.channel.send(`Expedition lancée pour ${Math.floor(expedition_duration / (1000*60*60) % 24)} heures. Avec ${or_apporter} or apportés.`); // ? DraxyNote: A stylisé aussi, c'est ce qui dit que tu as lancé l'expedition
        await client.updateUser(message.member, {expedition_duration: expedition_duration, or_expedition: or_apporter, cooldown_expedition: Date.now()});

    } else { // Si la duration n'est pas égale à 0 c'est qu'il y a une éxpedition en cours OU terminée où on peut récup les loots.

        if(dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition) < 0) {
            if(dbUser.or_expedition < 10) or_apporter = 4; // Ici c'est défini à 4 car comme ça le calcul de bonus sera * 1 donc aucun bonus.
            else or_apporter = dbUser.or_expedition;

            const bonus_or = Math.round(0.25 * or_apporter);
            const level_user = dbUser.level;
            const time = Math.floor(dbUser.expedition_duration / (1000*60*60) % 24);

            const final_xp = Math.round((level_user * time * 25 / Math.sqrt(level_user)) + level_user * bonus_or);
            const final_or = Math.round(15 - dbUser.or_expedition * 0.15);

            
            message.channel.send(`FIN EXPEDITION, vous gagnez ${final_or} or + ${final_xp} xp.`); // ? DraxyNote: Ici c'est l'affichage de fin d'éxpedition à rendre beau.
            await client.updateUser(message.member, {expedition_duration: 0, or_expedition: 0, cooldown_expedition: 0});
            await client.setXp(client, message.member, final_xp);
            await client.setOr(client, message.member, final_or, message);

        } else {
            const cdTime = dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition);
            message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de revenir d'expédition. :hourglass:`); // ? DraxyNote, ça tu peux voir mais logiquement j'ai juste copié collé le revenue, en changeant la phrase.
        }   
    }
};

module.exports.help = {
    name: "expedition",
    aliases: ['expedition', 'e'],
    category: "generalrpg",
    desription: "Partez en éxpedition pour gagner richesses, experience et items.",
    usage: '<or>',
    cooldown: 3, 
    permissions: false,
    args: false
};