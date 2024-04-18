const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');

module.exports.run = async (client, message, args) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`, `warn`);

    const img = await Canvas.loadImage("./base.png");

    const canvas = Canvas.createCanvas(1200, 1200);
	const context = canvas.getContext('2d');

    //context.drawImage(img, 0, 0, img.width, img.height);

    //img.getImageData(left, top, width, height);
    //context.fillRect(x*8, y*8, 8, 8);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: "data.png" });
    message.channel.send({ files: [attachment] });
}

module.exports.help = {
    name: "upscaling",
    aliases: ['us'],
    category: "",
    desription: "Augmente la qualité d'une image",
    usage: "",
    cooldown: 1,
    permissions: true,
    args: false 
};