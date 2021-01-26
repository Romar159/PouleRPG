const {Collection} = require('discord.js');
const {PREFIX} = require('../../config');

module.exports = (client, message) => {
    if (message.channel.type === "dm") return client.emit("directMessage", message);
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    
    const args = message.content.slice(PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
    if(!command) return;

    if(command.help.permissions && !message.member.hasPermission('ADMINISTRATOR')) return message.reply("Commande administrateur, permission requise.");
    
    if (command.help.args && !args.length) {
        let noArgsReply = `Argument Attendu ${message.author}`;

        if (command.help.usage) noArgsReply += `\nSyntaxe: \`${PREFIX}${command.help.name} ${command.help.usage}\``;
        return message.channel.send(noArgsReply);
    }

    if (!client.cooldowns.has(command.help.name)) {
        client.cooldowns.set(command.help.name, new Collection());
    }

    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.help.name);
    const cdAmount = (command.help.cooldown || 5) * 1000;

    if (tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if (timeNow < cdExpirationTime) {
            timeLeft = (cdExpirationTime - timeNow) / 1000;
            return message.reply(`Veuillez attendre ${timeLeft.toFixed(0)} seconde(s) avant de réutiliser la commande.`);
        }
    }

    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);

    command.run(client, message, args);
}