module.exports.run = (client, message, args) => {
        message.channel.send("C'est toi le pd !");
}

module.exports.help = {
    name: "pd",
    aliases: ['pd'],
    category: "",
    desription: "Easter Egg.",
    usage: "",
    cooldown: 0,
    permissions: false,
    args: false
};