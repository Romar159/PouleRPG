module.exports.run = async (client, message, args) => {
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    await message.channel.send("Redémarrage en cours...");
    await message.delete();
    process.exit();
}

module.exports.help = {
    name: "reload",
    aliases: ['reload', 'restart', 'reboot'],
    category: "admin",
    desription: "Redémarre le bot.",
    usage: '',
    cooldown: 10, 
    permissions: true,
    args: false
};