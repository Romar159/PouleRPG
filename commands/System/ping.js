module.exports.run = (client, message, args, settings, dbUser) => {
    if(message.content.startsWith("p<pong")) {
        const m = message.channel.send("Calcul...").then(async msg => {
            msg.edit( `Ping ! **|** :ping_pong:\nTemps de réponse : **${msg.createdTimestamp - message.createdTimestamp}ms**`);
        });
        return;
    }

    if(client.randomInt(0, 43) == 43) {
        const m = message.channel.send("Calcul...").then(async msg => {
            msg.edit( `👲 **|** Chinois !\nTemps de réponse : **${msg.createdTimestamp - message.createdTimestamp}ms**`);
        });
        client.addFoundedEasterEgg(client, message.member, dbUser, 9);
        return;
    }

    const m = message.channel.send("Calcul...").then(async msg => {
        msg.edit( `:ping_pong: **|** Pong !\nTemps de réponse : **${msg.createdTimestamp - message.createdTimestamp}ms**`);
    });
}

module.exports.help = {
    name: "ping",
    aliases: ['latence', 'ms', 'pong'],
    category: "system",
    desription: "Renvoie le temps de latence du bot.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};