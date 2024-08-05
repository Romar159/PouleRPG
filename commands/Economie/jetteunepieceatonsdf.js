module.exports.run = async (client, message, args, settings, dbUser) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);


    const list_badges = require('../../assets/rpg/badges.json');

    const dailyCD = 36000000;
    
    const lastDaily = await dbUser.cooldown_tacty;
    //if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
    if(lastDaily > Date.now()) {
        //const cdTime = dailyCD - (Date.now() - lastDaily);
        const cdTime = lastDaily - Date.now(); 
        message.reply(`Il n'y a plus aucun SDF dans le coin, attendez encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes, il devrait y en avoir de nouveau. :dash:`);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - wait cooldown : ${Math.floor(cdTime / (1000*60*60) % 24)}:${Math.floor(cdTime / (1000*60) % 60)}:${Math.floor(cdTime / (1000) % 60)} | lastdaily=${lastDaily} | dailycd=${dailyCD} | Date: ${Date.now()}`);

    } else { // Si le cooldown est passé.

        if(dbUser.or <= 0) return message.channel.send(":money_with_wings: Vous êtes vous même un SDF, vous ne pouvez pas donner de poyn.");
        

        /*let member_ran;
        member_ran = message.guild.members.cache.random();
    
        if(member_ran.user.bot) {
            while(member_ran.user.bot) {
                member_ran = message.guild.member(message.guild.members.cache.random());
                console.log("Retry -> BOT");
            }
        }*/

        
        let arr = await Array.from(message.guild.members.cache.filter(member => !member.user.bot));
        let ran_usr = arr[Math.floor(Math.random() * arr.length)];

        let member_ran = ran_usr[1]; 

    
        //let mbm = message.guild.member(message.author); //! DEPRECATED

        //member_ran = message.guild.member(member_ran);
    
        /*const dataUser = await client.getUser(member_ran);
        if(!dataUser) {
            await client.createUser({
                guildID: member_ran.guild.id,
                guildName: member_ran.guild.name,
            
                userID: member_ran.id,
                username: member_ran.user.tag,
            });
        }*/
    
        
    
        // await client.setXp(client, mbm, 10); // ? Est-ce abusé ? 
        
        /* if(randomInt(1, 5) == 3) { //! pas encore en vigueur
            // TODO: POST BETA: Ajouter un point d'amitié avec la faction de l'utilisateur cible (voir cahier des charges. #idées-bonnes).
        } */

        let randomPiete = client.randomInt(1, 3);
        let randomMoral = client.randomInt(2, 4);
    
        const m = message.channel.send("Vous recherchez un SDF ...").then(async msg => {
            if(member_ran == message.member) { //soit même
                randomMoral = client.randomInt(4, 7);
                await client.editPoint(client, message.member, randomMoral, "moral");
                msg.edit(`:coin: Vous êtes tellement SDF que vous vous jetez un sou à vous même ? Soit, +${randomMoral} points de moral !`);
            } else {
                await client.editPoint(client, message.member, randomPiete, "piete");
                await client.editPoint(client, message.member, randomMoral, "moral");

                msg.edit(`:coin: Vous avez jeté un sou à ce SDF de **${member_ran.displayName}** et vous gagnez donc ${randomPiete} points de piété pour cette bonne action ainsi que ${randomMoral} points de moral.`); // \nDebug: executed in ${msg.createdTimestamp - message.createdTimestamp}ms
            }
        });

        await client.setOr(client, member_ran, 1, message);
        await client.setOr(client, message.member, -1, message);
        let randomHour = client.randomInt(4, 6) * 60 * 60 * 1000;
        client.updateUser(message.member, {cooldown_tacty: Date.now() + randomHour});

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - pièce jetée de ${message.author.tag} (${message.author.id}) à ${member_ran.user.tag} (${member_ran.user.id})`);

        if(member_ran == message.member) {
            if(await client.addBadge(client, message.member, dbUser, "2")) {
                message.channel.send(`WOW !! ${message.member} vient de gagner le badge **${client.filterById(list_badges, 2).name}** !`);
                client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - badge ID=2 obtenu pour ${message.member}`)
            }
        }
    }
}

module.exports.help = {
    name: "jetteunepieceatonsdf",
    aliases: ['tactysdf', "eupatsdf", "jupatsdf", "tossacointoyousdf", "envoieunepieceatonsdf", "sdf"],
    category: "economie",
    desription: "Envoie une de vos pièces à un utilisateur aléatoire, vous permettant de gagner de la piété",
    usage: "",
    cooldown: 5,
    permissions: false,
    args: false
};