const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');



module.exports.run = async (client, message, args, settings, dbUser) => {

    client.logCommandExecution(message, this);
    
    // 1 : Idée | 2 : Bug | 3 : Autre
    let subject_selected = 3;

    embed_feedback = new EmbedBuilder()
        .setColor('3A8F7F')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Faire un retour`)
        .setDescription(`Précisez le sujet de votre retour, et écrivez nous votre message !\nAttention, les critiques gratuites et/ou sans fondemment seront sévèrement punies ! N'oubliez pas que le bot est entièrement conçu bénévolement !\nAu delà de cela, soyez libre de nous communiquer ce que vous souhaitez !`)
        

    const modal_idee = new ModalBuilder()
        .setCustomId('myModal_idee' + message.author.id)
        .setTitle('Envoyer une idée');

    const modal_bug = new ModalBuilder()
        .setCustomId('myModal_bug' + message.author.id)
        .setTitle('Envoyer un bug');


	const modal = new ModalBuilder()
        .setCustomId('myModal' + message.author.id)
        .setTitle('Envoyer un commentaire');

    const subjectInput = new TextInputBuilder()
        .setCustomId('subjectInput')
        .setLabel("Quel est le sujet de votre retour ?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const feedbackInput = new TextInputBuilder()
        .setCustomId('feedbackInput')
        .setLabel("Écrivez votre retour")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph);

    

    const firstActionRow = new ActionRowBuilder().addComponents(subjectInput);
    const secondActionRow = new ActionRowBuilder().addComponents(feedbackInput);
   

    

    const selec = new ActionRowBuilder()
    .addComponents(new StringSelectMenuBuilder()
            .setCustomId('selectSubject' + message.author.id)
            .setPlaceholder('Choisissez un sujet...') 
            .addOptions(
            {
                label: 'Idée',
                description: 'Soummetez une idée d\'amélioration ou d\'ajout.',
                value: 'slc_sujet1' + message.author.id,
            },
            {
                label: 'Bug',
                description: 'Expliquez-nous un bug rencontré, avec un maximum de détails.',
                value: 'slc_sujet2' + message.author.id,
            },
            {
                label: 'Autre',
                description: 'Pour faire un autre retour. Décrivez nous-le sujet dans le formulaire.',
                value: 'slc_sujet3' + message.author.id,
            })
    )


    const filter = i => (
        i.customId === 'selectSubject' + message.author.id ||
        i.customId === 'myModal' + message.author.id && 
        i.user.id === message.author.id)

    const collector = message.channel.createMessageComponentCollector({ filter, time: 900000 }); //15 minutes

    await collector.on('collect', async i => {
       
        

        
        if(i.isStringSelectMenu()) {
            if(i.customId == "selectSubject" + i.user.id) {
                
                if(i.values == "slc_sujet1" + i.user.id) {
                    subject_selected = 1;
                    modal_idee.addComponents(secondActionRow);
                    await i.showModal(modal_idee);
                    //console.log(i.fields.getTextInputValue('feedbackInput'));
                     //await i.editReply({content:"Ok", components:[]})
                    collector.stop();
                }
                if(i.values == "slc_sujet2" + i.user.id) {
                    subject_selected = 2;
                    modal_bug.addComponents(secondActionRow);
                    await i.showModal(modal_bug);
                     //await i.editReply({content:"Ok", components:[]})
                    collector.stop();
                }
                if(i.values == "slc_sujet3" + i.user.id) {
                    subject_selected = 3;
                    
                    modal.addComponents(firstActionRow, secondActionRow);
                    await i.showModal(modal);
                    
                    //await i.editReply({content:"", components:[]})
                    collector.stop();
                }
            }
        }
        // if (i.isModalSubmit()) {
        //     console.log("test")
        //     if (i.customId === 'myModal' + i.user.id) {
        //         await i.reply({ content: 'Geted' });
        //     }
        // }
    });

    // modal.on('collect', async (interaction) => {
    //     console.log(interaction.fields.getTextInputValue('favoriteColorInput'));
    // });

   

    message.channel.send({embeds:[embed_feedback], components: [selec]})
}


module.exports.help = {
    name: "commentaire",
    aliases: ['feedback', 'commentaires', 'retour'],
    category: "system",
    desription: "Permet d'envoyer un retour au développeur. Que ce soit une idée, un bug ou autre. (Attention, les critiques gratuites et/ou sans fondemment seront sévèrement punies). N'oubliez pas que le bot est entièrement conçu bénévolement !",
    usage: '',
    cooldown: 5, 
    permissions: false,
    args: false,
};