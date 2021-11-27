module.exports.run = async (client, message, args, settings) => {

    if(!message.mentions.members.first()) return message.reply("ERROR: Mentionnez un utilisateur valide.");
    const mention = message.mentions.members.first()

    
        await client.createUser({
            guildID: mention.guild.id,
            guildName: mention.guild.name,
        
            userID: mention.id,
            username: mention.user.tag,
        }); 
        message.channel.send("Utilisateur crée.");
 };
   
 module.exports.help = {
     name: "createuser",
     aliases: ['createuser'],
     category: "admin",
     desription: "Ajoute un utilisateur à la bdd à la main. (ATTENTION: Commande admin/debug, si un utilisateur existe déjà il est recrée une seconde fois.",
     usage: '<@USER>',
     cooldown: 0, 
     permissions: true,
     args: true
 };