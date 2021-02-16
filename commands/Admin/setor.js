module.exports.run = async (client, message, args) => {
    if(!message.mentions.users.first()) return message.reply("ERROR, Mention invalide.");
    if(isNaN(parseInt(args[1]))) return message.reply("ERROR, Nombre invalide.");
    await client.setOr(client, message.mentions.members.first(), args[1], message);
    message.channel.send(`${args[1]} or ajoutées à ${args[0]}`);
}

module.exports.help = {
    name: "setor",
    aliases: ['setor', 'setOr'],
    category: "admin",
    desription: "Edit l'or d'un utilisateur.",
    usage: '<@user> <or>',
    cooldown: 2, 
    permissions: true,
    args: true
};