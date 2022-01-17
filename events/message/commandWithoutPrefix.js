const {MessageEmbed} = require("discord.js");

module.exports = async (client, message) => {
    const dbUser = await client.getUser(message.member);
    const user = message.author;
    const msg = message.content.toLowerCase();
    if(user.bot) return;

    if(msg.indexOf('bonne nuit') >= 0 || msg.indexOf('bon nui') >= 0 || msg.indexOf('bon nuit') >= 0 || msg.indexOf('bone nuit') >= 0 || msg.indexOf('bananenuit') >= 0) {
        const bonnenuit_ran = client.randomInt(1, 5);
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
      
    if(msg.indexOf('hitler') >= 0) {
        client.addFoundedEasterEgg(client, message.member, dbUser, 3);
        return message.channel.send("Arrêtez tout !! Le point Godwin est atteint !");
    }
    
    if(msg.indexOf('🙏') >= 0 && message.channel.id == '445370665395159060') {

        const lastDaily = await dbUser.cooldown_pray; 
        let dateNow = new Date()

        if(dateNow.getFullYear() === lastDaily.getFullYear() && dateNow.getMonth() === lastDaily.getMonth() && dateNow.getDate() === lastDaily.getDate()) {
            return;
        } else {
            let random_pray = client.randomInt(1, 3);
            
            await client.updateUser(message.member, {cooldown_pray: Date.now()});
            await client.editPoint(client, message.member, random_pray, "piete");
            return message.author.send(`Dieu Poulet a entendu votre prière ! +${random_pray} points de piété.`);
        }
    }

    if(msg.indexOf('je peux faire ce que je veux') >= 0) {
        client.addFoundedEasterEgg(client, message.member, dbUser, 4);
        return message.channel.send(`Eouez meczz, t'as vu ça? <:EP_poulet_trop_classe:803391420580233226>`);
    }

    if(msg.indexOf('fuck les majuscules') >= 0) {
        client.addFoundedEasterEgg(client, message.member, dbUser, 5);
        return message.channel.send(`C'est pas de ma faute si t'es pété. :person_shrugging:`);
    }

    if(msg.split(/(,|\?|!|\.|"|'|-|\/|\\|`|:|~| )+/).includes('cul')) {
        return message.channel.send(`OH UN CUL ! <:EP_GIGA_SATANAS:670675422756732932>`)
    }

    if(msg.indexOf('maintenante') >= 0) {
        client.addFoundedEasterEgg(client, message.member, dbUser, 6);

        return message.channel.send(`Ah oui alors là, l'ancien WarPreferences de mon cul oui ! **:)**`);
    }

    if(msg.indexOf('grcher') >= 0 || msg.indexOf('drcher') >= 0) {
        client.addFoundedEasterEgg(client, message.member, dbUser, 7);
        return message.channel.send(`Le beau profil de cul là avec la classe de merde !`);
    }
}