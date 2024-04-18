// return 1 si a est plus puissant que b
// return 0 si a est moins puissant que b
// return 2 si ce sont les même armes.

const { Message } = require("discord.js");

function aPlusPuissantQueB(a, b) {
    if(a == b) return 2;
    if(a == 0 && b == 4 || a == 0 && b == 1) {
        return 1;
    }
    if(a == 1 && b == 4 || a == 1 && b == 2) {
        return 1;
    }
    if(a == 2 && b == 3 || a == 2 && b == 0) {
        return 1;
    }
    if(a == 3 && b == 0 || a == 3 && b == 1) {
        return 1;
    }
    if(a == 4 && b == 3 || a == 4 && b == 2) {
        return 1;
    }
    return 0;
}

module.exports.run = (client, message, args, settings, dbUser) => {
    
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

   

    // 0 - épée | 1 - arc | 2 - piques | 3 - bouclier | 4 - marteau
    // const armee_epsilon = [300, 500, 800, 100, 70];
    // const armee_dairos =  [80, 800, 450, 160, 230];

    const armee_epsilon = [500, 500, 800, 1020, 70];
    const armee_dairos =  [800, 800, 4570, 1060, 230];

    const placement_epsilon = [1, 0, 2, 3, 4];
    const placement_dairos= [2, 4, 1, 0, 3];

    let points_epsilon = 0;
    let points_dairos = 0;

    // avantages :
    /*
        0 > 4 & > 1
        1 > 4 & > 2
        2 > 3 & > 0
        3 > 0 & > 1
        4 > 3 & > 2
    */

    let current_ligne = 0;

    let current_epsilon = 0;
    let current_dairos = 0;

    let no_zero = true;
    let nb_ligne_zero = 0;
    let tour = 0; // compte le nombre de tour complet

    // tant qu'il y toujours au moins une ligne sans zéro
    while(no_zero == true) {
        tour++;
    
        //parcour chaque ligne à la suite
        for(current_ligne = 0; current_ligne < 5; current_ligne++) {
            let type_arme_epsilon = placement_epsilon[current_ligne];
            let type_arme_dairos = placement_dairos[current_ligne];

            current_epsilon = armee_epsilon[type_arme_epsilon];
            current_dairos  = armee_dairos[type_arme_dairos];

            //On fait le calcul que si la ligne ne contient pas de zéro d'un côté ou de l'autre.
            if(current_epsilon != 0 || current_dairos != 0) {


                message.channel.send(`AVANT LE TOUR DE LA Ligne **${current_ligne}**\n Epsilon: ${current_epsilon}\n Daïros: ${current_dairos}`);
                if(aPlusPuissantQueB(type_arme_epsilon, type_arme_dairos) == 1) {
                    // Epsilon à l'avantage du type
                    message.channel.send("**Epsilon** à l'avantage du type");
                    let nb_restant_epsilon = armee_epsilon[type_arme_epsilon] - armee_dairos[type_arme_dairos] / 2;
                    let nb_restant_dairos = armee_dairos[type_arme_dairos] - armee_epsilon[type_arme_epsilon] * 2;

                    if(nb_restant_dairos < 0) nb_restant_dairos = 0;
                    if(nb_restant_epsilon < 0) nb_restant_epsilon = 0;



                    current_epsilon = armee_epsilon[type_arme_epsilon] = nb_restant_epsilon;
                    current_dairos  = armee_dairos[type_arme_dairos] = nb_restant_dairos;
                    
                } else if(aPlusPuissantQueB(type_arme_epsilon, type_arme_dairos) == 0) {
                    // Dairos à l'avantage du type
                    message.channel.send("**Dairos** à l'avantage du type");

                    let nb_restant_epsilon = armee_epsilon[type_arme_epsilon] - armee_dairos[type_arme_dairos] / 2;
                    let nb_restant_dairos = armee_dairos[type_arme_dairos] - armee_epsilon[type_arme_epsilon] * 2;

                    if(nb_restant_dairos < 0) nb_restant_dairos = 0;
                    if(nb_restant_epsilon < 0) nb_restant_epsilon = 0;



                    current_epsilon = armee_epsilon[type_arme_epsilon] = nb_restant_epsilon;
                    current_dairos  = armee_dairos[type_arme_dairos] = nb_restant_dairos;

                } else {
                    //égalité
                    //si quantitéEpsilon > quantitéDairos = Epsilon win (QuantitéDairos = 0  et quantitéEpsilon = quantitéEpsilon - quantitéDairos)
                    //Si quantitéDairos > quantitéEpsilon = Dairos win (QuantitéEpsilon = 0  et quantitéDairos = quantitéDairos - quantitéEpsilon)
                }
                message.channel.send(`APRES LE TOUR DE LA Ligne **${current_ligne}**\n Epsilon: ${current_epsilon}\n Daïros: ${current_dairos}\n----------------------------`);
            }

        }

        message.channel.send(`\nFINAL TOUR ${tour}:\n\nEpsilon: ${armee_epsilon}\nDaïros: ${armee_dairos}`);
    

        //on vérifie les points de ce tour
        nb_ligne_zero = 0; // on calcul le nombre de ligne à 0 et si c'est 5 (donc toutes) on arrête la boucle while sinon on peut continuer.
        for(let i = 0; i < 5; i++) {
            type_arme_epsilon = placement_epsilon[i];
            type_arme_dairos = placement_dairos[i];

            current_epsilon = armee_epsilon[type_arme_epsilon];
            current_dairos = armee_dairos[type_arme_dairos];

            if(current_epsilon != 0 && current_dairos == 0) {
                points_epsilon++;
                nb_ligne_zero++;
            } else if(current_epsilon == 0 && current_dairos != 0) {
                points_dairos++;
                nb_ligne_zero++;
            } else if(current_epsilon == 0 && current_dairos == 0) {
                //rien.
                nb_ligne_zero++;
            }
            if(nb_ligne_zero >= 5) {
                no_zero = false;
                nb_ligne_zero = 0;
            } 
            console.log(`nb_ligne_zero: ${nb_ligne_zero}`);
             
        }
    }

    message.channel.send(`\nFINAL BATAILLE :\n\nEpsilon: ${points_epsilon}\nDaïros: ${points_dairos}`);

}

module.exports.help = {
    name: "simulateurbataille",
    aliases: ['simbat', 'sb'],
    category: "admin",
    desription: "Simule une bataille",
    usage: '',
    cooldown: 3,  
    permissions: true,
    args: false,
}; 