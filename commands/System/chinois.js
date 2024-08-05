module.exports.run = (client, message, args, settings, dbUser) => {

    const emojis = [':rice:', ':man_with_chinese_cap:', ':flag_cn:'];
    const phrases = ["Ping pong ping pong !", "Je mange du chien.", "Trois grains de riz nourrissent toute ma nation.", "Tching Tchang Tchong !", "Yé sui oun petit tinois."];

    const random_emoji = client.randomInt(0, emojis.length - 1);
    const random_phrase =  client.randomInt(0, phrases.length - 1);


    const m = message.channel.send("Calcul...").then(async msg => {
        msg.edit(`${emojis[random_emoji]} | ${phrases[random_phrase]}\nTemps de réponse : **${msg.createdTimestamp - message.createdTimestamp}ms**`);
    });
    client.addFoundedEasterEgg(client, message.member, dbUser, 9);
}

/*module.exports.runSlash = async (client, interaction) => {

    try {
        const msg = await interaction.reply({content: ":ping_pong: **|** Pong !\nTemps de réponse : **...ms**", fetchReply: true});

        await interaction.editReply({content: `:ping_pong: **|** Pong !\nTemps de réponse : **${msg.createdTimestamp - interaction.createdTimestamp}ms**`})

    } catch (error) {
        console.log("ERROR: ", error);
    }
}*/

module.exports.help = {
    name: "chinois",
    aliases: ["chintok", "tchingtchingtchong", "chine"],
    category: "",
    desription: "Renvoie le temps de latence du bot de manière raciste.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};