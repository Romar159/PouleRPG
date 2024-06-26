module.exports.run = async (client, message, args) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);


    if(!message.mentions.users.first()) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Mention Invalide. Message=${message.content}`, "err");

        return message.reply("ERROR, Mention invalide.");
    } 
    if(isNaN(parseInt(args[1]))) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Nombre Invalide. Message=${message.content}`, "err");

        return message.reply("ERROR, Nombre invalide.");
    } 
    await client.setOr(client, message.mentions.members.first(), args[1], message);
    message.channel.send(`${args[1]} poyn ajoutées à ${args[0]}`);

    client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${args[1]} poyn ajoutées à ${args[0].user.tag} (${args[0].user.id})`);

}

module.exports.help = {
    name: "setor",
    aliases: ['setor', 'setOr'],
    category: "admin",
    desription: "Edit les poyn d'un utilisateur.",
    usage: '<@user> <poyn>',
    cooldown: 2, 
    permissions: true,
    args: true
};