const {randomInt} = require("../../util/functions/randominteger");

module.exports.run = (client, message) => {
    if (randomInt(1,2) == 1)
        return message.channel.send(`PILE !`);
    else   
        return message.channel.send(`FACE !`);
}

module.exports.help = {
    name: "pileouface",
    aliases: ['pileouface'],
    category: "entertainment",
    desription: "Lance une pièce pour faire un pile ou face.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
};