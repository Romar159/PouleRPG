module.exports.run = (client, message, args, settings, dbUser) => {
    client.addFoundedEasterEgg(client, message.member, dbUser, 1); // ! BUG ici
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