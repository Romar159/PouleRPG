module.exports.run = async (client, message, args, settings, dbUser) => {
    if(!message.mentions.users.first()) return message.reply("Utilisateur invalide.");
    let member = message.guild.members.cache.get(message.mentions.users.first().id);

    if(member.roles.cache.has('415947454626660366')) await client.updateUser(member, {faction: "epsilon"});
    else if(member.roles.cache.has('415947455582961686')) await client.updateUser(member, {faction: "daïros"});
    else if(member.roles.cache.has('415947456342130699')) await client.updateUser(member, {faction: "lyomah"});
    else if(member.roles.cache.has('665340021640921099')) await client.updateUser(member, {faction: "alpha"});
    else await client.updateUser(member, {faction: "NULL"});

    message.channel.send(`**${member.user.username} mis à jour avec succès !**`);
};
  
module.exports.help = {
    name: "majuserfaction",
    aliases: ['muf', 'leProfLol'],
    category: "admin",
    desription: "Mets à jour la faction d'un utilisateur dans la base de données.",
    usage: '<@user>',
    wiki: 'https://romar159.github.io/poulerpg.github.io/',
    cooldown: 2,  
    permissions: true,
    args: true
};