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
}

module.exports = User;