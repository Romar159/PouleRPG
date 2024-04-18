module.exports.run = (client, message, args, settings, dbUser) => {
    
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);


    client.addFoundedEasterEgg(client, message.member, dbUser, 1); // ! BUG ici
    message.channel.send("Cette commande n'existe pas. Comment l'avez-vous utilisée ?");
    client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Easter Egg ID=1 ajouté.`);

}

module.exports.help = {
name: "???",
aliases: [],
category: "",
desription: "La commande `???` n'existe tout simplement pas, c'est un petit easter egg, voilà tout.\n**Voici comment ne pas l'utiliser :**",
usage: "",
cooldown: 0,
permissions: false,
args: false
};