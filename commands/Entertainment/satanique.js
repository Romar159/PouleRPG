module.exports.run = (client, message, args, settings, dbUser) => {
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    for(let i=0;i<5;i++) {
        message.channel.send("<@297414955618140162> Mon préfix est bien fils de con !");
    }
    client.addFoundedEasterEgg(client, message.member, dbUser, 2);
}

module.exports.help = {
    name: "satanique",
    aliases: ['satanique'],
    category: "",
    desription: "Easter Egg.",
    usage: "",
    cooldown: 120,
    permissions: false,
    args: false
};