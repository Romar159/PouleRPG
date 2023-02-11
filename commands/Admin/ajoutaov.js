const levenshtein = require('js-levenshtein');
 
module.exports.run = async (client, message, args) => {
    
    client.logCommandExecution(message, this);
    
    var cat = "vérité";
    var arr = [];

    if(!args[1]) return message.reply("Veuillez entrer un texte valide.");

    //Vérficiation de la catégorie en prenant en compte les fautes de frapes.
    if(levenshtein(args[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'verite') > levenshtein(args[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'action')) {
        cat = "action"
    }

    //Récupération de la phrase (args[1 et +])
    for(let i = 1; i < args.length; i++) {
        arr.push(args[i]);
    }
    var str = arr.join(' ');

    

    //création de l'entrée DB
    const newAov = {
        categorie: cat,
        texte: str
    };
    await client.createAov(newAov);

    message.channel.send(`Nouveau ${cat} crée : ${str}`);
    
}

module.exports.help = {
    name: "ajoutaov",
    aliases: ['ajoutactionouverite', 'aaov'],
    category: "admin",
    desription: "ajoute un action ou vérité à la base de donnée",
    usage: "<categorie> <texte>",
    cooldown: 5, 
    permissions: true,
    args: true
};