module.exports.run = (client, message, args) => {
    const m = message.channel.send("Calcul...").then(async msg => {
        msg.edit( `:ping_pong: **|** Pong!\nTemps de réponse : **${msg.createdTimestamp - message.createdTimestamp}ms**`);
    });
}

module.exports.help = {
    name: "ping",
    aliases: ['latence', 'ms'],
    category: "system",
    desription: "Renvoie le temps de latence du bot.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};