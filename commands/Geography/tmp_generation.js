
module.exports.run = (client, message, args) => {

    let charbon = client.randomInt(12000, 25000);
    let fer = client.randomInt(8000, 15000);
    let or = client.randomInt(1000, 3500);
    let bois = client.randomInt(50000, 90000);
    let roche = client.randomInt(80000, 150000);

    let nb_villages = client.randomInt(1, 9);

    message.channel.send(`
        **Matières brutes** :

        Charbon **${charbon}**
        Fer **${fer}**
        Or **${or}**
        Bois **${bois}**
        Roche **${roche}** 
        
        **Lieux** :
    
        Villages construisibles **${nb_villages}** ???
        
        Capitale : fortifications ; bâtiments religieux ; ... ; ...
    `);

}

module.exports.help = {
    name: "tmp_generation",
    aliases: ['tgen'],
    category: "geography",
    desription: "Commande Temporaire | Fait des essaies de génération de terrain.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};