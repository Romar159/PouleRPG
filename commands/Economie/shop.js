const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
var json_shop;
var is_event = false;

module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);
    message.channel.send("/!\\ ATTENTION Le Shop est obsolète et est en cours de réaménagement /!\\");
    return;

    if(!args[0]) {
        const filter = i => (i.customId === 'pts' || i.customId === 'itm' || i.customId === "evt") && i.user.id === message.author.id;
        const filterItems = i2 => (i2.customId === 'expe' || i2.customId === 'craft' || i2.customId === "eqip") && i2.user.id === message.author.id;

    
        const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pts')
                .setLabel('Points')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('itm')
                .setLabel('Items')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('evt')
                .setLabel('Events')
                .setStyle(ButtonStyle.Primary), 
        );

        const items_collector = message.channel.createMessageComponentCollector({ filterItems, time: 15000 });
        const items_row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('expe')
                .setLabel('Expédition')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('craft')
                .setLabel('Crafts')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('eqip') 
                .setLabel('⚔️ Équipement')
                .setStyle(ButtonStyle.Secondary),
        );

        const embed = new EmbedBuilder()
        .setColor('BF2F00')
        .setAuthor({name: `List item`, iconURL: client.user.displayAvatarURL()});


        collector.on('collect', async i => {
            if (i.customId === 'pts') {
                await i.deferUpdate();
                json_shop = require('../../assets/shop/shop_points.json');
                json_shop.forEach(element => {
                    embed.addFields({name: `\`${element.id}\` - ${element.name}`, value: `${element.description} | ${element.price} :coin:`})
                });
                await i.editReply({ embeds:[embed], components: [] });
            }
            else if (i.customId === 'itm') {
                await i.deferUpdate();
                items_collector.on('collect', async i2 => {
                    if (i2.customId === 'expe') {
                        await i2.deferUpdate();
                        json_shop = require('../../assets/shop/items/shop_items_expedition.json');

                        json_shop.forEach(element => {
                            embed.addFields({name:`\`${element.id}\` - ${element.name}`, value:`${element.description} | ${element.price} :coin:`})
                        });
                        await i2.editReply({ embeds:[embed], components: [] });
                        
                    }
                    else if (i2.customId === 'craft') {
                        await i2.deferUpdate();
                        json_shop = require('../../assets/shop/items/shop_items_craft.json');
                        json_shop.forEach(element => {
                            embed.addFields({name:`\`${element.id}\` - ${element.name}`, value: `${element.description} | ${element.price} :coin:`})
                        });
                        await i2.editReply({ embeds:[embed], components: [] });

                    }
                    else if (i2.customId === 'eqip') {
                        await i2.deferUpdate();
                        json_shop = require('../../assets/shop/items/shop_items_equipement.json');

                        json_shop.forEach(element => {
                            embed.addFields({name: `\`${element.id}\` - ${element.name}`, value: `${element.description} | ${element.price} :coin:`})
                        });
                        await i2.editReply({ embeds:[embed], components: [] });
                        


                    }

                    
                    // Pour choisir les items
                    /*let filter = m => m.author.id === message.author.id;
                    let collectorsd = message.channel.createMessageCollector({ filter, time: 15000, maxProcessed: 1 });
                        
                    await collectorsd.on('collect', m => {
                        let choix = m.content.split(' ');
                        let quantité = 1;
                        if(!isNaN(choix[0])) {
                            if(choix[1]) {
                                if(!isNaN(choix[1])) {
                                    if(choix[1] < 1) return message.reply(`Quantité invalide. Ne peut être en dessous de 1`);
                                    quantité = choix[1]
                                } else {
                                    return message.reply(`Quantité invalide.`);
                                }
                            }

                            if(choix[0] <= json_shop.length && choix[0] > 0) {
                                quantité = parseInt(quantité);

                                //message.channel.send(`Collected ${json_shop[choix[0] - 1].name} * ${quantité}`); //*debug
                                let prix_total = json_shop[choix[0] - 1].price * quantité;
                                if(prix_total > dbUser.or) return message.reply(`Vous n'avez pas assez d'or pour payer ${prix_total}. Vous possédez actuellement ${dbUser.or}`);
                                client.setOr(client, message.member, -prix_total, message);
                                eval(json_shop[choix[0] - 1].action);
                                return message.channel.send(`Merci pour votre achat de ${quantité} ${json_shop[choix[0] - 1].name} pour un total de ${prix_total} :coin: DBG`);
                                
                            }
                            
                        }
                    });*/
                });
                await i.editReply({ content:`Choisissez la catégorie d'Item que vous souhaitez consulter.`, components: [items_row] });

            }
            else if (i.customId === 'evt') {
                await i.deferUpdate();
                json_shop = require('../../assets/shop/shop_events.json');
                json_shop.forEach(element => {
                    embed.addFields({name: `\`${element.id}\` - ${element.name}`, value:`${element.description} | ${element.price} :coin:`})
                });
                is_event = true;
                await i.editReply({ embeds:[embed], components: [] });
            }

            //pour choisir les points ou events
            
            let filterreste = m => m.author.id === message.author.id;
            let collectorsd2 = message.channel.createMessageCollector({ filterreste, time: 15000, maxProcessed: 1 });
                        
                    await collectorsd2.on('collect', m => {
                        let choix = m.content.split(' ');
                        let quantité = 1;
                        if(!isNaN(choix[0])) {
                            if(choix[1]) {
                                if(!isNaN(choix[1])) {
                                    if(choix[1] < 1) return message.reply(`Quantité invalide. Ne peut être en dessous de 1`);
                                    quantité = choix[1]
                                } else {
                                    return message.reply(`Quantité invalide.`);
                                }
                            }

                            if(is_event) quantité = 1; // * pas besoin de quantité, inutile d'acheter plusieurs fois un pack d'event.
                            quantité = parseInt(quantité);
                            // ! Il faudra également verifier si on n'a pas déjà ce pack, dans ce cas empêcher l'achat.
                            if(choix[0] <= json_shop.length && choix[0] > 0) {
                                //message.channel.send(`Collected ${json_shop[choix[0] - 1].name} * ${quantité}`); //*debug
                                let prix_total = json_shop[choix[0] - 1].price * quantité;
                                if(prix_total > dbUser.or) return message.reply(`Vous n'avez pas assez d'or pour payer ${prix_total}. Vous possédez actuellement ${dbUser.or}`);
                                client.setOr(client, message.member, -prix_total, message);
                                eval(json_shop[choix[0] - 1].action);
                                return message.channel.send(`Merci pour votre achat de ${quantité} ${json_shop[choix[0] - 1].name} pour un total de ${prix_total} :coin:`);
                            
                            }
                            
                        }
                    });
        });

        message.reply({ content:`Choisissez la catégorie que vous souhaitez consulter`, components: [row] });



    } else { //Achat rapide en une commande
        let quantité = 1;
        if(isNaN(args[0])) return message.reply(`Cette catégorie n'existe pas.`);
        if(args[0] < 1 || args[0] > 3) return message.reply(`Cette catégorie n'existe pas.`);
        if(args[0] == 2 && isNaN(args[1])) return message.reply(`Cette sous-catégorie d'item n'existe pas.`);
        if(args[0] == 2 && args[1] > 3) return message.reply(`Cette catégorie d'item n'existe pas.`);
        if(args[0] == 2 && args[1] < 1) return message.reply(`Cette catégorie d'item n'existe pas.`);

        if(args[0] == 1) { // points

            json_shop = require('../../assets/shop/shop_points.json');

            if(!args[1]) return message.reply(`Veuillez renseigner un identifiant valide.`);
            if(args[1] > json_shop.length) return message.reply(`Cet item n'existe pas.`);
            if(args[1] < 1) return message.reply(`Cet item n'existe pas`);
            if(args[2]) {
                if(!isNaN(args[2])) {
                    quantité = args[2];
                }
            }
            quantité = parseInt(quantité);

            let prix_total = json_shop[args[1] - 1].price * quantité;
            if(prix_total > dbUser.or) return message.reply(`Vous n'avez pas assez d'or pour payer ${prix_total}. Vous possédez actuellement ${dbUser.or}`);
            await client.setOr(client, message.member, -prix_total, message);
            eval(json_shop[args[1] - 1].action)
            return message.channel.send(`Merci pour votre achat de ${quantité} ${json_shop[args[1] - 1].name} pour un total de ${prix_total} :coin:`);
        }
        else if(args[0] == 2) { // items
            if(args[1] > 3) return message.reply(`Cette sous-catégorie d'item n'existe pas.`);
            if(args[1] < 1) return message.reply(`Cette sous-catégorie d'item n'existe pas.`);
            if(!args[1]) return message.reply(`Veuillez renseigner une sous-catégorie d'item valide.`);

            if(args[1] == 1) json_shop = require('../../assets/shop/items/shop_items_expedition.json');
            else if(args[1] == 2) json_shop = require('../../assets/shop/items/shop_items_craft.json');
            else if(args[1] == 3) json_shop = require('../../assets/shop/items/shop_items_equipement.json');

            if(args[2] > json_shop.length) return message.reply(`Cet item n'existe pas.`);
            if(args[2] < 1) return message.reply(`Cet item n'existe pas`);
            if(!args[2]) return message.reply(`Veuillez renseigner un identifiant valide.`);

            if(args[3]) {
                if(!isNaN(args[3])) {
                    quantité = args[3];
                }
            }
            quantité = parseInt(quantité);

            let prix_total = json_shop[args[2] - 1].price * quantité;
            if(prix_total > dbUser.or) return message.reply(`Vous n'avez pas assez d'or pour payer ${prix_total}. Vous possédez actuellement ${dbUser.or}`);
            await client.setOr(client, message.member, -prix_total, message);
            eval(json_shop[args[2] - 1].action)
            return message.channel.send(`Merci pour votre achat de ${quantité} ${json_shop[args[2] - 1].name} pour un total de ${prix_total} :coin:`);

        }
        else if(args[0] == 3) { // events

            json_shop = require('../../assets/shop/shop_events.json');

            if(!args[1]) return message.reply(`Cet item n'existe pas.`);
            if(args[1] > json_shop.length) return message.reply(`Cet item n'existe pas.`);
            if(args[1] < 1) return message.reply(`Cet item n'existe pas`);
            
            // * pas besoin de quantité, inutile d'acheter plusieurs fois un pack d'event.
            let prix_total = json_shop[args[1] - 1].price;
            if(prix_total > dbUser.or) return message.reply(`Vous n'avez pas assez d'or pour payer ${prix_total}. Vous possédez actuellement ${dbUser.or}`);
            await client.setOr(client, message.member, -prix_total, message);
            eval(json_shop[args[1] - 1].action)
            return message.channel.send(`Merci pour votre achat de ${json_shop[args[1] - 1].name} pour un total de ${prix_total} :coin:`);
        }
    } 
};

module.exports.help = {
    name: "magasin",
    aliases: ['shop'],
    category: "",
    desription: "Ouvre le magasin. Deprecated !",
    usage: "",
    cooldown: 5,
    permissions: false,
    args: false
};