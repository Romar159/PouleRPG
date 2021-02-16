module.exports.run = async (client, message, args, settings, dbUser) => {

    
    if(message.author.id != '421400262423347211' && args[0] != 'view' || args[0] != 'leaderboard') 
        return message.channel.send("Vous n'êtes pas la vénitienne. Vous ne pouvez donc pas modifier les points vénitienne.");
    
    let user;
    if(message.mentions.users.first())
       user = message.guild.member(message.mentions.users.first());
    

    if(args[0].toLowerCase() == 'view') {
        if(!args[1] || !message.mentions.users.first()) return message.channel.send(`Vous avez ${dbUser.pointsvenitienne} point(s) vénitienne.`);
        else {
            const usr = await client.getUser(user);
            return message.channel.send(`${usr.username} à ${usr.pointsvenitienne} point(s) vénitienne.`);
        }
    }

    if(args[0].toLowerCase() == 'ajout') {
        if(!args[1] || !message.mentions.users.first()) return message.channel.send(`Vous devez définir un utilisateur cible.`);

        const userToUpdate = await client.getUser(user);
        const updatedPts = parseInt(userToUpdate.pointsvenitienne) + 1;
        await client.updateUser(user, { pointsvenitienne: updatedPts});
        return message.channel.send(`Point vénitienne accordé à ${userToUpdate.username}`);
    }

    if(args[0].toLowerCase() == 'retrait') {
        if(!args[1] || !message.mentions.users.first()) return message.channel.send(`Vous devez définir un utilisateur cible.`);

        const userToUpdate = await client.getUser(user);
        const updatedPts = parseInt(userToUpdate.pointsvenitienne) - 1;
        await client.updateUser(user, { pointsvenitienne: updatedPts});
        return message.channel.send(`Point vénitienne retiré à ${userToUpdate.username}`);
    }

    if(args[0].toLowerCase() == 'leaderboard') {
        await client.getUsers(message.guild).then(p => {
            console.log(p);
            p.sort((a, b) => (a.pointsvenitienne < b.pointsvenitienne) ? 1 : -1).splice(0, 5).forEach(e => {
                message.channel.send(`${e.username} - ${e.pointsvenitienne} point(s) vénitienne.`); // ? DraxyNote: Ici, je pense que tu foutras un embed, donc fait tout l'embed JUSTE en dessous du if, et ensuite tu ajouteras un embed.addField à la place de cette ligne ^^
            });
        });
    }
};

module.exports.help = {
    name: "pointvenitienne",
    aliases: ['point venitienne', 'ptsveni'],
    category: "entertainment",
    desription: "Donne, retire ou regarde ses points venitienne",
    usage: "<action:view/leaderboard/ajout/retrait> <@user>",
    cooldown: 1,
    permissions: false,
    args: true
};