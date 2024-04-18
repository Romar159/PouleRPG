//const units_values = require("../../assets/guerre/units.json");

module.exports.run = async (client, message, args) => {
    
    // infatrie légère, infantrie lourde, cavalerie légère, cavalerie lourde, archers, piquiers
    let archers_a1_ran = client.randomInt(100, 750);
    let archers_a2_ran = client.randomInt(100, 750);

    let cavlou_a1_ran = client.randomInt(35, 95);
    let cavlou_a2_ran = client.randomInt(35, 95);

    let army1 = [350, 230, 130, 125, archers_a1_ran, 215];
    let army2 = [410, 125, 210, 95, archers_a2_ran, 325];

    let army1_base = [350, 230, 130, 125, archers_a1_ran, 215];
    let army2_base = [410, 125, 210, 95, archers_a2_ran, 325];

    //durée des tours calculés en fonction de la taille de l'armée
    let size_army1 = army1[0] + army1[1] + army1[2] + army1[3] + army1[4] + army1[5];
    let size_army2 = army2[0] + army2[1] + army2[2] + army2[3] + army2[4] + army2[5];

    let round_duration = Math.round((((size_army1 + size_army2) / 2) % 24) / 2);
    //round_duration = 1; // DEV
   
    message.channel.send(round_duration.toString());

    

    let min_rnd = 2.950;
    let max_rnd = 3.100;

    let quotien_de_fail = 0;
    let neces = 0;
    let calcul_archers_a1 = 0;
    let calcul_archers_a2 = 0;

    let output_a1 = [];
    let output_a2 = [];

    let unique_output = [];

    if(round_duration < 1) round_duration = 1; // on fait au moins 1 tour d'escarmouche.
//!Escarmouche.
    for(let x = 1; x <= round_duration; x++) {
        //message.channel.send("```TOUR " + x + "```");
        archer_atk = units_values[4].attaque;


        //6 -> les six types d'unités
        for(let t = 0; t < 6; t++) {
    /* ARMEE 1 */
            quotien_de_fail = await client.randomFloat(min_rnd, max_rnd);
            neces = archer_atk / units_values[t].defense; // calcul combien d'unité de ce type un archer peu tuer
 
            //nombres_unité_possible_à_tuer multiplié par, entre 40% et 60% des archers, le tout divisé par le quotien de fail.
            calcul_archers_a1 = (neces * (army1[4] * client.randomFloat(0.4, 0.6))) / quotien_de_fail
            if(units_values[t].faible_contre.includes(4)) calcul_archers_a1 * 1.10; //Si l'unité cible se trouve être faible contre l'unité attaquante (archer = 4) on augmente de 10% (d'où le *1.10) la puissance des attaquants
            if(units_values[t].resistant_contre.includes(4)) calcul_archers_a1 * 0.85; // Si l'unité cible se trouve être resistante à l'unité attaquante (archer = 4) on baisse la puissance des attaquants de 15% (d'où le *0.85)

            //OUTPUT DEBUG
            //output_a1.push("ARMEE_1 :\n Atts : " + army1[4] + "\nDéfs **" + units_values[t].name + "** :" + army2[t] + "\nmorts possibles par un archer : " + neces + "\ntués si des dieux : " + (neces * army1[4]) + "\ntués si humains: " + calcul_archers_a1);
            output_a1.push(`**Armée 1** \nInfanterie Légère : **${army1[0]}** \nInfanterie Lourde : **${army1[1]}** \nCavalerie Légère : **${army1[2]}** \nCavalerie Lourde : **${army1[3]}** \nArchers : **${army1[4]}** \nPiquiers : **${army1[5]}** \n`);

    /* ARMEE 2 */
             quotien_de_fail = await client.randomFloat(min_rnd, max_rnd);
             neces = archer_atk / units_values[t].defense; // calcul combien d'unité de ce type un archer peu tuer
  
             //nombres_unité_possible_à_tuer multiplié par, entre 40% et 60% des archers, le tout divisé par le quotien de fail.
             calcul_archers_a2 = (neces * (army2[4] * client.randomFloat(0.4, 0.6))) / quotien_de_fail
             if(units_values[t].faible_contre.includes(4)) calcul_archers_a2 * 1.10; //Si l'unité cible se trouve être faible contre l'unité attaquante (archer = 4) on augmente de 10% (d'où le *1.10) la puissance des attaquants
             if(units_values[t].resistant_contre.includes(4)) calcul_archers_a2 * 0.85; // Si l'unité cible se trouve être resistante à l'unité attaquante (archer = 4) on baisse la puissance des attaquants de 15% (d'où le *0.85)
 
             //OUTPUT DEBUG
             //output_a2.push("ARMEE_2 :\n Atts : " + army2[4] + "\nDéfs **" + units_values[t].name + "** :" + army1[t] + "\nmorts possibles par un archer : " + neces + "\ntués si des dieux : " + (neces * army2[4]) + "\ntués si humains: " + calcul_archers_a2);
             output_a2.push(`**Armée 2** \nInfanterie Légère : **${army2[0]}** \nInfanterie Lourde : **${army2[1]}** \nCavalerie Légère : **${army2[2]}** \nCavalerie Lourde : **${army2[3]}** \nArchers : **${army2[4]}** \nPiquiers : **${army2[5]}** \n`);
             
    /* CALCULS FINAUX */
            //on retire APRES le tour des DEUX armées !
            army2[t] = Math.round(army2[t] - calcul_archers_a1); // on retire le nombre de tués.
            army1[t] = Math.round(army1[t] - calcul_archers_a2); // on retire le nombre de tués.
            if(army1[t] < 0) army1[t] = 0;
            if(army2[t] < 0) army2[t] = 0;
        }

        unique_output.push(`**Armée 1** \nInfanterie Légère : **${army1[0]}** \nInfanterie Lourde : **${army1[1]}** \nCavalerie Légère : **${army1[2]}** \nCavalerie Lourde : **${army1[3]}** \nArchers : **${army1[4]}** \nPiquiers : **${army1[5]}** \n`)
        unique_output.push(`**Armée 2** \nInfanterie Légère : **${army2[0]}** \nInfanterie Lourde : **${army2[1]}** \nCavalerie Légère : **${army2[2]}** \nCavalerie Lourde : **${army2[3]}** \nArchers : **${army2[4]}** \nPiquiers : **${army2[5]}** \n`);


        //message.channel.send("\n\n" + output_a1.join("\n\n"));
        //message.channel.send("\n\n" + output_a2.join("\n\n"));
        //message.channel.send(`\n\n ${unique_output.join("\n\n")}`);
        unique_output = [];
        output_a1 = [];
        output_a2 = [];
   
    }
    message.channel.send(`Armée **1** Post-Escarmouche \nInfLeg: ${army1_base[0] - army1[0]} (base:${army1_base[0]}) \nInfLou: ${army1_base[1] - army1[1]} (base:${army1_base[1]})\nCavLeg: ${army1_base[2] - army1[2]} (base:${army1_base[2]})\nCavLou: ${army1_base[3] - army1[3]} (base:${army1_base[3]})\nArchers: ${army1_base[4] - army1[4]} (base:${army1_base[4]})\nPiquiers: ${army1_base[5] - army1[5]} (base:${army1_base[5]})\n\nArmée **2** Post-Escarmouche \nInfLeg: ${army2_base[0] - army2[0]} (base:${army2_base[0]}) \nInfLou: ${army2_base[1] - army2[1]} (base:${army2_base[1]})\nCavLeg: ${army2_base[2] - army2[2]} (base:${army2_base[2]})\nCavLou: ${army2_base[3] - army2[3]} (base:${army2_base[3]})\nArchers: ${army2_base[4] - army2[4]} (base:${army2_base[4]})\nPiquiers: ${army2_base[5] - army2[5]} (base:${army2_base[5]})`)
    message.channel.send(`Nouvelles compositions armées :\n\nArmy1: ${army1.join(" - ")}\nArmy2: ${army2.join(" - ")}`);
    
    for(let w = 0; w < 6; w++) {
        army1_base[w] = army1[w];
        army2_base[w] = army2[w];
    }
    
    
//!Mêlée - Tank
    
    quotien_de_fail = 0;
    //on change le quotien de fail. Il est plus important chez les cavaliers
    min_rnd = 3.250;
    max_rnd = 3.450;

    neces = 0;
    let cavalierlourd_atk = units_values[3].attaque;

    for(let x = 1; x <= round_duration; x++) {
        for(let t = 0; t < 5; t++) { //on fait sur toutes les unités sauf archers
            if(t != 4) { // si c'est pas des archers

                /*Armée 1*/
                //cavalerie lourde attaquent
                quotien_de_fail = await client.randomFloat(min_rnd, max_rnd);
                neces = cavalierlourd_atk / units_values[t].defense;

                calcul_cavalierslourds_a1 = (neces * (army1[3] * client.randomFloat(0.4, 0.6))) / quotien_de_fail
                if(units_values[t].faible_contre.includes(3)) calcul_cavalierslourds_a1 * 1.15; //Si l'unité cible se trouve être faible contre l'unité attaquante (archer = 4) on augmente de 15% (d'où le *1.15) la puissance des attaquants
                if(units_values[t].resistant_contre.includes(3)) calcul_cavalierslourds_a1 * 0.80; // Si l'unité cible se trouve être resistante à l'unité attaquante (archer = 4) on baisse la puissance des attaquants de 20% (d'où le *0.80)
                console.log("[QUOT_FAIL] army1 - cavalerie_atk : " + quotien_de_fail);

                //piquiers ripostent
                quotien_de_fail = await client.randomFloat(min_rnd, max_rnd);
                neces = units_values[5].attaque / units_values[3].defense;

                calcul_ripostepiquiers_a1 = (neces * (army1[5] * client.randomFloat(0.4, 0.6))) / quotien_de_fail;
                if(units_values[3].faible_contre.includes(5)) calcul_ripostepiquiers_a1 * 1.20; //Si l'unité cible se trouve être faible contre l'unité attaquante (archer = 4) on augmente de 20% (d'où le *1.20) la puissance des attaquants
                if(units_values[3].resistant_contre.includes(5)) calcul_ripostepiquiers_a1 * 0.75; // Si l'unité cible se trouve être resistante à l'unité attaquante (archer = 4) on baisse la puissance des attaquants de 25% (d'où le *0.75)
                console.log("[QUOT_FAIL] army1 - piquiers_riposte : " + quotien_de_fail);

                // entre 3 et 6% des piquiers décèdent lors de chaque tour (tués dans le tankage par ex)
                army1[5] = army1[5] - Math.round(army1[5] * client.randomFloat(0.03, 0.06));


                /*Armée 2*/
                //cavalerie lourde attaquent
                quotien_de_fail = await client.randomFloat(min_rnd, max_rnd);

                calcul_cavalierslourds_a2 = (neces * (army1[3] * client.randomFloat(0.4, 0.6))) / quotien_de_fail
                if(units_values[t].faible_contre.includes(3)) calcul_cavalierslourds_a2 * 1.15; //Si l'unité cible se trouve être faible contre l'unité attaquante (archer = 4) on augmente de 15% (d'où le *1.15) la puissance des attaquants
                if(units_values[t].resistant_contre.includes(3)) calcul_cavalierslourds_a2 * 0.80; // Si l'unité cible se trouve être resistante à l'unité attaquante (archer = 4) on baisse la puissance des attaquants de 20% (d'où le *0.80)
                console.log("[QUOT_FAIL] army2 - cavalerie_atk : " + quotien_de_fail);


                //piquiers ripostent
                quotien_de_fail = await client.randomFloat(min_rnd, max_rnd);
                neces = units_values[5].attaque / units_values[3].defense;

                calcul_ripostepiquiers_a2 = (neces * (army2[5] * client.randomFloat(0.5, 0.7))) / quotien_de_fail;
                if(units_values[3].faible_contre.includes(5)) calcul_ripostepiquiers_a2 * 1.20; //Si l'unité cible se trouve être faible contre l'unité attaquante (archer = 4) on augmente de 20% (d'où le *1.20) la puissance des attaquants
                if(units_values[3].resistant_contre.includes(5)) calcul_ripostepiquiers_a2 * 0.75; // Si l'unité cible se trouve être resistante à l'unité attaquante (archer = 4) on baisse la puissance des attaquants de 25% (d'où le *0.75)
                console.log("[QUOT_FAIL] army2 - piquiers_riposte : " + quotien_de_fail);

                // entre 3 et 6% des piquiers décèdent lors de chaque tour (tués dans le tankage par ex)
                army2[5] = army2[5] - Math.round(army2[5] * client.randomFloat(0.03, 0.06));


                // retraits unités
                army2[t] = Math.round(army2[t] - calcul_cavalierslourds_a1); // on retire le nombre de tués.
                army2[3] = Math.round(army2[3] - calcul_ripostepiquiers_a1); // on retire les cavaliers lourds tués par les piquiers

                army1[t] = Math.round(army1[t] - calcul_cavalierslourds_a2); // on retire le nombre de tués.
                army1[3] = Math.round(army1[3] - calcul_ripostepiquiers_a2); // on retire les cavaliers lourds tués par les piquiers

                if(army1[t] < 0) army1[t] = 0;
                if(army2[t] < 0) army2[t] = 0;
            }
        }
    }
    message.channel.send(`Armée **1** Post-Tank \nInfLeg: ${army1_base[0] - army1[0]} (base:${army1_base[0]}) \nInfLou: ${army1_base[1] - army1[1]} (base:${army1_base[1]})\nCavLeg: ${army1_base[2] - army1[2]} (base:${army1_base[2]})\nCavLou: ${army1_base[3] - army1[3]} (base:${army1_base[3]})\nArchers: ${army1_base[4] - army1[4]} (base:${army1_base[4]})\nPiquiers: ${army1_base[5] - army1[5]} (base:${army1_base[5]})\n\nArmée **2** Post-Tank \nInfLeg: ${army2_base[0] - army2[0]} (base:${army2_base[0]}) \nInfLou: ${army2_base[1] - army2[1]} (base:${army2_base[1]})\nCavLeg: ${army2_base[2] - army2[2]} (base:${army2_base[2]})\nCavLou: ${army2_base[3] - army2[3]} (base:${army2_base[3]})\nArchers: ${army2_base[4] - army2[4]} (base:${army2_base[4]})\nPiquiers: ${army2_base[5] - army2[5]} (base:${army2_base[5]})`)
    message.channel.send(`Nouvelles compositions armées :\n\nArmy1: ${army1.join(" - ")}\nArmy2: ${army2.join(" - ")}`);
    


//!Mêlée - Mêlée générale



}

module.exports.help = {
    name: "newbattletest",
    aliases: ['nbt'],
    category: "admin",
    desription: "Test l'algo du nouveau système de guerre.",
    usage: '',
    cooldown: 1, 
    permissions: true,
    args: false
};