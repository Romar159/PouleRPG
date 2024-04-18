const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, StringSelectMenuBuilder} = require("discord.js");

const reponses = require("../../assets/rpg/reponses_testdefaction_short");
const reponses_long = require("../../assets/rpg/reponses_testdefaction");

module.exports.run = async (client, message, args, settings, dbUser) => {

    var index = 0;
    var points_epsilon = 0;
    var points_dairos = 0;
    var points_lyomah = 0;
    var points_alpha = 0;

    //message.channel.send(`[DEBUG] Points START: ${points_epsilon} ${points_dairos} ${points_lyomah} ${points_alpha}`);


    const intro = new EmbedBuilder()
    .setColor('1ABC9C')
    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
    .setDescription("**Test de Faction**\n\nEffectuez ce test de personnalité et découvrez avec quelle faction vous êtes le plus compatible.\n\n\n:warning: **ATTENTION** :warning:\n\nCe test indique, via des situations fictives, quelle serait la faction la plus compatible avec vous, mais en aucun cas vous êtes obligé de le suivre ! \nCe test peut ne pas être fiable à 100% ou bien vous vous sentez plus attirer par une autre faction que le résultat...\n\nPrennez ce test comme une aide pour faire votre choix ou même comme un divertissement, mais n'oubliez pas que choisir une faction est **définitif** ! *(sauf certains cas rare, voir loi Paragraphe 4 - Alinéa 1)*\n\n*Si vous mettez plus de 10 minutes à répondre au test, celui-ci sera annulé pour des raisons de sauvegarde de performance (vous pourrez en relancer un sans problème)*");

    const q1 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 1 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Un membre de votre faction commet une erreur qui a coûté beaucoup de poyn à votre faction. Seul vous, savez qui est le responsable.**\n\n:one: ${reponses_long.REP_Q1[0].description} \n:two: ${reponses_long.REP_Q1[1].description} \n:three:${reponses_long.REP_Q1[2].description}`);
    const q2 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 2 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Vous explorez des cavernes et découvrez que des bandits ont installé leur camp au fond de celle-ci. Quelle est votre approche ?**\n\n:one: ${reponses_long.REP_Q2[0].description} \n:two: ${reponses_long.REP_Q2[1].description} \n:three:${reponses_long.REP_Q2[2].description}`);
    const q3 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 3 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Vous faites partie du gouvernement, une guerre semble se profiler entre votre faction et une autre.**\n\n:one: ${reponses_long.REP_Q3[0].description} \n:two: ${reponses_long.REP_Q3[1].description} \n:three:${reponses_long.REP_Q3[2].description} \n:four: ${reponses_long.REP_Q3[3].description}`);
    const q4 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 4 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Au détour d’une ruelle, un soir pluvieux, vous surprenez une discussion secrète… un complot se trame dans l’ombre**\n\n:one: ${reponses_long.REP_Q4[0].description} \n:two: ${reponses_long.REP_Q4[1].description} \n:three:${reponses_long.REP_Q4[2].description} \n:four: ${reponses_long.REP_Q4[3].description}`);
    const q5 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 5 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Alors que vous venez de commencer un nouveau travail, un collègue vous interpelle et vous propose ses conseils pour vous aider à faire mieux.**\n\n:one: ${reponses_long.REP_Q5[0].description} \n:two: ${reponses_long.REP_Q5[1].description}`);
    const q6 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 6 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Un membre de votre faction est enfermé dans les cachots d’une faction ennemie.**\n\n:one: ${reponses_long.REP_Q6[0].description} \n:two: ${reponses_long.REP_Q6[1].description} \n:three:${reponses_long.REP_Q6[2].description}`);
    const q7 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 7 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Vous êtes agent d'un complot. Vous faites donc parties des membres actifs et impliqués dans la mise en place et le succès d’un complot.**\n\n:one: ${reponses_long.REP_Q7[0].description} \n:two: ${reponses_long.REP_Q7[1].description} \n:three:${reponses_long.REP_Q7[2].description}`);
    const q8 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 8 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Un membre du conseil pourrait être retiré de ses fonctions et vous pourriez avoir l'opportunité de le remplacer.**\n\n:one: ${reponses_long.REP_Q8[0].description} \n:two: ${reponses_long.REP_Q8[1].description}`);
    const q9 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 9 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Votre maître de faction vous envoie en mission dans une région inconnue.**\n\n:one: ${reponses_long.REP_Q9[0].description} \n:two: ${reponses_long.REP_Q9[1].description}`);
    const q10 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: "Question 10 sur 10", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Vous êtes missioné par votre faction pour soutirer des informations à un prisonnier ennemi.**\n\n:one: ${reponses_long.REP_Q10[0].description} \n:two: ${reponses_long.REP_Q10[1].description} \n:three:${reponses_long.REP_Q10[2].description}`);

    const questions = [];
    questions.push(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10);

    


    



 
    const filter = i => (i.customId === 'start' + message.author.id || i.customId === 'select' + message.author.id) && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 600000 }); //10 minutes
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`start` + message.author.id) //on ajoute le author.id au customId pour éviter que des cons puissent foutre la merde sur le test de quelqu'un en repassant par dessus. (s'exploitait si on lançait un test on pouvait interragir sur tous les autres.)
            .setLabel('Commencer')
            .setStyle(ButtonStyle.Success)
    );
    

    const selectMenuQ1 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q1));
    const selectMenuQ2 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q2));
    const selectMenuQ3 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q3));
    const selectMenuQ4 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q4));
    const selectMenuQ5 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q5));
    const selectMenuQ6 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q6));
    const selectMenuQ7 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q7));
    const selectMenuQ8 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q8));
    const selectMenuQ9 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q9));
    const selectMenuQ10 = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('select' + message.author.id).setPlaceholder('Choisissez votre réponse...').addOptions(reponses.REP_Q10));

    const repmenus = []
    repmenus.push(selectMenuQ1, selectMenuQ2, selectMenuQ3, selectMenuQ4, selectMenuQ5, selectMenuQ6, selectMenuQ7, selectMenuQ8, selectMenuQ9, selectMenuQ10);

    await collector.on('collect', async i => {
        if(i.isButton()) {
            await i.deferUpdate(); 
            i.editReply({embeds:[questions[index]], components:[repmenus[index]]})
            
        }
        else if(i.isStringSelectMenu()) {
            index = index + 1;
            if(i.values[0] == "slc_rep1") { 
                await i.deferUpdate();
                if(index == 1) { //id question
                    points_epsilon += 1;
                    points_alpha += 2;
                } else if(index == 2) { //id question
                    points_epsilon -= 2;
                    points_lyomah -= 1;
                    points_alpha += 2;
                } else if(index == 3) { //id question
                    
                    points_dairos += 2
                    points_lyomah += 1;
                    points_alpha -= 1;
                } else if(index == 4) { //id question
                    
                    points_dairos += 2
                    points_lyomah += 2;
                } else if(index == 5) { //id question
                    
                    points_dairos -= 1
                    points_alpha += 2;
                } else if(index == 6) { //id question
                    points_epsilon += 2;
                    points_dairos += 1;
                    points_alpha -= 1;
                } else if(index == 7) { //id question
                    points_dairos += 2
                    points_lyomah += 3;
                } else if(index == 8) { //id question
                    points_epsilon += 1;
                    points_dairos -= 1
                    points_lyomah -= 1;
                    points_alpha += 2;
                } else if(index == 9) { //id question
                    points_epsilon += 1;
                    points_dairos -= 1
                    points_alpha -= 1;
                } else if(index == 10) { //id question
                    points_epsilon += 2;
                }
            }
            if(i.values[0] == "slc_rep2") { 
                await i.deferUpdate();
                if(index == 1) { //id question
                    points_dairos += 1
                    points_lyomah += 1;
                } else if(index == 2) { //id question
                    points_epsilon += 2;
                    points_dairos += 1
                } else if(index == 3) { //id question
                   
                    points_alpha += 3;
                } else if(index == 4) { //id question
                    points_epsilon += 3;
                    points_dairos += 1
                    
                } else if(index == 5) { //id question
                    
                    points_dairos += 2;
                    points_lyomah += 1;
                } else if(index == 6) { //id question
                    points_epsilon -= 2;
                    points_dairos -= 1;
                    points_alpha += 2;
                } else if(index == 7) { //id question
                    points_epsilon += 3;
                    points_alpha -= 2;
                } else if(index == 8) { //id question
                    
                    points_dairos += 1;
                    points_lyomah += 2;
                    
                } else if(index == 9) { //id question
                    points_epsilon -= 1;
                    points_dairos += 1;
                } else if(index == 10) { //id question
                    
                    points_alpha += 2;
                }
            }
            if(i.values[0] == "slc_rep3") { 
                await i.deferUpdate();
                if(index == 1) { //id question
                    points_lyomah += 2;
                } else if(index == 2) { //id question
                    points_dairos += 2
                    points_lyomah += 1;
                } else if(index == 3) { //id question
                    points_epsilon += 3;
                    
                } else if(index == 4) { //id question
                    
                    points_dairos += 1
                    points_lyomah += 1;
                    points_alpha += 2;
                } else if(index == 5) { //id question
                    

                } else if(index == 6) { //id question
                    points_epsilon += 1;
                    points_dairos += 2;
                    points_lyomah += 2;
                    points_alpha -= 1;
                } else if(index == 7) { //id question
                    
                    points_lyomah -= 2;
                    points_alpha += 2;
                } else if(index == 8) { //id question
                    

                } else if(index == 9) { //id question
                    

                } else if(index == 10) { //id question
                    
                    points_dairos += 2;
                    points_lyomah += 2;
                    
                }
            }
            if(i.values[0] == "slc_rep4") { 
                await i.deferUpdate();
                if(index == 1) { //id question
                    

                } else if(index == 2) { //id question
                    
                } else if(index == 3) { //id question
                    points_epsilon += 1;
                    points_lyomah += 3;
                } else if(index == 4) { //id question
                    points_epsilon += 2;
                    points_dairos -= 1
                    points_lyomah -= 1;
                    points_alpha += 1;
                } else if(index == 5) { //id question
                    

                } else if(index == 6) { //id question
                    
                    
                } else if(index == 7) { //id question
                    
                    
                } else if(index == 8) { //id question
                    
                    
                } else if(index == 9) { //id question
                    
                    
                } else if(index == 10) { //id question
                    
                    
                }
            }
    
            if(index < 10) {
                await i.editReply({embeds:[questions[index]], components:[repmenus[index]]})
            } else {
                collector.stop();

                //message.channel.send(`DEBUG RAW POINTS: Epsilon: ${points_epsilon} | Daïros: ${points_dairos} | Lyomah: ${points_lyomah} | Alpha: ${points_alpha}`)
                
                //on retire le fait que les points soient en négatif (et si aucun n'est en négatif c'est pas grave puisque tout le monde augmente de la même valeur.)
                points_epsilon += 5;
                points_dairos += 5;
                points_lyomah += 5;
                points_alpha += 5;

                var division = 18;

                //message.channel.send(`DEBUG RAW POINTS AFTER UPDATE: Epsilon: ${points_epsilon} | Daïros: ${points_dairos} | Lyomah: ${points_lyomah} | Alpha: ${points_alpha}`)
                const embed_resultats = new EmbedBuilder();
                if(points_epsilon > points_dairos && points_epsilon > points_lyomah && points_epsilon > points_alpha) {
                    embed_resultats.setColor('AA3C00')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**La faction la plus compatible avec vous est : <@&415947454626660366>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                } else if(points_dairos > points_epsilon && points_dairos > points_lyomah && points_dairos > points_alpha) {
                    embed_resultats.setColor('0078F0')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**La faction la plus compatible avec vous est : <@&415947455582961686>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                
                } else if(points_lyomah > points_epsilon && points_lyomah > points_dairos && points_lyomah > points_alpha) {
                    embed_resultats.setColor('00A00A')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**La faction la plus compatible avec vous est : <@&415947456342130699>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                
                } else if(points_alpha > points_epsilon && points_alpha > points_dairos && points_alpha > points_lyomah) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**La faction la plus compatible avec vous est : <@&665340021640921099>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                



                } else if(points_epsilon == points_dairos) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**Oh ! Deux factions peuvent vous correspondre : <@&15947454626660366> et <@&15947455582961686>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                } else if(points_epsilon == points_lyomah) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**Oh ! Deux factions peuvent vous correspondre : <@&15947454626660366> et <@&15947456342130699>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                } else if(points_epsilon == points_alpha) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**Oh ! Deux factions peuvent vous correspondre : <@&15947454626660366> et <@&665340021640921099>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                }
                
                else if(points_dairos == points_lyomah) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**Oh ! Deux factions peuvent vous correspondre : <@&15947455582961686> et <@&15947456342130699>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                } else if(points_dairos == points_alpha) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**Oh ! Deux factions peuvent vous correspondre : <@&15947455582961686> et <@&665340021640921099>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                }

                
                else if(points_lyomah == points_alpha) {
                    embed_resultats.setColor('F0C800')
                    .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
                    .setDescription(`**Oh ! Deux factions peuvent vous correspondre : <@&15947456342130699> et <@&665340021640921099>** \n\n Vous êtes\nEpsilon à ${Math.ceil((points_epsilon * 100) / division)}%\nDaïros à ${Math.ceil((points_dairos * 100) / division)}%\nLyomah à ${Math.ceil((points_lyomah * 100) / division)}%\nAlpha à ${Math.ceil((points_alpha * 100) / division)}%\n\nVous pouvez choisir votre faction à la fin de la commande p<débuter ! *(si vous n'en avez pas déjà une)*`);
                }

                
                await i.editReply({embeds:[embed_resultats], components:[]})
            }
            //message.channel.send(`[DEBUG] AUTHOR:${message.author.username} INDEX:${index} | Points LOOP: ${points_epsilon} ${points_dairos} ${points_lyomah} ${points_alpha}`);

        }
        
        //message.channel.send("DEBUG: index: " + index);
    });

    message.channel.send({embeds:[intro], components:[row]});

       


    //afficher en pourcent toutes les factions en ordre décroissant, mais évidemment afficher en plus gros celle avec le plus de point !
}

module.exports.help = { 
    name: "testdefaction",
    aliases: ['tdf'],
    category: "generalrpg",
    desription: "Effectuez un test de personnalité qui vous indique avec quelle faction vous êtes le plus compatible.",
    usage: "",
    cooldown: 10,
    permissions: false,
    args: false
}; 