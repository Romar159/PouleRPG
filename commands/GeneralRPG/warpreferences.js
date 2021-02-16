const { guild } = require("discord.js");
const {randomInt} = require("../../util/functions/randominteger");

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(dbUser.class !== "NULL") return message.reply("Vous avez déjà créé vos préférences militaire.");
    if(!args[0].length || !args[1].length) return message.reply(`Vous devez renseigner les deux valeurs.`);
   
    const choice_class = args[0].toLowerCase();
    const choice_position = args[1].toLowerCase();

    try {
        let random = randomInt(1, 3);
        let hatedpos = "droite";

        if(choice_class == "cavalier" || choice_class == "guerrier" || choice_class == "archer") {
            if(choice_position == "droite" || choice_position == "centre" || choice_position == "gauche") {

                message.channel.send(`Vous avez choisis la classe \`${choice_class}\`, ainsi que \`${choice_position}\` comme position favorite. Cela vous convient-il ? vous ne pourrez plus changer après (oui)`);
                const filter = m => (message.author.id === m.author.id);
                const userEntry = await message.channel.awaitMessages(filter, {
                    max:1, time:8000, errors: ['time']
                });

                if(userEntry.first().content.toLowerCase() === "oui") {
                    await client.updateUser(message.member, {class: choice_class});
                    await client.updateUser(message.member, {combat_favoriteposition: choice_position});

                    do {
                        random = randomInt(1, 3);
                        if(random == 1) hatedpos = "droite";
                        else if (random == 2) hatedpos = "centre";
                        else if (random == 3) hatedpos = "gauche";   
                    } while (hatedpos == choice_position)
                    await client.updateUser(message.member, {combat_hatedposition: hatedpos});

                    message.channel.send(`Votre classe est maintenante : \`${choice_class}\`\nVotre position favorite est : \`${choice_position}\` \nEt la position où vous êtes le moins efficace est \`${hatedpos}\``);
                }
            } else {
                return message.channel.send("Cette position n'existe pas.");
            }
        } else {
            return message.channel.send("Cette classe n'existe pas.");
        }
/*
        if(choice_position == "droite") {
            await client.updateUser(message.member, {combat_favoriteposition: "droite"});
        } else if(choice_position == "centre") {
            await client.updateUser(message.member, {combat_favoriteposition: "centre"});
        } else if(choice_position == "gauche") {
            await client.updateUser(message.member, {combat_favoriteposition: "gacuhe"});
        } */
    } catch(e) {
        message.channel.send(`TIMEOUT / ?ERROR: ${e}`);
    }
        
/*
        for(let i=0;i<classes.length;i++) {
            console.log("BOUCLE I : " + classes[i] + ` ${choice_class}`);
            if(choice_class === toString(classes[i])) {
                console.log("OK I !");

                await client.updateUser(message.member, {class: classes[i]});
            } else {
                message.channel.send("NON I !");
            }
        }

        for(let y=0;y<positions.length;y++) {
            console.log("BOUCLE Y " + positions[y]  + ` ${args[1]}`);
            if(choice_position === toString(positions[y])) {
                console.log("OK Y !");
                
                while(random == y) {
                    random = randomInt(0, 2);
                }
                await client.updateUser(message.member, {combat_favoriteposition: positions[y]});
                await client.updateUser(message.member, {combat_hatedposition: positions[random]});
            } else {
                message.channel.send("NON Y !");
            }
        } */
    

/*
    if(args[0] == '--class') { //souhaite éditer sa classe
        try {
            message.channel.send(`Voici les classes disponibles (cavalier, guerrier, archer).`);
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages(filter, {
                max:1, time:5000, errors: ['time']
            });
    
            if(userEntry.first().content.toLowerCase() === "cavalier")
                client.updateUser(message.member, {class: "cavalier"});
            else if(userEntry.first().content.toLowerCase() === "guerrier")
                client.updateUser(message.member, {class: "guerrier"});
            else if(userEntry.first().content.toLowerCase() === "archer")
                client.updateUser(message.member, {class: "archer"});

        } catch(e) {
            message.channel.send('Timeout.');
        }
    } else if(args[0] == '--favposition') { //souhaite éditer sa position favorite
        try {
            message.channel.send(`Voici les positions disponibles (gauche, centre, droite).`);
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages(filter, {
                max:1, time:5000, errors: ['time']
            });
    
            if(userEntry.first().content.toLowerCase() === "gauche")
                client.updateUser(message.member, {combat_favoriteposition: "gauche"});
            else if(userEntry.first().content.toLowerCase() === "centre")
                client.updateUser(message.member, {combat_favoriteposition: "centre"});
            else if(userEntry.first().content.toLowerCase() === "droite")
                client.updateUser(message.member, {combat_favoriteposition: "droite"});

        } catch(e) {
            message.channel.send('Timeout.');
        }
    } else if(args[0] == '--hatedposition') { //souhaite éditer sa position favorite
        try {
            message.channel.send(`Voici les positions disponibles (gauche, centre, droite).`);
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages(filter, {
                max:1, time:5000, errors: ['time']
            });
    
            if(userEntry.first().content.toLowerCase() === "gauche")
                client.updateUser(message.member, {combat_hatedposition: "gauche"});
            else if(userEntry.first().content.toLowerCase() === "centre")
                client.updateUser(message.member, {combat_hatedposition: "centre"});
            else if(userEntry.first().content.toLowerCase() === "droite")
                client.updateUser(message.member, {combat_hatedposition: "droite"});

        } catch(e) {
            message.channel.send('Timeout.');
        }
    } else {
        message.channel.send("Paramètre(s) invalide(s).");
    } */
}

module.exports.help = {
    name: "warpreferences",
    aliases: ['warpreferences'],
    category: "generalrpg",
    desription: "Créé ses préférences militaire.",
    usage: '<class:cavalier/guerrier/archer> <position_favorite:gauche/centre/droite>',
    cooldown: 3, 
    permissions: false,
    args: true
};