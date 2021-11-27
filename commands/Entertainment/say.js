module.exports.run = (client, message, args) => {
    message.delete();

    if(message.content.indexOf('@everyone') >= 0) {
        return message.channel.send('Le contenu du message est innaproprié.');
    } else {
        message.channel.send(args.join(" "));
    }
}

module.exports.help = {
    name: "dire",
    aliases: ['dis'],
    category: "entertainment",
    desription: "Renvoie le même message que l'utilisateur.",
    usage: "<message>",
    cooldown: 1,
    permissions: false,
    args: true
};