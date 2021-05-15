const {randomInt} = require('../../util/functions/randominteger');

module.exports.run = async (client, message, args, settings, dbUser) => {

    const dailyCD = 8.64e+7;
    
    const lastDaily = await dbUser.cooldown_tacty;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`il n'y a plus aucun SDF dans le coin, attendez encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes, il devrait y en avoir de nouveau. :dash:`);
    } else { // Si le cooldown est passé.

        if(dbUser.or <= 0) return message.channel.send(":money_with_wings: Vous êtes vous même un SDF, vous ne pouvez pas donner d'argent.");
        
        let member_ran;
        member_ran = message.guild.members.cache.random();
    
        if(member_ran.user.bot) {
            while(member_ran.user.bot) {
                member_ran = message.guild.member(message.guild.members.cache.random());
                console.log("Retry -> BOT");
            }
        }	
    
        let mbm = message.guild.member(message.author);
        member_ran = message.guild.member(member_ran);
    
        const dataUser = await client.getUser(member_ran);
        if(!dataUser) {
            await client.createUser({
                guildID: member_ran.guild.id,
                guildName: member_ran.guild.name,
            
                userID: member_ran.id,
                username: member_ran.user.tag,
            });
        }
    
        await client.setOr(client, member_ran, 1, message);
        await client.setOr(client, mbm, -1, message);
    
        await client.setXp(client, mbm, 10); // ? Est-ce abusé ? 
        
        if(randomInt(1, 5) == 3) {
            // TODO: POST BETA: Ajouter un point d'amitié avec la faction de l'utilisateur cible (voir cahier des charges. #idées-bonnes).
        }
    
        message.channel.send(`:coin: Vous avez jeté un sous à ce SDF de **${member_ran.displayName}**`);
        client.updateUser(message.member, {cooldown_tacty: Date.now()});
    }
}

module.exports.help = {
    name: "tossacointoyoursdf",
    aliases: ['tactysdf'],
    category: "economie",
    desription: "Envoie une de vos pièce à un utilisateur aléatoire, vous permettant de gagner de l'XP, et avec de la chance un point d'amitié.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
};