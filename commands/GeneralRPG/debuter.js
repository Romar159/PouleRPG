const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder} = require("discord.js");



module.exports.run = async (client, message, args, settings, dbUser) => {
    var index = 0;

    var db_e = await client.getFaction('epsilon');
    var db_d = await client.getFaction('daïros');
    var db_l = await client.getFaction('lyomah');
    var db_a = await client.getFaction('alpha');

    const page1 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: message.member.user.username + " (1/10)", iconURL: message.member.user.displayAvatarURL()})
        .setDescription("**Bienvenue dans PouleRPG**\n\nC'est ici que l'aventure débute ! Vous allez en **apprendre davantage** sur le jeu, comment **bien débuter** et enfin choisir **votre faction** ! <:EP_Pjoie:867163422662852648>")
 
    const page2 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: message.member.user.username + " (2/10)", iconURL: message.member.user.displayAvatarURL()})
        .setDescription("**Le RPG**\n\nComme vous le savez peut-être déjà, PouleRPG possède un côté **RPG** *(comme son nom l'indique)*. Vous allez pouvoir découvrir tout un système d'**économie**, de **stats** et d'**expérience** !\n\nEn exerçant le **métier** de votre choix vous allez pouvoir gagner la majorité de votre **or** ! Il existe cependant beaucoup d'**autres manières** d'en obtenir !\n Pour gagner en **expérience**, tout comme l'or il existe **de nombreuses manières** comme: partir en **expédition**, vous **entraîner** ou encore en **combattant des ennemis** !\n\nLe bot <@159985870458322944> a aussi son importance dans le jeu. Plus vous **parlez** plus vous **gagnez** en XP. Il existe **plusieurs palliers** d'XP qui vous donnent accès à des **rôles** de plus en plus **importants** vous permettant de **débloquer** diverses choses, comme une **capacité** plus élevé pour **votre banque**. \nN'hésitez pas à executer les commandes `!rank` vous permettant de voir votre **classement** d'XP et `!leaderboard` pour voir celui **des autres** ainsi que les **différents palliers** d'XP atteignables.");

    const page3 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: message.member.user.username + " (3/10)", iconURL: message.member.user.displayAvatarURL()})
        .setDescription("**La Grande Stratégie**\n\nPouleRPG possède également un côté **Grande-Stratégie**.\nComme vous le savez sûrement, une faction possède un **Maître** et peut également avoir un conseil qui comprend trois membres : Le **Maréchal**, L'**Intendant** et Le **Chapelain**. En étant titulaire de l'**un de ces quatre rôle** c'est là où la Grande Stratégie de PouleRPG est la plus **puissante** ! En effet le **gouvernement** de la faction doit **gérer beaucoup d'aspect** de cette dernière.\n\n\n• La **politique** : contrôlez les **relations** entre les membres ou jetez les aux **cachots**. Gérez les **décisions** de la faction et les conflits. Modifiez les **lois** *(en développement)* en vigueur pour offrir plus de pouvoir au peuple... ou au gouvernement.\n\n• L'**économie** : la faction possède son propre **coffre** contenant son **or**. Instaurez des **taxes** sur le revenue de vos membres pour le remplir ou comptez sur leur **loyauté** !\n\n• La **guerre** : parfois, lorsque la **diplomatie** est infructueuse, la **guerre** est la **seule alternative** pour gérer les différents entre Factions. **Menez vos troupes** au combat, **entraînez-les**, formez des **commandants**, **assiégez** des villes ! **Détruisez** la faction **adverse** jusqu'à ce que vous remportiez la **victoire** !\n\n• Le **territoire** et la **géopolitique** *(fonctionnalité en partie développée)* : Collectez des **ressources**, **construisez** des villages, des villes, **fortifiez** votre capitale, gérez vos **frontières**, **commercez** entre factions, formez des **alliances** ou faites la guerre pour gagner leur **territoire** ou **volez leurs ressources** !\n\n\nMême si tous ces aspects sont principalement liés au gouvernement, en tant que simple membre de faction vous avez une **importance capitale** pour que votre faction tienne. C'est **vous** qui apportez la majorité de l'**or**, c'est **votre expérience** et **vos stats** qui font grandir la faction ! Et en plus de celà des **nouveautés** arrivent bientôt spécialement dédiées aux membres sans pouvoir ! *(au programme: complots, missions, et plus encore...)*");

    const page4 = new EmbedBuilder()
        .setColor('1ABC9C')
        .setAuthor({name: message.member.user.username + " (4/10)", iconURL: message.member.user.displayAvatarURL()})
        .setDescription("**Informations complémentaires**\n\nAvant de passer au choix de la faction voici quelques informations utiles :\n\n**Commandes principales:**\n\n• `p<aide` affiche la liste des commandes disponibles par catégorie, ou si vous précisez une commande ainsi `p<aide nom_commande` vous aurez accès à une brève explication et sa synthaxe.\n• `p<préférences` pour choisir vos préférences RPG comme votre arme de prédiléction par exemple.\n• `p<entrainement` pour vous entraîner\n• `p<métier` et `p<travail` pour choisir votre métier et gagner de l'or\n• `p<expedition` pour gagner de l'or et de l'xp\n• `p<banque` et `p<xp` pour voir votre or et votre niveau d'expérience. \n\n**Liens:**\n\n• **Lien du Wiki** comprennant des explications de tous les aspects du jeu et l'utilisation détaillée de toutes les commandes : https://romar159.github.io/PouleRPGweb/ \n• **Lien du Github** pour les curieux souhaitant voir le code (écrit intégralement en Javascript) : https://github.com/Romar159/PouleRPG \n\n*Notez aussi que le bot est en bêta ses fonctionnalités sont faibles, mais de très grosses mises à jour se préparent et viendrons le compléter au fil du temps ! N'hésitez donc pas à faire part à <@421400262423347211> de tous bugs ou problèmes que vous pouriez rencontrer ou encore de vos envies et idées pour de futures mise à jour !* <:EP_Pclin_oeil:867162153345744956>");

        //noter qu'en bêta les fonctionnalités sont faibles, et que de très grosses mises à jour se prépares !

    const page5 = new EmbedBuilder() 
        .setColor('1ABC9C')
        .setAuthor({name: message.member.user.username + " (5/10)", iconURL: message.member.user.displayAvatarURL()})
        .setDescription("**Le choix de votre Faction**\n\nVous y voilà ! Le choix de la faction est **très important**. Elle vous **représente** comme tous **les autres membres** et vous en faite partie **intégralement**, vous vous devez d'y être **loyal** !\nChaque faction est **très différente des autres**, vous devez choisir celle **qui vous ressemble** le plus, la plus proche de votre vision ; votre faction est **votre façon de penser** ! Attention, ce choix est définitif, il n'y a que de rare cas où vous pouvez changer ! (voir Loi P4 A1)\n\nCependant, il peut s'avérer que ce soit un choix **complexe**. Et que même après avoir lu chaque descriptions de chaque factions vous vous trouvez encore **emplis de doutes** sur votre choix, vous pouvez effectuer **\"Le Test\"**. C'est un test de **personnalité** qui va vous permettre de définir **quelle faction vous correspond le mieux**, bien sûr vous pourrez toujours choisir. Le test sert simplement à vous **aiguiller** ! Pour faire le test exécutez la commande ``p<test-de-faction``.\n\nDans les **pages suivantes** vous allez être amenez à **découvrir** chaque faction et à la fin de ces dernières vous aurez la possibilité de **choisir** la votre !\n*Dieu Poulet veille sur vous ; que votre choix soit judicieux !* <:EP_Pfier:867163346319179817>");
 


    const page6 = new EmbedBuilder() 
        .setColor('AA3C00')
        .setAuthor({name: message.member.user.username + " (6/10)", iconURL: message.member.user.displayAvatarURL()})
        .setTitle(`**Epsilon**`)
        .setThumbnail('https://i.imgur.com/K9CXVaO.png')
        .setDescription(`${(!db_e.idmaitre) ? "**Maître vacant**" : "Gouverné par **<@" + db_e.idmaitre + ">**"} \n\n\n**La Stratégie et la Diplomatie**\n\nMalgré leur attitude **calme** voir parfois froide, les Epsilon sont de **puissants diplomates** et de **fins stratèges** ! \n\nIls sont connus pour leur **érudition** et utilisent leur **savoir** et leur **éloquence** pour résoudre la plupart des problèmes. \n\nLors des conflits ils vont prioriser la **diplomatie** plutôt que la violence. \nMais, lorsque cela ne suffit guère, leur grande **connaissance** en **stratégie** leur permet de mener leurs armées au combat en **réfléchissant** plutôt sur une **carte** et un **plan** que de partir tête baissée et miser uniquement sur le grand nombre et la puissance de leurs troupes !`);

    const page7 = new EmbedBuilder() 
        .setColor('0078F0')
        .setAuthor({name: message.member.user.username + " (7/10)", iconURL: message.member.user.displayAvatarURL()})
        .setTitle(`**Daïros**`)
        .setThumbnail('https://i.imgur.com/sh3wjrv.png')
        .setDescription(`${(!db_d.idmaitre) ? "**Maître vacant**" : "Gouverné par **<@" + db_d.idmaitre + ">**"} \n\n\n**L'Exploration et l'Amélioration**\n\nLes Daïros sont de grands **explorateurs**. Leur **curiosité**, parfois intrusive, leur est fort utile pour apprendre de leur environnement. \n\nIls sont connus pour leur **indépendance**, ainsi que pour **chercher les limites** de chaque domaine pour les maîtriser au mieux. \n\nDe par leur façon d’être, ils **éviteront** au maximum les conflits. Mais si cela arrive, leurs nombreuses **expériences** leurs permettent d’agir en **toutes circonstances** ! \nLeur curiosité leur permet d'**évaluer** les tactiques de l’adversaire pour mieux y répondre, et chaque erreur est pour eux, source d'**amélioration**.`);
        
    const page8 = new EmbedBuilder() 
        .setColor('00A00A')
        .setAuthor({name: message.member.user.username + " (8/10)", iconURL: message.member.user.displayAvatarURL()})
        .setTitle(`**Lyomah**`)
        .setThumbnail('https://i.imgur.com/uj8TLad.png')
        .setDescription(`${(!db_l.idmaitre) ? "**Maître vacant**" : "Gouverné par **<@" + db_l.idmaitre + ">**"} \n\n\n**La Loyauté et la Solidarité**\n\nLes Lyomah sont **loyaux** et **solidaires**, ils **s’entraident** et ne se laissent **jamais tomber**. \n\nIls sont connus pour leur **esprit d’équipe** et leur **dévouement** sans faille. Ils veillent **les uns sur les autres** ; et grâce à leur grand **sens de l'honneur**, ils savent qu’ils peuvent se faire **confiance**. \n\nLors des conflits ils **combinent** leurs forces et **coopèrent** tous **ensemble** pour gagner. Et ce, même s’ils devaient se sacrifier pour les autres.`);
        
    const page9 = new EmbedBuilder() 
        .setColor('F0C800')
        .setAuthor({name: message.member.user.username + " (9/10)", iconURL: message.member.user.displayAvatarURL()})
        .setTitle(`**Alpha**`)
        .setThumbnail('https://i.imgur.com/tIwuxXD.png')
        .setDescription(`${(!db_a.idmaitre) ? "**Maître vacant**" : "Gouverné par **<@" + db_a.idmaitre + ">**"} \n\n\n**La Vigueur et la Persévérance**\n\nGrâce à leur **vigueur** et leur **persévérance**, les Alpha obtiennent souvent ce qu’ils **veulent**. \nIls **n’abandonnent jamais** leurs objectifs et font tout pour **arriver à leur fin** même s’ils doivent employer la **force** quitte à perdre leur sang-froid. \n\nIls sont connus pour leur **efficacité** et leur **performance** ce qui leur permet d’atteindre tous leurs buts. \n\nLors des conflits ils ne se laissent pas **intimider**, ce sont eux qui **imposent** leur force aux autres !`);
        


    const page10 = new EmbedBuilder() 
        .setColor('1ABC9C')
        .setAuthor({name: message.member.user.username + " (10/10)", iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`**Choisissez... Judicieusement !** \n\n N'oubliez pas. Votre choix est définitif !${dbUser.faction == "NULL" ? "" : "\n\n:warning: **ATTENTION** :warning: \nVous êtes déjà dans une faction. Vous ne pourrez pas en changer ici !"} ${client.hasMinRole(message.member, "paysan") == false ? "\n\n**/!\\ ATTENTION /!\\ ** \nPour choisir une faction vous devez au moins être Paysan, c'est à dire le Niveau 2 du bot Mee6. Essayez de parler un petit peu avant de commencer à jouer <:EP_Pjoie:867163422662852648>" : ""}`);


    const embedBvnEpsilon = new EmbedBuilder()
        .setColor('AA3C00')
        .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`${message.member} a rejoint la Faction **<@&415947454626660366>** !`);
    const embedBvnDairos = new EmbedBuilder()
        .setColor('0078F0')
        .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`${message.member} a rejoint la Faction **<@&415947455582961686>** !`);
    const embedBvnLyomah = new EmbedBuilder()
        .setColor('00A00A')
        .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`${message.member} a rejoint la Faction **<@&415947456342130699>** !`);
    const embedBvnAlpha = new EmbedBuilder()
        .setColor('F0C800')
        .setAuthor({name: message.member.user.username, iconURL: message.member.user.displayAvatarURL()})
        .setDescription(`${message.member} a rejoint la Faction **<@&665340021640921099>** !`);


    
    const all_pages = [];
    all_pages.push(page1, page2, page3, page4, page5, page6, page7, page8, page9, page10);

    const filter = i => (i.customId === 'gauche' || i.customId === 'droite' || i.customId === 'select') && i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 360000 }); //6 minutes
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`gauche`)
                .setLabel('🡠')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`droite`)
                .setLabel('🡢')
                .setStyle(ButtonStyle.Primary)
        ); 

        const selectFac = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Choisissez votre Faction...') 
					.addOptions(
						{
							label: '🟧 Epsilon',
							description: 'Vous rejoignez la faction Epsilon',
							value: 'slc_epsilon',
						},
						{
							label: '🟦 Daïros',
							description: 'Vous rejoignez la faction Daïros',
							value: 'slc_dairos',
						},
                        {
							label: '🟩 Lyomah',
							description: 'Vous rejoignez la faction Lyomah',
							value: 'slc_lyomah',
						},
                        {
							label: '🟨 Alpha',
							description: 'Vous rejoignez la faction Alpha',
							value: 'slc_alpha',
						},
					),
			);

        await collector.on('collect', async i => {
            //console.log(`Debug: isButton : ${i.isButton()} | isSelectMenu: ${i.isSelectMenu()} | i.user.id: ${i.user.id} | message.author.id: ${message.author.id} | i.customId: ${i.customId} | endsWith: ${i.customId.endsWith(i.user.id)}`);
            if(i.user.id != message.author.id) return;
            
            if(i.isButton()) {
                //console.log("Button");
                if (i.customId === `gauche`) {
                    if(index == 0) index = 10;
                    //if(index > 0) {
                        await i.deferUpdate();
                        await i.editReply({ embeds:[all_pages[index - 1]], components: [row] });
                        //await message.channel.send("index avant:" + index);
                        await index--;
                    //}
                        
                    
                } else if(i.customId === `droite`) {
                    if(index == 9) index = -1;
                    //if(index < 10) {
                        await i.deferUpdate();
                        await i.editReply({ embeds:[all_pages[index + 1]], components: [row] });
                        //await message.channel.send("index avant:" + index);
                        await index++;
                    //}
                } 
                if(index == 9) await i.editReply({components: [selectFac, row] });
                
                //if(!i.isSelectMenu()) return;
                //console.log(i.isSelectMenu() + "cid: " + i.customId);
            } else if (i.isSelectMenu()) {

                //console.log("select menu");
                if (i.customId === 'select') { 
                    //await console.log("OUI ! " + "elements: " + i.values.join(' '));
                    //await message.channel.send("SELECTED !");
                    await i.deferUpdate();

                    if(client.hasMinRole(message.member, "paysan") == false) {
                        collector.stop();
                        return i.editReply({embeds:[], content: "Vous n'êtes pas Paysan ou plus, vous ne pouvez donc pas rejoindre de faction. Essayez de parler un peu avant de jouer et atteignez au moins le niveau 2 !", ephemeral: true, components: []})
                    }

                    if(dbUser.faction != "NULL") {
                         collector.stop();
                         return i.editReply({embeds:[], content: `Vous êtes déjà dans la faction ${dbUser.faction}. Vous ne pouvez pas en choisir une autre.`, ephemeral: true, components: []})
                    } else {
                        if(i.values[0] == "slc_epsilon") {
                            await message.member.roles.add('415947454626660366');
                            await client.updateUser(message.member, {faction: "epsilon"});
                            collector.stop();
                            return i.editReply({embeds:[embedBvnEpsilon], components: []});
                        } 
                        else if(i.values[0] == "slc_dairos") {
                            await message.member.roles.add('415947455582961686');
                            await client.updateUser(message.member, {faction: "daïros"});
                            collector.stop();
                            return i.editReply({embeds:[embedBvnDairos], components: []});
                        }
                        else if(i.values[0] == "slc_lyomah") {
                            await message.member.roles.add('415947456342130699');
                            await client.updateUser(message.member, {faction: "lyomah"});
                            collector.stop();
                            return i.editReply({embeds:[embedBvnLyomah], components: []});
                        } 
                        else if(i.values[0] == "slc_alpha") {
                            await message.member.roles.add('665340021640921099');
                            await client.updateUser(message.member, {faction: "alpha"});
                            collector.stop();
                            return i.editReply({embeds:[embedBvnAlpha], components: []});
                        }
                    }
                }
            }
        });

    await message.reply({embeds:[all_pages[index]], components: [row], allowedMentions: {repliedUser: false} });
    //message.channel.send({embeds:[page1, page2, page3, page4, page5]});   

}

module.exports.help = { 
    name: "debuter",
    aliases: ['débuter', 'commencer'],
    category: "generalrpg",
    desription: "Permet de commencer PouleRPG.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
}; 