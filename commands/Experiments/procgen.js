const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');


module.exports.run = async (client, message, args) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`, "warn");

    let size = 512;
        const canvas = Canvas.createCanvas(size, size);
		const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(255,255,255,1)';

        //const background = Canvas.fillStyle = 'blue';
        context.fillRect(0, 0, size, size);

        for(let x=0; x<size/8; x++) {
            for(let y=0; y<size/8; y++) {
                context.fillStyle = `rgba(${client.randomInt(0,1)},${client.randomInt(0,1)},${client.randomInt(0,1)},1)`;
                context.fillRect(x*8, y*8, 8, 8);
            }
        }

        
        
        for(let x=0; x<size/8; x++) {
            for(let y=0; y<size/8; y++) {
                let dataCurrent = context.getImageData(x*8,y*8,1,1).data;
                let dataUp=0,dataDown=0,dataLeft=0,dataRight=0;

                    if(y!=0)
                        dataUp = context.getImageData(x*8,(y*8)-8,1,1).data;
                

                    if(y!=(size/8)-8)
                        dataDown = context.getImageData(x*8,(y*8)+8,1,1).data;
               

                    if(x!=0)
                        dataLeft = context.getImageData((x*8)-8,y*8,1,1).data;
               

                    if(x!=(size/8)-8)
                        dataRight = context.getImageData((x*8)+8,y*8,1,1).data;
                
                console.log(`Current: ${dataCurrent}\nUP: ${dataUp} \nDOWN: ${dataDown} \nLEFT: ${dataLeft} \nRIGHT: ${dataRight}`);
               
                if(dataCurrent[0] == dataUp[0] && dataCurrent[1] == dataUp[1]) {
                    context.fillStyle = `rgba(255,0,0,1)`;
                } else if(dataCurrent[0] == dataDown[0] && dataCurrent[1] == dataDown[1]) {
                    context.fillStyle = `rgba(0,255,0,1)`;
                } else if(dataCurrent[0] == dataLeft[0] && dataCurrent[1] == dataLeft[1]) {
                    context.fillStyle = `rgba(0,0,255,1)`;
                } else if(dataCurrent[0] == dataRight[0] && dataCurrent[1] == dataRight[1]) {
                    context.fillStyle = `rgba(255,255,255,1)`;
                } else {
                    context.fillStyle = `rgba(255,0,255,1)`;
                }
                context.fillRect(x*8, y*8, 8, 8);

            }
        }
        
        
        //context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const attachment = new AttachmentBuilder(canvas.toBuffer());
        message.reply({ files: [attachment] });
   
}

module.exports.help = {
    name: "procgen",
    aliases: ['pg'],
    category: "experiments",
    desription: "Genère une carte procéduralement",
    usage: "",
    cooldown: 1,
    permissions: true,
    args: false 
};