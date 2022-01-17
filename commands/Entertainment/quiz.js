var counter = 0; 
var already_started = false;

const { MessageEmbed } = require("discord.js");
const culureG_json = require("../../assets/quiz/culture_general.json");
const culturePOP_json = require("../../assets/quiz/culture_populaire.json");


module.exports.run = async (client, message, args) => {


        if(already_started == true) return message.reply("WESH LOL Y'EN A DEJA UN EN COURS >:(")
        


        var objectif_point = 5;

        var categorie = "tout";

        if(!args[0]) {}
        else {
            if(args[0] == "classement") {
                const leadEmbed = new MessageEmbed()
                .setColor('BF2F00')
                .setAuthor(`Classement des meilleurs joueurs du quiz`, client.user.displayAvatarURL());
        
                await client.getUsers(message.guild).then(p => {
                    p.sort((a, b) => (a.wins_quiz < b.wins_quiz) ? 1 : -1).splice(0, 5).forEach(e => {
                        if(e.wins_quiz > 0)
                            leadEmbed.addField(`** **`, `**${e.username.split('#')[0]}** a gagné **${e.wins_quiz}** fois le quiz !`);
                    });
                });
                return message.channel.send({embeds:[leadEmbed]});
            }

            if(isNaN(args[0])) return message.reply("Veuillez renseigner une valeur numérique.");
            if(args[0] < 1) return message.reply("Cette valeur est trop faible. Minimum 1.");
            if(args[0] > 256) return message.reply("Cette valeur est trop grande. Maximum 256.");
            objectif_point = parseInt(args[0]);
        } 
        already_started = true;

        if(args[1]) {
            if(args[1].toLowerCase() == "cultureg") categorie = "culture générale";
            if(args[1].toLowerCase() == "culturepop") categorie = "culture populaire";
        }

        questions = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"]; //! TESTS

        array_players = []; // contient les id des joueurs (a partir du moment où il gagnent un point au moins.)
        array_players_points = [] // contient par ID les points des joueurs équivalent au même id dans le tableau précédent.
        
        var question;
        if(categorie == "culture générale") {
            question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
        } else if(categorie == "culture populaire") {
            question = client.filterById(culturePOP_json, client.randomInt(0, culturePOP_json.length - 1))
        } else {
            if(client.randomInt(0, 1) == 1) {
                question = client.filterById(culturePOP_json, client.randomInt(0, culturePOP_json.length - 1))
            } else {
                question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
            }
        }
        

        message.channel.send(`Un quiz va démarrer ! La catégorie de question est : **${categorie}** ! \nLe premier joueur à **${objectif_point}** point(s), gagne la partie ! :) \n ** **`);
        setTimeout(() => {
            
            
            
            message.channel.send(`${question.id + 1} : **${question.categorie}** \n${question.question}`); // question 1

            
            //const filter = m => m.content.toLowerCase().includes(question.reponse[question.reponses.indexOf(m.content.toLowerCase())]) || m.content.toLowerCase().includes("p<passer");
            const filter = m => m.author.id != client.user.id;
            const collector = message.channel.createMessageCollector({ filter, time: 600000});

            collector.on('collect', m => {
                //console.log(`counter: ${counter}`);


                if(m.content == 'p<stopquiz') {
                    collector.stop(); 
                    return;
                }
                if(m.content == 'p<passer') {
                    message.channel.send(`Question passée !`);
                    //message.channel.send(questions[client.randomInt(0, questions.length - 1)]); // ! TEST
                    //question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
                    if(categorie == "culture générale") {
                        question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
                    } else if(categorie == "culture populaire") {
                        question = client.filterById(culturePOP_json, client.randomInt(0, culturePOP_json.length - 1))
                    } else {
                        if(client.randomInt(0, 1) == 1) {
                            question = client.filterById(culturePOP_json, client.randomInt(0, culturePOP_json.length - 1))
                        } else {
                            question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
                        }
                    }
                    message.channel.send(`${question.id + 1} : **${question.categorie}** \n${question.question}`);
                } else {
                
                    if(question.reponses[question.reponses.indexOf(m.content.toLowerCase())]) {
                        let index = array_players.indexOf(m.author.id);
                        if(index >= 0) {
                            array_players_points[index] = array_players_points[index] + 1;
                        } else {
                            array_players.push(m.author.id);
                            array_players_points.push(1)
                            index = array_players.length - 1;
                            //console.log("size " + array_players.length);
                        }
        
                        
                        //console.log(array_players_points[index]);
                        if(array_players_points[index] < objectif_point) {
        
                            
        
                            message.channel.send(`**${m.author.username}** marque un point, trop fort ! **${array_players_points[index]}** Points\n** **`);
                            //question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
                            if(categorie == "culture générale") {
                                question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
                            } else if(categorie == "culture populaire") {
                                question = client.filterById(culturePOP_json, client.randomInt(0, culturePOP_json.length - 1))
                            } else {
                                if(client.randomInt(0, 1) == 1) {
                                    question = client.filterById(culturePOP_json, client.randomInt(0, culturePOP_json.length - 1))
                                } else {
                                    question = client.filterById(culureG_json, client.randomInt(0, culureG_json.length - 1))
                                }
                            }
                            message.channel.send(`${question.id + 1} : **${question.categorie}** \n${question.question}`);
                            //message.channel.send(questions[client.randomInt(0, questions.length - 1)]); // ! TEST
                            counter++;
                        } else {
                            collector.stop();
                        }
                    } else {
                        
                    }
                }
            });

            collector.on('end', async collector => {
                //console.log("DEBUG 3: " + array_players_points.indexOf(5) + " DATA: " + array_players[array_players_points.indexOf(5)]);
                already_started = false;
                if(array_players_points.indexOf(objectif_point) < 0) {
                    return message.channel.send(`Quiz terminé sans gagnant !`);
                } else {
                    let memb = message.guild.members.cache.get(array_players[array_players_points.indexOf(objectif_point)]);
                    let dbM = await client.getUser(memb)
                    await client.updateUser(memb, {wins_quiz: dbM.wins_quiz + 1});
                    return message.channel.send(`Quiz fini ! ${memb} a gagné avec **${objectif_point}** points !`);
                }
            }); 
    }, 5000);
} 

module.exports.help = {
    name: "quiz",
    aliases: [],
    category: "entertainment",
    desription: "Lance un quiz sur différents sujets. utilisez la commande p<passer pour sauter la question. et p<stopquiz pour arrêter de jouer. 'p<quiz classement' pour voir le classement des meilleurs joueurs !",
    usage: "[objectif point] [catégorie:tout/cultureG/culturePOP]",
    cooldown: 1,
    permissions: false,
    args: false 
};