module.exports.run = async (client, message, args, settings, dbUser) => {

    if(message.member.roles.cache.has('415947454626660366')) await client.updateUser(message.member, {faction: "epsilon"});
    else if(message.member.roles.cache.has('415947455582961686')) await client.updateUser(message.member, {faction: "daïros"});
    else if(message.member.roles.cache.has('415947456342130699')) await client.updateUser(message.member, {faction: "lyomah"});
    else if(message.member.roles.cache.has('665340021640921099')) await client.updateUser(message.member, {faction: "alpha"});
    else await client.updateUser(message.member, {faction: "NULL"});

    
    message.channel.send("Possible mise à jour effectuée avec succès. Si votre problème persiste contactez le développeur");
}

module.exports.help = {
    name: "auto-actualisation",
    aliases: ['updateme', 'aa'],
    category: "system",
    desription: "Permet de mettre à jour votre fichier utilisateur, notamment votre faction, s'il ne l'est pas. C'est une commande de debug sans risque que tout le monde peut exécuter.",
    usage: '',
    cooldown: 30, 
    permissions: false,
    args: false,
};