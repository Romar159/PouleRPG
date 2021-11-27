module.exports.run = async (client, message, args, settings, dbUser) => {

    var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
    var est_maitre = false;

    var titres_honorifiques = ['Maître des écuries', 'Grand aumônier', 'Échanson'];
    var titres_politiques = ['Maréchal', 'Intendant', 'Chapelain'];

    var est_titre_honorifique = true; // true = honorifique / false = politique
    var est_aumonier = false;
    var roletitre;

    for(let y=0; y<roles_maitre.length; y++) {
        if(message.member.roles.cache.has(roles_maitre[y])) {
            est_maitre = true;
            break;
        } else {
            est_maitre = false;
        }
    }
    if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");

    if(args[0] == "liste") {
        return message.channel.send("Voici la liste des titres honorifiques que vous pouvez accorder à vos membres : **" + titres_honorifiques.join('** ; **') + "** \nEt voici la liste des titres politiques : **" + titres_politiques.join('** ; **') + "** (pour plus de précision sur les titres, reférerez vous au guide de PouleRPG.");
    }

    const user = message.guild.members.cache.get(message.mentions.users.first().id);
    const memberDB = await client.getUser(user);
    const action = args[1];
    let titre = args[2];

    if(args[3] != undefined) {
        titre = args[2] + " " + args[3];      
        if(args[4] != undefined) {
            titre = titre + " " + args[4]; 
        }
    } 
   // message.channel.send(`DEBUG: ${memberDB.faction} | ${dbUser.faction} | ${user}`);

    if(user == message.member) return message.reply("vous ne pouvez pas vous accorder un titre à vous même.");
    if(memberDB.faction != dbUser.faction) return message.reply(`cet utilisateur n'est pas dans votre faction. ICI->**${args[0]}**`);
    
    if(user == undefined) return message.reply(`cet utilisateur n'est pas valide. ICI->**${args[0]}**`);
    if(args[1] != "accorder") {
        if(args[1] != "révoquer") {
            return message.reply(`cette action n'existe pas. ICI->**${args[1]}**`);
        }
    }
     
    // ça c bo n'empaiche. :)
    if(titre != titres_honorifiques[0]) {
        if(titre != titres_honorifiques[1]) {
            if(titre != titres_honorifiques[2]) {
                if(titre != titres_politiques[0]) {
                    if(titre != titres_politiques[1]) {
                        if(titre != titres_politiques[2]) {
                            return message.reply(`Ce titre n'existe pas. ICI->**${titre}**`)
                        } else {
                            est_titre_honorifique = false;
                            roletitre = message.guild.roles.cache.find(r => r.id === "887045324034691072")
                         //   console.log("Chapelain");
                        }
                    } else {
                        est_titre_honorifique = false;
                        roletitre = message.guild.roles.cache.find(r => r.id === "887045363532447774")

                       // console.log("Intendant");
                    }
                } else {
                    est_titre_honorifique = false;
                    roletitre = message.guild.roles.cache.find(r => r.id === "887045234482106389")

                   // console.log("Maréchal");
                }
            } else {
                est_titre_honorifique = true;
                //console.log("Echanson");
            }
        }  else {
            est_titre_honorifique = true;
            est_aumonier = true;
            //console.log("Aumonier");
        }
    } else {
        //console.log("Maitre ecurie");
        est_titre_honorifique = true;
        
    }

    //message.channel.send(`DEBUG: USER: ${user} \nAction: ${action} \nTitre: ${titre} \n Honorifique ? : ${est_titre_honorifique}`);

    if(action == "révoquer") {
        if(est_titre_honorifique) {
            if(memberDB.titre_honorifique == "NULL") return message.channel.send("Cet utilisateur n'a pas de titre honorifique.");
            if(memberDB.titre_honorifique != titre) return message.channel.send("Cet utiisateur n'a pas ce titre. Il possède : " + memberDB.titre_honorifique);
            else client.updateUser(user, {titre_honorifique : "NULL"});

            if(est_aumonier) {
                message.channel.send(`${user} à perdu son titre honorifique de ${titre} et perd donc 100 prestige et 50 piété.`); 
                client.editPoint(client, user, -50, "piete"); 
            } else {
                message.channel.send(`${user} à perdu son titre honorifique de ${titre} et perd donc 100 prestige.`);
            }
            client.editPoint(client, user, -100, "prestige"); 
            
        }
        else if(!est_titre_honorifique) {
            if(memberDB.titre_politique == "NULL") return message.channel.send("Cet utilisateur n'a pas de titre politique.");
            if(memberDB.titre_politique != titre) return message.channel.send("Cet utiisateur n'a pas ce titre. Il possède : " + memberDB.titre_politique);
            else client.updateUser(user, {titre_politique : "NULL"});
            message.channel.send(`${user} à perdu son titre politique de ${titre} et perd donc 200 prestige.`);
            await client.updateUser(user, {metier: 0}); // retire son métier politique !
            client.editPoint(client, user, -200, "prestige");
            user.roles.remove(roletitre);
        }
    }   
    
    if(action == "accorder") {
        // acorder sauf si quelqu'un d'autre l'a déjà.

        
        
        if(est_titre_honorifique) {
            let usr = await client.getUserTitreHonorifique(titre);
            if(usr != undefined) {
                if(usr.faction == dbUser.faction) {
                    return message.channel.send(`${usr.username} à déjà ce titre.`);
                }
            }

            if(memberDB.titre_honorifique != "NULL") return message.channel.send("Cet utilisateur a déjà un titre honorifique. Il possède le titre de " + memberDB.titre_honorifique);
            else client.updateUser(user, {titre_honorifique : titre});
            if(est_aumonier) {
                message.channel.send(`${message.member} à accordé à ${user} le titre honorifique de ${titre} et ce dernier gagne donc 100 prestige et 50 piété.`);
                client.editPoint(client, user, 50, "piete"); 

            } else {
                message.channel.send(`${message.member} à accordé à ${user} le titre honorifique de ${titre} et ce dernier gagne donc 100 prestige.`);
            }
            client.editPoint(client, user, 100, "prestige"); 
        }
        else if(!est_titre_honorifique) {
            let usr = await client.getUserTitrePolitique(titre);
            if(usr != undefined) {
                if(usr.faction == dbUser.faction) {
                    return message.channel.send(`${usr.username} à déjà ce titre.`);
                }
            }

            if(memberDB.titre_politique != "NULL") return message.channel.send("Cet utilisateur a déjà un titre politique. Il possède le titre de " + memberDB.titre_politique);
            else client.updateUser(user, {titre_politique : titre});
            message.channel.send(`${message.member} à accordé à ${user} le titre politique de ${titre} et ce dernier gagne donc 200 prestige.`);
            
            let id_metier = 0;
            if(titre == "Maréchal") id_metier = 901;
            if(titre == "Intendant") id_metier = 902;
            if(titre == "Chapelain") id_metier = 903;
            await client.updateUser(user, {metier: id_metier}); // ajoute son métier politique !

            client.editPoint(client, user, 200, "prestige"); 
            user.roles.add(roletitre);
        }
    }
}

module.exports.help = {
    name: "titre",
    aliases: ['titre'],
    category: "politique, diplomatie et economie",
    desription: "Accordez ou révoquer un titre honorifique ou politique à un membre de votre faction.",
    usage: '[liste] <@USER> <action:accorder/révoquer> <titre>',
    cooldown: 3, 
    permissions: false,
    args: true,
};