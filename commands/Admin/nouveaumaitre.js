const fs = require("fs");
const jsondata = require("../../assets/rpg/archivesmaitres.json");

module.exports.run = async (client, message, args) => {

    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    if(!message.mentions.members.first()) {
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Mention Invalide. Message=${message.content}`, "err");
        return message.reply("Veuillez renseigner un utilisateur valide.");
    } 
    
    const fac = args[1].toLowerCase();
    const member = message.guild.members.cache.get(message.mentions.users.first().id);
    let role_maitre;


    switch(fac) {
        case "epsilon":
            role_maitre = message.guild.roles.cache.get("445617906072682514");
        break;

        case "daïros":
            role_maitre = message.guild.roles.cache.get("445617911747313665");
        break;

        case "lyomah":
            role_maitre = message.guild.roles.cache.get("445617908903706624");
            break;

        case "alpha":
            role_maitre = message.guild.roles.cache.get("665340068046831646");
            break;

        default:
            client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Faction Invalide. Message=${message.content}`, "err");
            return message.reply("veuillez entrer une faction valide.");
    }

    let dbFaction = await client.getFaction(fac);

    let ancienmaitre = message.guild.members.cache.get(dbFaction.idmaitre);
    if(ancienmaitre != undefined) ancienmaitre.roles.remove(role_maitre);

    await client.updateFaction(fac, {idmaitre: message.mentions.users.first().id});
    member.roles.add(role_maitre);
    
    client.editPoint(client, member, 500, "prestige");

    client.updateUser(ancienmaitre, {metier: 0});
    client.updateUser(member, {metier: 904});
    

    let dbNouveauMaitre = client.getUser(member);
    if(dbNouveauMaitre.titre_politique != "NULL") {
        client.updateUser(member, {titre_politique: "NULL"});
        client.editPoint(client, member, -200, "prestige");
    }

    await message.channel.send(`${message.mentions.users.first()} est à présent le nouveau Maître de la faction ${fac}`);
    client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - ${message.mentions.users.first().tag} (${message.mentions.users.first().id}) remplace ${ancienmaitre.user.tag} (${ancienmaitre.user.id}) dans ${fac}`);


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    let date = today


    //The object to be added
    const addition = {
        id : jsondata.length,
        faction: fac,
        userid: message.mentions.users.first().id,
        debmandat: date
        };
        fs.readFile("assets/rpg/archivesmaitres.json", "utf8", function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now converting it to an object
            obj.push(addition); //adding the data
            var json = JSON.stringify(obj, null, 2); //converting it back to json
            fs.writeFile("assets/rpg/archivesmaitres.json", json, "utf8", (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Done");
            }
            });
        }
        });

        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - JSON ArchivesMaitre édité. ID: ${addition.id}`);
    

}

module.exports.help = {
    name: "nouveaumaitre",
    aliases: ['nouveauMaitre'],
    category: "admin",
    desription: "Modifie le maître de faction.",
    usage: '<@USER> <faction>',
    cooldown: 1, 
    permissions: true,
    args: true
};