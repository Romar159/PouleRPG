module.exports.run = async (client, message, args, settings, dbUser) => {

    if(message.member.roles.cache.has('415947454626660366')) await client.updateUser(message.member, {faction: "epsilon"});
    else if(message.member.roles.cache.has('415947455582961686')) await client.updateUser(message.member, {faction: "daïros"});
    else if(message.member.roles.cache.has('415947456342130699')) await client.updateUser(message.member, {faction: "lyomah"});
    else if(message.member.roles.cache.has('665340021640921099')) await client.updateUser(message.member, {faction: "alpha"});
    else await client.updateUser(message.member, {faction: "NULL"});

    
    message.channel.send("Possible mise à jour effectuée avec succès.");
}

module.exports.help = {
    name: "auto-actualisation",
    aliases: ['updateme', 'aa'],
    category: "system",
    desription: "Permet de mettre à jour votre fichier utilisateur s'il ne l'est pas.",
    usage: '',
    cooldown: 15, 
    permissions: false,
    args: false,
};