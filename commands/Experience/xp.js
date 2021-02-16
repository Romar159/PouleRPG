module.exports.run = async (client, message, args, settings, dbUser) => {
    if(message.mentions.users.first()) {
        const usr = await client.getUser(message.guild.member(message.mentions.users.first()));

       // const needxp_usr = await (((700 * parseInt(usr.level)) / Math.sqrt(parseInt(usr.level))) - 200);
        message.channel.send(`XP: ${usr.experience}/${needxp_usr} LEVEL: ${usr.level}`);
    } else {
        const needxp_dbuser = Math.round((((700 * parseInt(dbUser.level)) / Math.sqrt(parseInt(dbUser.level))) - 200));
        message.channel.send(`XP: ${dbUser.experience}/${needxp_dbuser} LEVEL: ${dbUser.level}`);
    }
};

module.exports.help = {
    name: "xp",
    aliases: ['xp'],
    category: "experience",
    desription: "Affiche l'experience actuelle d'un utilisateur.",
    usage: "<@user>",
    cooldown: 1,
    permissions: false,
    args: false
};