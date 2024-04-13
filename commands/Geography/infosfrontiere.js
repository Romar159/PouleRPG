const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {

    /*var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
        var est_maitre = false;

        for(let y=0; y<roles_maitre.length; y++) {
            if(message.member.roles.cache.has(roles_maitre[y])) {
                est_maitre = true;
                break;
            } else {
                est_maitre = false;
            }
        }
        if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");*/
        
    /*let faction = await client.getFaction(dbUser.faction);


    


    const emb = new EmbedBuilder()
    .setColor('BF2F00')
    .setAuthor({name:`Membres actuellement en expédition sur votre territoire.`, iconURL:client.user.displayAvatarURL()});
    let index_iterration = 0;

    faction.joueurs_sur_le_territoire.forEach(async element => {
        // retire le membre des joueurs sur le territoire de la faction s'il a fini son éxpédition
        let dbElement = await client.getUser(message.guild.members.cache.get(element));
        const currentDate = new Date();
        //Check si le joueur sur le territoire a fini son expédition (dans ce cas on l'enlève du array du territoire)
        if(dbElement.cooldown_activity.getTime() < currentDate.getTime()) {

            let arr = faction.joueurs_sur_le_territoire;
            arr = arr.filter(e => e !== dbElement.userID);

            await client.updateFaction(faction.name, {joueurs_sur_le_territoire: arr});
            await client.updateUser(message.guild.members.cache.get(element), {localisation_expedition: "NULL"})
            
        }
    })

    faction = await client.getFaction(dbUser.faction);


    faction.joueurs_sur_le_territoire.forEach(async element => {
        index_iterration++;

        emb.addFields({name:`** **`, value:`${message.guild.members.cache.get(element)}`});
        if(index_iterration >= faction.joueurs_sur_le_territoire.length) {
            await message.channel.send({embeds:[emb]});
        }
        
    });
    if(!faction.joueurs_sur_le_territoire[0]) {
        emb.addFields({name:`** **`, value:`Personne n'a franchit vos frontières.`});
        message.channel.send({embeds:[emb]});
    }*/

    let faction = await client.getFaction(dbUser.faction);

const emb = new EmbedBuilder()
    .setColor('BF2F00')
    .setAuthor({name:`Membres actuellement en expédition sur votre territoire.`, iconURL:client.user.displayAvatarURL()});

for (const element of faction.joueurs_sur_le_territoire) {
    let dbElement = await client.getUser(message.guild.members.cache.get(element));
    const currentDate = new Date();

    // Vérifier si le joueur sur le territoire a terminé son expédition
    if (dbElement.cooldown_activity.getTime() < currentDate.getTime()) {
        // Retirer le membre des joueurs sur le territoire de la faction
        let arr = faction.joueurs_sur_le_territoire.filter(e => e !== dbElement.userID);
        await client.updateFaction(faction.name, {joueurs_sur_le_territoire: arr});
        await client.updateUser(message.guild.members.cache.get(element), {localisation_expedition: "NULL"});
    }
}

// Récupérer à nouveau la faction après les modifications
faction = await client.getFaction(dbUser.faction);

// Ajouter les membres restants à l'embed
for (const element of faction.joueurs_sur_le_territoire) {
    emb.addFields({name:`** **`, value:`${message.guild.members.cache.get(element)}`});
}

// Vérifier s'il n'y a aucun joueur sur le territoire
if (!faction.joueurs_sur_le_territoire[0]) {
    emb.addFields({name:`** **`, value:`Personne n'a franchi vos frontières.`});
}

// Envoyer l'embed
message.channel.send({embeds:[emb]});

    
}

module.exports.help = {
    name: "infosfrontière",
    aliases: ['if', 'infosfrontières', 'infofrontières', 'infofrontière', 'infosfrontiere', 'infosfrontieres'],
    category: "geography",
    desription: "Affiche qui se trouve sur le territoire actuellement.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
    gouvernement: true
};

