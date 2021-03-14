module.exports.run = async (client, message, args) => {
    if(!message.mentions.members.first()) return message.reply("Veuillez renseigner un utilisateur valide.");
    
    const fac = args[1].toLowerCase();
    switch(fac) {
        case "epsilon":
        break;

        case "daïros":
        break;

        case "lyomah":
            break;

        case "alpha":
            break;

        default:
        return message.reply("veuillez entrer une faction valide.");
    }

    await client.updateFaction(fac, {idmaitre: message.mentions.users.first().id});
    message.channel.send(`${message.mentions.users.first()} est à présent le nouveau Maître de la faction ${fac}`);
}

module.exports.help = {
    name: "nouveaumaitre",
    aliases: ['nouveauMaitre', 'nouveau Maitre'],
    category: "admin",
    desription: "Modifie le maître de faction.",
    usage: '<@USER> <faction>',
    cooldown: 1, 
    permissions: true,
    args: true
};