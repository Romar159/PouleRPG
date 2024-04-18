module.exports.run = async (client, message, args, settings) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    //let guild = client.guilds.cache.get(message.guild.id);
    let fet = await message.guild.members.fetch()
    
    fet.forEach(async (member) => {
        if(!member.user.bot) {
            let dbEntry = await client.getUser(member);
            if(!dbEntry) {
                await client.createUser({
                    guildID: member.guild.id,
                    guildName: member.guild.name,
                
                    userID: member.id,
                    username: member.user.tag,
                }); 
                message.channel.send(`${member.user.tag} crée.`);
                client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) : Utilisateur crée dans le base de donnée dbUser. userID=${member.user.id}`, "info");
            }
        }
    });  
 };
   
 module.exports.help = {
     name: "ajoutmanquantsbdd",
     aliases: ['ambdd'],
     category: "admin",
     desription: "Ajoute tous les membre du serveur qui n'ont pas d'entrée bdd à cette dernière.",
     usage: '',
     cooldown: 1, 
     permissions: true,
     args: false
 };