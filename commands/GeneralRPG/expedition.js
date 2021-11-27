const {MessageEmbed, Message} = require('discord.js')

module.exports.run = async (client, message, args, settings, dbUser) => {

    let or_apporter = parseInt(args[0]);
    if(dbUser.expedition_duration == 0) { // Si la duration est égale à 0 c'est qu'il n'y a pas d'éxpedition en cours.
        const expedition_duration = client.randomInt(8, 10) * 3600000; // random entre 8 et 10 heures (en ms);
        let or_apporter = parseInt(args[0]);

        if(!or_apporter && or_apporter != 0) return message.reply("vous devez renseigner une valeur numérique.");
        if(or_apporter > 100) or_apporter = 100;
        if(or_apporter < 10) or_apporter = 0; // Ici c'est défini à 0 pour l'affichage.
        if(or_apporter > dbUser.or) return message.reply("vous n'avez pas assez d'argent.");
    
        await client.setOr(client, message.member, - or_apporter, message);

        const debutEmbed = new MessageEmbed()
        .setColor('5E6366')
        .setAuthor(`Expédition lancée !`, message.author.displayAvatarURL())
        .setDescription(`L'expédition va durer **${expedition_duration / 3600000}h** avec **${or_apporter}** or !`);

        message.channel.send({embeds:[debutEmbed]});
        await client.updateUser(message.member, {expedition_duration: expedition_duration, or_expedition: or_apporter, cooldown_expedition: Date.now()});

    } else { // Si la duration n'est pas égale à 0 c'est qu'il y a une éxpedition en cours OU terminée où on peut récup les loots.

        if(dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition) < 0) {
            if(dbUser.or_expedition < 10) or_apporter = 0; // Ici c'est défini à 4 car comme ça le calcul de bonus sera * 1 donc aucun bonus.
            else or_apporter = dbUser.or_expedition;

            const bonus_or = 0.125 * or_apporter;
            const level_user = dbUser.level;
            const time = Math.floor(dbUser.expedition_duration / (1000*60*60) % 24);
            
            const final_xp = Math.round((12.5 * (time * level_user + (bonus_or * level_user / 3))/ Math.sqrt(level_user)));
            const final_or = Math.round(10 - dbUser.or_expedition * 0.10);
            
            const finEmbed = new MessageEmbed()
            .setColor('3F992D')
            .setAuthor(`Expédition terminée !`, message.author.displayAvatarURL())
            .addField(`** **`, `**:test_tube: +${final_xp} XP**`, true)
            .addField(`** **`, `** **`, true)
            .addField(`** **`, `:coin: **+${final_or} Or**`, true);

            message.channel.send({embeds:[finEmbed]});
            await client.setOr(client, message.member, dbUser.or_expedition, message);
            await client.updateUser(message.member, {expedition_duration: 0, or_expedition: 0, cooldown_expedition: 0});
            await client.setXp(client, message.member, final_xp);
            await client.setOr(client, message.member, final_or, message);

        } else {
            const cdTime = dbUser.expedition_duration - (Date.now() - dbUser.cooldown_expedition);
            message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de revenir d'expédition. :hourglass:`);
        }   
    }
};

module.exports.help = {
    name: "expédition",
    aliases: ['e', 'expedition'],
    category: "generalrpg",
    desription: "Partez en éxpedition pour gagner richesses, expériences et items.",
    usage: '<or>',
    cooldown: 3, 
    permissions: false,
    args: false
};