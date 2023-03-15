const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const armes = require("../../assets/rpg/armes.json")
const metiers = require("../../assets/rpg/metiers/metiers.json")

module.exports.run = async (client, message, args, settings, dbUser) => {

    const faction = await client.getFaction(dbUser.faction);

    const emote_faction = ":house:";

    const arme_name = client.filterById(armes, dbUser.armeFavorite).name;
    const arme_emote = client.filterById(armes, dbUser.armeFavorite).emote;

    let metier_name = "";
    let metier_emote = ":hole:";
    if(dbUser.metier == 0) {
        metier_name = "Sans Emploi"
    } else {
        metier_name = client.filterById(metiers, dbUser.metier).name;
        metier_emote = ":hammer_pick:";
    }

    const needxp_usr = Math.round((1000 * parseInt(dbUser.level)) / Math.sqrt(parseInt(dbUser.level)) * 1.5);
    

    const embed = new EmbedBuilder()
    .setAuthor({name:`Profil de ${message.author.username}`, iconURL:message.author.displayAvatarURL()});
    if(dbUser.faction == "epsilon")
        embed.setColor('AA3C00');
    if(dbUser.faction == "daïros")
        embed.setColor('0078F0');
    if(dbUser.faction == "lyomah")
        embed.setColor('00A00A');
    if(dbUser.faction == "alpha")
        embed.setColor('F0C800');
    if(dbUser.faction == "NULL")
        embed.setColor('5E6366');

    if(dbUser.faction == "NULL")
        embed.addFields({name:`${emote_faction} **Faction**`, value:`Vagabond`, inline:true});
    else
        embed.addFields({name:`${emote_faction} **Faction**`, value:`**<@&${faction.roleid}>**`, inline:true});
    embed.addFields({name:`:trophy: **Rang**`, value:`${client.getMee6Role(message.member).name}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`${arme_emote} **Arme**`, value: `${arme_name[0].toUpperCase() + arme_name.slice(1).toLowerCase()}`, inline:true})
    .addFields({name:`${metier_emote} **Métier**`, value: `${metier_name}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:bar_chart: **Niveau**`, value:dbUser.level.toString(), inline:true})
    .addFields({name:`:test_tube: **Expérience**`, value:`${dbUser.experience.toString()}/${needxp_usr}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`**:coin: Poyn**`, value:dbUser.or.toString(), inline:true})
    if(message.author.id == '421400262423347211')
        embed.addFields({name:`:woman_red_haired: **Points(s) vénitienne**`, value:`∞`, inline:true});
    else
        embed.addFields({name:`:woman_red_haired: **Points(s) vénitienne**`, value:dbUser.pointsvenitienne.toString(), inline:true});
        


        //embed points
        const embedPts = new EmbedBuilder()
    .setAuthor({name:`Points de ${message.author.username}`, iconURL:message.author.displayAvatarURL()});
    if(dbUser.faction == "epsilon")
        embedPts.setColor('AA3C00');
    if(dbUser.faction == "daïros")
        embedPts.setColor('0078F0');
    if(dbUser.faction == "lyomah")
        embedPts.setColor('00A00A');
    if(dbUser.faction == "alpha")
        embedPts.setColor('F0C800');
    if(dbUser.faction == "NULL")
        embedPts.setColor('5E6366');

    embedPts.addFields({name:`:crown: **Prestige**`, value: `${dbUser.prestige}`, inline:true})
    .addFields({name:`:pray: **Piété**`, value: `${dbUser.piete}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:gem: **Richesse**`, value:`${dbUser.richesse}`, inline:true})
    .addFields({name:`:dart: **Puissance**`, value:`${dbUser.puissance}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:muscle: **Forme**`, value:`${dbUser.forme}`, inline:true})
    .addFields({name:`:sunflower: **Moral**`, value:`${dbUser.moral}`, inline:true})
    .addFields({name:'** **', value:'** **'})

    .addFields({name:`:pick: **Travail**`, value:`${dbUser.travail}`, inline:true})
    .addFields({name:`:brain: **Savoir**`, value:`${dbUser.savoir}`, inline:true})

    //--
    //affichage

    const pages = [embed, embedPts];
    index = 0;

    const filter = i => (i.customId === 'gauche' || i.customId === 'droite' || i.customId === 'select') && i.user.id === message.author.id;
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
        //console.log(`Debug: isButton : ${i.isButton()} | isSelectMenu: ${i.isSelectMenu()} | i.user.id: ${i.user.id} | message.author.id: ${message.author.id} | i.customId: ${i.customId} | endsWith: ${i.customId.endsWith(i.user.id)}`);
        if(i.user.id != message.author.id) return;
        
        if(i.isButton()) {
            //console.log("Button");
            if (i.customId === `gauche` || i.customId === `droite`) {
                    await i.deferUpdate();
                    await i.editReply({embeds:[pages[(index == 0) ? 1 : 0]], components: [row] });

                    if(index == 0) index = 1;
                    else index = 0;
            }
        }
    });

    //message.channel.send(`Piété : ${dbUser.piete} \nPrestige : ${dbUser.prestige} \nRichesse : ${dbUser.richesse} \nTravail : ${dbUser.travail} \nForme : ${dbUser.forme} \nSavoir : ${dbUser.savoir} \nMoral : ${dbUser.moral}`); // ? DraxyNote: Ici faut ajouter au embed.
    message.channel.send({embeds:[embed], components: [row]});
}

module.exports.help = {
    name: "profil",
    aliases: ['utilisateur', 'pr', "profile"],
    category: "generalrpg",
    desription: "Affiche votre profil complet.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
}; 