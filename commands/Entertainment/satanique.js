module.exports.run = (client, message, args) => {
    for(let i=0;i<5;i++) {
        message.channel.send("<@297414955618140162> Mon préfix est bien fils de con !");
    }
}

module.exports.help = {
    name: "satanique",
    aliases: ['satanique'],
    category: "",
    desription: "Easter Egg.",
    usage: "",
    cooldown: 60,
    permissions: false,
    args: false
};