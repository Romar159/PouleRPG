const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, EmbedBuilder } = require("discord.js");
const levenshtein = require('js-levenshtein');


module.exports.run = async (client, message, args, settings, dbUser, command, mentionnedUser, user, arg0, arg1) => {
    
    
    client.logCommandExecution(message, this);

    if(args[0]) {
        arg0 = args[0]
        arg1 = args[1]
    }

    //choix aléatoire de catégorie
    var cat = (client.randomInt(0, 1) == 1 ? "action" : "vérité");
    var rating = "";

    //test du theme
    if(arg1) {
        if(arg1.toLowerCase() == "r18") {
            rating = "R18"
        } else {
            rating = "TP"
        }
    } else {
        rating = (client.randomInt(0, 1) == 1 ? "TP" : "R18");
    }

    //si argument passé on récupère la catégorie voulu, gérant les fautes de frappe.
    if(arg0) {
        //si le paramètre n'est pas "aléatoire" alors on voit ce qui est demandé. Sinon on garde le random fait au début.
        if(arg0.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") != "aleatoire") {
            if(levenshtein(arg0.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'verite') > levenshtein(arg0.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'action')) {
                cat = "action"
            } else {
                cat = "vérité"
            }
        }
    }

    

    
    var obj = await client.getRandomAov(cat, rating);
    // message.channel.send("data: " + obj.texte);

    const embedaov = new EmbedBuilder()
        .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
        .setDescription("**" + obj.texte + "**")

    if(cat == "action") embedaov.setColor('D53B3E');
    else if(cat == "vérité") embedaov.setColor('359553');

   

    const filter = i => (i.customId === 'act' || i.customId === 'vrt' || i.customId === 'ran' || i.customId === 'stop');
    const collector = message.channel.createMessageComponentCollector({ filter, time: 720000, error:["time"] }); //5 minutes
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`act`)
                .setLabel('Action')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`vrt`)
                .setLabel('Vérité')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`ran`)
                .setLabel('Aléatoire')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`stop`)
                .setLabel('Stop')
                .setStyle(ButtonStyle.Secondary)
                
        ); 

        /*
        ! BUG !
        ! Essayer de comprendre comment empêcher si l'on renvois la commande p<aov de supporter deux collector
        ! En gros, si on lance un p<aov, puis un autre, peu importe les boutons sur lesquels on appuie, ça va faire supporter la première commande puis la deuxième puis la premiere etc..
        ! Et si on en fait 3, ça fait la 1er la 2eme la 3eme puis re la 1er etc... etc...
        ! L'idée c'est de juste, soit :
        !   - Si l'on renvois la commande, ça stop toutes interactions et message des autres commandes AOV (bonne question de comment...)
        !   - Ajouter un filtre plus poussé aux boutons qui ne répond qu'au message concerné pour ces boutons-là (le mieux)
        !   Je crois d'ailleurs que Truth or Dare fonctionne comme ça, en gros on peut avoir plusieurs partie en même temps mais sans s'entremêler.
        
        */
        //if(collector.collected.size > 0) collector.stop();
    

    await collector.on('collect', async i => { 
        if(i.isButton()) {
            //console.log("Button");
            if (i.customId === `stop`) { 
                await i.deferUpdate();
                i.editReply({components: []});
                collector.stop();
                return;
            }
            if (i.customId === `act`) { 
                
                await i.deferUpdate();
                //collector.stop("reason: ended");

                /*
                    on émet la commande avec comme message déclencheur msg (plus bas), l'args[0] = "action" l'args[1] c'est le rating initial et le user c'est i.user, 
                    les autres paramètres sont les même qu'au premier lancement
                */
                //message.channel.send("cont: " + choice);
                //message.channel.send("ARGS1: " + args[1]);
                
                
                //msg.edit({components: []})
                //return this.run(client, message, [], settings, dbUser, command, mentionnedUser, i.user, "action", arg1);
                
                var obj = await client.getRandomAov("action", rating);
                // message.channel.send("data: " + obj.texte);

                const embedaov = new EmbedBuilder()
                    .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
                    .setDescription("**" + obj.texte + "**")
                    .setColor('D53B3E');

                    
                    i.editReply({components: []});
                    message.reply({embeds:[embedaov], components: [row], allowedMentions: {repliedUser: false}});


            } else if (i.customId === `vrt`) {
                await i.deferUpdate();
                //await collector.stop();
                i.editReply({components: []});
                //return await this.run(client, message, [], settings, dbUser, command, mentionnedUser, i.user, "vérité", arg1);

                var obj = await client.getRandomAov("vérité", rating);
                // message.channel.send("data: " + obj.texte);

                const embedaov = new EmbedBuilder()
                    .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
                    .setDescription("**" + obj.texte + "**")
                    .setColor('359553');

                    i.editReply({embeds:[embedaov], components: [row]});

            } else if (i.customId === `ran`) {
                await i.deferUpdate();
                //await collector.stop();
                i.editReply({components: []});
                //return await this.run(client, message, [], settings, dbUser, command, mentionnedUser, i.user, "aléatoire", arg1);

                cat = (client.randomInt(0, 1) == 1 ? "action" : "vérité")
                var obj = await client.getRandomAov(cat, rating);
                // message.channel.send("data: " + obj.texte);

                const embedaov = new EmbedBuilder()
                    .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
                    .setDescription("**" + obj.texte + "**")
                    
                if(cat == "action") embedaov.setColor('D53B3E');
                else if(cat == "vérité") embedaov.setColor('359553');

                i.editReply({embeds:[embedaov], components: [row]});
            }
        }
    });

    await collector.on('end', async (i, reason) => { 
        //message.channel.send(reason);
    });

    let msg = await message.reply({embeds:[embedaov], components: [row], allowedMentions: {repliedUser: false}});
    //message.delete();
}

module.exports.help = {
    name: "actionouvérité",
    aliases: ['actionouverite', 'aov'],
    category: "entertainment",
    desription: "Propose un action ou vérité",
    usage: "[action/vérité/aléatoire] [theme:TP/R18]",
    cooldown: 3,
    permissions: false,
    args: false
};