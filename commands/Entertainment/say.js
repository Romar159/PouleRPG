module.exports.run = (client, message, args) => {
    message.channel.send(args.join(" "));
}

module.exports.help = {
    name: "say",
    aliases: ['dit'],
    category: "entertainment",
    desription: "renvoie le même message que l'utilisateur.",
    usage: "<message>",
    cooldown: 1,
    permissions: false,
    args: true
};