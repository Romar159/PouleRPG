const {MessageEmbed} = require('discord.js');
module.exports.run = async (client, message, args, settings, dbUser) => {

    
    if(args[0] == 'view' || args[0] == 'leaderboard') {}
    else if(message.author.id != '421400262423347211')
        return message.channel.send("Vous n'êtes pas la vénitienne.\nVous ne pouvez donc pas modifier les points vénitienne.");
    

    let user;
    if(message.mentions.users.first())
       user = message.guild.member(message.mentions.users.first());
    

    if(args[0].toLowerCase() == 'view') {
        const embed = new MessageEmbed()
        .setColor('#BF2F00');
        if(!args[1] || !message.mentions.users.first()) {
            if(message.author.id == '421400262423347211')
                embed.setDescription(`:woman_red_haired: Oh, La vénitiene ! Tu as bien évidemment **∞** point(s) vénitienne.`);
            else
                embed.setDescription(`:woman_red_haired: Vous avez **${dbUser.pointsvenitienne}** point(s) vénitienne.`);

            return message.channel.send(embed);
        }
        else {
            if(message.mentions.users.first().id == '421400262423347211') {
                embed.setDescription(`:woman_red_haired: ${message.mentions.users.first()} a **∞** point(s) vénitienne.`);
            } else {
                const usr = await client.getUser(user);
                embed.setDescription(`:woman_red_haired: ${user} a **${usr.pointsvenitienne}** point(s) vénitienne.`);
            }
            return message.channel.send(embed);
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

    if(args[0].toLowerCase() == 'leaderboard') {
        await client.getUsers(message.guild).then(p => {
                message.channel.send(`${message.guild.member('421400262423347211').user.username} - ∞ point(s) vénitienne.`); // ? DraxyNote: Est-ce qu'on ajoute vraiment cette ligne ? (ça rajoute juste la vénitienne en haut du classement avec l'infini de points x))
            p.sort((a, b) => (a.pointsvenitienne < b.pointsvenitienne) ? 1 : -1).splice(0, 5).forEach(e => {
                message.channel.send(`${e.username} - ${e.pointsvenitienne} point(s) vénitienne.`); // ? DraxyNote: Ici, je pense que tu foutras un embed, donc fait tout l'embed JUSTE en dessous du if, et ensuite tu ajouteras un embed.addField à la place de cette ligne ^^
            });
        });
    }
};

module.exports.help = {
    name: "pointvenitienne",
    aliases: ['point venitienne', 'ptveni', 'ptsveni'],
    category: "entertainment",
    desription: "Donne, retire ou regarde ses points venitienne",
    usage: "<action:view/leaderboard/ajout/retrait> <@user>",
    cooldown: 1,
    permissions: false,
    args: true
};