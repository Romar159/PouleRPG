const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    // ! INFONCTIONNEL -> Sera rework dans une prochaine màj
    let items = [];
    const shop = require('../../assets/shop/shop.json');
    let or = dbUser.or;

    const embed = new MessageEmbed()
    .setTitle(":shopping_cart: Magasin civil :shopping_bags:")
    .setColor('#F2DB0C')
  
    shop.map(e => { items.push(`${e.id} • ${e.name} | ${e.price} Or`) });
    embed.setDescription(`Voici les différents objets disponibles :\n\n${items.map(item => `• **${item}**`).join('\n')}`);
    message.channel.send({embeds:[embed]});

    const filter = m => (message.author.id === m.author.id);
    const userEntry = await message.channel.awaitMessages(filter, {
        max:1, time:60000, errors: ['time']
    });

 
    if(userEntry.first().content) {
        let args2 = userEntry.first().content.split(/ +/);
        let quantity = 0;
        let item;
        
        if(isNaN(userEntry.first().content)) {
            if(client.filterByName(shop, userEntry.first().content.toLowerCase())) {
                item = client.filterByName(shop, userEntry.first().content.toLowerCase());
            } else {
                return message.channel.send("Cet item n'existe pas attardé de première.");
            }
        } else {
            if(isNaN(args2[0])) return message.channel.send(`Cet item n'existe pas fils de con.`);

            if(client.filterById(shop, args2[0])) {
                item = client.filterById(shop, args2[0]);
            } else {
                return message.reply("Cet item n'existe pas enculé.");
            }
        }

        if(!args2[0]) return message.reply("Item invalide. T'es vraiment con toi"); // Impossible


        if(item.price > or) return message.channel.send("T'as pas assez de frique sous merde.");
        message.channel.send(`Machin cul t'as choisi cette merde : ${item.name} ! T'en veux combien fils de pute ?`);
        // ? DraxyNote : alors dans le json il y a la ligne "description" cependant je l'ai pas inclu ici parce que 
        // ? je sais pas si on fait une commande infoitem, ou alors quand on choisit l'item (juste au dessus) ça nous 
        // ? dit juste à quoi il sert ? (pour l'utiliser -> 'item.description')

        const filter2 = m => (message.author.id === m.author.id);
        const userEntry2 = await message.channel.awaitMessages(filter2, {
            max:1, time:15000, errors: ['time']
        });

        if(userEntry2.first().content) {
            let args3 = userEntry2.first().content.split(/ +/);

            if(args3[0] && isNaN(args3[0]) || args3[0] < 1) return message.reply("Quantité Invalide.");
            if(!args3[0]) quantity = 1;
            else quantity = args3[0];

            let total = item.price * quantity;        
            if(total > or) return message.reply(`Vous n'avez pas assez d'argent.\n Vous avez ${or} et le prix est ${total}`);
        
            message.channel.send(`${quantity} ${item.name} acheté(es) pour un total de **${total}** :coin:.\nMerci de votre confiance et à bientôt chez Poulamazon.`);
            client.addItemById(client, message, message.member, dbUser, item.id, quantity);
            
        }
    } 
};

module.exports.help = {
    name: "magasin",
    aliases: ['shop'],
    category: "economie",
    desription: "Ouvre le magasin.",
    usage: "",
    cooldown: 5,
    permissions: false,
    args: false
};