const { ActionRowBuilder, ButtonBuilder, MessageCollector, EmbedBuilder, Client } = require("discord.js");
const {PREFIX} = require('../../config');

const metiers = require("../../assets/rpg/metiers/metiers.json");

const casusb = require("../../assets/guerre/casusbelli.json");

const fs = require("fs");

const User = require('../../util/objects/User');



module.exports.run = async (client, message, args, settings, dbUser) => {







    return;

    //TEST POUR AFFICHER LE COMBAT MAIS C'EST ECLATOX UN PEU

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


                            const tableaux = [tableau1, tableau2, tableau3, tableau4_win_att, tableau4_win_def]
                            var up = 0;
                            var msg = message.channel.send("test");
                            var attaquants_wins = true;


                        const showBattle = () => {
                            if(up < 3) {
                                msg = message.channel.send({content:tableaux[up]});
                                up++;
                            } else {
                                if(attaquants_wins == true) {
                                    msg = message.channel.send({content:tableaux[3]});
                                    clearInterval(interval);
                                } else {
                                    msg = message.channel.send({content:tableaux[4]});
                                    clearInterval(interval);
                                }

                            }
                        }

                        var interval = setInterval(showBattle, 2000); //2000ms = 2s

                        

    return;

    //!Version 2 :
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
    
    const tableauInitial = [9, 2, 17, 12, 0, 1];
    const resultats = diviserTableau(tableauInitial);
    
    console.log(resultats[0]);
    console.log(resultats[1]);
    console.log(resultats[2]);

    //!1ER VERSION
    /*function diviserTableau(tableauInitial) {
        let tableau1 = [0, 0, 0, 0, 0, 0]; //gauche
        let tableau2 = [0, 0, 0, 0, 0, 0]; //centre
        let tableau3 = [0, 0, 0, 0, 0, 0]; //droit

        for(let i = 0; i < tableauInitial.length; i++) {
            if(tableauInitial[i] < 6) { //Si c'est en dessous de 6 on s'emmerde pas on met tout dans le flanc central.
                tableau2[i] += tableauInitial[i];
            } else {
                let calc = tableauInitial[i] / 3
                if(Number.isInteger(calc)) {
                    tableau1[i] += calc;
                    tableau2[i] += calc;
                    tableau3[i] += calc;
                } else {
                    tableau1[i] += Math.ceil(calc);
                    tableau2[i] += Math.ceil(calc);
                    tableau3[i] += Math.floor(calc)
                }
            }
        }
        
        return [tableau1, tableau2, tableau3];
    }
    
    const tableauInitial = [9, 0, 16, 12, 0];
    const resultats = diviserTableau(tableauInitial);
    
    console.log(resultats[0]);
    console.log(resultats[1]);
    console.log(resultats[2]);*/

    return;

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
    
    const tableau = [140, 9, 315, 0, 38, 0];
    const sommeTotale = 300;
     
    message.channel.send("value: " + diviserSommeEquitablement(tableau, sommeTotale))

  return;

  message.channel.send('val: ' + Math.ceil(65 / 10000 * 1000) / 1000);
  return;

  //Récupérations des troupes dans chaque flanc des deux armées !
  const att_jsonarmy = [500, 600, 700, 800, 900, 450]
  const def_jsonarmy = [500, 600, 700, 800, 900, 450]
  
  //ce sont les troupes, elles sont modifiables donc (si on veut récup l'original/initial on lit le jsonarmy)
  let att_flancgauche_troupes = att_jsonarmy[0];
  let att_flanccentral_troupes = att_jsonarmy[1];
  let att_flancdroit_troupes = att_jsonarmy[2];

  let def_flancgauche_troupes = def_jsonarmy[0];
  let def_flanccentral_troupes = def_jsonarmy[1];
  let def_flancdroit_troupes = def_jsonarmy[2];

  let pertes_flanc_gauche_att = 3000;
  let pertes_flanc_gauche_def = 3000;

  let pertes_flanc_central_att = 3200;
  let pertes_flanc_central_def = 3200;

  let pertes_flanc_droit_att = 2500;
  let pertes_flanc_droit_def = 2500;
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

  

  message.channel.send(`${att_flancgauche_troupes}
  ${att_flanccentral_troupes}
  ${att_flancdroit_troupes}
  
  ${def_flancgauche_troupes}
  ${def_flanccentral_troupes}
  ${def_flancdroit_troupes}`)*/

  const flancs = ['gauche', 'central', 'droit'];

  for (const flanc of flancs) {
      for (let i = 0; i < 6; i++) {
          const att_troupes = eval(`att_flanc${flanc}_troupes`);
          const def_troupes = eval(`def_flanc${flanc}_troupes`);
          const pertes_att = eval(`pertes_flanc_${flanc}_att`);
          const pertes_def = eval(`pertes_flanc_${flanc}_def`);

          att_troupes[i] -= pertes_att * 0.05;  // Archers contre archers
          att_troupes[i] -= pertes_att * 0.19;  // Archers contre autres troupes

          def_troupes[i] -= pertes_def * 0.05;  // Archers contre archers
          def_troupes[i] -= pertes_def * 0.19;  // Archers contre autres troupes
      }
  }

  message.channel.send(`${att_flancgauche_troupes}
  ${att_flanccentral_troupes}
  ${att_flancdroit_troupes}
  
  ${def_flancgauche_troupes}
  ${def_flanccentral_troupes}
  ${def_flancdroit_troupes}`)



  return;
  message.channel.send(`value: ${client.randomFloat(0.975, 1.025)}`)

  return;

  // Exemple de Points
const Points = 50;

// Diviser par 100000
const resultat = Points / 100000;

// Arrondir à 0.001 près
const resultatArrondi = Math.round(resultat * 1000) / 1000;

// Obtenir l'entier supérieur
//const resultatFinal = Math.ceil(resultatArrondi);

console.log(resultatArrondi);

return;

    message.channel.send("valeur: " + Math.floor(Math.max(0, Math.min(2500, dbUser.piete)) / 2500 * 95));

    return;

    const user = new User(message.member, dbUser); //celui qui execute la commande

    console.log(await user.getMoney());


    return;

    const items = [
        "bleach",
        "disco_ball",
        "flash_tracker",
        "knife",
        "medkit",
        "pepper_spray",
        "quoicouknife",
        "radar",
        "spring",
        "stim_blue",
        "stim_green",
        "stim_pink",
        "stim_purple",
        "stim_white",
        "stim_yellow",
        "stink_bomb",
        "unicorn_plush",
        "utra"
      ]

    items.forEach(e => {
        //message.channel.send()

          fs.writeFile("generated/" + e + ".json", `{
            "parent": "item/generated",
            "textures": {
              "layer0": "incomprehensiblemod:item/` + e + `"
            }
          }`, (err) => {
            if (err) {
              console.error("Une erreur s'est produite lors de l'écriture du fichier : ", err);
            } else {
              console.log(`Le contenu a été écrit dans le fichier ${nomFichier}`);
            }
          });
    })

    

    message.reply("Wesh alors");
    return;
    const factionCible = await client.getFaction("lyomah");
    const faction = await client.getFaction(dbUser.faction);

    await client.addCasusBelli(factionCible, faction, "1")

    return;

    message.channel.send(`Initiale redoutabilité: ${dbUser.redoutabilite}`)
    await client.editPoint(client, message.member, Math.floor(-dbUser.redoutabilite + (dbUser.redoutabilite * 0.90)), "redoutabilite")
    message.channel.send(`maintenant : ${dbUser.redoutabilite}`)

    return;

    function pourcentageDePerte(quantiteOr, A, B) {
        return A * (1 - Math.exp(-B * quantiteOr));
    }
      
      
      const A = 0.2; // plus ce sera grand plus le pourcentage maximal perdu sera élevé
      const B = 0.001; // plus ce sera petit plus la décroissance sera progressive.
      const quantiteOrPersonne1 = 10000; // bank faction1.
      const quantiteOrPersonne2 = 50000; // bank faction2.
      
      const pertePersonne1 = pourcentageDePerte(quantiteOrPersonne1, A, B);
      const pertePersonne2 = pourcentageDePerte(quantiteOrPersonne2, A, B);
      
      console.log(`Personne 1 a ${quantiteOrPersonne1} perd ${pertePersonne1 * 100}% de son or. soit : ${Math.floor(quantiteOrPersonne1 * pertePersonne1)}`);
      console.log(`Personne 2 a ${quantiteOrPersonne2} perd ${pertePersonne2 * 100}% de son or. soit : ${Math.floor(quantiteOrPersonne2 * pertePersonne2)}`);


    return; 
    message.channel.send(`:crossed_swords: La guerre entre **Epsilon** et **Daïros** est terminée ! :crossed_swords:\n\n**Epsilon** a gagné !\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par Daïros. Ce fut une réussite, un pacte de non-agression a également été signé entre les deux factions !\nEEpsilon a gagné beaucoup de redoutabilité et de prestige ainsi que des poyns, volés à la faction adverse ! Tandis que Daïros a perdu, en plus de ces poyns, du prestige et évidemment de la redoutabilité...`)


    return;

    let ep = await client.getFaction("epsilon");
    let al = await client.getFaction("alpha");
    await client.editRelation(ep, al, 0)
    //excepted : arrayalpha: 3 0 0 0 | arrayepsilon = 0 0 4 3

    return;

    // embed_declarerGuerreMenu = new EmbedBuilder()
    //         .setColor('3C4C66')
    //         .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    //         .setTitle(`Déclarer la guerre !`)
    //         .setDescription(`Sélectionnez le casus belli de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
    //         .addFields([
    //             {name:`Cible: XXX`, value:`Titre - Description`}, 
    //             {name:`Cible2: XXX2`, value:`Titre2 - Description2`}, 
    //         ])

    // message.channel.send({embeds:[embed_declarerGuerreMenu]})


    // embed_declarerGuerreMenu = new EmbedBuilder()
    // .setColor('3C4C66')
    // .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    // .setTitle(`Déclarer la guerre !`)
    // .setDescription(`Sélectionnez le casus belli de votre choix avec les flèches et confirmez avec le bouton "Déclarer" lorsque vous êtes sûr de votre décision !\n\n:warning: **Attention** :warning:\nDéclarer une guerre ne peut être annulé sans vous rendre ou sans que l'adversaire n'accepte une paix blanche. `)
    // .addFields([
    //     {name:`** **`, value:`** **`}, 
    //     {name:`${casusb[1].name} • Contre : **Daïros**`, value:`${casusb[1].description}`}, 
    // ])
    
    

    // message.channel.send({embeds:[embed_declarerGuerreMenu]})


    // return;

    

    await client.updateFaction("epsilon", {casusbelli: [{"id":"1","cible":"lyomah"}, {"id":"0","cible":"lyomah"}, {"id":"1","cible":"daïros"}, {"id":"2","cible":"alpha"}]})

    //const faction = await client.getFaction("epsilon");
    //message.channel.send(`data: ${client.filterById(casusb, faction.casusbelli[1].id).name} ${faction.casusbelli[1].cible}`);

    // const faction = await client.getFaction("epsilon");

    // let tmp = faction.casusbelli;

    // tmp.push({"id":"1","cible":"lyomah"});

    // await client.updateFaction("epsilon", {casusbelli: tmp})
    // //const faction = await client.getFaction("epsilon");
    // message.channel.send(`data: ${client.filterById(casusb, faction.casusbelli[1].id).name} ${faction.casusbelli[1].cible}`);

    return;
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`)

    message.channel.send(client.filterById(metiers, 1).description);



    // require("../../util/objects/armes")(client);

    // let poney = new animal("Poulet", 42);
    // message.channel.send(poney.getAge());


    /*let jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    message.reply(jours[new Date().getDay()]);*/

    // si c'est 6 c'est samedi
/*
    const filter = m => (message.author.id === m.author.id);
    var final = `{\n`;

    message.channel.send("ID");
    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
            final = final + `"id" : ${collected.first().content},\n`;
            
            message.channel.send("NAME");
            message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                final = final + `"name" : "${collected.first().content}",\n`;
                    message.channel.send("RARETE");
                    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                        final = final + `"rarete" : ${collected.first().content},\n`;
                            message.channel.send("DESCRIPTION");
                            message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                                final = final + `"description" : "${collected.first().content}",\n`;
                                    message.channel.send("REACTIONS");
                                    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                                        let array_reacts = collected.first().content.split(" ");
                                        let final_array = `[\\${array_reacts[0]}`;
                                        for(let i = 1; i < array_reacts.length; i++) {
                                            final_array = final_array + `, '\\${array_reacts[i]}'`;
                                        }
                                        final_array = final_array + `]`;
                                        final = final + `"reactions" : ${final_array},\n`;
                                        
                                        message.channel.send(final)
                                            
                                    }).catch(() => {
                                            message.reply('timeout.');
                                    });
                            }).catch(() => {
                                    message.reply('timeout.');
                            });
                    }).catch(() => {
                            message.reply('timeout.');
                    });
            }).catch(() => {
                    message.reply('timeout.');
            });

    }).catch(() => {
            message.reply('timeout.');
    }); */


    //if(dbUser.training == true) message.reply("OUI ! D'accord ! Il s'entraine.");

    /*
    client.channels.cache.get("415947202649653249").messages.fetch("930886480895823892")
    .then(message => message.react(`❄️`))
    .catch(console.error); */



    /*let nb_gains = client.randomInt(1, 3);

    for(i=0, i<nb_gains, i++) {
        let id_gain = client.randomInt(1, 3);
        let buffer = id_gain;
        if(id_gain = 0)
    }*/


/* GAINS MULTIPLE ENNEMIS
    //xp = 1, or = 2, piete = 3
    let a = [1, 2, 3];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    let final_array = a.slice(0, client.randomInt(1, 3)).sort();
    let gagner = ` `;
    for(i=0; i<final_array.length; i++) {
        if(final_array[i] == 1) { gagner = gagner + `+50xp`; client.setXp(client, message.member, 50)}
        if(final_array[i] == 2) { gagner = gagner + `+2 or`; client.setOr(client, message.member, 2, message)}
        if(final_array[i] == 3) { gagner = gagner + `+5 piété `; client.editPoint(client, message.member, 5, `piete`)}
        if(i<final_array.length - 1) gagner = gagner + " | ";
    }
    message.channel.send(`${gagner}`);
*/

//message.channel.send(`Coucou`);
// let epsilon = await client.getFaction('epsilon');
// let dairos = await client.getFaction('daïros');
// let lyomah = await client.getFaction('lyomah');
// let alpha = await client.getFaction('alpha');

/*let array = epsilon.joueurs_sur_le_territoire;
array.push(dbUser.userID.toString());
message.channel.send("DBG: " + array);
await client.updateFaction(epsilon.name, {joueurs_sur_le_territoire: array});
*/
//message.channel.send(`${faction.joueurs_sur_le_territoire}`);
//await client.updateFaction(faction, {joueurs_sur_le_territoire: faction.joueurs_sur_le_territoire.push(dbUser.userID)});
//message.channel.send(`Ep: ${epsilon.joueurs_sur_le_territoire} Da: ${dairos.joueurs_sur_le_territoire} Ly: ${lyomah.joueurs_sur_le_territoire} Al: ${alpha.joueurs_sur_le_territoire}`);


            /*let arr = epsilon.joueurs_sur_le_territoire;
            arr = arr.filter(e => e !== dbUser.userID);
            message.channel.send("data: " + arr + " debug: " + dbUser.userID);*/
};
  
module.exports.help = {
    name: "test",
    aliases: ['test'],
    category: "admin",
    desription: "un fichier pour faire des tests rapidos.",
    usage: '',
    wiki: 'https://romar159.github.io/poulerpg.github.io/',
    cooldown: 2,  
    permissions: true,
    args: false
};