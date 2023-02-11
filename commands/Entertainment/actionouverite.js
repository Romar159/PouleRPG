const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, EmbedBuilder } = require("discord.js");
const levenshtein = require('js-levenshtein');

module.exports.run = async (client, message, args, settings, dbUser, command, mentionnedUser, user) => {
    
    client.logCommandExecution(message, this);

    //choix aléatoire de catégorie
    var cat = (client.randomInt(0, 1) == 1 ? "action" : "vérité");

    //si argument passé on récupère la catégorie voulu, gérant les fautes de frappe.
    if(args[0]) {
        if(levenshtein(args[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'verite') > levenshtein(args[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'action')) {
            cat = "action"
        } else {
            cat = "vérité"
        }
    }


    var obj = await client.getRandomAov(cat);
    // message.channel.send("data: " + obj.texte);

    const embedaov = new EmbedBuilder()
        .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
        .setDescription(obj.texte);

    if(cat == "action") embedaov.setColor('D53B3E');
    else if(cat == "vérité") embedaov.setColor('359553');

   

    const filter = i => (i.customId === 'act' || i.customId === 'vrt' || i.customId === 'ran');
    const collector = message.channel.createMessageComponentCollector({ filter, time: 300000 }); //5 minutes
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
                .setStyle(ButtonStyle.Primary)
                
        ); 

    await collector.on('collect', async i => { 
        if(i.isButton()) {
            //console.log("Button");
            if (i.customId === `act`) { 
                await i.deferUpdate();
                collector.stop();
                this.run(client, msg, ["action"], settings, dbUser, command, mentionnedUser, i.user);

            } else if (i.customId === `vrt`) {
                await i.deferUpdate();
                collector.stop();
                this.run(client, msg, ["vérité"], settings, dbUser, command, mentionnedUser, i.user);
            } else if (i.customId === `ran`) {
                await i.deferUpdate();
                collector.stop();
                this.run(client, msg, [""], settings, dbUser, command, mentionnedUser, i.user);
            }
        }
    });

    let msg = await message.reply({embeds:[embedaov], components: [row]});

}

module.exports.help = {
    name: "actionouvérité",
    aliases: ['actionouverite', 'aov'],
    category: "entertainment",
    desription: "Propose un action ou vérité",
    usage: "[action/vérité]",
    cooldown: 3,
    permissions: false,
    args: false
};