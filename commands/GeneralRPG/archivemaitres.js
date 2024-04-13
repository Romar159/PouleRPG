const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const data = require("../../assets/rpg/archivesmaitres.json")

module.exports.run = async (client, message, args) => {

    let index = 0;
    let last_index = data.length - 1;

    let selection = client.filterById(data, 0);

    var embed_ArchiveMaitre = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Archive Maître`)
        .setDescription(`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${client.upperCaseFirstChar(selection.faction)}**`)

    const filter = i => (i.customId === 'gauche' || i.customId === 'droite') && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 }); //2 minutes
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`gauche`)
                .setLabel('🡠')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`droite`)
                .setLabel('🡢')
                .setStyle(ButtonStyle.Secondary)
        ); 
    await collector.on('collect', async i => {
        if(i.user.id != message.author.id) return;
        
        if(i.isButton()) {
            
            //console.log("Button");
            if (i.customId === `gauche`) {
                
                    await i.deferUpdate();
                    if(index == 0) {
                        let selection = client.filterById(data, last_index);
                        embed_ArchiveMaitre.setDescription(`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**`)
                        //await i.editReply({content:`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**` , components: [row] });
                        await i.editReply({embeds:[embed_ArchiveMaitre], components:[row]})
                        index = last_index;
                    } else {
                        index--;
                        let selection = client.filterById(data, index);
                        embed_ArchiveMaitre.setDescription(`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**`)
                        //await i.editReply({content:`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**` , components: [row] });  
                        await i.editReply({embeds:[embed_ArchiveMaitre], components:[row]})

                    }
            } else if (i.customId === `droite`) {
                await i.deferUpdate();
                if(index == last_index) {
                    let selection = client.filterById(data, 0);
                    embed_ArchiveMaitre.setDescription(`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**`)
                    //await i.editReply({content:`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**` , components: [row] });  
                    await i.editReply({embeds:[embed_ArchiveMaitre], components:[row]})
                    index = 0;
                } else {
                    index++;
                    let selection = client.filterById(data, index);
                    embed_ArchiveMaitre.setDescription(`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**`)
                    //await i.editReply({content:`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**` , components: [row] });  
                    await i.editReply({embeds:[embed_ArchiveMaitre], components:[row]})

                }
            }
        }
    });

    message.channel.send({embeds:[embed_ArchiveMaitre], components:[row]})
    //message.channel.send({content:`Le ${selection.debmandat} <@${selection.userid}> a été élu(e) maître de la faction **${selection.faction}**`, components: [row]})
}

module.exports.help = {
    name: "archivemaitres",
    aliases: ['archivemaitre', 'am'],
    category: "generalrpg",
    desription: "Liste l'historique des maîtres élus ainsi que la date de début de leur mandat.",
    usage: '',
    cooldown: 10, 
    permissions: false,
    args: false,
};