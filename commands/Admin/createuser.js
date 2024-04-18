module.exports.run = async (client, message, args, settings) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    if(!message.mentions.members.first()) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) : Mention Utilisateur invalide. MESSAGE=${message.content}`, "err");
        return message.reply("ERROR: Mentionnez un utilisateur valide.");
    } 
    const mention = message.mentions.members.first()

    
        await client.createUser({
            guildID: mention.guild.id,
            guildName: mention.guild.name,
        
            userID: mention.id,
            username: mention.user.tag,
        }); 
        message.channel.send("Utilisateur crée.");
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) : Utilisateur crée dans le base de donnée dbUser. MENTION=${mention}`, "err");
        
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