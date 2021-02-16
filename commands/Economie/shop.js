const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {
    const items = [];
    const shop = require('../../assets/shop/shop.json');
    const q = args.join(" ");
    const position = shop.map(e => e.name.toLowerCase()).indexOf(q.toLowerCase());
    if(q && position == -1) message.reply("ERROR, cet objet n'existe pas.");

    const embed = new MessageEmbed()
    .setTitle("Shop Civile.")
    

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
                    message.channel.send("Vous n'avez pas assez d'argent pour acheter cet objet.");
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
        shop.map(e => { items.push(`${e.name} | ${e.price} or`) });
        embed.setDescription(`Le Shop accessible pour tout le monde.\nVoici les differents objets disponnibles:\n\n${items.map(item => `**${item}**`).join('\n')}`);
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "shop",
    aliases: ['shop', 'magasin'],
    category: "economie",
    desription: "Ouvre le shop.",
    usage: "[item_to_buy]",
    cooldown: 5,
    permissions: false,
    args: false
};