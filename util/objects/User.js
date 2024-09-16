class User {
    constructor(discordMember, dbUser) {
        this.dbUser = dbUser;
        this.discordMember = discordMember;
    }

    async getMoney() {
        // Logique pour récupérer l'argent depuis la base de données
        // Par exemple, vous pourriez utiliser une requête à une base de données
        // Ici, j'utilise une promesse simulée à des fins de démonstration
        return new Promise((resolve, reject) => {
            // Remplacez ceci par votre logique réelle de récupération d'argent
            // Exemple: resolve(100);
            resolve(this.dbUser.or);
            reject(new Error("La fonction getMoney n'a pas réussi."));
        });
    }

    async getFaction() {
        // Logique pour récupérer l'argent depuis la base de données
        // Par exemple, vous pourriez utiliser une requête à une base de données
        // Ici, j'utilise une promesse simulée à des fins de démonstration
        return new Promise((resolve, reject) => {
            // Remplacez ceci par votre logique réelle de récupération d'argent
            // Exemple: resolve(100);
            resolve(this.dbUser.faction);
            reject(new Error("La fonction getMoney n'a pas réussi."));
        });
    }
}

module.exports = User;

/*

  "faction": "epsilon",
  "titre_politique": "NULL",
  "level_mee6": 1,
  "experience": 1546,
  "level": 9,
  "or": 514,
  "maxbank": 80000,
  "endettement": 0,
  "daily": {
    "$date": "1970-01-01T00:00:00.000Z"
  },
  "cooldown_arene": {
    "$date": "2024-08-17T22:22:42.432Z"
  },
  "cooldown_pray": {
    "$date": "2024-08-10T13:55:15.408Z"
  },
  "cooldown_tacty": {
    "$date": "2024-08-18T02:22:47.303Z"
  },
  "cooldown_pari": {
    "$date": "2024-08-17T22:22:48.927Z"
  },
  "cooldown_mission": {
    "$date": "1970-01-01T00:00:00.000Z"
  },
  "cooldown_activity": {
    "$date": "2024-08-18T08:22:41.994Z"
  },
  "state_travail": false,
  "state_entrainement": false,
  "state_expedition": true,
  "state_mission": false,
  "metier": 904,
  "heure_travail": 0,
  "cooldown_metier": {
    "$date": "1970-01-01T00:00:00.000Z"
  },
  "ranMinEnnemi": 0.7,
  "ranMaxEnnemi": 1.3,
  "cooldown_ennemi": {
    "$date": "2024-08-17T22:22:50.260Z"
  },
  "cooldown_entrainement": {
    "$date": "1970-01-01T00:00:00.000Z"
  },
  "heure_entrainement": 0,
  "cooldown_expedition": {
    "$date": "1970-01-01T00:00:00.000Z"
  },
  "expedition_duration": 0,
  "or_expedition": 0,
  "localisation_expedition": "lyomah",
  "armeFavorite": 0,
  "training": false,
  "prestige": 229,
  "piete": 563,
  "richesse": 25,
  "redoutabilite": 4,
  "forme": 7,
  "moral": 132,
  "travail": 616,
  "savoir": 598,
  "pointsvenitienne": 0,
  "poulets": 598,
  "wins_quiz": 8,
  "arene_streak": 0,
  "badges_possedes": "603524",
  "foundedeastereggs": "1039",
  "guildID": "415943423636537344",
  "guildName": "L'Empire du Poulet",
  "userID": "421400262423347211",
  "username": "romar1#0"
*/