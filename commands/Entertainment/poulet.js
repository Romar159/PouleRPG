const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    const embed = new EmbedBuilder()
    .setColor('E58B16');
    


    if(args[0] == "moi") {
        embed.setAuthor({name: `Nombre de poulets personnellement envoyés`, inconURL: client.user.displayAvatarURL()});
        embed.setDescription(`:chicken: **${dbUser.poulets}** :chicken:`);
    } else {
        let poulets = parseInt(dbUser.poulets);
        poulets++;
        settings.poulet++;

        const newGuild = await client.getGuild(message.guild);
        embed.setDescription(`:chicken: **${newGuild.poulet + 1}** :chicken:`); 

        //await client.updateGuild(message.guild, {poulet: settings.poulet});
        await client.updateGuild(message.guild, { $inc: {poulet: 1}});
        await client.updateUser(message.author, {poulets: poulets});
        await client.getGuild(message.guild);

        embed.setAuthor({name: `Nombre de poulets`, iconURL: client.user.displayAvatarURL()});
       
        

        if(dbUser.poulets + 1 == 500) {
            const list_badges = require('../../assets/rpg/badges.json');
            if(await client.addBadge(client, message.member, await client.getUser(message.member), "4")) {
                message.channel.send(`WOW !! ${message.member} vient de gagner le badge **${client.filterById(list_badges, 4).name}** !`);
            }
        }
    }
    message.channel.send({embeds:[embed]});
}

module.exports.help = {
    name: "poulet",
    aliases: ['chicken'],
    category: "entertainment",
    desription: "Augmente le nombre de poulet de 1 🐔 chaque utilisation et l'affiche.",
    usage: "[moi]",
    cooldown: 1,
    permissions: false,
    args: false
};