const {EmbedBuilder} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    if(isNaN(args[0])) return message.reply("Veuillez entrer une valeur numérique.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Valeur Invalide. MESSAGEE=${message.content}.`, "err"); 
    let x = parseInt(args[0]);
    let o = 0;
    //let prestige = "";
    let richesse = "";

    if(x > dbUser.or) return message.reply("Vous n'avez pas assez de poyn.") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - quantité de poyn trop faible. NECESSAIRE=${x} | ACTUEL=${dbUser.or} MESSAGE=${message.content}`, "err");
    if(x < 5) return message.reply("Cette valeur est trop faible. Minimum 5 poyn") & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Valeur trop faible. NECESSAIRE=5. MESSAGE=${message.content}`);

    const dailyCD = 7200000; 
    
    const lastDaily = await dbUser.cooldown_pari;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) < 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il n'y a plus de combats sur lesquels parier ! Attendez encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes, il devrait y en avoir de nouveau. :hourglass:`);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - wait cooldown : ${Math.floor(cdTime / (1000*60*60) % 24)}:${Math.floor(cdTime / (1000*60) % 60)}:${Math.floor(cdTime / (1000) % 60)} | lastdaily=${lastDaily} | dailycd=${dailyCD} | Date: ${Date.now()}`);

    } else { // Si le cooldown est passé.
        await client.updateUser(message.member, {cooldown_pari: Date.now()});


        await client.setOr(client, message.member, -x, message);

        let y = (Math.log(x * client.randomFloat(0.975, 1.275))) / 1.5;
            
        if(client.randomFloat(0, y) <= 1) {
            y = Math.log(x * client.randomFloat(0.95, 1.25));

            // if(client.randomFloat(0, y) <= 1) {
            //     o = (x * 1.5) * client.randomFloat(1, 1.1);
            //     /*if(client.randomInt(0, 3) == 0) {
            //         await client.editPoint(client, message.member, 10, "prestige");
            //         prestige = "ainsi que 10 points de **prestige** ";
            //         console.log("prestige up");
            //     }*/ 
            //     if(client.randomInt(0, 8) == 0) {
            //         await client.editPoint(client, message.member, 2, "richesse");
            //         richesse = "et 2 points de **richesse**";
            //         console.log("richesse up");
            //     }

            //     await client.setOr(client, message.member, Math.round(o), message);
            //     return message.channel.send(`Bravo ! Vous avez parié juste ! Vous gagnez ${Math.round(o)} poyn :coin: ${prestige}${richesse}`);
            // }

            o = (x * 1.1) * client.randomFloat(1, 1.1);
            /*if(client.randomInt(0, 3) == 0) { 
                await client.editPoint(client, message.member, 3, "prestige");
                prestige = "ainsi que 3 points de **prestige** ";
                console.log("prestige down");
            } */
           var quantity_pts_richesse = 0;
            if(client.randomInt(0, 8) >= 7) {
                message.channel.send("DEBUG FIRST")
                quantity_pts_richesse = 1;
                if(client.randomInt(0, 7) >= 6) {
                    message.channel.send("DEBUG SECOND")
                    quantity_pts_richesse = 2;
                    if(client.randomInt(0, 6) >= 5) {
                        message.channel.send("DEBUG THIRD")
                        quantity_pts_richesse = 3;
                    }
                }

                await client.editPoint(client, message.member, quantity_pts_richesse, "richesse");
                richesse = "et "+quantity_pts_richesse+" point de **richesse**";
                if(quantity_pts_richesse>1) richesse = "et "+quantity_pts_richesse+" points de **richesse**"; //conjugaison
                console.log("richesse +" + quantity_pts_richesse);
            }

            
            
            await client.setOr(client, message.member, Math.round(o), message);
            return message.channel.send(`Bravo ! Vous avez parié juste ! Vous gagnez ${Math.round(o)} poyn :coin: ${richesse}`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Pari réussi.`);
        }
        return message.channel.send(`Vous avez perdu votre pari ! -${x} poyn :coin:`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Pari perdu. -${x} poyn.`);
        
    }
};

module.exports.help = {
    name: "pari",
    aliases: [],
    category: "economie",
    desription: "Pariez une somme de poyn sur un combattant pour possiblement gagner plus !",
    usage: "<poyn>",
    cooldown: 2,
    permissions: false,
    args: true
};