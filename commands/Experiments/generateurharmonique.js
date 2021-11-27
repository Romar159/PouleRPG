module.exports.run = (client, message, args) => {
   
    const tonnalités = ["do", "do#", "ré", "ré#", "mi", "fa", "fa#", "sol", "sol#", "la", "la#", "si", "do", "do#", "ré", "ré#", "mi", "fa", "fa#", "sol", "sol#", "la", "la#", "si"];
    const mode = ["majeur", "mineur"];

    const random_tonnalité = client.randomInt(0, 11);
    const random_mode = client.randomInt(0, 1);

    const gamme = `${tonnalités[random_tonnalité]} ${mode[random_mode]}`;

    const random_accord1 = client.randomInt(0, 6);
    const random_accord2 = client.randomInt(0, 6);
    const random_accord3 = client.randomInt(0, 6);
    const random_accord4 = client.randomInt(0, 6);

    
   


    if(random_mode == 0) { // majeur : 2 2 1 2 2 2 1

        const i = random_tonnalité;
        message.channel.send(`Gamme: ${gamme} \n\n Note gamme: ${tonnalités[i]} ${tonnalités[i + 2]} ${tonnalités[i + 4]} ${tonnalités[i + 5]} ${tonnalités[i + 7]} ${tonnalités[i + 9]} ${tonnalités[i + 11]} ${tonnalités[i + 12]}`);

        const degrees_maj = [tonnalités[i] + " majeur", tonnalités[i + 2] + " mineur", tonnalités[i + 4] + " mineur", tonnalités[i + 5] + " majeur", tonnalités[i + 7] + " majeur", tonnalités[i + 9] + " mineur", tonnalités[i + 11] + " mineur diminué", tonnalités[i + 12] + " mineur"];

        message.channel.send(`Accords gamme: \n**Ier degrée** ${tonnalités[i]} majeur \n**IIème degrée** ${tonnalités[i + 2]} mineur \n**IIIème degrée** ${tonnalités[i + 4]} mineur \n**IVème degrée** ${tonnalités[i + 5]} majeur \n**Vème degrée** ${tonnalités[i + 7]} majeur \n**VIème degrée** ${tonnalités[i + 9]} mineur \n**VIIème degrée** ${tonnalités[i + 11]} mineur diminué \n**Ier degrée** ${tonnalités[i + 12]} majeur`);
        message.channel.send(`${random_accord1 + 1} degrée : ${degrees_maj[random_accord1]}\n${random_accord2 + 1} degrée : ${degrees_maj[random_accord2]}\n${random_accord3 + 1} degrée : ${degrees_maj[random_accord3]}\n${random_accord4 + 1} degrée : ${degrees_maj[random_accord4]}\n`)

    }
    if (random_mode == 1) { // mineur : 2 1 2 2 1 2 2
        const i = random_tonnalité;
        message.channel.send(`Gamme: ${gamme} \n\n Note gamme: ${tonnalités[i]} ${tonnalités[i + 2]} ${tonnalités[i + 3]} ${tonnalités[i + 5]} ${tonnalités[i + 7]} ${tonnalités[i + 8]} ${tonnalités[i + 10]} ${tonnalités[i + 12]}`);

        const degrees_min = [tonnalités[i] + " mineur", tonnalités[i + 2] + " mineur diminué", tonnalités[i + 3] + " majeur", tonnalités[i + 5] + " mineur", tonnalités[i + 7] + " mineur", tonnalités[i + 8] + " majeur", tonnalités[i + 10] + " majeur", tonnalités[i + 12] + " mineur"];

        message.channel.send(`Accords gamme: \n**Ier degrée** ${tonnalités[i]} mineur \n**IIème degrée** ${tonnalités[i + 2]} mineur diminué \n**IIIème degrée** ${tonnalités[i + 3]} majeur \n**IVème degrée** ${tonnalités[i + 5]} mineur \n**Vème degrée** ${tonnalités[i + 7]} mineur \n**VIème degrée** ${tonnalités[i + 8]} majeur \n**VIIème degrée** ${tonnalités[i + 10]} majeur \n**Ier degrée** ${tonnalités[i + 12]} mineur`);
        message.channel.send(`${random_accord1 + 1} degrée : ${degrees_min[random_accord1]}\n${random_accord2 + 1} degrée : ${degrees_min[random_accord2]}\n${random_accord3 + 1} degrée : ${degrees_min[random_accord3]}\n${random_accord4 + 1} degrée : ${degrees_min[random_accord4]}\n`)

    }

        var rythm_string = "";
        var melodie = "";
        let rythm;
        let rythm_avant = 500;

        let random_mesure = client.randomInt(1, 4);
        let mesure = 0;
        switch(random_mesure) {
            case 1:
                mesure = 8;
            break;

            case 2:
                mesure = 16;
            break;

            case 3:
                mesure = 24
            break;
            case 4: 
                mesure = 32;
            break;
        }
        message.channel.send(`Nombre de notes: ${mesure} pour ${mesure / 4} mesures.`);

    for(let y=0;y<mesure;y++) {
        
        if(rythm_avant == 1) {
            rythm = client.randomInt(1, rythm_avant + 1);
        } else if (rythm_avant == 4){
            rythm = client.randomInt(1, 4);
        } else {
            rythm = client.randomInt(rythm_avant -1, rythm_avant + 1);
        }
        
        if(rythm_avant == 500) { //premier tour de boucle.
            rythm = client.randomInt(1, 4);
        }
        
        let random_notes = client.randomInt(0, 6);
        const notes = ["do", "ré", "mi", "fa", "sol", "la", "si"];
        if(rythm == 1) { // croche
            rythm_string = " croche\n";
        } else if (rythm == 2) { // noire
            rythm_string = " noire\n";

        } else if (rythm == 3) { // blanche
            rythm_string = " blanche\n";

        } else if (rythm == 4) { // ronde
            rythm_string = " ronde\n";
        }
        rythm_avant = rythm;
        melodie = melodie + (notes[random_notes] + rythm_string);
    }

    message.channel.send("** ** \n**Mélodie** : \n\n" + melodie);


}

module.exports.help = {
name: "generateurharmonique",
aliases: ['gh'],
category: "experiments",
desription: "Génère une progression harmonique dans une gamme.",
usage: "",
cooldown: 1,
permissions: false,
args: false
};