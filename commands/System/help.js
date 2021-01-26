const {MessageEmbed} = require("discord.js");
const {PREFIX} = require("../../config");
const {readdirSync} = require("fs");
const categoryList = readdirSync('./commands');

module.exports.run = (client, message, args) => {
    if(!args.lenght) {
        const embed = new MessageEmbed()
        .setColor("#FFFFFF")
        .addField("Liste des commandes", `Liste de toutes les sous-catégories disponible et leurs commandes\nPour plus d\'informations sur une commande tappez \`${PREFIX}help <commandName>\``)

        for (const category of categoryList) {
            embed.addField(
                `${category}`,
                `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('`, `')}\``
            );
        };
        return message.channel.send(embed);

    } else { // ! Ici, la commande individuelle ne fonctionne pas comme elle devrait.
        console.log("ARGS !");
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
        if (!command) return message.reply("Cette commande n'existe pas.");

        const embed = new MessageEmbed()
        .setColor("#FFFFFF")
        .setTitle(`\`${commande.help.name}\``)
        .addField("Description", `${command.help.desription}`)
        .addField("Utilisation", command.help.usage ? `${PREFIX}${command.help.name} ${command.help.usage}` : `${PREFIX}${command.help.name}`, true)

        if (command.help.aliases.lenght > 1) embed.addField("Alias", `${command.help.aliases.join(", ")}`, true);

        return message.channel.send(embed);
    }
   
};

module.exports.help = {
    name: "help",
    aliases: ['h', 'aide', 'a'],
    category: "system",
    desription: "renvoie la liste des commandes du bot.",
    usage: '<commandName>',
    cooldown: 2, 
    permissions: false,
    args: false
};