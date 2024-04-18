const {EmbedBuilder} = require("discord.js");
const {PREFIX} = require("../../config");
const {readdirSync} = require("fs");
const categoryList = readdirSync('./commands');

module.exports.run = (client, message, args) => {
    var categoryName;    

    if(!args.length) {
        const embed = new EmbedBuilder()
        .setColor('5E6366')
        .addFields([{name: "Liste des commandes", value: `Pour plus d\'informations sur une commande tapez \`${PREFIX}aide <commandName>\``}])

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
                    //categoryName = `:microscope: Expérimentations`;
                    categoryName = `NULL`;
                    break;
                case "GeneralRPG":
                    categoryName = `:archery: RPG`;
                    break;
                case "Geography":
                    categoryName = `:earth_africa: Territorialité et Géopolitique`; 
                    break;
                case "Guerre":
                    categoryName = `:crossed_swords: Guerre`;
                    break;
                case "Faction":
                    categoryName = `:mortar_board: Faction`;
                    break;
                case "System":
                    categoryName = `:robot: Système`;
                    break;
            } 
            
            if(categoryName != "NULL") {
                embed.addFields([{
                 name: `${categoryName}`,
                 value: `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('` • `')}\``
                }]);
            }
        };
        return message.channel.send({ embeds: [embed] });

    } else {
        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
        if(!command) return message.reply("Cette commande n'existe pas.");

        const embed = new EmbedBuilder()
        .setColor('5E6366')
        .setTitle(`\`${command.help.name}\``)
        .addFields([{name: "Description", value: `${command.help.desription}`}, {name:"Utilisation", value: command.help.usage ? `${PREFIX}${command.help.name} ${command.help.usage}` : `${PREFIX}${command.help.name}`}])
        //.addField([{name:"Utilisation", value: command.help.usage ? `${PREFIX}${command.help.name} ${command.help.usage}` : `${PREFIX}${command.help.name}` }])

        if(command.help.aliases.length >= 1) embed.addFields([{name: "Alias", value: `${command.help.aliases.join(", ")}`}]);
        embed.addFields([{name: '** **', value: `[Wiki](${command.help.wiki})`}])

        return message.channel.send({ embeds: [embed] });
        
    }
   
};

module.exports.help = {
    name: "aide",
    aliases: ['a', 'help'],
    category: "system",
    desription: "Renvoie la liste des commandes du bot ou de leur utilisation.",
    usage: '[nom_commande]',
    cooldown: 2, 
    permissions: false,
    args: false,
    wiki: 'https://poulerpg.000webhostapp.com/wiki/system/aide.html'
};