module.exports.run = (client, message, args, settings, dbUser) => {
        message.channel.send("C'est toi le pd !");
        client.addFoundedEasterEgg(client, message.member, dbUser, 0);
}

module.exports.help = {
    name: "pd",
    aliases: [],
    category: "",
    desription: "Easter Egg.",
    usage: "",
    cooldown: 0,
    permissions: false,
    args: false
};