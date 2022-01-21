module.exports.run = async (client, message, args, settings, dbUser) => {
    const json_armes = require('../../assets/rpg/armes.json');
    if(!args[0]) {
        return message.channel.send(`**Options modifiables**\n\n**[ArmeFavorite]** : Votre arme favorite que vous utilisez partout : \nActuel : **${json_armes[dbUser.armeFavorite].name}** \noptions : ${json_armes[0].name};${json_armes[1].name};${json_armes[2].name};${json_armes[3].name};${json_armes[4].name}`);
    }

    else if(args[0] == 'armefavorite') {
        if(args[1] === "épée" || args[1] == "arc" || args[1] == "pique" || args[1] == "bouclier" || args[1] == "marteau") {
            await client.updateUser(message.member, {armeFavorite : client.filterByName(json_armes, args[1]).id});
            return message.reply(`Votre arme par défaut est à présent : **${args[1]}**`);
        } 
        return message.reply("Cette arme n'existe pas.");
    }

    else {
        return message.reply("Cette option n'existe pas.");
    }
}

module.exports.help = {
    name: "préférences",
    aliases: ['preferences', 'p'],
    category: "system",
    desription: "Modifie vos préférences.",
    usage: '<[option] [choix]>',
    cooldown: 3, 
    permissions: false,
    args: false,
};