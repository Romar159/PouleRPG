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

        if(dbUser.class == "guerrier") {
            ranMin = 0.8;
            ranMax = 1.2;
            phrase = "Vous donnez un violent coup d'épée sur"
        } else if(dbUser.class == "archer") {
            ranMin = 0.7;
            ranMax = 1.3;
            phrase = "Vous tirez une flèche très puissante sur"
        } else if(dbUser.class == "cavalier") {
            ranMin = 0.9;
            ranMax = 1.1;
            phrase = "Vous foncez avec votre cheval sur"
        } else {
            return message.reply("Vous devez posséder une classe avant de lancer un combat. faites `p<préférencecsguerre` pour selectionner votre classe.");
        }

        let ennemi = ennemis[client.randomInt(0, ennemis.length - 1)];
        let LevelMob = client.randomInt(ennemi.levelMin, ennemi.levelMax);

        
        let final_user = (dbUser.level * client.randomFloat(ranMin, ranMax)) / (LevelMob * client.randomFloat(ennemi.ranMin, ennemi.ranMax));
        let final_mob = (LevelMob * client.randomFloat(ennemi.ranMin, ennemi.ranMax)) / (dbUser.level * client.randomFloat(ranMin, ranMax));

        //message.channel.send(`**${message.author.username}** Niveau ${dbUser.level} - Puissance : ${final_user} \n**${ennemi.name}** Niveau ${LevelMob} - Puissance : ${final_mob}`);
        if(final_user > final_mob) { //win
            message.channel.send(`${phrase} ${ennemi.name}, Vous gagnez !`); //? DraxyNote : Ici (et aussi en dessous) tu peux mettre plus d'infos, genre nom du mob, son niveau etc... enfin ce qui est dispo dans la BDD ennemis.json
            //await client.setXp(client, message.member, 10) //! TEMP 
            eval(ennemi.gains);
        } else { //lose
            message.channel.send(`${ennemi.name} ${ennemi.attaques[client.randomInt(0, ennemi.attaques.length - 1)]} Vous perdez !`);
        }
        await client.updateUser(message.member, {cooldown_ennemi: Date.now()});
    }
}

module.exports.help = {
    name: "ennemi",
    aliases: ['enm'],
    category: "generalrpg",
    desription: "Battez vous contre un ennemi pour gagner de l'xp",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};

/* Ennemis random dev

    {
        "id": 0,
        "name": "Slime",
        "levelMin": 1,
        "levelMax": 6,
        "ranMin": 0.5,
        "ranMax": 1.3,
        "attaques": ["lance de la gêlée", "vous étouffe"]
    },
    {
        "id": 1,
        "name": "Satanas Chicken",
        "levelMin": 150,
        "levelMax": 300,
        "ranMin": 0.950,
        "ranMax": 3.5,
        "attaques": ["Fait apparaître un restaurant KFC", "vous dit qu'il va anéantir tous les poulets du monde pour les manger !"]
    }

*/