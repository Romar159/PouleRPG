module.exports.run = async (client, message, args) => {
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    if(isNaN(parseInt(args[1]))) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Mention Invalide. Message=${message.content}`, "err");
        return message.reply("ERROR, nombre invalide.");
    } 
    client.setXp(client, message.mentions.users.first(), args[1]);
    message.channel.send(`${args[1]} xp ajoutées à ${args[0]}`);
    client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${args[1]} xp ajoutées à ${args[0].tag} (${args[0].id})`);

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