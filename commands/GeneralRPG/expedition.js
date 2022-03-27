const {MessageEmbed, Message} = require('discord.js')

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(dbUser.in_jail == 'true') return message.reply("Aux cachots vous ne pouvez pas partir (ou revenir hehe) d'expédition.");
    if(dbUser.on_mission == 'true') return message.reply("Vous êtes en mission, il vous est donc impossible de partir en expédition.");
    if(dbUser.working == 'true') return message.reply("Vous êtes en train de travailler, vous ne pouvez donc pas partir en expédition.");
    if(dbUser.training == true) return message.reply("Vous êtes en train de vous entrainez, vous ne pouvez donc pas partir en expédition.");

    let or_apporter = parseInt(args[0]);
    if(dbUser.expedition_duration == 0) { // Si la duration est égale à 0 c'est qu'il n'y a pas d'éxpedition en cours.
        const expedition_duration = client.randomInt(8, 10) * 3600000; // random entre 8 et 10 heures (en ms);
        let or_apporter = parseInt(args[0]);

        if(!or_apporter && or_apporter != 0) return message.reply("vous devez renseigner une valeur numérique.");
        if(or_apporter > 100) or_apporter = 100;
        if(or_apporter < 10) or_apporter = 0; // Ici c'est défini à 0 pour l'affichage.
        if(or_apporter > dbUser.or) return message.reply("vous n'avez pas assez d'argent.");
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

        const debutEmbed = new MessageEmbed()
        .setColor('5E6366')
        .setAuthor(`Expédition lancée !`, message.author.displayAvatarURL())
        .setDescription(`L'expédition va durer **${expedition_duration / 3600000}h** avec **${or_apporter}** or !`); //? DraxyNote : Il faut ici ajouter l'affichage du Pays dans lequel on va. (avec 'localisation')

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
    } 
};

module.exports.help = {
    name: "expédition",
    aliases: ['e', 'expedition'],
    category: "generalrpg",
    desription: "Partez en expédition pour gagner richesses, expériences et items.",
    usage: '<or> [localisation:epsilon/daïros/lyomah/alpha]',
    cooldown: 3, 
    permissions: false,
    args: false
};