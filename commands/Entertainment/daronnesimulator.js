module.exports.run = (client, message, args) => {
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    message.delete();
    const type = client.randomInt(1, 3);

    if(type == 1) {
        const insulte = [`Putain,`, `Merde,`, `Molo`];
        const personne = [`Kevin`, `la Vénitienne`, `fils de pute`, `Mémé`, `Zheo`];
        const ordre_ou_exclamation = [`là, merde !!`, `je veux écouter la fin du film !`, `ferme là connasse !!`];
        
        
        const insulte_ran = client.randomInt(0, insulte.length - 1);
        const personne_ran = client.randomInt(0, personne.length -1);
        const ordre_ou_exclamation_ran = client.randomInt(0, ordre_ou_exclamation.length - 1);

        message.channel.send(`${insulte[insulte_ran]} ${personne[personne_ran]} ${ordre_ou_exclamation[ordre_ou_exclamation_ran]}`);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Procédural: ${insulte[insulte_ran]} ${personne[personne_ran]} ${ordre_ou_exclamation[ordre_ou_exclamation_ran]}`);
    } else if(type == 2 || type == 3) {
        const phrase = ["Bon je peux écouter la fin du film là merde !?", "Tu veux boire le reste de CHAMpomy", "VOTRE POULET IL ACCOUCHE !!!!", "Si tu gueule jte saute", "Non on va faire ça bien, je vais me coiffer...", "Elle est où la vénitienne? :) Oh putain, cette gueule !", "Ouais les deux pd on dirrait ils sont en trans", "Le Proverbe aussi, fermer sa gueule", "Attend la vénitienne elle a pas la gueule de pelo", "Eh bat elle fait chier la vénitienne", "C'est pas une séance de cul là ?", "T'es en train de jouir avec la vénitienne, fais plus doucement !", "Salut ma chérie !", "Oh vous avez le pète ce soir !", "Ouais c'est ça (avec accent bizarre)", "Molo avec la flotte", "Molo avec le chauffage", "Salut toi !", "Nanani nanana !"];
        const phrase_ran = client.randomInt(0, phrase.length - 1);

        message.channel.send(phrase[phrase_ran]);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Prefab: ${phrase[phrase_ran]}`);
    }

}

module.exports.help = {
name: "daronnesimulator",
aliases: ['ds'],
category: "entertainment",
desription: "Exécute une phrase de la daronne ou en crée une qu'elle pourrait dire.",
usage: "",
cooldown: 1,
permissions: false,
args: false
};