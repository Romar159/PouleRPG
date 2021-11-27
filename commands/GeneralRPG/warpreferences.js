const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {

    const filter = i => (i.customId === 'confirmation' || i.customId === 'refus') && i.user.id === message.author.id;
    
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('confirmation')
            .setLabel('Oui')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('refus')
            .setLabel('Non')
            .setStyle('DANGER'),
    );

    if(!args[1]) return message.reply(`Vous devez renseigner une position.`);
    if(dbUser.class !== "NULL") return message.reply("Vous avez déjà créé vos préférences militaire.");
    if(!args[0].length || !args[1].length) return message.reply(`Vous devez renseigner les deux valeurs.`);
   
    const choice_class = args[0].toLowerCase();
    const choice_position = args[1].toLowerCase();
    const embed = new MessageEmbed()
    .setColor('BF2F00')
    .setAuthor(`Préférences de guerre`, client.user.displayAvatarURL());

    try {
        let random = client.randomInt(1, 3);
        let hatedpos = "droite";

        if(choice_class == "cavalier" || choice_class == "guerrier" || choice_class == "archer") {
            if(choice_position == "droite" || choice_position == "centre" || choice_position == "gauche") {

                embed.setDescription(`Vous avez choisi la classe **${choice_class}**, ainsi que la position **${choice_position}** comme favorite.\nCela vous convient-il ? \n\n**Vous ne pourrez plus les changer après.**`);

                
                collector.on('collect', async i => {
                    if (i.customId === 'confirmation') {
                        await i.deferUpdate();

                        await client.updateUser(message.member, {class: choice_class});
                        await client.updateUser(message.member, {combat_favoriteposition: choice_position});
    
                        do {
                            random = client.randomInt(1, 3);
                            if(random == 1) hatedpos = "droite";
                            else if (random == 2) hatedpos = "centre";
                            else if (random == 3) hatedpos = "gauche";   
                        } while (hatedpos == choice_position)
                        await client.updateUser(message.member, {combat_hatedposition: hatedpos});
    
                        const randomMessage = client.randomInt(0, 69)
                        if(randomMessage == 42) {
                            embed.setDescription(`Votre classe est maintenante : **${choice_class}**\nVotre position favorite est maintenante : **${choice_position}**\nVotre position détestée est : **${hatedpos}**`)
                            embed.setFooter(`Hehehehehe, t'as eu un easter egg, bien joué ! :)`)
                        } else {
                            embed.setDescription(`Votre classe est désormais : **${choice_class}**\nVotre position favorite est désormais : **${choice_position}**\nVotre position détestée est : **${hatedpos}**`);
                        }
                        await i.editReply({ embeds:[embed], components: [] });
                    }
                    else if(i.customId === 'refus') {
                        await i.deferUpdate();
                        embed.setDescription(`**Processus annulé !** \nVous pouvez refaire la commande avec les paramètres que vous préférez.`);
                        await i.editReply({ embeds:[embed], components: [] });
                    }
                });
    
                message.reply({ embeds:[embed], components: [row] });
                
            } else {
                return message.reply(`Cette position n'existe pas.\n**ICI -> ${args[1]}**`);
            }
        } else {
            return message.reply(`Cette classe n'existe pas.\n**ICI -> ${args[0]}**`);
        }

    } catch(e) {
        message.channel.send(`Temps écoulé.`);
    }
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