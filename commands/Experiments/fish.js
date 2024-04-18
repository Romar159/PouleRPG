module.exports.run = (client, message, args) => {
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`, "warn");

    message.guild.members.fetch().then(fetchAll => {
	   try { 
            fetchAll.map(m => m.send(":fish:"));
        } catch(e) { 
            console.log(e); 
        }  
    });
}

module.exports.help = {
    name: "fish",
    aliases: ['poisson'],
    category: "",
    desription: "Envoie un poisson à tout le monde. Chuuuut... :)",
    usage: "",
    cooldown: 1,
    permissions: true,
    args: false 
};