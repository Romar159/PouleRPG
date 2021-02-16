const { guild } = require("discord.js");
module.exports.run = (client, message, args) => {
   message.guild.members.fetch().then(fetchAll => {
       
        const epsilon = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
        const dairos = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
        const lyomah = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
        const alpha = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));

        // Si aucun argument n'est passé, envoyer la liste de toutes les factions.
        if (!args.lenght) return message.channel.send(`Membres de la faction Epsilon :\`\n${epsilon.map(m=>m.user.tag).join('`\n`')}\`\n\n
Membres de la faction Daïros :\`\n${dairos.map(m=>m.user.tag).join('`\n`')}\`\n\n
Membres de la faction Lyomah :\`\n${lyomah.map(m=>m.user.tag).join('`\n`')}\`\n\n
Membres de la faction Alpha :\`\n${alpha.map(m=>m.user.tag).join('`\n`')}\``);

        // Sinon, on analyse les arguments pour chaque faction.

        //DraxyNote : Si tu veux mettre le nombre de pelo qu'il y a dans la faction il faut récupérer "faction.size". (remplace "faction", par le nom de la faction que tu veux évidemment x))
        if (args[0].toLowerCase() == "epsilon")
            message.channel.send(`Membres de la faction Epsilon :\`\n${epsilon.map(m=>m.user.tag).join('`\n`')}\``);
        if (args[0].toLowerCase() == "daïros")
            message.channel.send(`Membres de la faction Daïros :\`\n${dairos.map(m=>m.user.tag).join('`\n`')}\``);
        if (args[0].toLowerCase() == "lyomah")
            message.channel.send(`Membres de la faction Lyomah :\`\n${lyomah.map(m=>m.user.tag).join('`\n`')}\``);
        if (args[0].toLowerCase() == "alpha")
            message.channel.send(`Membres de la faction Alpha :\`\n${alpha.map(m=>m.user.tag).join('`\n`')}\``);     
   });
}

module.exports.help = {
    name: "list",
    aliases: ['list'],
    category: "generalrpg",
    desription: "renvoie la liste des membres des factions.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false
};