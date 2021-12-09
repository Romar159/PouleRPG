const json_CG = require("../../assets/quiz/culture_general.json");
const json_POP = require("../../assets/quiz/culture_populaire.json");
var used_json;

module.exports.run = async (client, message, args) => {
    return message.reply("WIP");
    console.log("HERE");
    const filter = m => (message.author.id === m.author.id);
    const userEntry = await message.channel.awaitMessages(filter, {
        max:1, time:60000, errors: ['time']
    });

    message.channel.send("Choisissez d'abbord le JSON cible (cultureg/culturepop)");
    let json, categorie, question, reponses;

    
 
    if(userEntry.first().content) {
        if(userEntry.first().content == "cultureg") {
            used_json = json_CG;
        } else if(userEntry.first().content == "culturepop") {
            used_json = json_POP;
        } else {
            return message.reply("Ce json n'existe pas.");
        }

        const userEntry2 = await message.channel.awaitMessages(filter, {
            max:1, time:60000, errors: ['time']
        });
        message.channel.send('Choisissez à présent la catégorie. (exemple: Littérature, Musique, Biologie, Chimie, Jeux vidéo, etc...');

        if(userEntry2.first().content) {
            categorie = userEntry2.first().content;

            const userEntry3 = await message.channel.awaitMessages(filter, {
                max:1, time:60000, errors: ['time']
            });
            message.channel.send('Définissez maintenant la question.');
            if(userEntry3.first().content) {
                question = userEntry3.first().content;

                const userEntry4 = await message.channel.awaitMessages(filter, {
                    max:1, time:60000, errors: ['time']
                });
                message.channel.send('Définissez maintenant la ou les réponses (séparées par un ";" s\'il y en a plus de 1');
                if(userEntry4.first().content) {
                    reponses = userEntry4.first().content.split(';');

                    message.channel.send(`
                    {
                        "id": ${used_json.length},
                        "categorie": ${categorie},
                        "question": ${question},
                        "reponses": ${reponses}
                    }
                    `);
                }
            }
        }
    }
}

module.exports.help = {
    name: "ajoutquestion",
    aliases: ['addquestion', 'aq'],
    category: "admin",
    desription: "Ajoute une question facilement au quiz",
    usage: '<json> <catégorie> <question> <réponses>',
    cooldown: 3, 
    permissions: true,
    args: false,
};