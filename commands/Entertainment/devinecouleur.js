const { MessageEmbed, CommandInteractionOptionResolver } = require("discord.js");
const {randomInt} = require("../../util/functions/randoms");

module.exports.run = async (client, message, args) => {


    let couleurs = ["blanc", "beige", "rose", "magenta", "rouge", "carmin", "corail", "saumon", "orange", "ambre", "jaune", "kaki", "kaki foncé", "vert d'eau", "vert", "vert océan", "vert impérial", "bleu céleste", "cyan", "bleu azur", "bleu", "bleu nuit", "blurple", "blurple foncé", "lavande", "violet", "zinzolin", "indigo", "bistre", "noisette", "caramel", "marron", "argent", "gris", "anthracite"];
    let couleurs_code = ['#ffffff', '#fdcb9c', '#f49acc', '#ff00ff', '#FF0000', '#960018', '#e63c00', '#e9926f', '#ec9900', "#d4ad00", '#ffff00', '#f0e68c', '#a8a35f', '#b0f2b6', '#00FF00', '#2e8b57', '#00561b', '#b2ffff', '#00ffff', '#00bfff', '#0000FF', '#0f056b', '#7289da', '#4e5d94', '#9683ec', '#b301eb', '#6c0277', '#4b0082', '#856d4d', '#955628', '#7e3300', '#582900', '#c0c0c0', '#808080', '#303030'];
    
   /* if(args[0] == "compet") {
        
        if(args[1] == "facile") {
            couleurs = ["blanc", "rose", "magenta", "rouge", "orange", "jaune", "vert", "cyan", "bleu", "violet", "marron",  "gris"];
            couleurs_code = ['#ffffff', '#fdb7c4', '#ff00ff', '#FF0000', '#ec9900', '#ffff00', '#00FF00', '#00ffff', '#0000FF', '#af1ec4', '#582900', '#808080'];
        }
        let id_color = randomInt(0, couleurs.length - 1);
        //message.channel.send(`COULEUR : ${couleurs[id_color]}`);

        const embed = new MessageEmbed()
        .setColor(couleurs_code[id_color])
        .setDescription("Quelle couleur ? :))))");

        message.channel.send({embeds:[embed]});

        
        const filter = m => (m.author.id !== client.user.id);
        const userEntry = await message.channel.awaitMessages({filter, time:15000, errors: ['time']
        }).then(async d => {
            await d.forEach(e => {
                console.log("HEY + " + d)
                if(e.content) { 
                    let a_msg = e.content.toLowerCase();
                    if(a_msg == couleurs[id_color]) {
                       return message.channel.send("T TRO FOR <@" + e.author.id + ">");
                    }
                }
            })
        }).catch(err => {console.log(err)});
        


        // MODE NORMAL
        } else {*/
        if(args[0] == "facile") {
            couleurs = ["blanc", "rose", "magenta", "rouge", "orange", "jaune", "vert", "cyan", "bleu", "violet", "marron",  "gris"];
            couleurs_code = ['#ffffff', '#f49acc', '#ff00ff', '#FF0000', '#ec9900', '#ffff00', '#00FF00', '#00ffff', '#0000FF', '#b301eb', '#582900', '#808080'];
        }
    
        let id_color = client.randomInt(0, couleurs.length - 1);
        //message.channel.send(`COULEUR : ${couleurs[id_color]}`);
    
        const embed = new MessageEmbed()
        .setColor(couleurs_code[id_color])
        .setDescription("Quelle couleur ? :))))");
    
        message.channel.send({embeds:[embed]});
    
        const filter = m => (message.author.id === m.author.id);
        const userEntry = await message.channel.awaitMessages({filter, 
            max:1, time:15000, errors: ['time']
        }); 
    
        
        if(userEntry.first().content) {
            let a_msg = userEntry.first().content.toLowerCase();
            if(a_msg == couleurs[id_color]) {
                message.channel.send("T TRO FOR");
                if(client.randomInt(1, 1000) == 500) {
                    message.channel.send("**WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO !!!!!** TU VIENS DE TROUVER L'EVENT LE PLUS **RARE** DU BOT !!!! +1 xp.");
                    client.setXp(client, message.author, 1);
                }
            } else {
                message.channel.send(`T TRO NUL LOL !!! C T : **${couleurs[id_color]}**`);
            }
        }
   // }

    
}

module.exports.help = {
    name: "devinecouleur",
    aliases: ['dc'],
    category: "entertainment",
    desription: "Un petit jeu là où on doit deviner une couleur",
    usage: "[facile]",
    cooldown: 1,
    permissions: true,
    args: false 
};