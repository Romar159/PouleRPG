const {MessageEmbed} = require("discord.js");
const {PREFIX} = require("../../config");
const {readdirSync} = require("fs");
const categoryList = readdirSync('./commands');

module.exports.run = (client, message, args) => {
    var categoryName;    

    if(!args.length) {
        const embed = new MessageEmbed()
        .setColor('5E6366')
        .addField("Liste des commandes", `Pour plus d\'informations sur une commande tapez \`${PREFIX}aide <commandName>\``)

        for(var category of categoryList) {
            switch(category) {
                case "Admin":
                    categoryName = `:hammer: Administrateur`;
                    break;
                case "Economie":
                    categoryName = `:coin: Économie`;
                    break;
                case "Entertainment":
                    categoryName = `:tada: Divers`;
                    break;
                case "Experience":
                    categoryName = `:test_tube: Expérience`;
                    break;
                case "Experiments":
                    categoryName = `:microscope: Expérimentations`;
                    break;
                case "GeneralRPG":
                    categoryName = `:archery: RPG`;
                    break;
                case "Geography":
                    categoryName = `:earth_africa: Géographie`; // ? DraxyNote : lulz ici je sais pas quoi dire pour tout ce qui est géopolitique & partie gestion de terrain.
                    break;
                case "Guerre":
                    categoryName = `:crossed_swords: Guerre`;
                    break;
                case "Politique, Diplomatie et Economie":
                    categoryName = `:mortar_board: Maître de Faction`;
                    break;
                case "System":
                    categoryName = `:robot: Système`;
                    break;
            }
                embed.addField(
                `${categoryName}`,
                `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('` • `')}\``
            );
        };
        return message.channel.send({ embeds: [embed] });

    } else {
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
        if(!command) return message.reply("Cette commande n'existe pas.");

        const embed = new MessageEmbed()
        .setColor('5E6366')
        .setTitle(`\`${command.help.name}\``)
        .addField("Description", `${command.help.desription}`)
        .addField("Utilisation", command.help.usage ? `${PREFIX}${command.help.name} ${command.help.usage}` : `${PREFIX}${command.help.name}`, true)

        if(command.help.aliases.length >= 1) embed.addField("Alias", `${command.help.aliases.join(", ")}`, true);

        return message.channel.send({ embeds: [embed] });
        
    }
   
};

module.exports.help = {
    name: "aide",
    aliases: ['a'],
    category: "system",
    desription: "Renvoie la liste des commandes du bot ou de leur utilisation.",
    usage: '[commandName]',
    cooldown: 2, 
    permissions: false,
    args: false
};