const { MessageEmbed } = require("discord.js");
const ennemis = require("../../assets/rpg/ennemis.json")

module.exports.run = async (client, message, args, settings, dbUser) => {
    const dailyCD = 3600000 * 2;
    
    const lastDaily = await dbUser.cooldown_ennemi;
    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) < 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`Il vous reste encore **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes à attendre avant de pouvoir combattre un ennemi de nouveau !`);
    } else { // Si le cooldown est passé.

        let ranMin;
        let ranMax;
        let phrase;
        let phrasePerdre = [" cependant, vous n'arrivez pas à encaisser le choc", ", cela vous détruit", " et vous n'arrivez pas à le supporter", ", la force de cette attaque vous tétanise", ", cela vous donne le cancer", " et vous tombez au sol", ", vous essayez d'esquiver mais ce fut un échec"]
        let gagner;

        if(dbUser.class == "guerrier") {
            ranMin = 0.8;
            ranMax = 1.2;
            phrase = ["Vous donnez un violent coup d'épée sur", "Vous tranchez violemment"]
        } else if(dbUser.class == "archer") {
            ranMin = 0.7;
            ranMax = 1.3;
            phrase = ["Vous tirez une flèche très puissante sur", "Vous tirez une pluie de flèches sur", "Vous décochez une sublime flèche sur"]
        } else if(dbUser.class == "cavalier") {
            ranMin = 0.9;
            ranMax = 1.1;
            phrase = ["Vous foncez avec votre cheval sur"]
        } else {
            return message.reply("Vous devez posséder une classe avant de lancer un combat. faites `p<préférencecsguerre` pour selectionner votre classe.");
        }

        //let ennemi = ennemis[client.randomInt(0, ennemis.length - 1)];

        let f_enm = client.filterByLevel(ennemis, dbUser);
        let ennemi = f_enm[client.randomInt(0, f_enm.length - 1)];

        if(!ennemi) ennemi = ennemis[client.randomInt(0, ennemis.length - 1)];


        //recup tous les mobs compris entre dbUser.level - 5 et dbUser.level + 5;
        //while(ennemi.levelMax > dbUser.level + 5)

        let LevelMob = client.randomInt(ennemi.levelMin, ennemi.levelMax);

        
        let final_user = (dbUser.level * client.randomFloat(ranMin, ranMax)) / (LevelMob * client.randomFloat(ennemi.ranMin, ennemi.ranMax));
        let final_mob = (LevelMob * client.randomFloat(ennemi.ranMin, ennemi.ranMax)) / (dbUser.level * client.randomFloat(ranMin, ranMax));

        const embed = new MessageEmbed();
        
        //message.channel.send(`**${message.author.username}** Niveau ${dbUser.level} - Puissance : ${final_user} \n**${ennemi.name}** Niveau ${LevelMob} - Puissance : ${final_mob}`);
        if(final_user > final_mob) { //win
            eval(ennemi.gains);
            embed.setAuthor(`Victoire !`, message.author.displayAvatarURL())
            .setColor('3F992D')
            .setDescription(`${phrase[client.randomInt(0, phrase.length - 1)]} un(e) **${ennemi.name}** de niveau **${LevelMob}** !\n**${gagner}**`); // ? RomarNote
            message.channel.send({embeds:[embed]});
            //await client.setXp(client, message.member, 10) //! TEMP 

        } else { //lose
            embed.setAuthor(`Défaite...`, message.author.displayAvatarURL())
            .setColor('BF2F00')
            .setDescription(`**${ennemi.name}** de niveau **${LevelMob}** ${ennemi.attaques[client.randomInt(0, ennemi.attaques.length - 1)]}${phrasePerdre[client.randomInt(0, phrasePerdre.length - 1)]}...`);
            message.channel.send({embeds:[embed]});
        }
        await client.updateUser(message.member, {cooldown_ennemi: Date.now()});
    }
}

module.exports.help = {
    name: "ennemi",
    aliases: ['enm'],
    category: "generalrpg",
    desription: "Tentez de vous battre contre un ennemi pour possiblement gagner diverses récompenses.",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false,
};