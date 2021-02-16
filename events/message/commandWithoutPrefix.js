const {randomInt} = require("../../util/functions/randominteger");

module.exports = async (client, message) => {
    const dbUser = await client.getUser(message.member);
    const user = message.author;
    const msg = message.content.toLowerCase();
    if(user.bot || user.id == "297414955618140162") return;

    if(msg.indexOf('bonne nuit') >= 0 || msg.indexOf('bon nui') >= 0 || msg.indexOf('bon nuit') >= 0 || msg.indexOf('bone nuit') >= 0) {
        const bonnenuit_ran = randomInt(1, 5);
        switch(bonnenuit_ran) {
            case 1:
                return message.channel.send("Bonne Nuiiiiiiiit :)))) !!!");
            break;

            case 2:
                return message.channel.send("Bon nui."); 
            break;

            case 3:
                return message.channel.send("Bonne nuit sale boomer de merde.");
            break;

            case 4:
                return message.channel.send("LA TRES BONNE NUIT TA MERE :))))");
            break;

            case 5:
                return message.channel.send("BONNNNEUUUUH NUIIIIIIT ***(*:**");
            break;
        }
    }
      
    if(msg.indexOf('hitler') >= 0)
        return message.channel.send("Arrêtez tout !! Le point Godwin est atteint !");
    
    if(msg.indexOf('🙏') >= 0 && message.channel.id == '445370665395159060') {
            
        const dailyCD = 8.64e+7;
        if(!dbUser.or) await client.updateUser(message.member, {or: 0});

        const lastDaily = await dbUser.daily;
        if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
            return;
        } else { // Si le cooldown est passé
            let random_pray = randomInt(1, 12);
            if(random_pray > 0) {
                message.author.send("Dieu Poulet à entendu votre prière ! +2 or dans votre banque.");
                client.setOr(client, message.member, 2, message);
                
            }
            client.updateUser(message.member, {cooldown_pray: Date.now()});
        }
    }
}