const levenshtein = require('js-levenshtein');
 
module.exports.run = async (client, message, args) => {
    
    client.logCommandExecution(message, this);
    
    var cat = "vérité";
    var rating = "TP";
    var arr = [];

    if(!args[1]) return message.reply("Veuillez choisir une classification (rating) valide: **TP**/**R18**")
    if(!args[2]) return message.reply("Veuillez entrer un texte valide.");

    //Vérficiation de la catégorie en prenant en compte les fautes de frapes.
    if(levenshtein(args[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'verite') > levenshtein(args[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'action')) {
        cat = "action"
    }

    if(args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") == "r18") rating = "r18";

    //Récupération de la phrase (args[2 et +])
    for(let i = 2; i < args.length; i++) {
        arr.push(args[i]);
    }
    var str = arr.join(' ');

    

    //création de l'entrée DB
    const newAov = {
        categorie: cat,
        texte: str
    };
    if(rating == "r18")
        await client.createAov(newAov);
    else 
        await client.createAovtp(newAov)

    message.channel.send(`Rating: ${rating.toUpperCase()} - Nouvelle ${cat} créée : ${str}`);
    
}

module.exports.help = {
    name: "ajoutaov",
    aliases: ['ajoutactionouverite', 'aaov'],
    category: "admin",
    desription: "ajoute un action ou vérité à la base de donnée",
    usage: "<categorie> <rating> <texte>",
    cooldown: 5, 
    permissions: true,
    args: true
};