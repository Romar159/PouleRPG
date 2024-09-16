class Player {
    constructor(discordMember, dbUser) {
        this.dbUser = dbUser;
        this.discordMember = discordMember;
    }

    async getOr() {
        // Logique pour récupérer l'or depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.or);
            reject(new Error("La fonction getOr n'a pas réussi."));
        });
    }

    async getFaction() {
        // Logique pour récupérer la faction depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.faction);
            reject(new Error("La fonction getFaction n'a pas réussi."));
        });
    }

    async getTitrePolitique() {
        // Logique pour récupérer le titre politique depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.titre_politique);
            reject(new Error("La fonction getTitrePolitique n'a pas réussi."));
        });
    }

    async getLevelMee6() {
        // Logique pour récupérer le niveau Mee6 depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.level_mee6);
            reject(new Error("La fonction getLevelMee6 n'a pas réussi."));
        });
    }

    async getExperience() {
        // Logique pour récupérer l'expérience depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.experience);
            reject(new Error("La fonction getExperience n'a pas réussi."));
        });
    }

    async getLevel() {
        // Logique pour récupérer le niveau depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.level);
            reject(new Error("La fonction getLevel n'a pas réussi."));
        });
    }

    async getMaxBank() {
        // Logique pour récupérer la limite maximale de la banque depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.maxbank);
            reject(new Error("La fonction getMaxBank n'a pas réussi."));
        });
    }

    async getEndettement() {
        // Logique pour récupérer l'endettement depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.endettement);
            reject(new Error("La fonction getEndettement n'a pas réussi."));
        });
    }

    async getDaily() {
        // Logique pour récupérer la date du daily depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.daily);
            reject(new Error("La fonction getDaily n'a pas réussi."));
        });
    }

    async getCooldownArene() {
        // Logique pour récupérer le cooldown de l'arène depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_arene);
            reject(new Error("La fonction getCooldownArene n'a pas réussi."));
        });
    }

    async getCooldownPray() {
        // Logique pour récupérer le cooldown de la prière depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_pray);
            reject(new Error("La fonction getCooldownPray n'a pas réussi."));
        });
    }

    async getCooldownTacty() {
        // Logique pour récupérer le cooldown de tactique depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_tacty);
            reject(new Error("La fonction getCooldownTacty n'a pas réussi."));
        });
    }

    async getCooldownPari() {
        // Logique pour récupérer le cooldown de pari depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_pari);
            reject(new Error("La fonction getCooldownPari n'a pas réussi."));
        });
    }

    async getCooldownMission() {
        // Logique pour récupérer le cooldown de mission depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_mission);
            reject(new Error("La fonction getCooldownMission n'a pas réussi."));
        });
    }

    async getCooldownActivity() {
        // Logique pour récupérer le cooldown d'activité depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_activity);
            reject(new Error("La fonction getCooldownActivity n'a pas réussi."));
        });
    }

    async getStateTravail() {
        // Logique pour récupérer l'état de travail depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.state_travail);
            reject(new Error("La fonction getStateTravail n'a pas réussi."));
        });
    }

    async getStateEntrainement() {
        // Logique pour récupérer l'état d'entraînement depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.state_entrainement);
            reject(new Error("La fonction getStateEntrainement n'a pas réussi."));
        });
    }

    async getStateExpedition() {
        // Logique pour récupérer l'état d'expédition depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.state_expedition);
            reject(new Error("La fonction getStateExpedition n'a pas réussi."));
        });
    }

    async getStateMission() {
        // Logique pour récupérer l'état de mission depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.state_mission);
            reject(new Error("La fonction getStateMission n'a pas réussi."));
        });
    }

    async getMetier() {
        // Logique pour récupérer le métier depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.metier);
            reject(new Error("La fonction getMetier n'a pas réussi."));
        });
    }

    async getHeureTravail() {
        // Logique pour récupérer les heures de travail depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.heure_travail);
            reject(new Error("La fonction getHeureTravail n'a pas réussi."));
        });
    }

    async getCooldownMetier() {
        // Logique pour récupérer le cooldown du métier depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_metier);
            reject(new Error("La fonction getCooldownMetier n'a pas réussi."));
        });
    }

    async getRanMinEnnemi() {
        // Logique pour récupérer la ranMinEnnemi depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.ranMinEnnemi);
            reject(new Error("La fonction getRanMinEnnemi n'a pas réussi."));
        });
    }

    async getRanMaxEnnemi() {
        // Logique pour récupérer la ranMaxEnnemi depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.ranMaxEnnemi);
            reject(new Error("La fonction getRanMaxEnnemi n'a pas réussi."));
        });
    }

    async getCooldownEnnemi() {
        // Logique pour récupérer le cooldown de l'ennemi depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_ennemi);
            reject(new Error("La fonction getCooldownEnnemi n'a pas réussi."));
        });
    }

    async getCooldownEntrainement() {
        // Logique pour récupérer le cooldown d'entraînement depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_entrainement);
            reject(new Error("La fonction getCooldownEntrainement n'a pas réussi."));
        });
    }

    async getHeureEntrainement() {
        // Logique pour récupérer les heures d'entraînement depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.heure_entrainement);
            reject(new Error("La fonction getHeureEntrainement n'a pas réussi."));
        });
    }

    async getCooldownExpedition() {
        // Logique pour récupérer le cooldown d'expédition depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.cooldown_expedition);
            reject(new Error("La fonction getCooldownExpedition n'a pas réussi."));
        });
    }

    async getExpeditionDuration() {
        // Logique pour récupérer la durée d'expédition depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.expedition_duration);
            reject(new Error("La fonction getExpeditionDuration n'a pas réussi."));
        });
    }

    async getOrExpedition() {
        // Logique pour récupérer l'or d'expédition depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.or_expedition);
            reject(new Error("La fonction getOrExpedition n'a pas réussi."));
        });
    }

    async getLocalisationExpedition() {
        // Logique pour récupérer la localisation d'expédition depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.localisation_expedition);
            reject(new Error("La fonction getLocalisationExpedition n'a pas réussi."));
        });
    }

    async getArmeFavorite() {
        // Logique pour récupérer l'arme favorite depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.armeFavorite);
            reject(new Error("La fonction getArmeFavorite n'a pas réussi."));
        });
    }

    async getTraining() {
        // Logique pour récupérer l'état d'entraînement depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.training);
            reject(new Error("La fonction getTraining n'a pas réussi."));
        });
    }

    async getPrestige() {
        // Logique pour récupérer le prestige depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.prestige);
            reject(new Error("La fonction getPrestige n'a pas réussi."));
        });
    }

    async getPiete() {
        // Logique pour récupérer la piété depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.piete);
            reject(new Error("La fonction getPiete n'a pas réussi."));
        });
    }

    async getRichesse() {
        // Logique pour récupérer la richesse depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.richesse);
            reject(new Error("La fonction getRichesse n'a pas réussi."));
        });
    }

    async getRedoutabilite() {
        // Logique pour récupérer la redoutabilité depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.redoutabilite);
            reject(new Error("La fonction getRedoutabilite n'a pas réussi."));
        });
    }

    async getForme() {
        // Logique pour récupérer la forme depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.forme);
            reject(new Error("La fonction getForme n'a pas réussi."));
        });
    }

    async getMoral() {
        // Logique pour récupérer le moral depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.moral);
            reject(new Error("La fonction getMoral n'a pas réussi."));
        });
    }

    async getTravail() {
        // Logique pour récupérer le travail depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.travail);
            reject(new Error("La fonction getTravail n'a pas réussi."));
        });
    }

    async getSavoir() {
        // Logique pour récupérer le savoir depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.savoir);
            reject(new Error("La fonction getSavoir n'a pas réussi."));
        });
    }

    async getPointsVenitienne() {
        // Logique pour récupérer les points venitienne depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.pointsvenitienne);
            reject(new Error("La fonction getPointsVenitienne n'a pas réussi."));
        });
    }

    async getPoulets() {
        // Logique pour récupérer le nombre de poulets depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.poulets);
            reject(new Error("La fonction getPoulets n'a pas réussi."));
        });
    }

    async getWinsQuiz() {
        // Logique pour récupérer le nombre de victoires aux quiz depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.wins_quiz);
            reject(new Error("La fonction getWinsQuiz n'a pas réussi."));
        });
    }

    async getAreneStreak() {
        // Logique pour récupérer la série de victoires dans l'arène depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.arene_streak);
            reject(new Error("La fonction getAreneStreak n'a pas réussi."));
        });
    }

    async getBadgesPossedes() {
        // Logique pour récupérer les badges possédés depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.badges_possedes);
            reject(new Error("La fonction getBadgesPossedes n'a pas réussi."));
        });
    }

    async getFoundEasterEggs() {
        // Logique pour récupérer le nombre d'easter eggs trouvés depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.foundedeastereggs);
            reject(new Error("La fonction getFoundEasterEggs n'a pas réussi."));
        });
    }

    async getGuildID() {
        // Logique pour récupérer l'ID de la guilde depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.guildID);
            reject(new Error("La fonction getGuildID n'a pas réussi."));
        });
    }

    async getGuildName() {
        // Logique pour récupérer le nom de la guilde depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.guildName);
            reject(new Error("La fonction getGuildName n'a pas réussi."));
        });
    }

    async getUserID() {
        // Logique pour récupérer l'ID de l'utilisateur depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.userID);
            reject(new Error("La fonction getUserID n'a pas réussi."));
        });
    }

    async getUsername() {
        // Logique pour récupérer le nom d'utilisateur depuis la base de données
        return new Promise((resolve, reject) => {
            resolve(this.dbUser.username);
            reject(new Error("La fonction getUsername n'a pas réussi."));
        });
    }

    isMaster() {
        if(this.dbUser.metier == 904) {
            return false;
        }
    }

    
}

module.exports = Player;

