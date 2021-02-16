module.exports.run = async (client, message, args) => {
    if(isNaN(parseInt(args[1]))) return message.reply("ERROR, nombre invalide.");
    client.setXp(client, message.mentions.users.first(), args[1]);
    message.channel.send(`${args[1]} xp ajoutées à ${args[0]}`);
}

module.exports.help = {
    name: "setxp",
    aliases: ['setxp', 'setXp'],
    category: "admin",
    desription: "Edit l'experience d'un utilisateur.",
    usage: '<@user> <xp>',
    cooldown: 2, 
    permissions: true,
    args: true
};