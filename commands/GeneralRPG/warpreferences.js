const {MessageEmbed} = require("discord.js");
const {randomInt} = require("../../util/functions/randominteger");

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(!args[1]) return message.reply(`vous devez renseigner une position.`);
    if(dbUser.class !== "NULL") return message.reply("vous avez déjà créé vos préférences militaire.");
    if(!args[0].length || !args[1].length) return message.reply(`vous devez renseigner les deux valeurs.`);
   
    const choice_class = args[0].toLowerCase();
    const choice_position = args[1].toLowerCase();
    const embed = new MessageEmbed()
    .setColor('BF2F00')
    .setAuthor(`Préférences de guerre`, client.user.displayAvatarURL());

    try {
        let random = randomInt(1, 3);
        let hatedpos = "droite";

        if(choice_class == "cavalier" || choice_class == "guerrier" || choice_class == "archer") {
            if(choice_position == "droite" || choice_position == "centre" || choice_position == "gauche") {

                embed.setDescription(`Vous avez choisi la classe **${choice_class}**, ainsi que la position **${choice_position}** comme favorite.\nCela vous convient-il ? (oui)\n\n**Vous ne pourrez plus les changer après.**`);

                message.channel.send(embed);
                const filter = m => (message.author.id === m.author.id);
                const userEntry = await message.channel.awaitMessages(filter, {
                    max:1, time:10000, errors: ['time']
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

                    const randomMessage = randomInt(0, 69)
                    if(randomMessage == 42) {
                        embed.setDescription(`Votre classe est maintenante : **${choice_class}**\nVotre position favorite est maintenante : **${choice_position}**\nVotre position détestée est : **${hatedpos}**`)
                        embed.setFooter(`Hehehehehe, t'as eu un easter egg, bien joué ! :)`)
                    } else {
                        embed.setDescription(`Votre classe est désormais : **${choice_class}**\nVotre position favorite est désormais : **${choice_position}**\nVotre position détestée est : **${hatedpos}**`);
                    }

                    message.channel.send(embed);
                }
            } else {
                return message.reply(`cette position n'existe pas.\n**ICI -> ${args[1]}**`);
            }
        } else {
            return message.reply(`cette classe n'existe pas.\n**ICI -> ${args[0]}**`);
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
        message.channel.send(`Temps écoulé.`);
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
    name: "préférencesguerre",
    aliases: ['préfguerre', 'prefguerre', 'pg'],
    category: "generalrpg",
    desription: "Définit ses préférences militaire.",
    usage: '<class:cavalier/guerrier/archer> <position_favorite:gauche/centre/droite>',
    cooldown: 3, 
    permissions: false,
    args: true
};