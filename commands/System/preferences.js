module.exports.run = async (client, message, args, settings, dbUser) => {
    if(!args[0]) {
        return message.channel.send(`**Options modifiables**\n\n**[defautArene]** : Arme par défaut dans l'arène : \nActuel : **${dbUser.preferences_defaultArene}** \noptions : dague/glaive/lance/arbalète/claymore`);
    }

    else if(args[0] == 'defautArene') {
        if(args[1] === "dague" || args[1] == "glaive" || args[1] == "lance" || args[1] == "arbalète" || args[1] == "claymore") {
            await client.updateUser(message.member, {preferences_defaultArene : args[1]});
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