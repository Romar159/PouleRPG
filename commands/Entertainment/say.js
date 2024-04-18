module.exports.run = (client, message, args) => {
    
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    
    message.delete();

    if(message.content.indexOf('@everyone') >= 0 || message.content.indexOf('@here') >= 0) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - @everyone trouvé !`, "warn");

        return message.channel.send('Le contenu du message est inapproprié.');
    } else {
        message.channel.send(args.join(" "));
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - MESSAGE=${args.join(" ")}`);
    } 
}

module.exports.help = {
    name: "dire",
    aliases: ['dis', "say"],
    category: "entertainment",
    desription: "Renvoie le même message que l'utilisateur.",
    usage: "<message>",
    cooldown: 3,
    permissions: false,
    args: true
};