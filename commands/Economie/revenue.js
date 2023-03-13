const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    return;
    let or = 0;
    const dailyCD = 8.64e+7;
    if(!dbUser.or) await client.updateUser(message.member, {or: 0});

    const lastDaily = await dbUser.daily;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant de pouvoir de nouveau récupérer votre revenue. :hourglass:`);
    } else { // Si le cooldown est passé.

        var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
        var roleslvl_ids = ["445253268176633891", "445253591465328660", "445253561648021514", "445253809640308746", "445257669918588948", "650832087993024522", "445257144011587594", "612469098466639893", "650828967716192269"];
        var or_getbyid = [1, 2, 5, 6, 9, 11, 16, 25, 35, 1, 3, 7, 9, 12, 17, 23, 32, 44];
        
        for(let i=0; i<roleslvl_ids.length; i++) {
            if(message.member.roles.cache.has(roleslvl_ids[i])) {
                for(let y=0; y<roles_maitre.length; y++) {
                    if(message.member.roles.cache.has(roles_maitre[y])) {
                        or = or_getbyid[(i + 9)]; // des ID 10 à 18 dans le array c'est l'or des maître.
                        break;
                    } else {
                        or = or_getbyid[i];
                    }
                }
            }
        }
        client.setOr(client, message.member, or, message);
        client.updateUser(message.member, {daily: Date.now()});
        const embed = new EmbedBuilder()
        .setColor('F2DB0C')
        .setAuthor('Revenue quotidien', message.author.displayAvatarURL())
        .setDescription(`**+${or}** :coin:\nVous avez actuellement **${dbUser.or + or}/${dbUser.maxbank}** :coin:`);

        message.channel.send({embeds:[embed]});
    }
}

module.exports.help = {
    name: "revenue",
    aliases: ['thune'],
    category: "",
    desription: "Récupère son revenue du jour. deprecated !",
    usage: '',
    cooldown: 4, 
    permissions: false,
    args: false
};