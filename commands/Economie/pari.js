const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    if(isNaN(args[0])) return message.reply("Veuillez entrer une valeur numérique.") 
    let x = parseInt(args[0]);
    let o = 0;
    let prestige = "";
    let richesse = "";

    if(x > dbUser.or) return message.reply("Vous n'avez pas assez d'or.");
    if(x < 5) return message.reply("Cette valeur est trop faible. Minimum 5 or");

    const dailyCD = 7200000; 
    
    const lastDaily = await dbUser.cooldown_pari;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il n'y a plus de combats sur lesquels parier ! Attendez encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes, il devrait y en avoir de nouveau. :hourglass:`);
    } else { // Si le cooldown est passé.
        await client.updateUser(message.member, {cooldown_pari: Date.now()});


        await client.setOr(client, message.member, -x, message);

        let y = (Math.log(x * client.randomFloat(0.975, 1.275))) / 1.5;
            
        if(client.randomFloat(0, y) <= 1) {
            y = Math.log(x * client.randomFloat(0.95, 1.25));

            if(client.randomFloat(0, y) <= 1) {
                o = (x * 1.5) * client.randomFloat(1, 1.1);
                if(client.randomInt(0, 3) == 0) {
                    await client.editPoint(client, message.member, 10, "prestige");
                    prestige = "ainsi que 10 points de **prestige** ";
                    console.log("prestige up");
                } 
                if(client.randomInt(0, 8) == 0) {
                    await client.editPoint(client, message.member, 2, "richesse");
                    richesse = "et 2 points de **richesse**";
                    console.log("richesse up");
                }

                await client.setOr(client, message.member, Math.round(o), message);
                return message.channel.send(`Bravo ! Vous avez parié juste ! Vous gagnez ${Math.round(o)} :coin: ${prestige}${richesse}`);
            }

            o = (x * 1.1) * client.randomFloat(1, 1.1);
            if(client.randomInt(0, 3) == 0) { 
                await client.editPoint(client, message.member, 3, "prestige");
                prestige = "ainsi que 3 points de **prestige** ";
                console.log("prestige down");
            } 
            if(client.randomInt(0, 7) == 0) {
                await client.editPoint(client, message.member, 1, "richesse");
                richesse = "et 1 point de **richesse**";
                console.log("richesse down");

            }
            
            await client.setOr(client, message.member, Math.round(o), message);
            return message.channel.send(`Bravo ! Vous avez parié juste ! Vous gagnez ${Math.round(o)} :coin: ${prestige}${richesse}`);
        }
        return message.channel.send(`Vous avez perdu votre pari ! -${x} :coin:`);
        
    }
};

module.exports.help = {
    name: "pari",
    aliases: [],
    category: "economie",
    desription: "Pariez une somme d'or sur un combattant pour possiblement gagner plus !",
    usage: "<somme>",
    cooldown: 2,
    permissions: false,
    args: true
};