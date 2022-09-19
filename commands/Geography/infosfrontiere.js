const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {

    var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
        var est_maitre = false;

        for(let y=0; y<roles_maitre.length; y++) {
            if(message.member.roles.cache.has(roles_maitre[y])) {
                est_maitre = true;
                break;
            } else {
                est_maitre = false;
            }
        }
        if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");
        
    let faction = await client.getFaction(dbUser.faction);

    const emb = new EmbedBuilder()
    .setColor('BF2F00')
    .setAuthor({name:`Membres actuellement en expédition sur votre territoire.`, iconURL:client.user.displayAvatarURL()});

    faction.joueurs_sur_le_territoire.forEach(element => {
        
        emb.addFields({name:`** **`, value:`${message.guild.members.cache.get(element)}`});
        
    });
    if(!faction.joueurs_sur_le_territoire[0]) {
        emb.addFields({name:`** **`, value:`Personne n'a franchit vos frontières.`});
    }

    message.channel.send({embeds:[emb]});
}

module.exports.help = {
    name: "infosfrontière",
    aliases: ['if'],
    category: "geography",
    desription: "Affiche qui se trouve sur le territoire actuellement.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};

