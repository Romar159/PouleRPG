const {Collection,  ChannelType, InteractionType} = require('discord.js');
const {PREFIX} = require('../../config');

const fs = require("fs");

module.exports = async (client, interaction) => {
    
    // if(interaction.isCommand()) {
    //     const cmd = client.commands.get(interaction.commandName);
    //     if(!cmd) return interaction.reply("Cette commande n'existe pas");
    //     /*
    //     let args = 0;
    //     let settings = 0;
    //     let dbUser = 0;
    //     let command = 0;
    //     let mentionnedUser = 0;
    //     */

    //     cmd.runSlash(client, interaction);
    // }

    if (interaction.type === InteractionType.ModalSubmit) {
        const feedback_json_file = "./assets/feedbacks.json";

        if (interaction.customId === 'myModal_idee' + interaction.user.id) {
            const response = interaction.fields.getTextInputValue('feedbackInput');
            interaction.reply(`Votre commentaire a bien été enregistré ! Il sera consulté rapidement.`);

            const new_feedback = {
                "author": interaction.user.username + "(" + interaction.user.id + ")",
                "subject": "Idée",
                "content": response
            };

            // Lire le contenu du fichier JSON existant (asynchrone)
            fs.readFile(feedback_json_file, 'utf8', (err, data) => {
                if (err) {
                    console.error('Erreur de lecture du fichier JSON :', err);
                    return;
                }
            
                // Parsez le contenu JSON existant en un objet JavaScript
                const objetsExistant = JSON.parse(data);
            
                // Ajoutez le nouvel objet à votre tableau d'objets existant
                objetsExistant.push(new_feedback);
            
                // Convertissez le tableau d'objets mis à jour en JSON
                const nouveauContenuJSON = JSON.stringify(objetsExistant, null, 2);
            
                // Écrivez le nouveau contenu JSON dans le fichier (asynchrone)
                fs.writeFile(feedback_json_file, nouveauContenuJSON, (err) => {
                if (err) {
                    console.error('Erreur d\'écriture du fichier JSON :', err);
                    return;
                }
                //console.log('Objet ajouté avec succès au fichier JSON !');
                });
            });

        }
        if (interaction.customId === 'myModal_bug' + interaction.user.id) {
            const response = interaction.fields.getTextInputValue('feedbackInput');
            interaction.reply(`Votre commentaire a bien été enregistré ! Il sera consulté rapidement.`);

            const new_feedback = {
                author: interaction.user.username + "(" + interaction.user.id + ")",
                subject: "Bug",
                content: response,
            };

            // Lire le contenu du fichier JSON existant (asynchrone)
            fs.readFile(feedback_json_file, 'utf8', (err, data) => {
                if (err) {
                    console.error('Erreur de lecture du fichier JSON :', err);
                    return;
                }
            
                // Parsez le contenu JSON existant en un objet JavaScript
                const objetsExistant = JSON.parse(data);
            
                // Ajoutez le nouvel objet à votre tableau d'objets existant
                objetsExistant.push(new_feedback);
            
                // Convertissez le tableau d'objets mis à jour en JSON
                const nouveauContenuJSON = JSON.stringify(objetsExistant, null, 2);
            
                // Écrivez le nouveau contenu JSON dans le fichier (asynchrone)
                fs.writeFile(feedback_json_file, nouveauContenuJSON, (err) => {
                if (err) {
                    console.error('Erreur d\'écriture du fichier JSON :', err);
                    return;
                }
                //console.log('Objet ajouté avec succès au fichier JSON !');
                });
            });
        }
        if (interaction.customId === 'myModal' + interaction.user.id) {
            const subject = interaction.fields.getTextInputValue('subjectInput');
            const response = interaction.fields.getTextInputValue('feedbackInput');
            interaction.reply(`Votre commentaire a bien été enregistré ! Il sera consulté rapidement.`);

            const new_feedback = {
                author: interaction.user.username + "(" + interaction.user.id + ")",
                subject: subject,
                content: response,
            };

            // Lire le contenu du fichier JSON existant (asynchrone)
            fs.readFile(feedback_json_file, 'utf8', (err, data) => {
                if (err) {
                    console.error('Erreur de lecture du fichier JSON :', err);
                    return;
                }
            
                // Parsez le contenu JSON existant en un objet JavaScript
                const objetsExistant = JSON.parse(data);
            
                // Ajoutez le nouvel objet à votre tableau d'objets existant
                objetsExistant.push(new_feedback);
            
                // Convertissez le tableau d'objets mis à jour en JSON
                const nouveauContenuJSON = JSON.stringify(objetsExistant, null, 2);
            
                // Écrivez le nouveau contenu JSON dans le fichier (asynchrone)
                fs.writeFile(feedback_json_file, nouveauContenuJSON, (err) => {
                if (err) {
                    console.error('Erreur d\'écriture du fichier JSON :', err);
                    return;
                }
                //console.log('Objet ajouté avec succès au fichier JSON !');
                });
            });
        }
    }


};