const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");

const fs = require('fs');


const bataille = async (client, message, dbUser) => {
    if(global.users_use_guerre_cmd.indexOf(message.author.id) != -1) {
        //message.channel.send("DEBUG: " + global.users_use_guerre_cmd.join(" - "));
        return message.reply({content:`Vous êtes déjà en train d'utiliser cette commande. Si vous souhaitez relancer la commande vous devez quitter l'éditeur dans le menu. *(Si vous pensez qu'il y a une erreur, attendez 15 minutes et réessayez. Si ça ne marche toujours pas contactez le développeur. @romar1)*`});
    } else {
        global.users_use_guerre_cmd.push(message.author.id);
    }


    const faction_user = await client.getFaction(dbUser.faction);

    let faction_attaquant, faction_defenseur;
    let army_attaquant, army_defenseur;
    let dbFactionUser;
    let armyFactionUser;
    let totalArmyUser;

    //Embed qui dit qu'on est pas en guerre.
    let embed_battle = new EmbedBuilder()
    .setColor('3C4C66')
    .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    .setTitle(`Bataille`)
    .setDescription(`Vous n'êtes pas en guerre, vous ne pouvez donc pas lancer d'assaut !`);


    //logique pour afficher l'embed en fonction de l'état
    if(faction_user.en_guerre == true) {
        faction_attaquant = await client.getFaction(faction_user.attaquant);
        faction_defenseur = await client.getFaction(faction_user.defensseur);
        

        if(faction_attaquant.name == "epsilon") army_attaquant = require("../../../assets/guerre/armies/epsilon_army.json");
        if(faction_defenseur.name == "epsilon") army_defenseur = require("../../../assets/guerre/armies/epsilon_army.json");

        if(faction_attaquant.name == "daïros") army_attaquant = require("../../../assets/guerre/armies/dairos_army.json");
        if(faction_defenseur.name == "daïros") army_defenseur = require("../../../assets/guerre/armies/dairos_army.json");

        if(faction_attaquant.name == "lyomah") army_attaquant = require("../../../assets/guerre/armies/lyomah_army.json");
        if(faction_defenseur.name == "lyomah") army_defenseur = require("../../../assets/guerre/armies/lyomah_army.json");

        if(faction_attaquant.name == "alpha") army_attaquant = require("../../../assets/guerre/armies/alpha_army.json");
        if(faction_defenseur.name == "alpha") army_defenseur = require("../../../assets/guerre/armies/alpha_army.json");


        dbFactionUser = (faction_user.name == faction_attaquant.name) ? faction_attaquant : faction_defenseur;
        armyFactionUser = (faction_user.name == faction_attaquant.name) ? army_attaquant : army_defenseur;
        //console.log(armyFactionUser);

        totalArmyUser = armyFactionUser.reduce((acc, obj) => acc + obj.units.reduce((sum, value) => sum + value, 0), 0);

        const cooldown = dbFactionUser.cooldown_battle.getTime();
        const temps = Date.now();
        const cooldown_remain = cooldown - temps;
        console.log(cooldown + " - " + temps);

        //Embed qui 
            // - affiche l'adversaire, 
            // - le temps qu'il reste à nos troupes pour récupérer,
        embed_battle = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Bataille`)
        .addFields({"name":"Attaquants", value:`${faction_attaquant.displayname}`, inline:true},{"name":"** **", value:`** **`, inline:true}, {"name":"Défenseurs", value:`${faction_defenseur.displayname}`, inline:true})
        .addFields({name:"Armée Complète", value:`${Math.round(totalArmyUser)} unités`, inline:true}, {"name":"** **", value:`** **`, inline:true}, {"name":`${(cooldown < temps) ? `Vos unités son prêtes au combat !` : 'Temps de récupération'}`, value:`${(cooldown < temps) ? "** **" : `**${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`}`, inline:true})
    }
    
    //Relié au Embed du dessus :
    const rowMenuBattle = new ActionRowBuilder()
        .addComponents(
        
        
        new ButtonBuilder()
            .setCustomId(`btnbattle` + message.author.id) // - Bouton pour lancer la bataille ! (étant en Alpha, donc qu'un seul ennemi on a pas besoin de choisir l'adversaire ni le terrain etc...)
            .setLabel('Lancer l\'assaut !')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnmenu` + message.author.id)  // - Bouton pour Quitter évidemment
            .setLabel('Quitter')
            .setStyle(ButtonStyle.Danger)
    ); 
    
    const filter = i => (
        i.customId === 'btnmenu' + message.author.id ||
        i.customId === 'btnbattle' + message.author.id) && 
        i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 900000 }); //15 minutes

    await collector.on('collect', async i => {
        if(i.isButton()) {
            if(i.customId == "btnmenu" + i.user.id) {
                await i.deferUpdate();
                i.editReply({components:[]});
                collector.stop();
            }
            if(i.customId == "btnbattle" + i.user.id) {
                
                if(faction_user.en_guerre == true) { 
                    cooldown = dbFactionUser.cooldown_battle.getTime();
                    temps = Date.now();
                    cooldown_remain = cooldown - temps;
                    
                    if(cooldown < temps) {
                        console.log("[DEBUT LOGS GUERRE] " + new Date())

                        //logique :
                        /*
                            Si le temps de récupération des troupes est trop faible soit ne pas afficher le bouton, 
                            ou alors juste envoyer un message temp comme quoi les troupes doivent encore récupérer

                            Si on lance finalement :
                                - Précalcule tout le combat, et sait donc qui gagne.
                                - Affiche une succession de message en fonction qui donnera un effet stylé ! Voir si possible simuler un visuel de bataille avec des emote colorés !
                                - Affiche l'embed au bout de quelques secondes pour montrer les résultats et donc les sauvegarder dans la base de donnée !
                                v - Mettre dans les deux factions le cooldown battle
                                - Modifier le score de guerre pour les deux factions !
                                - Donner un peu de prestige et de redoutabilité au gagnant
                                
                        */

                        //Précalcul du combat
                            //*Bonus commandant :
                            let commandants_attaquants = []; //contient les db des 3 commandants dans l'ordre gauche centre droite. Est "NULL" si pas de commandant
                            let commandants_defenseurs = [];

                            //est utilisé s'il n'y a pas de commandant, et agis comme s'il y avait le pire commandant qui puiss y avoir !
                            const fake_commandant = {
                                "userID":"123456789",
                                "metier": 0,
                                "redoutabilite":-2000,
                                "prestige":-3000,
                                "forme":-2000,
                                "savoir":-2000,
                                "moral":-2000,
                                "level":0
                            }

                            
                            for(let y = 0; y < 3; y++) {
                                (faction_attaquant.commandants[y] != "NULL") ? commandants_attaquants.push(await client.getUser(message.guild.members.cache.get(faction_attaquant.commandants[y]))) : commandants_attaquants.push(fake_commandant);
                                (faction_defenseur.commandants[y] != "NULL") ? commandants_defenseurs.push(await client.getUser(message.guild.members.cache.get(faction_defenseur.commandants[y]))) : commandants_defenseurs.push(fake_commandant);
                            }

                            //******calcul les bonus de tous les commandants******
                            
                            let att_bonuscommandants = [0, 0, 0];
                            let def_bonuscommandants = [0, 0, 0];


                            for(let i = 0; i < 3; i++) { 
                                //*Titre Politique 
                                //Si maitre +0.2 
                                    //attaquants 
                                if(faction_attaquant.idmaitre == commandants_attaquants[i].userID) att_bonuscommandants[i] = att_bonuscommandants[i] + 0.2; 
                                    //defenseurs 
                                if(faction_defenseur.idmaitre == commandants_defenseurs[i].userID) def_bonuscommandants[i] = def_bonuscommandants[i] + 0.2; 
 
                                //Si membre du conseil : +0.15 
                                    //attaquants 
                                if(faction_attaquant.marechal == commandants_attaquants[i].userID) att_bonuscommandants[i] = att_bonuscommandants[i] + 0.15; 
                                if(faction_attaquant.intendant == commandants_attaquants[i].userID) att_bonuscommandants[i] = att_bonuscommandants[i] + 0.15; 
                                if(faction_attaquant.chapelain == commandants_attaquants[i].userID) att_bonuscommandants[i] = att_bonuscommandants[i] + 0.15; 
                                    //defenseurs 
                                if(faction_defenseur.marechal == commandants_defenseurs[i].userID) def_bonuscommandants[i] = def_bonuscommandants[i] + 0.15; 
                                if(faction_defenseur.intendant == commandants_defenseurs[i].userID) def_bonuscommandants[i] = def_bonuscommandants[i] + 0.15; 
                                if(faction_defenseur.chapelain == commandants_defenseurs[i].userID) def_bonuscommandants[i] = def_bonuscommandants[i] + 0.15; 
 
                                //*Rang Mee6 
                                const valeurs_rang = [-2, -1, 0, 1, 2, 3, 4, 5, 6] 
                                //en fonction du role a un bonus
                                    //attaquants
                                let att_value_get = client.getMee6RoleId(message.guild.members.cache.get(commandants_attaquants[i].userID)); 
                                if(att_value_get != -1) { 
                                    att_bonuscommandants[i] = att_bonuscommandants[i] + (valeurs_rang[att_value_get] * 0.02); 
                                } else { 
                                    att_bonuscommandants[i] = att_bonuscommandants[i] + (-2 * 0.02); //s'il a pas de rôle on met le même que paysan
                                } 
                                    //defenseurs
                                let def_value_get = client.getMee6RoleId(message.guild.members.cache.get(commandants_defenseurs[i].userID)); 
                                if(def_value_get != -1) { 
                                    def_bonuscommandants[i] = def_bonuscommandants[i] + (valeurs_rang[def_value_get] * 0.02); 
                                } else { 
                                    def_bonuscommandants[i] = def_bonuscommandants[i] + (-2 * 0.02); //s'il a pas de rôle on met le même que paysan
                                } 


                                //*Métier
                                    //attaquants
                                let att_valeur_metier = (commandants_attaquants[i].metier >= 1 && commandants_attaquants[i].metier <= 5) ? -1 :
                                                          (commandants_attaquants[i].metier >= 6 && commandants_attaquants[i].metier <= 12) ? 0 :
                                                          (commandants_attaquants[i].metier >= 13 && commandants_attaquants[i].metier <= 20) ? 1 :
                                                          (commandants_attaquants[i].metier >= 21 && commandants_attaquants[i].metier <= 23) ? 2 :
                                                          (commandants_attaquants[i].metier >= 24 && commandants_attaquants[i].metier <= 26) ? 3 :
                                                          (commandants_attaquants[i].metier >= 901 && commandants_attaquants[i].metier <= 903) ? 4 :
                                                          (commandants_attaquants[i].metier >= 904 && commandants_attaquants[i].metier <= 904) ? 5 : -2;
                                
                                    //défenseurs
                                let def_valeur_metier = (commandants_defenseurs[i].metier >= 1 && commandants_defenseurs[i].metier <= 5) ? -1 :
                                                          (commandants_defenseurs[i].metier >= 6 && commandants_defenseurs[i].metier <= 12) ? 0 :
                                                          (commandants_defenseurs[i].metier >= 13 && commandants_defenseurs[i].metier <= 20) ? 1 :
                                                          (commandants_defenseurs[i].metier >= 21 && commandants_defenseurs[i].metier <= 23) ? 2 :
                                                          (commandants_defenseurs[i].metier >= 24 && commandants_defenseurs[i].metier <= 26) ? 3 :
                                                          (commandants_defenseurs[i].metier >= 901 && commandants_defenseurs[i].metier <= 903) ? 4 :
                                                          (commandants_defenseurs[i].metier >= 904 && commandants_defenseurs[i].metier <= 904) ? 5 : -2;
                                
                                att_bonuscommandants[i] = att_bonuscommandants[i] + (att_valeur_metier * 0.025);
                                def_bonuscommandants[i] = def_bonuscommandants[i] + (def_valeur_metier * 0.025);
                                  


                                //*Points 

                                     //*FAIT: ça veut dire quoi à l'entier supérieur ? 
                                    //*FAIT/ Genre si le résultat = 0.035 ça vaudra 1, pareil 0.962 etc... en fait je comprends pas le calcul pour juste quasiment TOUT LE TEMPS avoir 1 tant qu'on est pas au dessus de 100 000 points  
                                    //*FAIT *Visiblement il faut donc si on a 0.0058 on aura 0.006
                                    //*NOTE: Pas c'est bon t'as eu ta réponse c'est implémenté depuis des siècles

                                let att_total_points = (commandants_attaquants[i].redoutabilite + commandants_attaquants[i].prestige + commandants_attaquants[i].forme + commandants_attaquants[i].savoir + commandants_attaquants[i].moral) / 100000;
                                let def_total_points = (commandants_defenseurs[i].redoutabilite + commandants_defenseurs[i].prestige + commandants_defenseurs[i].forme + commandants_defenseurs[i].savoir + commandants_defenseurs[i].moral) / 100000;

                                // Arrondir à 0.001 près
                                att_total_points = Math.round(att_total_points * 1000) / 1000;
                                def_total_points = Math.round(def_total_points * 1000) / 1000;

                                att_bonuscommandants[i] = att_bonuscommandants[i] + att_total_points;
                                def_bonuscommandants[i] = def_bonuscommandants[i] + def_total_points;

                                //*Level

                                /*let att_total_level = commandants_attaquants[i].level / 10000;
                                let def_total_level = commandants_defenseurs[i].level / 10000;

                                att_total_level = Math.round(att_total_level * 1000) / 1000;
                                def_total_level = Math.round(def_total_level * 1000) / 1000;*/

                                let att_total_level = Math.ceil(commandants_attaquants[i].level / 10000 * 1000) / 1000;
                                let def_total_level = Math.ceil(commandants_defenseurs[i].level / 10000 * 1000) / 1000;
                                //message.channel.send("LVL ATT: " + att_total_level + " LVL DEF: " + def_total_level);

                                att_bonuscommandants[i] = att_bonuscommandants[i] + att_total_level;
                                def_bonuscommandants[i] = def_bonuscommandants[i] + def_total_level;

                                 //*Total final :
                                 att_bonuscommandants[i] = 1 + att_bonuscommandants[i];
                                 def_bonuscommandants[i] = 1 + def_bonuscommandants[i];

                            } 

                            console.log(`[DEBUG] Bonus commandants :\nAttaquant: ${att_bonuscommandants.join(' - ')}\nDéfenseurs: ${def_bonuscommandants.join(' - ')}`);
                            

                        //*******Bataille*******

                            //*FAIT: Ajouter le BonusAlliées
                            //*calcul des PuissanceRan de chaque troupe pour chaque flanc:
                            //dans l'ordre Archer | Infanterie Légère | Infanterie Lourde | Cavelerie légère | Cavalerie Lourde | Piquiers
                                //attaquants
                            const att_puissanceran_flancgauche = [client.randomFloat(0.9, 1.1), client.randomFloat(0.975, 1.025), client.randomFloat(0.8, 1.2), client.randomFloat(0.925, 1.075), client.randomFloat(0.75, 1.25), client.randomFloat(0.875, 1.125)];
                            const att_puissanceran_flanccentral = [client.randomFloat(0.9, 1.1), client.randomFloat(0.975, 1.025), client.randomFloat(0.8, 1.2), client.randomFloat(0.925, 1.075), client.randomFloat(0.75, 1.25), client.randomFloat(0.875, 1.125)];
                            const att_puissanceran_flancdroit = [client.randomFloat(0.9, 1.1), client.randomFloat(0.975, 1.025), client.randomFloat(0.8, 1.2), client.randomFloat(0.925, 1.075), client.randomFloat(0.75, 1.25), client.randomFloat(0.875, 1.125)];

                                //défenseurs
                            const def_puissanceran_flanccentral = [client.randomFloat(0.9, 1.1), client.randomFloat(0.975, 1.025), client.randomFloat(0.8, 1.2), client.randomFloat(0.925, 1.075), client.randomFloat(0.75, 1.25), client.randomFloat(0.875, 1.125)];
                            const def_puissanceran_flancgauche = [client.randomFloat(0.9, 1.1), client.randomFloat(0.975, 1.025), client.randomFloat(0.8, 1.2), client.randomFloat(0.925, 1.075), client.randomFloat(0.75, 1.25), client.randomFloat(0.875, 1.125)];
                            const def_puissanceran_flancdroit = [client.randomFloat(0.9, 1.1), client.randomFloat(0.975, 1.025), client.randomFloat(0.8, 1.2), client.randomFloat(0.925, 1.075), client.randomFloat(0.75, 1.25), client.randomFloat(0.875, 1.125)];

                            //*Calcul du Bonus allié
                            const att_BonusAlly = faction_attaquant.relations.reduce((acc, curr) => acc + (curr === 3), 0) * 0.1;
                            const def_BonusAlly = faction_defenseur.relations.reduce((acc, curr) => acc + (curr === 3), 0) * 0.1;

                            //*Calcul PuissanceTroupe de chaque troupe :
                            //Même ordre qu'au dessus
                                //attaquants
                            const att_puissancetroupe_flancgauche = [(  1 * att_puissanceran_flancgauche[0] * att_bonuscommandants[0]) + att_BonusAlly,( 1 * att_puissanceran_flancgauche[1] * att_bonuscommandants[0]) + att_BonusAlly,( 1 * att_puissanceran_flancgauche[2] * att_bonuscommandants[0]) + att_BonusAlly,( 1 * att_puissanceran_flancgauche[3] * att_bonuscommandants[0]) + att_BonusAlly,( 1 * att_puissanceran_flancgauche[4] * att_bonuscommandants[0]) + att_BonusAlly,( 1 * att_puissanceran_flancgauche[5] * att_bonuscommandants[0]) + att_BonusAlly]
                            const att_puissancetroupe_flanccentral = [(1 * att_puissanceran_flanccentral[0] * att_bonuscommandants[1]) + att_BonusAlly,(1 * att_puissanceran_flanccentral[1] * att_bonuscommandants[1]) + att_BonusAlly,(1 * att_puissanceran_flanccentral[2] * att_bonuscommandants[1]) + att_BonusAlly,(1 * att_puissanceran_flanccentral[3] * att_bonuscommandants[1]) + att_BonusAlly,(1 * att_puissanceran_flanccentral[4] * att_bonuscommandants[1]) + att_BonusAlly,(1 * att_puissanceran_flanccentral[5] * att_bonuscommandants[1]) + att_BonusAlly]
                            const att_puissancetroupe_flancdroit = [(    1 * att_puissanceran_flancdroit[0] * att_bonuscommandants[2]) + att_BonusAlly,(  1 * att_puissanceran_flancdroit[1] * att_bonuscommandants[2]) + att_BonusAlly,(  1 * att_puissanceran_flancdroit[2] * att_bonuscommandants[2]) + att_BonusAlly,(  1 * att_puissanceran_flancdroit[3] * att_bonuscommandants[2]) + att_BonusAlly,(  1 * att_puissanceran_flancdroit[4] * att_bonuscommandants[2]) + att_BonusAlly,(  1 * att_puissanceran_flancdroit[5] * att_bonuscommandants[2]) + att_BonusAlly]

                                //défenseurs
                            const def_puissancetroupe_flancgauche = [(  1 * def_puissanceran_flancgauche[0] * def_bonuscommandants[0]) + def_BonusAlly,( 1 * def_puissanceran_flancgauche[1] * def_bonuscommandants[0]) + def_BonusAlly,( 1 * def_puissanceran_flancgauche[2] * def_bonuscommandants[0]) + def_BonusAlly,( 1 * def_puissanceran_flancgauche[3] * def_bonuscommandants[0]) + def_BonusAlly,( 1 * def_puissanceran_flancgauche[4] * def_bonuscommandants[0]) + def_BonusAlly,( 1 * def_puissanceran_flancgauche[5] * def_bonuscommandants[0]) + def_BonusAlly]
                            const def_puissancetroupe_flanccentral = [(1 * def_puissanceran_flanccentral[0] * def_bonuscommandants[1]) + def_BonusAlly,(1 * def_puissanceran_flanccentral[1] * def_bonuscommandants[1]) + def_BonusAlly,(1 * def_puissanceran_flanccentral[2] * def_bonuscommandants[1]) + def_BonusAlly,(1 * def_puissanceran_flanccentral[3] * def_bonuscommandants[1]) + def_BonusAlly,(1 * def_puissanceran_flanccentral[4] * def_bonuscommandants[1]) + def_BonusAlly,(1 * def_puissanceran_flanccentral[5] * def_bonuscommandants[1]) + def_BonusAlly]
                            const def_puissancetroupe_flancdroit = [(    1 * def_puissanceran_flancdroit[0] * def_bonuscommandants[2]) + def_BonusAlly,(  1 * def_puissanceran_flancdroit[1] * def_bonuscommandants[2]) + def_BonusAlly,(  1 * def_puissanceran_flancdroit[2] * def_bonuscommandants[2]) + def_BonusAlly,(  1 * def_puissanceran_flancdroit[3] * def_bonuscommandants[2]) + def_BonusAlly,(  1 * def_puissanceran_flancdroit[4] * def_bonuscommandants[2]) + def_BonusAlly,(  1 * def_puissanceran_flancdroit[5] * def_bonuscommandants[2]) + def_BonusAlly]
    

                            //Récupérations des troupes dans chaque flanc des deux armées !
                            const att_jsonarmy = require(`../../../assets/guerre/armies/` + faction_attaquant.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + `_army.json`);
                            const def_jsonarmy = require(`../../../assets/guerre/armies/` + faction_defenseur.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + `_army.json`);

                            const att_jsonarmy_file = require(`../../../assets/guerre/armies/` + faction_attaquant.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + `_army.json`);
                            //const att_initial_army = [ ...att_jsonarmy_file[0].units, ...att_jsonarmy_file[1].units, ...att_jsonarmy_file[2].units ];
                            const att_initial_army = [
                                att_jsonarmy_file[0].units.slice(),
                                att_jsonarmy_file[1].units.slice(),
                                att_jsonarmy_file[2].units.slice()
                              ];
                            
                            const def_jsonarmy_file = require(`../../../assets/guerre/armies/` + faction_defenseur.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + `_army.json`);
                            const def_initial_army = [
                                def_jsonarmy_file[0].units.slice(),
                                def_jsonarmy_file[1].units.slice(),
                                def_jsonarmy_file[2].units.slice()
                              ];
                            
                            //ce sont les troupes, elles sont modifiables donc (si on veut récup l'original/initial on lit le jsonarmy)
                            let att_flancgauche_troupes = att_jsonarmy[0].units;
                            let att_flanccentral_troupes = att_jsonarmy[1].units;
                            let att_flancdroit_troupes = att_jsonarmy[2].units;

                            let def_flancgauche_troupes = def_jsonarmy[0].units;
                            let def_flanccentral_troupes = def_jsonarmy[1].units;
                            let def_flancdroit_troupes = def_jsonarmy[2].units;

                            //ratios des 6 unités
                            const ratios_units = [2, 1, 2, 1.75, 3.5, 2.5];

                            //dégats en % qu'il font sur chaque unités
                            const ratiosParTypeArchers = [0.05, 0.19, 0.19, 0.19, 0.19, 0.19];
                            const ratiosParTypeInfanterieLegere = [0.35, 0.15, 0.06, 0.03, 0.01, 0.40];
                            const ratiosParTypeInfanterieLourde = [0.27, 0.27, 0.09, 0.03, 0.01, 0.33];
                            const ratiosParTypeCavalerieLegere = [0.21, 0.36, 0.28, 0.10, 0.04, 0.01];
                            const ratiosParTypeCavalerieLourde = [0.19, 0.32, 0.26, 0.14, 0.08, 0.01];
                            const ratiosParTypePiquiers = [0.02, 0.05, 0.04, 0.38, 0.38, 0.13];

                            //*Phase 1 - Archers ([0])
                            let pertes_flanc_droit_def = 0,pertes_flanc_droit_att = 0,pertes_flanc_central_def = 0,pertes_flanc_central_att = 0,pertes_flanc_gauche_def = 0,pertes_flanc_gauche_att = 0;
                            
                            
  
        //!ANCIEN SYSTEME - Avant optimisation du code !
/*                           
                            for(let w = 0; w < att_flancgauche_troupes[0]; w++) {
                                //calcul attaquant flanc gauche sur flanc droite défenseurs
                                 pertes_flanc_droit_def = pertes_flanc_droit_def + (att_puissancetroupe_flancgauche[0] * ratios_units[0]) //pertes du flanc droit des défenseurs
                            }

                            for(let w = 0; w < def_flancgauche_troupes[0]; w++) {
                                //calcul défenseurs flanc gauche sur flanc droite attaquants
                                 pertes_flanc_droit_att = pertes_flanc_droit_att + (def_puissancetroupe_flancgauche[0] * ratios_units[0]) //pertes du flanc droit des attaquants
                            }

                            for(let w = 0; w < att_flanccentral_troupes[0]; w++) {
                                //calcul attaquant flanc central sur flanc central défenseurs
                                 pertes_flanc_central_def = pertes_flanc_central_def + (att_puissancetroupe_flanccentral[0] * ratios_units[0])
                            }

                            for(let w = 0; w < def_flanccentral_troupes[0]; w++) {
                                //calcul défenseurs flanc central sur flanc central attaquants
                                 pertes_flanc_central_att = pertes_flanc_central_att + (def_puissancetroupe_flanccentral[0] * ratios_units[0])
                            }

                            for(let w = 0; w < att_flancdroit_troupes[0]; w++) {
                                //calcul attaquant flanc droit sur flanc gauche défenseurs
                                 pertes_flanc_gauche_def = pertes_flanc_gauche_def + (att_puissancetroupe_flancdroit[0] * ratios_units[0])
                            }

                            for(let w = 0; w < def_flancdroit_troupes[0]; w++) {
                                //calcul défenseurs flanc droit sur flanc droit attaquant
                                 pertes_flanc_gauche_att = pertes_flanc_gauche_att + (def_puissancetroupe_flancdroit[0] * ratios_units[0])
                            }

                            message.channel.send(`[DEBUG] Défense: droit: ${pertes_flanc_droit_def} | centre: ${pertes_flanc_central_def} | gauche: ${pertes_flanc_gauche_def}`)
                            message.channel.send(`[DEBUG] Attaquants: droit: ${pertes_flanc_droit_att} | centre: ${pertes_flanc_central_att} | gauche: ${pertes_flanc_gauche_att}`)
*/

                            // Fonction pour calculer les pertes pour un flanc donné
                            function calculerPertes(type_troupe, att_troupes, def_troupes, att_puissance, def_puissance) {
                                let pertes_att = 0;
                                let pertes_def = 0;

                                //Noter que les [0] sont les "archers". [1] serait l'infanterie légère etc...
                                for (let w = 0; w < att_troupes[type_troupe]; w++) {
                                    pertes_def += att_puissance[type_troupe] * ratios_units[type_troupe];
                                }

                                for (let w = 0; w < def_troupes[type_troupe]; w++) {
                                    pertes_att += def_puissance[type_troupe] * ratios_units[type_troupe];
                                }

                                return { att: pertes_att, def: pertes_def };
                            }

                            // Appel de la fonction pour chaque flanc avec les ARCHERS [0]
                            let pertesFlancDroit = calculerPertes(0, att_flancgauche_troupes, def_flancdroit_troupes, att_puissancetroupe_flancgauche, def_puissancetroupe_flancdroit);
                            let pertesFlancCentral = calculerPertes(0, att_flanccentral_troupes, def_flanccentral_troupes, att_puissancetroupe_flanccentral, def_puissancetroupe_flanccentral);
                            let pertesFlancGauche = calculerPertes(0, att_flancdroit_troupes, def_flancgauche_troupes, att_puissancetroupe_flancdroit, def_puissancetroupe_flancgauche);

                            console.log(`[DEBUG] PHASE-1 | Pertes Défense: flanc droit: ${pertesFlancDroit.def} | flanc central: ${pertesFlancCentral.def} | flanc gauche: ${pertesFlancGauche.def}`)
                            console.log(`[DEBUG] Phase-2 | Pertes Attaquants: flanc droit: ${pertesFlancDroit.att} | flanc central: ${pertesFlancCentral.att} | flanc gauche: ${pertesFlancGauche.att}`)


                            pertes_flanc_gauche_att = pertesFlancGauche.att;
                            pertes_flanc_gauche_def = pertesFlancGauche.def;

                            pertes_flanc_central_att = pertesFlancCentral.att;
                            pertes_flanc_central_def = pertesFlancCentral.def;

                            pertes_flanc_droit_att = pertesFlancDroit.att;
                            pertes_flanc_droit_def = pertesFlancDroit.def;

                            //!ANCIEN SYSTEME - Avant optimisation du code !
                        /*
                                //réduction attaquant et défenseurs pour chaque flancs
                                    //flanc gauche attaquant
                                att_flancgauche_troupes[0] = att_flancgauche_troupes[0] - (pertes_flanc_gauche_att * 0.05); //Archers contre archers
                                att_flancgauche_troupes[1] = att_flancgauche_troupes[1] - (pertes_flanc_gauche_att * 0.19); //Archers contre infanterie légère
                                att_flancgauche_troupes[2] = att_flancgauche_troupes[2] - (pertes_flanc_gauche_att * 0.19); //Archers contre infanterie lourde
                                att_flancgauche_troupes[3] = att_flancgauche_troupes[3] - (pertes_flanc_gauche_att * 0.19); //Archers contre cavalerie légère
                                att_flancgauche_troupes[4] = att_flancgauche_troupes[4] - (pertes_flanc_gauche_att * 0.19); //Archers contre cavalerie lourde
                                att_flancgauche_troupes[5] = att_flancgauche_troupes[5] - (pertes_flanc_gauche_att * 0.19); //Archers contre piquiers

                                    //flanc gauche défenseurs
                                def_flancgauche_troupes[0] = def_flancgauche_troupes[0] - (pertes_flanc_gauche_def * 0.05); //Archers contre archers
                                def_flancgauche_troupes[1] = def_flancgauche_troupes[1] - (pertes_flanc_gauche_def * 0.19); //Archers contre infanterie légère
                                def_flancgauche_troupes[2] = def_flancgauche_troupes[2] - (pertes_flanc_gauche_def * 0.19); //Archers contre infanterie lourde
                                def_flancgauche_troupes[3] = def_flancgauche_troupes[3] - (pertes_flanc_gauche_def * 0.19); //Archers contre cavalerie légère
                                def_flancgauche_troupes[4] = def_flancgauche_troupes[4] - (pertes_flanc_gauche_def * 0.19); //Archers contre cavalerie lourde
                                def_flancgauche_troupes[5] = def_flancgauche_troupes[5] - (pertes_flanc_gauche_def * 0.19); //Archers contre piquiers

                                
                                    //flanc central attaquant
                                att_flanccentral_troupes[0] = att_flanccentral_troupes[0] - (pertes_flanc_central_att * 0.05); //Archers contre archers
                                att_flanccentral_troupes[1] = att_flanccentral_troupes[1] - (pertes_flanc_central_att * 0.19); //Archers contre infanterie légère
                                att_flanccentral_troupes[2] = att_flanccentral_troupes[2] - (pertes_flanc_central_att * 0.19); //Archers contre infanterie lourde
                                att_flanccentral_troupes[3] = att_flanccentral_troupes[3] - (pertes_flanc_central_att * 0.19); //Archers contre cavalerie légère
                                att_flanccentral_troupes[4] = att_flanccentral_troupes[4] - (pertes_flanc_central_att * 0.19); //Archers contre cavalerie lourde
                                att_flanccentral_troupes[5] = att_flanccentral_troupes[5] - (pertes_flanc_central_att * 0.19); //Archers contre piquiers
    
                                    //flanc central défenseurs
                                def_flanccentral_troupes[0] = def_flanccentral_troupes[0] - (pertes_flanc_central_def * 0.05); //Archers contre archers
                                def_flanccentral_troupes[1] = def_flanccentral_troupes[1] - (pertes_flanc_central_def * 0.19); //Archers contre infanterie légère
                                def_flanccentral_troupes[2] = def_flanccentral_troupes[2] - (pertes_flanc_central_def * 0.19); //Archers contre infanterie lourde
                                def_flanccentral_troupes[3] = def_flanccentral_troupes[3] - (pertes_flanc_central_def * 0.19); //Archers contre cavalerie légère
                                def_flanccentral_troupes[4] = def_flanccentral_troupes[4] - (pertes_flanc_central_def * 0.19); //Archers contre cavalerie lourde
                                def_flanccentral_troupes[5] = def_flanccentral_troupes[5] - (pertes_flanc_central_def * 0.19); //Archers contre piquiers


                                    //flanc droit attaquant
                                att_flancdroit_troupes[0] = att_flancdroit_troupes[0] - (pertes_flanc_droit_att * 0.05); //Archers contre archers
                                att_flancdroit_troupes[1] = att_flancdroit_troupes[1] - (pertes_flanc_droit_att * 0.19); //Archers contre infanterie légère
                                att_flancdroit_troupes[2] = att_flancdroit_troupes[2] - (pertes_flanc_droit_att * 0.19); //Archers contre infanterie lourde
                                att_flancdroit_troupes[3] = att_flancdroit_troupes[3] - (pertes_flanc_droit_att * 0.19); //Archers contre cavalerie légère
                                att_flancdroit_troupes[4] = att_flancdroit_troupes[4] - (pertes_flanc_droit_att * 0.19); //Archers contre cavalerie lourde
                                att_flancdroit_troupes[5] = att_flancdroit_troupes[5] - (pertes_flanc_droit_att * 0.19); //Archers contre piquiers
    
                                    //flanc droit défenseurs
                                def_flancdroit_troupes[0] = def_flancdroit_troupes[0] - (pertes_flanc_droit_def * 0.05); //Archers contre archers
                                def_flancdroit_troupes[1] = def_flancdroit_troupes[1] - (pertes_flanc_droit_def * 0.19); //Archers contre infanterie légère
                                def_flancdroit_troupes[2] = def_flancdroit_troupes[2] - (pertes_flanc_droit_def * 0.19); //Archers contre infanterie lourde
                                def_flancdroit_troupes[3] = def_flancdroit_troupes[3] - (pertes_flanc_droit_def * 0.19); //Archers contre cavalerie légère
                                def_flancdroit_troupes[4] = def_flancdroit_troupes[4] - (pertes_flanc_droit_def * 0.19); //Archers contre cavalerie lourde
                                def_flancdroit_troupes[5] = def_flancdroit_troupes[5] - (pertes_flanc_droit_def * 0.19); //Archers contre piquiers
    
                                message.channel.send(`ATT: ${att_flancgauche_troupes.join(' - ')} \n${att_flanccentral_troupes.join(' - ')} \n${att_flancdroit_troupes.join(' - ')}`);
                                message.channel.send(`DEF: ${def_flancgauche_troupes.join(' - ')} \n${def_flanccentral_troupes.join(' - ')} \n${def_flancdroit_troupes.join(' - ')}`);

                        */

                                // Définition des ratios spécifiques à chaque type de troupe
                                

                                // Fonction pour mettre à jour les troupes en fonction des pertes
                                function mettreAJourTroupes(attTroupes, defTroupes, pertes, ratios) {
                                    for (let i = 0; i < 6; i++) {
                                        let nouvelleValeurAtt = attTroupes[i] -= pertes.att * ratios[i];
                                        let nouvelleValeurDef = defTroupes[i] -= pertes.def * ratios[i];

                                        attTroupes[i] = Math.max(nouvelleValeurAtt, 0);
                                        defTroupes[i] = Math.max(nouvelleValeurDef, 0);
                                    }
                                }

                                // Exemple d'utilisation pour le flanc gauche
                                mettreAJourTroupes(att_flancgauche_troupes, def_flancgauche_troupes, pertesFlancGauche, ratiosParTypeArchers);
                                // Exemple d'utilisation pour le flanc central
                                mettreAJourTroupes(att_flanccentral_troupes, def_flanccentral_troupes, pertesFlancCentral, ratiosParTypeArchers);
                                // Exemple d'utilisation pour le flanc droit
                                mettreAJourTroupes(att_flancdroit_troupes, def_flancdroit_troupes, pertesFlancDroit, ratiosParTypeArchers);

                                //message.channel.send(`ATT:\nGAUCHE : ${att_flancgauche_troupes.join(' - ')} \nCENTRAL : ${att_flanccentral_troupes.join(' - ')} \nDROIT : ${att_flancdroit_troupes.join(' - ')}`);
                                //message.channel.send(`DEF:\nGAUCHE : ${def_flancgauche_troupes.join(' - ')} \nCENTRAL : ${def_flanccentral_troupes.join(' - ')} \nDROIT : ${def_flancdroit_troupes.join(' - ')}`);



                        //*Phase 2 - Cavalerie Légère et Lourde + Piquiers [3] [4] et [5]

                        //*Cavalerie légère
                            pertesFlancDroit = calculerPertes(3, att_flancgauche_troupes, def_flancdroit_troupes, att_puissancetroupe_flancgauche, def_puissancetroupe_flancdroit);
                            pertesFlancCentral = calculerPertes(3, att_flanccentral_troupes, def_flanccentral_troupes, att_puissancetroupe_flanccentral, def_puissancetroupe_flanccentral);
                            pertesFlancGauche = calculerPertes(3, att_flancdroit_troupes, def_flancgauche_troupes, att_puissancetroupe_flancdroit, def_puissancetroupe_flancgauche);

                            //message.channel.send(`[DEBUG] PHASE-2-1 | Pertes Défense: flanc droit: ${pertesFlancDroit.def} | flanc central: ${pertesFlancCentral.def} | flanc gauche: ${pertesFlancGauche.def}`)
                            //message.channel.send(`[DEBUG] Phase-2-1 | Pertes Attaquants: flanc droit: ${pertesFlancDroit.att} | flanc central: ${pertesFlancCentral.att} | flanc gauche: ${pertesFlancGauche.att}`)


                            pertes_flanc_gauche_att = pertesFlancGauche.att;
                            pertes_flanc_gauche_def = pertesFlancGauche.def;

                            pertes_flanc_central_att = pertesFlancCentral.att;
                            pertes_flanc_central_def = pertesFlancCentral.def;

                            pertes_flanc_droit_att = pertesFlancDroit.att;
                            pertes_flanc_droit_def = pertesFlancDroit.def;

                            // Exemple d'utilisation pour le flanc gauche
                            mettreAJourTroupes(att_flancgauche_troupes, def_flancgauche_troupes, pertesFlancGauche, ratiosParTypeCavalerieLegere);
                            // Exemple d'utilisation pour le flanc central
                            mettreAJourTroupes(att_flanccentral_troupes, def_flanccentral_troupes, pertesFlancCentral, ratiosParTypeCavalerieLegere);
                            // Exemple d'utilisation pour le flanc droit
                            mettreAJourTroupes(att_flancdroit_troupes, def_flancdroit_troupes, pertesFlancDroit, ratiosParTypeCavalerieLegere);

                            //message.channel.send(`ATT: ${att_flancgauche_troupes.join(' - ')} \n${att_flanccentral_troupes.join(' - ')} \n${att_flancdroit_troupes.join(' - ')}`);
                            //message.channel.send(`DEF: ${def_flancgauche_troupes.join(' - ')} \n${def_flanccentral_troupes.join(' - ')} \n${def_flancdroit_troupes.join(' - ')}`);
                            

                            //*Cavalerie lourde

                            pertesFlancDroit = calculerPertes(4, att_flancgauche_troupes, def_flancdroit_troupes, att_puissancetroupe_flancgauche, def_puissancetroupe_flancdroit);
                            pertesFlancCentral = calculerPertes(4, att_flanccentral_troupes, def_flanccentral_troupes, att_puissancetroupe_flanccentral, def_puissancetroupe_flanccentral);
                            pertesFlancGauche = calculerPertes(4, att_flancdroit_troupes, def_flancgauche_troupes, att_puissancetroupe_flancdroit, def_puissancetroupe_flancgauche);

                           // message.channel.send(`[DEBUG] PHASE-2-2 | Pertes Défense: flanc droit: ${pertesFlancDroit.def} | flanc central: ${pertesFlancCentral.def} | flanc gauche: ${pertesFlancGauche.def}`)
                           // message.channel.send(`[DEBUG] Phase-2-2 | Pertes Attaquants: flanc droit: ${pertesFlancDroit.att} | flanc central: ${pertesFlancCentral.att} | flanc gauche: ${pertesFlancGauche.att}`)


                            pertes_flanc_gauche_att = pertesFlancGauche.att;
                            pertes_flanc_gauche_def = pertesFlancGauche.def;

                            pertes_flanc_central_att = pertesFlancCentral.att;
                            pertes_flanc_central_def = pertesFlancCentral.def;

                            pertes_flanc_droit_att = pertesFlancDroit.att;
                            pertes_flanc_droit_def = pertesFlancDroit.def;

                            // Exemple d'utilisation pour le flanc gauche
                            mettreAJourTroupes(att_flancgauche_troupes, def_flancgauche_troupes, pertesFlancGauche, ratiosParTypeCavalerieLourde);
                            // Exemple d'utilisation pour le flanc central
                            mettreAJourTroupes(att_flanccentral_troupes, def_flanccentral_troupes, pertesFlancCentral, ratiosParTypeCavalerieLourde);
                            // Exemple d'utilisation pour le flanc droit
                            mettreAJourTroupes(att_flancdroit_troupes, def_flancdroit_troupes, pertesFlancDroit, ratiosParTypeCavalerieLourde);

                            console.log(`ATT: ${att_flancgauche_troupes.join(' - ')} \n${att_flanccentral_troupes.join(' - ')} \n${att_flancdroit_troupes.join(' - ')}`);
                            console.log(`DEF: ${def_flancgauche_troupes.join(' - ')} \n${def_flanccentral_troupes.join(' - ')} \n${def_flancdroit_troupes.join(' - ')}`);
                            

                            //*Piquiers

                            pertesFlancDroit = calculerPertes(5, att_flancgauche_troupes, def_flancdroit_troupes, att_puissancetroupe_flancgauche, def_puissancetroupe_flancdroit);
                            pertesFlancCentral = calculerPertes(5, att_flanccentral_troupes, def_flanccentral_troupes, att_puissancetroupe_flanccentral, def_puissancetroupe_flanccentral);
                            pertesFlancGauche = calculerPertes(5, att_flancdroit_troupes, def_flancgauche_troupes, att_puissancetroupe_flancdroit, def_puissancetroupe_flancgauche);

                            //message.channel.send(`[DEBUG] PHASE-2-3 | Pertes Défense: flanc droit: ${pertesFlancDroit.def} | flanc central: ${pertesFlancCentral.def} | flanc gauche: ${pertesFlancGauche.def}`)
                            //message.channel.send(`[DEBUG] Phase-2-3 | Pertes Attaquants: flanc droit: ${pertesFlancDroit.att} | flanc central: ${pertesFlancCentral.att} | flanc gauche: ${pertesFlancGauche.att}`)


                            pertes_flanc_gauche_att = pertesFlancGauche.att;
                            pertes_flanc_gauche_def = pertesFlancGauche.def;

                            pertes_flanc_central_att = pertesFlancCentral.att;
                            pertes_flanc_central_def = pertesFlancCentral.def;

                            pertes_flanc_droit_att = pertesFlancDroit.att;
                            pertes_flanc_droit_def = pertesFlancDroit.def;

                            // Exemple d'utilisation pour le flanc gauche
                            mettreAJourTroupes(att_flancgauche_troupes, def_flancgauche_troupes, pertesFlancGauche, ratiosParTypePiquiers);
                            // Exemple d'utilisation pour le flanc central
                            mettreAJourTroupes(att_flanccentral_troupes, def_flanccentral_troupes, pertesFlancCentral, ratiosParTypePiquiers);
                            // Exemple d'utilisation pour le flanc droit
                            mettreAJourTroupes(att_flancdroit_troupes, def_flancdroit_troupes, pertesFlancDroit, ratiosParTypePiquiers);

                            //message.channel.send(`ATT: ${att_flancgauche_troupes.join(' - ')} \n${att_flanccentral_troupes.join(' - ')} \n${att_flancdroit_troupes.join(' - ')}`);
                            //message.channel.send(`DEF: ${def_flancgauche_troupes.join(' - ')} \n${def_flanccentral_troupes.join(' - ')} \n${def_flancdroit_troupes.join(' - ')}`);
                            


                                //calcul attaquant flanc gauche sur flanc droite défenseurs

                                //calcul défenseurs flanc gauche sur flanc droite attaquants

                                //calcul attaquant flanc central sur flanc central défenseurs

                                //calcul défenseurs flanc central sur flanc central attaquants

                                //calcul attaquant flanc droit sur flanc gauche défenseurs

                                //calcul défenseurs flanc droit sur flanc droit attaquant

                                //réduction attaquant et défenseurs pour chaque flancs

                            //*Phase 3 - Infanterie [1] [2]

                            //*Infanterie Légère

                            pertesFlancDroit = calculerPertes(1, att_flancgauche_troupes, def_flancdroit_troupes, att_puissancetroupe_flancgauche, def_puissancetroupe_flancdroit);
                            pertesFlancCentral = calculerPertes(1, att_flanccentral_troupes, def_flanccentral_troupes, att_puissancetroupe_flanccentral, def_puissancetroupe_flanccentral);
                            pertesFlancGauche = calculerPertes(1, att_flancdroit_troupes, def_flancgauche_troupes, att_puissancetroupe_flancdroit, def_puissancetroupe_flancgauche);

                            //message.channel.send(`[DEBUG] PHASE-3-1 | Pertes Défense: flanc droit: ${pertesFlancDroit.def} | flanc central: ${pertesFlancCentral.def} | flanc gauche: ${pertesFlancGauche.def}`)
                            //message.channel.send(`[DEBUG] Phase-3-1 | Pertes Attaquants: flanc droit: ${pertesFlancDroit.att} | flanc central: ${pertesFlancCentral.att} | flanc gauche: ${pertesFlancGauche.att}`)


                            pertes_flanc_gauche_att = pertesFlancGauche.att;
                            pertes_flanc_gauche_def = pertesFlancGauche.def;

                            pertes_flanc_central_att = pertesFlancCentral.att;
                            pertes_flanc_central_def = pertesFlancCentral.def;

                            pertes_flanc_droit_att = pertesFlancDroit.att;
                            pertes_flanc_droit_def = pertesFlancDroit.def;

                            // Exemple d'utilisation pour le flanc gauche
                            mettreAJourTroupes(att_flancgauche_troupes, def_flancgauche_troupes, pertesFlancGauche, ratiosParTypeInfanterieLegere);
                            // Exemple d'utilisation pour le flanc central
                            mettreAJourTroupes(att_flanccentral_troupes, def_flanccentral_troupes, pertesFlancCentral, ratiosParTypeInfanterieLegere);
                            // Exemple d'utilisation pour le flanc droit
                            mettreAJourTroupes(att_flancdroit_troupes, def_flancdroit_troupes, pertesFlancDroit, ratiosParTypeInfanterieLegere);

                            //message.channel.send(`ATT: ${att_flancgauche_troupes.join(' - ')} \n${att_flanccentral_troupes.join(' - ')} \n${att_flancdroit_troupes.join(' - ')}`);
                            //message.channel.send(`DEF: ${def_flancgauche_troupes.join(' - ')} \n${def_flanccentral_troupes.join(' - ')} \n${def_flancdroit_troupes.join(' - ')}`);
                            

                            //*Infanterie Lourde

                            pertesFlancDroit = calculerPertes(2, att_flancgauche_troupes, def_flancdroit_troupes, att_puissancetroupe_flancgauche, def_puissancetroupe_flancdroit);
                            pertesFlancCentral = calculerPertes(2, att_flanccentral_troupes, def_flanccentral_troupes, att_puissancetroupe_flanccentral, def_puissancetroupe_flanccentral);
                            pertesFlancGauche = calculerPertes(2, att_flancdroit_troupes, def_flancgauche_troupes, att_puissancetroupe_flancdroit, def_puissancetroupe_flancgauche);

                            //message.channel.send(`[DEBUG] PHASE-3-2 | Pertes Défense: flanc droit: ${pertesFlancDroit.def} | flanc central: ${pertesFlancCentral.def} | flanc gauche: ${pertesFlancGauche.def}`)
                            //message.channel.send(`[DEBUG] Phase-3-2 | Pertes Attaquants: flanc droit: ${pertesFlancDroit.att} | flanc central: ${pertesFlancCentral.att} | flanc gauche: ${pertesFlancGauche.att}`)


                            pertes_flanc_gauche_att = pertesFlancGauche.att;
                            pertes_flanc_gauche_def = pertesFlancGauche.def;

                            pertes_flanc_central_att = pertesFlancCentral.att;
                            pertes_flanc_central_def = pertesFlancCentral.def;

                            pertes_flanc_droit_att = pertesFlancDroit.att;
                            pertes_flanc_droit_def = pertesFlancDroit.def;

                            // Exemple d'utilisation pour le flanc gauche
                            mettreAJourTroupes(att_flancgauche_troupes, def_flancgauche_troupes, pertesFlancGauche, ratiosParTypeInfanterieLourde);
                            // Exemple d'utilisation pour le flanc central
                            mettreAJourTroupes(att_flanccentral_troupes, def_flanccentral_troupes, pertesFlancCentral, ratiosParTypeInfanterieLourde);
                            // Exemple d'utilisation pour le flanc droit
                            mettreAJourTroupes(att_flancdroit_troupes, def_flancdroit_troupes, pertesFlancDroit, ratiosParTypeInfanterieLourde);

                            //message.channel.send(`ATT: ${att_flancgauche_troupes.join(' - ')} \n${att_flanccentral_troupes.join(' - ')} \n${att_flancdroit_troupes.join(' - ')}`);
                            //message.channel.send(`DEF: ${def_flancgauche_troupes.join(' - ')} \n${def_flanccentral_troupes.join(' - ')} \n${def_flancdroit_troupes.join(' - ')}`);
                            



                                //calcul attaquant flanc gauche sur flanc droite défenseurs

                                //calcul défenseurs flanc gauche sur flanc droite attaquants

                                //calcul attaquant flanc central sur flanc central défenseurs

                                //calcul défenseurs flanc central sur flanc central attaquants

                                //calcul attaquant flanc droit sur flanc gauche défenseurs

                                //calcul défenseurs flanc droit sur flanc droit attaquant

                                //réduction attaquant et défenseurs pour chaque flancs

                            //* Phase 4 - Poursuite : [ALL]

                            /*message.channel.send(`Résumé avant Phase-4 : Poursuite 
                            

                            **Attaquants**
                            
                            
                            **Flanc Gauche :**
                            
                            Archers ${att_flancgauche_troupes[0]}
                            
                            Infanterie Légère ${att_flancgauche_troupes[1]}
                            
                            Infanterie Lourde ${att_flancgauche_troupes[2]}
                            
                            Cavalerie Légère ${att_flancgauche_troupes[3]}
                            
                            Cavalerie Lourde ${att_flancgauche_troupes[4]}
                            
                            Piquiers ${att_flancgauche_troupes[5]}
                            
                            
                            **Flanc Central :**
                            
                            Archers ${att_flanccentral_troupes[0]}
                            
                            Infanterie Légère ${att_flanccentral_troupes[1]}
                            
                            Infanterie Lourde ${att_flanccentral_troupes[2]}
                            
                            Cavalerie Légère ${att_flanccentral_troupes[3]}
                            
                            Cavalerie Lourde ${att_flanccentral_troupes[4]}
                            
                            Piquiers ${att_flanccentral_troupes[5]}
                            
                            
                            **Flanc Droit :**
                            
                            Archers ${att_flancdroit_troupes[0]}
                            
                            Infanterie Légère ${att_flancdroit_troupes[1]}
                            
                            Infanterie Lourde ${att_flancdroit_troupes[2]}
                            
                            Cavalerie Légère ${att_flancdroit_troupes[3]}
                            
                            Cavalerie Lourde ${att_flancdroit_troupes[4]}
                            
                            Piquiers ${att_flancdroit_troupes[5]}
                            
                            `)

                            message.channel.send(`Résumé avant Phase-4 : Poursuite 
                            
                            
                            **Défenseurs**
                            
                            
                            **Flanc Gauche :**
                            
                            Archers ${def_flancgauche_troupes[0]}
                            
                            Infanterie Légère ${def_flancgauche_troupes[1]}
                            
                            Infanterie Lourde ${def_flancgauche_troupes[2]}
                            
                            Cavalerie Légère ${def_flancgauche_troupes[3]}
                            
                            Cavalerie Lourde ${def_flancgauche_troupes[4]}
                            
                            Piquiers ${def_flancgauche_troupes[5]}
                            
                            
                            **Flanc Central :**
                            
                            Archers ${def_flanccentral_troupes[0]}
                            
                            Infanterie Légère ${def_flanccentral_troupes[1]}
                            
                            Infanterie Lourde ${def_flanccentral_troupes[2]}
                            
                            Cavalerie Légère ${def_flanccentral_troupes[3]}
                            
                            Cavalerie Lourde ${def_flanccentral_troupes[4]}
                            
                            Piquiers ${def_flanccentral_troupes[5]}
                            
                            
                            **Flanc Droit :**
                            
                            Archers ${def_flancdroit_troupes[0]}
                            
                            Infanterie Légère ${def_flancdroit_troupes[1]}
                            
                            Infanterie Lourde ${def_flancdroit_troupes[2]}
                            
                            Cavalerie Légère ${def_flancdroit_troupes[3]}
                            
                            Cavalerie Lourde ${def_flancdroit_troupes[4]}
                            
                            Piquiers ${def_flancdroit_troupes[5]}
                            
                            `)*/


                            //armées APRES les combats des premières phases
                            let att_new_fullarmy = [
                                Math.round(att_flancgauche_troupes[0] + att_flanccentral_troupes[0] + att_flancdroit_troupes[0]),
                                Math.round(att_flancgauche_troupes[1] + att_flanccentral_troupes[1] + att_flancdroit_troupes[1]),
                                Math.round(att_flancgauche_troupes[2] + att_flanccentral_troupes[2] + att_flancdroit_troupes[2]),
                                Math.round(att_flancgauche_troupes[3] + att_flanccentral_troupes[3] + att_flancdroit_troupes[3]),
                                Math.round(att_flancgauche_troupes[4] + att_flanccentral_troupes[4] + att_flancdroit_troupes[4]),
                                Math.round(att_flancgauche_troupes[5] + att_flanccentral_troupes[5] + att_flancdroit_troupes[5])
                            ]
                            let att_total_new_fullarmy = att_new_fullarmy.reduce((acc, valeur) => acc + valeur, 0);
                            let def_new_fullarmy = [
                                Math.round(def_flancgauche_troupes[0] + def_flanccentral_troupes[0] + def_flancdroit_troupes[0]),
                                Math.round(def_flancgauche_troupes[1] + def_flanccentral_troupes[1] + def_flancdroit_troupes[1]),
                                Math.round(def_flancgauche_troupes[2] + def_flanccentral_troupes[2] + def_flancdroit_troupes[2]),
                                Math.round(def_flancgauche_troupes[3] + def_flanccentral_troupes[3] + def_flancdroit_troupes[3]),
                                Math.round(def_flancgauche_troupes[4] + def_flanccentral_troupes[4] + def_flancdroit_troupes[4]),
                                Math.round(def_flancgauche_troupes[5] + def_flanccentral_troupes[5] + def_flancdroit_troupes[5])
                            ]
                            let def_total_new_fullarmy = def_new_fullarmy.reduce((acc, valeur) => acc + valeur, 0);




                            console.log("ATT avant p4: " + att_total_new_fullarmy)
                            console.log("DEF avant p4: " + def_total_new_fullarmy)

                            /*
                            function calculerPertesFullArmy(att_troupes, def_troupes, att_puissance, def_puissance) {
                                let pertes_att = 0;
                                let pertes_def = 0;

                                //fait type chaque unités
                                for(let type = 0; type < 6; type++) {
                                    //Noter que les [0] sont les "archers". [1] serait l'infanterie légère etc...
                                    for (let w = 0; w < att_troupes[type]; w++) {
                                        pertes_def += att_puissance[type] * ratios_units[type];
                                    }
    
                                    for (let w = 0; w < def_troupes[type]; w++) {
                                        pertes_att += def_puissance[type] * ratios_units[type];
                                    }
                                }

                                return { att: pertes_att, def: pertes_def };
                            }*/

                            //tant qu'une des factions n'a pas plus d'unités
                            //?En bêta peut être que le maître de faction pourra choisir quand se retirer pour pas perdre trop d'unité. s'il atteint cette somme il a perdu.
                            //?C'est bien sur risqué mais c'est un choix qu'on laisse

                            /*let p4_pertes_attaquants = [0, 0, 0, 0, 0, 0];
                            let p4_pertes_defenseurs = [0, 0, 0, 0, 0, 0];*/
                            let p4_pertes_attaquants = 0;
                            let p4_pertes_defenseurs = 0;
                            let iter = 0;
                            //Pertes total à retirer aux unités restantes !
                            let att_total_pertes = 0;
                            let def_total_pertes = 0;

                            const all_ratios_per_type = [ratiosParTypeArchers, ratiosParTypeInfanterieLegere, ratiosParTypeInfanterieLourde, ratiosParTypeCavalerieLegere, ratiosParTypeCavalerieLourde, ratiosParTypePiquiers]


                            while(att_total_new_fullarmy > 0 && def_total_new_fullarmy > 0) {
                                iter++;
                                //fait chaque unités
                                //for(let c = 0; c < 6; c++) {
                                    p4_pertes_defenseurs = att_total_new_fullarmy * client.randomFloat(0.85, 0.975)
                                    p4_pertes_attaquants = def_total_new_fullarmy * client.randomFloat(0.85, 0.975)
                                    

                                    let new_value_att = att_total_new_fullarmy -= p4_pertes_attaquants;
                                    let new_value_def = def_total_new_fullarmy -= p4_pertes_defenseurs;
                                   

                                    // On calcul NON PAS AVEC UN ARRAY (Archer -> Archer | Cavalerie -> Cavalerie etc...) mais sur le TOTAL des troupes
                                    // On enlever proportionnelement à toutes genre diviser par 6 (exemple 2000 pertes = 2000 / 6)

                                    
                                    att_total_new_fullarmy = Math.max(new_value_att, 0);
                                    def_total_new_fullarmy = Math.max(new_value_def, 0);
                                    console.log("[DEBUG] pertes_def : " + p4_pertes_defenseurs + " | pertes att: " + p4_pertes_attaquants)
                                    console.log("[DEBUG] New Value att : " + new_value_att + " | New Value def " + new_value_def)
                                    console.log(`Itération ${iter} : \nATT: ${att_total_new_fullarmy}\nDEF: ${def_total_new_fullarmy}`)

                                    att_total_pertes += p4_pertes_attaquants;
                                    def_total_pertes += p4_pertes_defenseurs;
                                //}
                            }

                            //Enlever les unités perdus
                            function diviserSommeEquitablement(tab, somme) {
                                const valeursNonNulles = tab.filter(val => val > 0);
                                const sommeNonNulles = valeursNonNulles.reduce((acc, val) => acc + val, 0);
                            
                                const ratio = somme / sommeNonNulles;
                            
                                let reste = somme;
                            
                                const resultat = tab.map(val => {
                                    if (val > 0) {
                                        const nouvelleValeur = Math.max(val - val * ratio, 0);
                                        reste -= val - nouvelleValeur;
                                        return Math.round(nouvelleValeur);
                                    }
                                    return 0;
                                });
                            
                                // Répartir le reste sur les valeurs non nulles
                                resultat.forEach((val, index) => {
                                    if (val > 0) {
                                        const ajout = (reste / sommeNonNulles) * val;
                                        resultat[index] = Math.min(val + ajout, val);
                                    }
                                });
                            
                                return resultat;
                            }

                            //modifie le tableau de toutes les unités :
                            att_new_fullarmy = diviserSommeEquitablement(att_new_fullarmy, Math.round(att_total_pertes));
                            def_new_fullarmy = diviserSommeEquitablement(def_new_fullarmy, Math.round(def_total_pertes));
                            
                            console.log("newfullarmy_att: " + att_new_fullarmy.join(` - `));
                            console.log("newfullarmy_def: " + def_new_fullarmy.join(` - `));
                            //ici on a plutôt ce qu'a pas perdu l'armée gagnante ! car la perdante est logiqument à 0.

                            //puis reforme chaque flanc aveec tout ça :
                            function diviserTableau(tableauInitial) {
                                let tableau1 = [0, 0, 0, 0, 0, 0];
                                let tableau2 = [0, 0, 0, 0, 0, 0];
                                let tableau3 = [0, 0, 0, 0, 0, 0];
                            
                                for (let i = 0; i < tableauInitial.length; i++) {
                                   // if (tableauInitial[i] < 6) {
                                   //     tableau2[i] += tableauInitial[i];
                                    //} else {
                                        let quotient = Math.floor(tableauInitial[i] / 3);
                                        let reste = tableauInitial[i] % 3;
                            
                                        tableau1[i] += quotient + (reste >= 1 ? 1 : 0);
                                        tableau2[i] += quotient + (reste >= 2 ? 1 : 0);
                                        tableau3[i] += quotient;
                        
                                        //if(tableauInitial[i] == 1) tableau2[i] += 1;
                                    //}
                                }
                            
                                return [tableau1, tableau2, tableau3];
                            }

                            //Ceci est EN GROS les "Troupes Vivantes", donc un genre de bonus, celles qui n'ont pas été touché. Et doit être ajouter via le additionnerTableau plus bas, au unités en vie après le calcul des dégats !
                            //const tableauInitial = [9, 2, 17, 12, 0, 1];
                            const att_a_rajouter = diviserTableau(att_new_fullarmy);
                            const def_a_rajouter = diviserTableau(def_new_fullarmy);


                            //*calcul des pertes au total par rapport au nombre initial
                            

                            //console.log("UNITS: " + att_jsonarmy[0].units)

                            //const att_initial_army = [att_jsonarmy[0].units, att_jsonarmy[1].units, att_jsonarmy[2].units];
                            //const def_initial_army = [def_jsonarmy[0].units, def_jsonarmy[1].units, def_jsonarmy[2].units];

                            //dis "Pelos Restants" dans le doc de la Guerre Alpha
                            let att_army_final = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
                            let def_army_final = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

                            var attaquant_total_puissance_ran_moyenne = 0;
                            var defenseur_total_puissance_ran_moyenne = 0;


                            //pour chaque type d'unité
                            for(let unit_type = 0; unit_type < 6; unit_type++) {
                                //pour chaque flanc
                                for(let flanc = 0; flanc < 3; flanc++) {
                                    //*FAIT! : SOIT ICI : Ne pas diviser par 3 les xxx_puissance_ran_moyenne, mais juste additinner les puissances ran)
                                                        // (Le nombre total de troupe mortes * Moyenne de leur puissance ran) * 0.25
                                    let att_puissance_ran_moyenne = (att_puissanceran_flancgauche[unit_type] + att_puissanceran_flanccentral[unit_type] + att_puissanceran_flancdroit[unit_type]) / 3;
                                    //!NOTE ATTENTION Ici j'ai "corrigé" je crois un problème en ajoutant "attaquant_total_puissance_ran_moyenne +" qu'il manquait. Je remplaçait donc à chaque type d'unité pour garder que le dernier.
                                    attaquant_total_puissance_ran_moyenne = attaquant_total_puissance_ran_moyenne + (att_puissanceran_flancgauche[unit_type] + att_puissanceran_flanccentral[unit_type] + att_puissanceran_flancdroit[unit_type]);

                                    let calc_morts_att = ((att_initial_army[flanc][unit_type] - att_a_rajouter[flanc][unit_type]) * att_puissance_ran_moyenne) * 0.25;
                                    att_army_final[flanc][unit_type] = Math.round(att_a_rajouter[flanc][unit_type] + calc_morts_att);




                                    let def_puissance_ran_moyenne = (def_puissanceran_flancgauche[unit_type] + def_puissanceran_flanccentral[unit_type] + def_puissanceran_flancdroit[unit_type]) / 3;
                                    defenseur_total_puissance_ran_moyenne = defenseur_total_puissance_ran_moyenne + (def_puissanceran_flancgauche[unit_type] + def_puissanceran_flanccentral[unit_type] + def_puissanceran_flancdroit[unit_type]);

                                    let calc_morts_def = ((def_initial_army[flanc][unit_type] - def_a_rajouter[flanc][unit_type]) * def_puissance_ran_moyenne) * 0.25;
                                    def_army_final[flanc][unit_type] = Math.round(def_a_rajouter[flanc][unit_type] + calc_morts_def);
                                

                                }
                            }   

                            console.log("Attaquants Armée initial : \n" + att_initial_army[0].join(` \n `) + att_initial_army[1].join(` \n `) + att_initial_army[2].join(` \n `) + "\n\n" + "Attaquants Armée Finale : \n" + att_army_final[0].join(` \n `) + att_army_final[1].join(` \n `) + att_army_final[2].join(` \n `) + "\n\n" + "Défenseurs Armée initial : \n" + def_initial_army[0].join(` \n `)  + def_initial_army[1].join(` \n `)  + def_initial_army[2].join(` \n `)  + "\n\n" + "Défenseurs Armée Finale : \n" + def_army_final[0].join(` \n `) + def_army_final[1].join(` \n `) + def_army_final[2].join(` \n `));
                            /*console.log(att_initial_army);
                            console.log(att_army_final);*/
                            
                            


                            //!N'est plus utile je crois, servait principalement à ajouter les unités encore en vie. Sauf qu'elles sont ajouté au dessus.
                            /*function additionnerTableaux(tableau1, tableau2) {
                                var resultat = [];
                            
                                // Vérification si les deux tableaux ont la même longueur
                                if (tableau1.length !== tableau2.length) {
                                    throw new Error("Les tableaux n'ont pas la même longueur");
                                }
                            
                                // Boucle pour additionner les valeurs correspondantes
                                for (var i = 0; i < tableau1.length; i++) {
                                    resultat.push(tableau1[i] + tableau2[i]);
                                }
                            
                                return resultat;
                            }*/

                            //*FAIT (voir le /!) : ça c'est pas très exact mais presque, le att_a_ajouter et def_a_ajouter, considère les unités absolument pas touché donc on les regagne en intégralité.
                            //*FAIT / ce qui fait qu'on doit les donner en BONUS après le calcul des pertes ! eux on en récup 100% en gros
                            //!Déjà executé au dessus
                            /*
                            const att_army_beforeDeathRedux = [additionnerTableaux(att_jsonarmy[0].units, att_a_rajouter[0]), 
                                                               additionnerTableaux(att_jsonarmy[1].units, att_a_rajouter[1]),
                                                               additionnerTableaux(att_jsonarmy[2].units, att_a_rajouter[2])
                                                              ]
                            const def_army_beforeDeathRedux = [additionnerTableaux(def_jsonarmy[0].units, def_a_rajouter[0]),
                                                               additionnerTableaux(def_jsonarmy[1].units, def_a_rajouter[1]),
                                                               additionnerTableaux(def_jsonarmy[2].units, def_a_rajouter[2])
                                                              ]
                                                              */
                              

                            //*Sauvegarder les nouvelles armées dans les fichiers des army des factions.

                            const att_newjson = [
                                {"id":0,"name":"gauche","units":att_army_final[0]},
                                {"id":1,"name":"central","units":att_army_final[1]},
                                {"id":2,"name":"droit","units":att_army_final[2]}
                            ]

                            const def_newjson = [
                                {"id":0,"name":"gauche","units":def_army_final[0]},
                                {"id":1,"name":"central","units":def_army_final[1]},
                                {"id":2,"name":"droit","units":def_army_final[2]}
                            ]

                            const att_contentToWrite = JSON.stringify(att_newjson, null, 2);
                            const def_contentToWrite = JSON.stringify(def_newjson, null, 2);

                            // Écrire dans le fichier
                            fs.writeFile("./assets/guerre/armies/" + faction_attaquant.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "_army.json", att_contentToWrite, 'utf-8', (err) => {
                                if (err) {
                                    console.error('Erreur lors de l\'écriture du fichier :', err);
                                } else {
                                    console.log('Le fichier a été mis à jour avec succès.');
                                }
                            });

                            fs.writeFile("./assets/guerre/armies/" + faction_defenseur.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "_army.json", def_contentToWrite, 'utf-8', (err) => {
                                if (err) {
                                    console.error('Erreur lors de l\'écriture du fichier :', err);
                                } else {
                                    console.log('Le fichier a été mis à jour avec succès.');
                                }
                            });

                            
                            let nom_gagnant = "";
                            let nom_perdant = "";

                            let attaquants_wins = false;
                            let defenseurs_wins = false;
                            console.log("ATT après p4: " + att_total_new_fullarmy)
                            console.log("DEF après p4: " + def_total_new_fullarmy)

                            if(att_total_new_fullarmy > 0) attaquants_wins = true;
                            if(def_total_new_fullarmy > 0) defenseurs_wins = true;

                            if(attaquants_wins == true && defenseurs_wins == false) {
                                console.log("[DEBUG] Les attaquants gagnent: " + faction_attaquant.displayname + " remporte la victoire sur " + faction_defenseur.displayname)
                                //attaquants gagnent
                                //progression guerre + (relatif a la qualité)
                                nom_gagnant = faction_attaquant.displayname;
                                nom_perdant = faction_defenseur.displayname;

                            } else if(attaquants_wins == false && defenseurs_wins == true) {
                                console.log("[DEBUG] Les défenseurs gagnent: " + faction_defenseur.displayname + " remporte la victoire sur " + faction_attaquant.displayname)
                                //défenseurs gagnent
                                //progression guerre - (relatif a la qualité)
                                nom_gagnant = faction_defenseur.displayname;
                                nom_perdant = faction_attaquant.displayname;

                            } else if(attaquants_wins == false && defenseurs_wins == false) {
                                message.channel.send("[DEBUG] Match nul les deux factions se sont entretués il ne reste plus personne. (LOGIQUEMENT MEGA RARE). Veuillez contacter le développeur.")
                                //match nul
                                await i.deferUpdate();
                                collector.stop();
                                return;
                                //aucune progression de guerre ne change
                            } else if(attaquants_wins == true && defenseurs_wins == true) {
                                message.channel.send("[DEBUG] Match nul aucune des factions n'a perdu ses troupes (cette situation ne peut arriver LOGIQUEMENT) Contacter de suite le développeur pour lui faire part du problème")
                                //match nul
                                //aucune progression de guerre ne change
                                await i.deferUpdate();
                                collector.stop();
                                return;
                            } 







                                //*Calcul qualité de guerre
                                //avec cette qualité de guerre on en déduira le score de guerre a donner en positif au gagnant et négatif au perdant !


                            

                            //On récup le nombre total d'unité à la base.
                            let att_total_units = [0, 0, 0, 0, 0, 0]
                            let def_total_units = [0, 0, 0, 0, 0, 0]
                            var NombreTroupes = 0;
                            var TroupesGagnantes = 0;
                            var TroupesPerdantes = 0;

                            for(let tt = 0; tt < 6; tt++) {
                                att_total_units[tt] = Math.round(att_initial_army[0][tt] + att_initial_army[1][tt] + att_initial_army[1][tt])
                                def_total_units[tt] = Math.round(def_initial_army[0][tt] + def_initial_army[1][tt] + def_initial_army[1][tt])

                                NombreTroupes = NombreTroupes + att_total_units[tt] + def_total_units[tt];
                                //NB: Ici ce sont nommées Gagnantes et Perdantes, uniquement pour s'y retrouver avec ce qu'à écrit Draxy.
                                //En réalité, ce ne sont pas les troupes des Gagnants ou perdants, mais des Attaquants et Défenseurs.
                                //REPRECISION : Si en fait il me semble bien que ce que Draxy écrivait par Gangnant et perdant c'est vrai.
                                //C'est pourquoi ci-dessous on vérifie ça avec les wins.

                                if(attaquants_wins == true && defenseurs_wins == false) {
                                    TroupesGagnantes = TroupesGagnantes + att_total_units[tt];
                                    TroupesPerdantes = TroupesPerdantes + def_total_units[tt];
                                } else if(attaquants_wins == false && defenseurs_wins == true) {
                                    TroupesGagnantes = TroupesGagnantes + def_total_units[tt];
                                    TroupesPerdantes = TroupesPerdantes + att_total_units[tt];
                                }
                            }

                            
                            

                            //On récup le prix de toutes ces unités.
                            const units = require('../../../assets/guerre/units.json'); // Importe les données du fichier units.json

                            let att_total_prix_units = [0, 0, 0, 0, 0, 0];
                            let def_total_prix_units = [0, 0, 0, 0, 0, 0];
                            var PrixTroupes = 0;

                            // Parcours chaque entrée dans les tableaux att_initial_army et def_initial_army
                            for (let tt = 0; tt < 6; tt++) {
                                // Pour chaque entrée, calcule le total en multipliant la quantité par le prix d'achat correspondant
                                att_total_prix_units[tt] = Math.round((att_initial_army[0][tt] * units[tt].prix_achat) + (att_initial_army[1][tt] * units[tt].prix_achat) + (att_initial_army[2][tt] * units[tt].prix_achat));
                                def_total_prix_units[tt] = Math.round((def_initial_army[0][tt] * units[tt].prix_achat) + (def_initial_army[1][tt] * units[tt].prix_achat) + (def_initial_army[2][tt] * units[tt].prix_achat));
                                
                                PrixTroupes = PrixTroupes + att_total_prix_units[tt] + def_total_prix_units[tt];
                            }

                            // affiche les résultats
                            console.log("[DEBUG] Total d'unités d'attaque :", att_total_units);
                            console.log("[DEBUG] Total d'unités de défense :", def_total_units);
                            

                            var CoffresBanques = faction_attaquant.bank + faction_defenseur.bank;


                            //*FAIT!: Check ici ce que Draxy m'a dit qu'en fait faut pas que je fasse la Moyenne à l'avance ? VIR LIGNE 951
                            var MoyennePuissanceRan = attaquant_total_puissance_ran_moyenne + defenseur_total_puissance_ran_moyenne;

                            var att_puissances_ran = [att_puissanceran_flancgauche, att_puissanceran_flanccentral, att_puissanceran_flancdroit];
                            var def_puissances_ran = [def_puissanceran_flancgauche, def_puissanceran_flanccentral, def_puissanceran_flancdroit];

                            var all_puissance_ran_nonull = []
                            var final_all_puissance_ran_nonull = 0;

                             

                            for(let flanc = 0; flanc < 3; flanc++) {
                                for(let units = 0; units < 6; units++) {
                                    if(att_initial_army[flanc][units] != 0) {
                                        all_puissance_ran_nonull.push(att_puissances_ran[flanc][units]);
                                    } 
                                    if(def_initial_army[flanc][units] != 0) {
                                        all_puissance_ran_nonull.push(def_puissances_ran[flanc][units]);
                                    }
                                }
                            }

                            all_puissance_ran_nonull.forEach(element => {
                                console.log(element);
                                final_all_puissance_ran_nonull = final_all_puissance_ran_nonull + element;
                            })

                            final_all_puissance_ran_nonull / all_puissance_ran_nonull.length;

                            console.log("[DEBUG] USED PUISSANCE RAN : " + all_puissance_ran_nonull.join(" - ") + "\n FINAL MOYENNE: " + final_all_puissance_ran_nonull + " \nTOTAL LENGTH: " + all_puissance_ran_nonull.length);
                            
                            MoyennePuissanceRan = final_all_puissance_ran_nonull / all_puissance_ran_nonull.length;



                            //*Fait: CHANGER LE MoyennePuissanceRan pour faire le truc que Draxy a dit en DM.
                            //*Fait: Additionner QUE LES randoms où les unités ne sont pas = 0 (supérieur en gros) puis en faire la moyenne (des deux factions, donc max 36 en gros (6unités * 3flancs * 2factions))
                            //*Fait: c'est assez facile j'ai les array de toutes les puissanceRan, et les array de toutes les unités AU DEPART. Suffit de pas prendre celles du Array PuissanceRan avec l'ID du array d'armée où les ID sont à 0
                            //*Fait/ CHUI FATIGUEE ! VRAIMENT ALED ! MAIS T'AS COMPRIS PUTAIN  

                            // les 4 valeurs pour le calcul final
                            var PrixGuerre = (CoffresBanques/4) / PrixTroupes;
                            var RatioPelo = TroupesGagnantes / TroupesPerdantes;
                            //var MoyTotPuissRan = MoyennePuissanceRan / NombreTroupes //*FAIT: DU COUP OUI -> Vérif si du coup plus besoin de diviser par le nombre de troupes ?
                            var MoyTotPuissRan = MoyennePuissanceRan;
                            var ImpCommandant = att_bonuscommandants[0] + att_bonuscommandants[1] + att_bonuscommandants[2] + def_bonuscommandants[0] + def_bonuscommandants[1] + def_bonuscommandants[2];

                            //var WarQuality = MoyTotPuissRan + ImpCommandant / RatioPelo + PrixGuerre
                            var WarQuality = (MoyTotPuissRan + ImpCommandant) / (RatioPelo + PrixGuerre)
                            
                            console.log(`DEBUG :
                            PrixGuerre : ${PrixGuerre}
                            CoffresBanques : ${CoffresBanques}
                            PrixTroupes : ${PrixTroupes}
                            RatioPelo : ${RatioPelo}
                            TroupesGagnantes : ${TroupesGagnantes}
                            TroupesPerdantes : ${TroupesPerdantes}
                            MoyTotPuissRan : ${MoyTotPuissRan}
                            MoyennePuissanceRan : ${MoyennePuissanceRan}
                            NombreTroupes : ${NombreTroupes}
                            ImpCommandant : ${ImpCommandant}
                            att_bonuscommandants : ${att_bonuscommandants.join(" - ")}
                            def_bonuscommandants : ${def_bonuscommandants.join(" - ")}

                            WarQuality : ${WarQuality}
                            `)

                            client.writeLog(`INFOS GUERRE EXECUTÉ PAR ${message.author.tag} (${message.author.id}) :
                            Attaquants : ${faction_attaquant.displayname}
                            Défenseurs : ${faction_defenseur.displayname}
                            PrixGuerre : ${PrixGuerre}
                            CoffresBanques : ${CoffresBanques}
                            PrixTroupes : ${PrixTroupes}
                            RatioPelo : ${RatioPelo}
                            TroupesGagnantes : ${TroupesGagnantes}
                            TroupesPerdantes : ${TroupesPerdantes}
                            MoyTotPuissRan : ${MoyTotPuissRan}
                            MoyennePuissanceRan : ${MoyennePuissanceRan}
                            NombreTroupes : ${NombreTroupes}
                            ImpCommandant : ${ImpCommandant}
                            att_bonuscommandants : ${att_bonuscommandants.join(" - ")}
                            def_bonuscommandants : ${def_bonuscommandants.join(" - ")}

                            WarQuality : ${WarQuality}
                            VictoryPoint (pré-calculés): ${Math.ceil(Math.max(1, Math.min(95, (WarQuality * 2.75))))}
                            `, "GUERRE")

                            
                            

                            console.log("Qualité de la bataille : " + WarQuality);

                            const VictoryPoints = Math.ceil(Math.max(1, Math.min(95, (WarQuality * 2.75))));

                            console.log("Points de victoire pour cette bataille: " + VictoryPoints);



                            //TANTQUE: total_réduction_attaquant <= 0 OU que total_réduction_défenseur <= 0
                                //calcul attaquants trois flanc réunis sur trois flancs réunis défenseurs avec FATIGUE

                                //calcul défenseurs trois flanc réunis sur trois flancs réunis attaquants avec FATIGUE
                            //FIN-TANQUE


                            //*Calcul des dégats :
                            //fait il me semble au dessus ?
                                //On calcul chez l'attaquant et chez l'adversaire la proportion d'unités tués et celles qui sont encore en vie !

                                //et après remettre équitablement en / 3 dans chaque flanc (explication RP: Pour rentrer il garde pas leur formation bien sur)

                            



                            
                        // - Cooldown Battle
                        /*
                         On récupère le nombre total d'unités qui RESTENT par faction. On le multiplie par un random. Et cela donne un cooldown de + on a d'unités en vie plus il faut de temps avant de pouvoir relancer une bataille.
                         C'est une manière un peu grossière mais efficace en Alpha de quantifier la "fatigue" des unités et empêcher de spammer des bataille surtout quand on a beaucoup d'unitéss donc de chance de gagner.
                        */

                        
                        let randomUnitsExhaust = client.randomFloat(11, 15);
                        //*const att_totalArmy = army_attaquant.reduce((acc, obj) => acc + obj.units.reduce((sum, value) => sum + value, 0), 0);
                        //*const def_totalArmy = army_defenseur.reduce((acc, obj) => acc + obj.units.reduce((sum, value) => sum + value, 0), 0);
                        //NOTE: Ci-dessus : obsolète car il prend en coompte les unités restantes AU COMBAT et non en vie. ce qui fait que la perdante est forcément à 0.

                        //Ceci ne sont quee des array d'array il faut les parcourir. Voire ensuite
                        //const att_totalArmy = att_army_final[0] + att_army_final[1] + att_army_final[2];
                        //const def_totalArmy = def_army_final[0] + def_army_final[1] + def_army_final[2];

                        // Initialiser les totaux à 0
                        let att_totalArmy = 0;
                        let def_totalArmy = 0;

                        // Parcourir tous les tableaux et additionner leurs éléments
                        for (let i = 0; i < att_army_final.length; i++) {
                            for (let j = 0; j < att_army_final[i].length; j++) {
                                att_totalArmy += att_army_final[i][j];
                            }
                        }

                        for (let i = 0; i < def_army_final.length; i++) {
                            for (let j = 0; j < def_army_final[i].length; j++) {
                                def_totalArmy += def_army_final[i][j];
                            }
                        }

                        let att_unitsExhaust = Math.floor(randomUnitsExhaust * att_totalArmy) * 1000;
                        let def_unitsExhaust = Math.floor(randomUnitsExhaust * def_totalArmy) * 1000;

                        const NewcurrentDate = new Date();

                        await client.updateFaction(faction_attaquant.name, {cooldown_battle: new Date(NewcurrentDate.getTime() + att_unitsExhaust)});
                        await client.updateFaction(faction_defenseur.name, {cooldown_battle: new Date(NewcurrentDate.getTime() + def_unitsExhaust)});

                        console.log(`[DEBUG] EXHAUST INFO & COOLDOWNS\n\n randomUnitsExhaust:${randomUnitsExhaust} \natt_totalArmy:${att_totalArmy} \ndef_totalArmy:${def_totalArmy} \natt_unitsExhaust:${att_unitsExhaust} \ndef_unitsExhaust:${def_unitsExhaust} \nNewcurrentDate:${NewcurrentDate} \nNewcurrentDateTIME:${NewcurrentDate.getTime()}`)
                        //FAIT: Ajouter l'update des points de victoire
                        //FAIT et corrigé: Vérifier si ça met bien la date à maintenant + le exhaust. Parce qu'on dirait qu'on peut spammer si on a une date loin dans le passé 
                        //par exemple, si on doit attendre genre 10h pour relancer, et qu'on à 30h depuis la dernière bataille, on peut, il me semble faire 3 batailles d'affilé
                        //alors qu'on est juste censé attendre un certains temps calculé ici entre chaque batailles.
                       
                       
                        //*fait: battle


                        //*NOTE: PEUT ÊTRE PAS FAIRE CA
                        //BETA:TODO: Affichage graphique : Faire un affichage en emote/ascii d'un champ de bataille, faire 3/4 étapes qui sont toujours les même peu importe le gagnant.
                        //BETA:*TODO: Et seulement le dernier "tableau" affiche le gagnant qui bat l'adversaire. (un peu comme Layton quand on résout une énigme)

                        let embed_fin_bataille = new EmbedBuilder()
                        .setColor('3C4C66')
                        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
                        .setTitle(`:crossed_swords: Résultats de la Bataille :crossed_swords:`)
                        .setDescription(`La bataille à fait rage ! \nLa faction ${nom_gagnant} remporte la victoire sur ${nom_perdant}.`)
                        .addFields({"name":`${faction_attaquant.displayname}`, "value":"Attaquants", inline:true}, {"name":`${faction_defenseur.displayname}`, "value":"Défenseurs", inline:true}, {"name":"** **", "value":"** **", inline:true})
                        .addFields({"name":"Unités en vie", "value":`${att_totalArmy}`, inline:true}, {"name":"Unités en vie", "value":`${def_totalArmy}`, inline:true}, {"name":"** **", "value":"** **", inline:true});

                        if(nom_gagnant == faction_attaquant.displayname) {
                            if((faction_attaquant.score_guerre + VictoryPoints) > 100) {
                                await client.updateFaction(faction_attaquant.name, {score_guerre: 100});
                                await client.updateFaction(faction_defenseur.name, {score_guerre: -100});
                            } else {
                                await client.updateFaction(faction_attaquant.name, {score_guerre: faction_attaquant.score_guerre + VictoryPoints});
                                await client.updateFaction(faction_defenseur.name, {score_guerre: faction_defenseur.score_guerre - VictoryPoints});
                            }

                            embed_fin_bataille.addFields({"name":"Points de victoire", "value":`+ ${VictoryPoints} :green_circle:`, inline:true}, {"name":"Points de victoire", "value":`− ${VictoryPoints} :red_circle:`, inline:true}, {"name":"** **", "value":"** **", inline:true});
                        } else {
                            if((faction_defenseur.score_guerre + VictoryPoints) > 100) {
                                await client.updateFaction(faction_attaquant.name, {score_guerre: -100});
                                await client.updateFaction(faction_defenseur.name, {score_guerre: 100});
                            } else {
                                await client.updateFaction(faction_attaquant.name, {score_guerre: faction_attaquant.score_guerre - VictoryPoints});
                                await client.updateFaction(faction_defenseur.name, {score_guerre: faction_defenseur.score_guerre + VictoryPoints});
                            }
                            embed_fin_bataille.addFields({"name":"Points de victoire", "value":`− ${VictoryPoints} :red_circle:`, inline:true}, {"name":"Points de victoire", "value":`+ ${VictoryPoints} :green_circle:`, inline:true}, {"name":"** **", "value":"** **", inline:true});
                        }


                        ///await i.deferUpdate();
                        await i.reply({embeds:[embed_fin_bataille], components: []})
                        collector.stop();

                        /*
                        const tableau1 = `:bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow:
                            :knife::dagger::dagger::dagger::dagger::knife::knife::dagger:
                            :racehorse::racehorse::horse::racehorse::racehorse::horse::horse::racehorse:
                            :black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:
                            :black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:
                            :racehorse::racehorse::horse::racehorse::racehorse::horse::horse::racehorse:
                            :knife::dagger::dagger::dagger::dagger::knife::knife::dagger:
                            :bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow::bow_and_arrow:`
    
                            const tableau2 = `:bow_and_arrow::bow_and_arrow::black_large_square::bow_and_arrow::bow_and_arrow::black_large_square::bow_and_arrow::bow_and_arrow:
                            :knife::dagger::black_large_square::dagger::bow_and_arrow::black_large_square::black_large_square::bow_and_arrow:
                            :racehorse::racehorse::black_large_square::horse::dagger::knife::knife::dagger:
                            :dagger::black_large_square::horse::racehorse::dagger::horse::racehorse::black_large_square:
                            :bow_and_arrow::black_large_square::horse::horse::black_large_square::racehorse::horse::horse:
                            :racehorse::racehorse::black_large_square::black_large_square::racehorse::black_large_square::racehorse::black_large_square:
                            :black_large_square::knife::dagger::dagger::knife::black_large_square::knife::dagger:
                            :bow_and_arrow::black_large_square::bow_and_arrow::bow_and_arrow::black_large_square::bow_and_arrow::bow_and_arrow::bow_and_arrow:`
    
                            const tableau3 = `:black_large_square::black_large_square::black_large_square::black_large_square::bow_and_arrow::black_large_square::black_large_square::black_large_square:
                            :knife::horse::black_large_square::dagger::bow_and_arrow::black_large_square::black_large_square::bow_and_arrow:
                            :black_large_square::racehorse::black_large_square::horse::black_large_square::black_large_square::dagger::black_large_square:
                            :dagger::black_large_square::dagger::black_large_square::black_large_square::racehorse::bow_and_arrow::black_large_square:
                            :bow_and_arrow::black_large_square::bow_and_arrow::black_large_square::black_large_square::horse::knife::racehorse:
                            :racehorse::racehorse::black_large_square::bow_and_arrow::black_large_square::bow_and_arrow::bow_and_arrow::racehorse:
                            :black_large_square::knife::black_large_square::black_large_square::black_large_square::black_large_square::knife::dagger:
                            :horse::horse::bow_and_arrow::bow_and_arrow::black_large_square::black_large_square::black_large_square::black_large_square:`
    
                            const tableau4_win_att = `:black_large_square::black_large_square::black_large_square::black_large_square::flag_white::black_large_square::black_large_square::black_large_square:
                            :black_large_square::dagger::black_large_square::black_large_square::bow_and_arrow::black_large_square::black_large_square::black_large_square:
                            :black_large_square::racehorse::black_large_square::horse::black_large_square::bow_and_arrow::black_large_square::black_large_square:
                            :black_large_square::bow_and_arrow::black_large_square::black_large_square::black_large_square::knife::dagger::black_large_square:
                            :dagger::black_large_square::black_large_square::black_large_square::black_large_square::bow_and_arrow::black_large_square::black_large_square:
                            :black_large_square::horse::dagger::black_large_square::black_large_square::black_large_square::racehorse::black_large_square:
                            :black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:
                            :black_large_square::black_large_square::black_large_square::triangular_flag_on_post::black_large_square::black_large_square::black_large_square::black_large_square:`
    
                            const tableau4_win_def = `:black_large_square::black_large_square::black_large_square::triangular_flag_on_post::black_large_square::black_large_square::black_large_square::black_large_square:
                            :black_large_square::dagger::black_large_square::black_large_square::bow_and_arrow::black_large_square::black_large_square::black_large_square:
                            :black_large_square::racehorse::black_large_square::horse::black_large_square::bow_and_arrow::black_large_square::black_large_square:
                            :black_large_square::bow_and_arrow::black_large_square::black_large_square::black_large_square::knife::dagger::black_large_square:
                            :dagger::black_large_square::black_large_square::black_large_square::black_large_square::bow_and_arrow::black_large_square::black_large_square:
                            :black_large_square::horse::dagger::black_large_square::black_large_square::black_large_square::racehorse::black_large_square:
                            :black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:
                            :black_large_square::black_large_square::black_large_square::black_large_square::flag_white::black_large_square::black_large_square::black_large_square:`

                            setInterval(showBattle, 2000); //2000ms = 2s

                            const tableaux = [tableau1, tableau2, tableau3, tableau4_win_att, tableau4_win_def]
                            var up = 0;

                        const showBattle = () => {
                            
                            if(up < 3) {
                                message.channel.send(tableaux[up]);
                                up++;
                            } else {
                                if(attaquants_wins == true) {
                                    message.channel.send(tableaux[3]);
                                } else {
                                    message.channel.send(tableaux[4]);
                                }

                            }
                        }
                        */

                        
                        
                    } else {
                        await i.reply({embeds:[], content: `Vos unités ne sont pas prêtes au combat. Elles doivent encore récupérer pendant **${Math.floor(cooldown_remain / (1000 * 60 * 60 * 24))}** jours, **${Math.floor(cooldown_remain / (1000*60*60) % 24)}** heures, **${Math.floor(cooldown_remain / (1000*60) % 60)}** minutes et **${Math.floor(cooldown_remain / (1000) % 60)}** secondes`, ephemeral: true, components: []})
                        collector.stop();
                    }
                } else {
                    await i.reply({embeds:[], content: `Vous n'êtes pas en guerre`, ephemeral: true, components: []})
                    collector.stop();
                }
            }
        }
    });

    //assure de vider la mémoire
    await collector.on('end', async i => {
        global.users_use_guerre_cmd[global.users_use_guerre_cmd.indexOf(message.author.id)] = "";
        return;
    });
   
    
//Affichage message
    if(faction_user.en_guerre == true) { 
        message.channel.send({embeds:[embed_battle], components:[rowMenuBattle]});
    } else {
        message.channel.send({embeds:[embed_battle], components:[]});
        collector.stop();
    }


}

module.exports = {
    bataille
}