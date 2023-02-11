const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const levenshtein = require('js-levenshtein');

module.exports.run = async (client, message, args) => {
    
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

    const filter = i => (i.customId === 'act' || i.customId === 'vrt');
    const collector = message.channel.createMessageComponentCollector({ filter, time: 300000 }); //5 minutes
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`act`)
                .setLabel('Action')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`vrt`)
                .setLabel('Vérité')
                .setStyle(ButtonStyle.Primary)
        ); 

    await collector.on('collect', async i => { 
        if(i.isButton()) {
            //console.log("Button");
            if (i.customId === `act`) { 
                await i.deferUpdate();
                collector.stop();
                this.run(client, message, ["action"]);

            } else if (i.customId === `vrt`) {
                await i.deferUpdate();
                collector.stop();
                this.run(client, message, ["vérité"]);
            }
        }
    });

    await message.reply({content: obj.texte, components: [row]});

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