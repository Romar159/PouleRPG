const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    const items = [];
    const shop = require('../../assets/shop/shop.json');
    const q = args.join(" ");
    const position = shop.map(e => e.name.toLowerCase()).indexOf(q.toLowerCase());
    if(q && position == -1) message.reply("**Erreur !** Cet objet n'existe pas.");

    const embed = new MessageEmbed()
    .setTitle(":shopping_cart: Magasin civil. :shopping_bags:")
    .setColor('#F2DB0C')
    

    if(q && position !== -1) {
        try {
            const item = shop[position];
            message.channel.send(`Voulez vous vraiment acheter \`${item.name}\` pour \`${item.price}\` or ? (oui)`);
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages(filter, {
                max:1, time:5000, errors: ['time']
            });
    
            if(userEntry.first().content.toLowerCase() === "oui") {
                if(dbUser.or < item.price) {
                    message.channel.send(":money_with_wings: Vous n'avez pas assez d'argent pour acheter cet objet.");
                } else {
                    client.setOr(client, message.member, -item.price, message);
                    if(item.name === "Point de puissance")
                        await client.updateUser(message.member, {"powerpoints": (dbUser.powerpoints + 1)});

                    message.channel.send(`Merci pour votre achat.\nVous avez maintenant ${dbUser.or - item.price} or dans votre banque.`);
                }
            }
        } catch(e) {
            message.channel.send('Achat annulé, merci de confirmer l\'achat en répondant : `oui`');
        }
    } else {
        shop.map(e => { items.push(`${e.name} | ${e.price} Or`) });
        embed.setDescription(`Voici les différents objets disponibles :\n\n${items.map(item => `• **${item}**`).join('\n')}`);
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "magasin",
    aliases: ['shop'],
    category: "economie",
    desription: "Ouvre le magasin.",
    usage: "[item_to_buy]",
    cooldown: 5,
    permissions: false,
    args: false
};