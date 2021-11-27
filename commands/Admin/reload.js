module.exports.run = async (client, message, args) => {
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