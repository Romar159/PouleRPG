const {MessageEmbed} = require('discord.js');
module.exports.run = async (client, message, args, settings, dbUser) => {

    const list_badges = require('../../assets/rpg/badges.json');

    
    if(args[0] == 'voir' || args[0] == 'classement') {}
    else if(message.author.id != '421400262423347211')
        return message.channel.send("Vous n'êtes pas la vénitienne.\nVous ne pouvez donc pas modifier les points vénitienne.");
    

    let user;
    if(message.mentions.users.first())
       user = message.guild.members.cache.get(message.mentions.users.first().id);
    

    if(args[0].toLowerCase() == 'voir') {
        const embed = new MessageEmbed()
        .setColor('BF2F00');
        if(!args[1] || !message.mentions.users.first()) {
            if(message.author.id == '421400262423347211')
                embed.setDescription(`:woman_red_haired: Oh, La vénitiene ! Tu as bien évidemment **∞** point(s) vénitienne.`);
            else
                embed.setDescription(`:woman_red_haired: Vous avez **${dbUser.pointsvenitienne}** point(s) vénitienne.`);

            return message.channel.send({embeds:[embed]});
        }
        else {
            if(message.mentions.users.first().id == '421400262423347211') {
                embed.setDescription(`:woman_red_haired: ${message.mentions.users.first()} a **∞** point(s) vénitienne.`);
            } else {
                const usr = await client.getUser(user);
                embed.setDescription(`:woman_red_haired: ${user} a **${usr.pointsvenitienne}** point(s) vénitienne.`);
            }
            return message.channel.send({embeds:[embed]});
        }
    }

    if(args[0].toLowerCase() == 'ajout') {
        if(!args[1] || !message.mentions.users.first()) return message.channel.send(`Chère vénitienne, vous devez définir un utilisateur cible.`);

        const userToUpdate = await client.getUser(user);
        const updatedPts = parseInt(userToUpdate.pointsvenitienne) + 1;
        await client.updateUser(user, { pointsvenitienne: updatedPts});
        if(updatedPts >= 100) {
            user.roles.add('732964881028087920');
        }
        if(updatedPts == 10) {
            if(await client.addBadge(client, message.guild.members.cache.get(user.user.id), userToUpdate, "3")) {
                message.channel.send(`WOW !! ${message.guild.members.cache.get(user.user.id)} vient de gagner le badge **${client.filterById(list_badges, 3).name}** !`);
            }
        }
        return message.channel.send(`Point vénitienne accordé à ${user.user.username}.`);
    }

    if(args[0].toLowerCase() == 'retrait') {
        if(!args[1] || !message.mentions.users.first()) return message.channel.send(`Chère vénitienne, vous devez définir un utilisateur cible.`);

        const userToUpdate = await client.getUser(user);
        const updatedPts = parseInt(userToUpdate.pointsvenitienne) - 1;
        await client.updateUser(user, { pointsvenitienne: updatedPts});
        if(updatedPts <= 100 && user.roles.cache.get('732964881028087920')) {
            user.roles.remove('732964881028087920');
        }
        return message.channel.send(`Point vénitienne retiré à ${user.user.username}.`);
    }

    if(args[0].toLowerCase() == 'classement') {
        const leadEmbed = new MessageEmbed()
        .setColor('BF2F00')
        .setAuthor(`Classement des points vénitienne`, client.user.displayAvatarURL());

        await client.getUsers(message.guild).then(p => {
                leadEmbed.addField(`** **`, `**:woman_red_haired: ${message.guild.members.cache.get('421400262423347211').user.username}** - **∞ + 0.5** point(s) vénitienne.`);
            p.sort((a, b) => (a.pointsvenitienne < b.pointsvenitienne) ? 1 : -1).splice(0, 5).forEach(e => {
                leadEmbed.addField(`** **`, `**${client.users.cache.get(e.userID).username}** - **${e.pointsvenitienne}** point(s) vénitienne.`);
            });
        });
        message.channel.send({embeds:[leadEmbed]});
    }
};

module.exports.help = {
    name: "pointvenitienne",
    aliases: ['point venitienne', 'ptveni', 'ptsveni'],
    category: "entertainment",
    desription: "Permet de voir ses points venitienne.",
    usage: "<action:voir/classement/ajout/retrait> <@user>",
    cooldown: 1,
    permissions: false,
    args: true
};