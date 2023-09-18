const mongoose = require("mongoose");
const { Guild, User, Faction, Aov, Aovtp } = require("../../models/index");
const {randomInt} = require("./randoms");
const fs = require("fs");
const gameconfig = require("../../assets/gameconfigs");

module.exports = client => {

    //crée une entrée dans la db R18
    client.createAov = async aov => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, aov);
        const createAov = await new Aov(merged);
        createAov.save().then(g => console.log(`R18: Nouveau ${g.categorie} -> ${g.texte}`));    
    };

    //crée une entrée dans la db tout public
    client.createAovtp = async aovtp => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, aovtp);
        const createAovtp = await new Aovtp(merged);
        createAovtp.save().then(g => console.log(`TP: Nouveau ${g.categorie} -> ${g.texte}`));    
    };

    client.getRandomAov = async (category, rating) => {
        if(rating == "R18") {
            const data = await Aov.find({ categorie: category});
            if(data) {
                console.log(data[0]);
                return data[client.randomInt(0, data.length - 1)]
            }
            else return;
        } else {
            const data = await Aovtp.find({ categorie: category});
            if(data) {
                console.log(data[0]);
                return data[client.randomInt(0, data.length - 1)]
            }
            else return;
        }
    }


    client.createGuild = async guild => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, guild);
        const createGuild = await new Guild(merged);
        createGuild.save().then(g => console.log(`Nouveau serveur -> ${g.guildName}`));    
    };

    client.getGuild = async guild => {
        const data = await Guild.findOne({ guildID: guild.id});
        if(data) return data;
        return client.config.DEFAULTSETTINGS; 
    };

    client.updateGuild = async (guild, settings) => {
        let data = await client.getGuild(guild);
        if(typeof data !== "object") data = {};
        for(const key in settings) {
            if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };


    client.createUser = async user => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId()}, user);
        const createUser = await new User(merged);
        createUser.save().then(u => console.log(`Nouvel utilisateur -> ${u.username}`))
    };

    client.getUser = async user => {
        const data = await User.findOne({ userID: user.id});
        if(data) return data;
        else return; 
    };

    client.getUserTitreHonorifique = async titre => {
        const data = await User.findOne({ titre_honorifique: titre});
        if(data) return data;
        else return; 
    };

    client.getUserTitrePolitique = async titre => {
        const data = await User.findOne({ titre_politique: titre});
        if(data) return data;
        else return; 
    };

    client.getUsersInjail = async () => {
        const data = await User.find({ in_jail: true});
        if(data) return data;
        else return; 
    };

    client.getUsersByFaction = async (faction_name) => {
        const data = await User.find({ faction: faction_name});
        if(data) return data;
        else return; 
    };

    client.getUsers = async guild => {
        const data = await User.find({ guildID: guild.id});
        if(data) return data;
        else return;
    }

    client.updateUser = async (user, settings) => {
        let data = await client.getUser(user);
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    }

    client.getFaction = async faction => {
        const data = await Faction.findOne({ name: faction});
        if(data) return data;
        else return; 
    };

    client.updateFaction = async (faction, settings) => {
        let data = await client.getFaction(faction);
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    }



    client.verifposition = async (client, dbUser, mention, faction1db) => {
        if(faction1db.a1 == mention) await client.updateFaction(dbUser.faction, {a1: "NULL"});
        if(faction1db.a2 == mention) await client.updateFaction(dbUser.faction, {a2: "NULL"});
        if(faction1db.a3 == mention) await client.updateFaction(dbUser.faction, {a3: "NULL"});

        if(faction1db.b1 == mention) await client.updateFaction(dbUser.faction, {b1: "NULL"});
        if(faction1db.b2 == mention) await client.updateFaction(dbUser.faction, {b2: "NULL"});
        if(faction1db.b3 == mention) await client.updateFaction(dbUser.faction, {b3: "NULL"});

        if(faction1db.c1 == mention) await client.updateFaction(dbUser.faction, {c1: "NULL"});
        if(faction1db.c2 == mention) await client.updateFaction(dbUser.faction, {c2: "NULL"});
        if(faction1db.c3 == mention) await client.updateFaction(dbUser.faction, {c3: "NULL"});
    }

    client.getPeloRole = async mention => {
        
        await client.updateMaxBank(client, mention);
        const dbmention = await client.getUser(mention);

        var mxbk = [gameconfig.MAXBANQUE_PAYSAN, gameconfig.MAXBANQUE_ARTISAN, gameconfig.MAXBANQUE_BOURGEOIS, gameconfig.MAXBANQUE_COURTISAN, gameconfig.MAXBANQUE_BARON, gameconfig.MAXBANQUE_COMTE, gameconfig.MAXBANQUE_MARQUIS, gameconfig.MAXBANQUE_DUC, gameconfig.MAXBANQUE_VASSAL];
        var levels_pelos = [gameconfig.MEE6LEVEL_PAYSAN, gameconfig.MEE6LEVEL_ARTISAN, gameconfig.MEE6LEVEL_BOURGEOIS, gameconfig.MEE6LEVEL_COURTISAN, gameconfig.MEE6LEVEL_BARON, gameconfig.MEE6LEVEL_COMTE, gameconfig.MEE6LEVEL_MARQUIS, gameconfig.MEE6LEVEL_DUC, gameconfig.MEE6LEVEL_VASSAL];

        for(let i=0;i<mxbk.length;i++) {
            if(dbmention.maxbank == mxbk[i])
                client.updateUser(mention, {level_mee6: levels_pelos[i]});
        }
    }

    client.loadDependencies = client => {
        client.config = require("../../config");
        client.mongoose = require("../mongoose");
        require("./setXp")(client);
        require("./setOr")(client);
        require("./randoms")(client);
        require("./updateMaxBank")(client);
        //require("./edit_points.js")(client);
         
    } 

    /**
     * 
     * @param {string} log Message log
     * @param {string} type Type de log [ERR, WARN, INFO] default : "INFO"
     * Write a text (log) in the file ./logs/logs.log
     */
    client.writeLog = (log, type) => {
        
        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let hours = date_time.getHours();
        let minutes = date_time.getMinutes();
        let seconds = date_time.getSeconds();

        if(hours.toString().length < 2) hours = "0" + hours;
        if(minutes.toString().length < 2) minutes = "0" + minutes;
        if(seconds.toString().length < 2) seconds = "0" + seconds;

        if(type == undefined) type = "info";

        let line = `${year}-${month}-${date} ${hours}:${minutes}:${seconds} [${type.toUpperCase()}] | ${log}\n`;

        fs.appendFile("./logs/logs.log", line, function(err) {
            if(err) {
                return console.log(err);
            }
        });  
    }

    client.logCommandExecution = (message, command) => {
        
        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let hours = date_time.getHours();
        let minutes = date_time.getMinutes();
        let seconds = date_time.getSeconds();

        if(hours.toString().length < 2) hours = "0" + hours;
        if(minutes.toString().length < 2) minutes = "0" + minutes;
        if(seconds.toString().length < 2) seconds = "0" + seconds;
        let line = `${year}-${month}-${date} ${hours}:${minutes}:${seconds} [EXECUTION] | ${command.help.name} executée par ${message.author.tag} (${message.author.id}) \n`;

        fs.appendFile("./logs/logs.log", line, function(err) {
            if(err) {
                return console.log(err);
            }
        });  
    }

    client.addBadge = async (client, member, dbUser, badgeid) => {
        if(dbUser.badges_possedes.includes(badgeid)) return false;
        var new_string = dbUser.badges_possedes + badgeid;
        await client.updateUser(member, {badges_possedes: new_string});
        return true;
    }

    client.addFoundedEasterEgg = async (client, member, dbUser, eeID) => {
        if(dbUser.foundedeastereggs.includes(eeID)) return false;
        const list_badges = require('../../assets/rpg/badges.json');
        var new_string = dbUser.foundedeastereggs + eeID;
        await client.updateUser(member, {foundedeastereggs: new_string});
        if((dbUser.foundedeastereggs.length + 1) == 3) {
            if(await client.addBadge(client, member, dbUser, "6")) {
                client.channels.cache.get('415945814045884427').send(`WOW !! ${member} vient de gagner le badge **${client.filterById(list_badges, 6).name}** !`);
            }
        }
        return true;
    }

    client.addItemById = async(client, message, member, dbUser, itemid, quantity) => {
        const shop = require('../../assets/shop/shop.json');
        let item = await client.filterById(shop, itemid);
        let price = item.price * quantity;

        // ---
        // item spéciaux -> On fait une action spécifique. :
        return; // temporairement invalide
        if(itemid == 1) { // * Point de puissance.
            await client.setOr(client, member, -price, message);
            let items = parseInt(dbUser.puissance) + parseInt(quantity);
            await client.updateUser(member, {"puissance": items});
        }

        // ---
        // items classique -> On les mets dans un string par ID tout comme les badges.
    }

    client.removeItemById = async(client, member, dbUser, itemid, quantity) => {
        let item = await client.filterById(shop, itemid);
        return; // temporairement invalide
        // ---
        // item spéciaux -> On fait une action spécifique. :
        if(itemid == 1) { // * Point de puissance.
            let items = parseInt(dbUser.puissance) - parseInt(quantity);
            await client.updateUser(member, {"puissance": items});
        }

        // ---
        // items classique -> On les mets dans un string par ID tout comme les badges.
    }

    // Récupérer un élément par ID
    //EXEMPLE:  filterById(list_badges, 0).name;
    client.filterById = (jsonObject, id) => {
        return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];
    }

    client.filterByName = (jsonObject, name) => {
        return jsonObject.filter(function(jsonObject) { return (jsonObject['name'].toLowerCase() == name.toLowerCase());})[0];
    }

    client.eventFilterByRarity = (jsonObject, rarete) => { // s'utilise que pour les events (que si dans le json y'a un paramètre "rarete")
        //return jsonObject.filter(function(jsonObject) { return (jsonObject['rarete'] == rarete);})[0];

        return result = jsonObject.filter(obj => obj.rarete == rarete);
    }

    client.filterByLevel = (jsonObject, dbUser) => { // s'utilise que pour les ennemis
        //return jsonObject.filter(function(jsonObject) { return (jsonObject['rarete'] == rarete);})[0];

        return result = jsonObject.filter(obj => obj.levelMin > dbUser.level - 5 && obj.levelMax < dbUser.level + 5);
    }

    // POINTS :

    // ex editpoint(50, "piete")
    // redoutabilité, piete, prestige, richesse, travail, forme, savoir, moral

    client.editPoint = async (client, member, quantity, point) => {

        const userToUpdate = await client.getUser(member);
        let point_base = 0;

        switch(point) {
            case "redoutabilite":
                if(userToUpdate.redoutabilite == undefined) point_base = 0;
                else point_base = userToUpdate.redoutabilite
                await client.updateUser(member, { redoutabilite: point_base + quantity});
            break;

            case "piete":
                if(userToUpdate.piete == undefined) point_base = 0;
                else point_base = userToUpdate.piete
                await client.updateUser(member, { piete: point_base + quantity});
            break;

            case "prestige":
                if(userToUpdate.prestige == undefined) point_base = 0;
                else point_base = userToUpdate.prestige
                await client.updateUser(member, { prestige: point_base + quantity});
            break;

            case "richesse":
                if(userToUpdate.richesse == undefined) point_base = 0;
                else point_base = userToUpdate.richesse
                await client.updateUser(member, { richesse: point_base + quantity});
            break;

            case "travail":
                if(userToUpdate.travail == undefined) point_base = 0;
                else point_base = userToUpdate.travail
                await client.updateUser(member, { travail: point_base + quantity});
            break;

            case "forme":
                if(userToUpdate.forme == undefined) point_base = 0;
                else point_base = userToUpdate.forme
                await client.updateUser(member, { forme: point_base + quantity});
            break;

            case "savoir":
                if(userToUpdate.savoir == undefined) point_base = 0;
                else point_base = userToUpdate.savoir
                await client.updateUser(member, { savoir: point_base + quantity});
            break;

            case "moral":
                if(userToUpdate.moral == undefined) point_base = 0;
                else point_base = userToUpdate.moral
                await client.updateUser(member, { moral: point_base + quantity});
            break;
        } 
    }

    

    // returns random key from Set or Map
    client.getRandomKeyOfMap = (collection) => {
        //let keys = Array.from(collection.keys());
        //console.log("HERE : " + collection.length);
        return collection[client.randomInt(0, collection.length - 1)];
    };

    /**
     * @Param {Client} client
     * @Param {GuildMember} member
     * @deprecated
     */
    client.isMaster = (message) => { 
        //verification du rôle de maître
        const roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
        let est_maitre = false;
        
        for(let y=0; y<roles_maitre.length; y++) {
            if(message.member.roles.cache.has(roles_maitre[y])) { est_maitre = true; break;}
            else est_maitre = false;
        }
        return est_maitre;
    };

    // 901 = Maréchal ; 902 = Intendant ; 903 = Chapelain
    client.isConseiller = async (member, id_metier_conseiller) => {
        //verification du rôle de conseiller

        const dbMembre = await client.getUser(member);
        if(dbMembre.metier == id_metier_conseiller) {
            return true;
        } else {
            return false;
        }
    };

    client.isMaitre = async (member) => {
        //verification du rôle de maître

        const dbMembre = await client.getUser(member);
        if(dbMembre.metier == 904) {
            return true;
        } else {
            return false;
        }
    };

    client.checkTaxes = async (message) => {

        let members; // declaration de la liste des membres.
        const metiers = require("../../assets/rpg/metiers/metiers.json");

        const bdd_user = await client.getUser(message.member);
        const dbFaction = await client.getFaction(bdd_user.faction);

        if(dbFaction === undefined || bdd_user === undefined) return;

        let last_check = dbFaction.cooldown_taxe;

        var Difference_In_Time = Date.now() - last_check.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        
        // /*debug:*/ message.channel.send(last_check.toString() + " \n dif: " + Math.floor(Difference_In_Days));

        if(Math.floor(Difference_In_Days) >= 7) { //fait au moins 7 jours.
            //on définit la nouvelle date de test au Lundi de cette semaine.
            const today = new Date();
            const first = today.getDate() - today.getDay() + 1;
            const monday = new Date(today.setDate(first));
            await client.updateFaction(dbFaction.name, {cooldown_taxe: monday});

            // et on calcul les montants

            //récupération des membres de chaque faction.
            message.guild.members.fetch().then(fetchAll => { 
                if(dbFaction.name = "epsilon") members = fetchAll.filter(m => m.roles.cache.get('415947454626660366'));
                else if(dbFaction.name = "daïros") members = fetchAll.filter(m => m.roles.cache.get('415947455582961686'));
                else if(dbFaction.name = "lyomah") members = fetchAll.filter(m => m.roles.cache.get('415947456342130699'));
                else if(dbFaction.name = "alpha") members = fetchAll.filter(m => m.roles.cache.get('665340021640921099'));

                members.forEach(async element => {
                    let usr = await client.getUser(element);
                    let metier = await client.filterById(metiers, usr.metier);
                    //console.log("ELEMENT: " + element + "\nusr: " + usr + "\nMETIER: " + metier);
                    if(metier !== undefined) {
                        if(metier.id != "904") { //sauf le maître

                            //On calcul le pourcentage de la taxe en fonction du salaire.
                            let salaire_max = metier.salaire * metier.horaires;
                            let taxe = parseInt((dbFaction.taxe / 100) * salaire_max);
                            let endettement_final = usr.endettement + taxe;
                            await client.updateUser(element, {endettement: endettement_final})
                        }
                    }
                });
            });

        } else {
            //pas 7 jours
            console.log("Ça ne fait pas au moins 7 jours que la dernière taxe à été check, mais: " + Math.round(Difference_In_Days) + " jours.");
        }
    }

    /**
     * @Description return true si le joueur a au minimum le rôle Mee6 passé en paramètre !
     * @Param {GuildMember} member
     * @Param {String} role
     */
    client.hasMinRole = (member, role) => {

        roles_id = ["445253268176633891", "445253591465328660", "445253561648021514", "445253809640308746", "445257669918588948", "650832087993024522", "445257144011587594", "612469098466639893", "650828967716192269"];
        index = -1;

        if(role == "paysan") index = 0;
        else if(role == "artisan") index = 1;
        else if(role == "bourgeois") index = 2;
        else if(role == "courtisan") index = 3;
        else if(role == "baron") index = 4;
        else if(role == "comte") index = 5;
        else if(role == "marquis") index = 6;
        else if(role == "duc") index = 7;
        else if(role == "vassal") index = 8;


        console.log(index);
        if(member.roles.cache.has(roles_id[0]) && index <= 0) return true; // il a au moins Paysan
        if(member.roles.cache.has(roles_id[1]) && index <= 1) return true; // il a au moins Artisan
        if(member.roles.cache.has(roles_id[2]) && index <= 2) return true; // il a au moins Bourgeois
        if(member.roles.cache.has(roles_id[3]) && index <= 3) return true; // il a au moins Courtisan
        if(member.roles.cache.has(roles_id[4]) && index <= 4) return true; // il a au moins Baron
        if(member.roles.cache.has(roles_id[5]) && index <= 5) return true; // il a au moins Comte
        if(member.roles.cache.has(roles_id[6]) && index <= 6) return true; // il a au moins Marquis
        if(member.roles.cache.has(roles_id[7]) && index <= 7) return true; // il a au moins Duc      
        if(member.roles.cache.has(roles_id[8]) && index <= 8) return true; // il a au moins Vassal
        
        return false;
    };

    /**
     * @Description Récupère le rôle Mee6 du member !
     * @Param {GuildMember} member
     * @returns {Role} rôle mee6
     */
    client.getMee6Role = (member) => {

        roles_id = ["445253268176633891", "445253591465328660", "445253561648021514", "445253809640308746", "445257669918588948", "650832087993024522", "445257144011587594", "612469098466639893", "650828967716192269"];
        
        if(member.roles.cache.has(roles_id[0])) return member.roles.cache.get(roles_id[0]); // Paysan
        if(member.roles.cache.has(roles_id[1])) return member.roles.cache.get(roles_id[1]); // Artisan
        if(member.roles.cache.has(roles_id[2])) return member.roles.cache.get(roles_id[2]); // Bourgeois
        if(member.roles.cache.has(roles_id[3])) return member.roles.cache.get(roles_id[3]); // Courtisan
        if(member.roles.cache.has(roles_id[4])) return member.roles.cache.get(roles_id[4]); // Baron
        if(member.roles.cache.has(roles_id[5])) return member.roles.cache.get(roles_id[5]); // Comte
        if(member.roles.cache.has(roles_id[6])) return member.roles.cache.get(roles_id[6]); // Marquis
        if(member.roles.cache.has(roles_id[7])) return member.roles.cache.get(roles_id[7]); // Duc      
        if(member.roles.cache.has(roles_id[8])) return member.roles.cache.get(roles_id[8]); // Vassal
        
        return false;
    };

    client.getRelation = async (faction1, faction2) => {
        var fac1 = await client.getFaction(faction1);
        if(faction2 == "epsilon") fac2 = 0;
        else if(faction2 == "daïros") fac2 = 1;
        else if(faction2 == "lyomah") fac2 = 2;
        else if(faction2 == "alpha") fac2 = 3;

        var relid = fac1.relations[fac2];

        //NB: Commercial n'existe pas en Alpha
        const relations = require("../../assets/guerre/relations.json");

        return relations[relid]
    }

    client.getAllFactionPoints = async (faction1, message) => {
        //console.log(faction1);
        var roleid = "";
        var all_values = [0, 0, 0, 0, 0, 0, 0, 0];
        var points = [0, 0, 0, 0, 0, 0, 0, 0];
      
        if (faction1 == "epsilon") {
          roleid = "415947454626660366";
        } else if (faction1 == "daïros") {
          roleid = "415947455582961686";
        } else if (faction1 == "lyomah") {
          roleid = "415947456342130699";
        } else if (faction1 == "alpha") {
          roleid = "665340021640921099";
        }

        const faction = await client.getFaction(faction1);
      
        const membres = message.guild.roles.cache.get(roleid).members.map(m => m);
      
        /*
        Pour chaque membre on récupère ses points et on aditionne aux autres membres.
        Mais pour le maître et son conseil, on multiplie par 3 les points en rapport avec son métier.

        Maître :
            - Prestige
            - Redoutabilité
        Intendant :
            - Richesse
            - Savoir
        Maréchal:
            - Forme
            - Travail
        Chapelain :
            - Piete
            - Moral

        */
          for (const m of membres) {
            let dbmembre = await client.getUser(m);
            points.push((m.user.id == faction.idmaitre) ? (parseInt(dbmembre.prestige) * 3) : parseInt(dbmembre.prestige));
            points.push((m.user.id == faction.chapelain) ? (parseInt(dbmembre.piete) * 3) : parseInt(dbmembre.piete));
            points.push((m.user.id == faction.intendant) ? (parseInt(dbmembre.richesse) * 3) : parseInt(dbmembre.richesse));
            points.push((m.user.id == faction.idmaitre) ? (parseInt(dbmembre.redoutabilite) * 3) : parseInt(dbmembre.redoutabilite));
            points.push((m.user.id == faction.marechal) ? (parseInt(dbmembre.forme) * 3) : parseInt(dbmembre.forme));
            points.push((m.user.id == faction.chapelain) ? (parseInt(dbmembre.moral) * 3) : parseInt(dbmembre.moral));
            points.push((m.user.id == faction.marechal) ? (parseInt(dbmembre.travail) * 3) : parseInt(dbmembre.travail));
            points.push((m.user.id == faction.intendant) ? (parseInt(dbmembre.savoir) * 3) : parseInt(dbmembre.savoir));
      
            for (let i = 0; i < 8; i++) {
              all_values[i] = parseInt(all_values[i]) + parseInt(points[i]);
            }
            points = [];
          }
      
        return all_values;
      }


      client.getFactionNameById = (id) => {
        switch(id) {
            case 0:
                return "epsilon";
                break;
            case 1:
                return "daïros";
                break;
            case 2:
                return "lyomah";
                break;
            case 3:
                return "alpha";
                break;
            case -1:
                return "NULL";
                    
        }
      }

      client.upperCaseFirstChar = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      client.getFactionNameByRelationId = (faction, relation_id) => {
        let id_faction_adverse = faction.relations.indexOf(relation_id); //recherche dans les relations quelle faction est en guerre/Alliance/Non-agression avec nous.
        return client.getFactionNameById(id_faction_adverse);
      }

      client.addCasusBelli = async (faction, faction_cible, casus_belli_id) => {
        let casus_belli_list = faction.casusbelli;
        casus_belli_list.push({id: casus_belli_id, cible: faction_cible.name});

        await client.updateFaction(faction.name, {casusbelli: casus_belli_list});
      }


      /* Valeurs relations
            0 = Neutre
            1 = Non-Agression
            2 = Commercial
            3 = Alliance
            4 = Ennemie
        */
      client.editRelation = async (dbfaction1, dbfaction2, relation_id) => {
        let newArrayFac1 = dbfaction1.relations;
        let newArrayFac2 = dbfaction2.relations;

        newArrayFac1[dbfaction2.factionid] = relation_id;
        newArrayFac2[dbfaction1.factionid] = relation_id;

        await client.updateFaction(dbfaction1.name, {relations: newArrayFac1});
        await client.updateFaction(dbfaction2.name, {relations: newArrayFac2});
      }

      client.getSimplifiedDate = (date) => {
        const jour = date.getDate();
        const mois = date.getMonth() + 1; // Les mois commencent à 0, donc on ajoute 1
        const annee = date.getFullYear();
        return dateFormatee = `${jour < 10 ? `0${jour}` : jour}/${mois < 10 ? `0${mois}` : mois}/${annee}`;
      }

      client.daysUntilDate = (date) => {
        const date_actuelle = new Date();
        const dif = date_actuelle - date;
        return Math.floor(dif / (1000 * 60 * 60 * 24));
      }


      /**
       * casusbelli_id : C'est l'identifiant du casus belli utilisé pour cette guerre noté dans le json
       * decision_id : 0: appuyer les exigeances | 1: Paix Blanche | 2: Se rendre
       * faction_decision_id : identifiant de statut la faction qui a executer la décision. : 0: Attaquant | 1: Défensseur
       * faction_attaquant: db de la faction qui a déclaré la guerre
       * faction_defensseurs: db de la faction qui s'est fait déclaré la guerre
       * message: message contenant la commande qui a éxécuté la commande
       */
      client.resultat_guerre = async (casusbelli_id, decision_id, faction_decision_id, faction_attaquants, faction_defensseurs, message) => {

        const casusbellijson = require("../../assets/guerre/casusbelli.json")
        const used_casusbelli = casusbellijson[casusbelli_id];

        //ceci contient l'objet du casusbelli DANS LA LISTE des casus belli possédés par la faction attaquante du coup.
        const casusbelli_faction_attaquante = faction_attaquants.casusbelli.find((objet) => objet.id === casusbelli_id && objet.cible === faction_defensseurs.id);
        //ceci contient donc l'id de cet objet
        const id_casusbelli_faction_attaquante = faction_attaquants.casusbelli.indexOf(casusbelli_faction_attaquante);

        const maitre_attaquant = message.guild.members.cache.get(faction_attaquants.idmaitre);
        const maitre_defensseur = message.guild.members.cache.get(faction_defensseurs.idmaitre);

        const maitre_attaquant_db = await client.getUser(maitre_attaquant);
        const maitre_defenseur_db = await client.getUser(maitre_defensseur);

        let change_relation = true;


        if(casusbelli_id == 0) { //Emprisonnement :
            if(decision_id == 0) { //appuyer les exigeances
                if(faction_decision_id == 0) { //en tant qu'Attaquant

                    
                    //attaquants
                    
                    // CHECk
                    client.editPoint(client, maitre_attaquant, 250, "prestige");   // "- Gagne 250 points de prestige", 
                    client.editPoint(client, maitre_attaquant, 200, "redoutabilite");// "- Gagne 200 points de redoutabilité"

                    // "- Perd le casus belli \"Emprisonnement\" envers la faction adverse"
                    let array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    //Tous les membres emprisonnés dans les cachots de la faction adverse sont délivrés
                    let array_cachots_defensseurs = faction_defensseurs.cachot;
                    let new_array_cachots_defensseurs = array_cachots_defensseurs;
                

                    const promises = array_cachots_defensseurs.map(async (e) => {
                        let memb_temp = message.guild.members.cache.get(e);
                        let dbUsrTemp = await client.getUser(memb_temp);
                        //console.log("FOREEACH: " + dbUsrTemp.username);
                        return dbUsrTemp.faction !== faction_attaquants.name;
                      });
                    
                      const results = await Promise.all(promises);
                      new_array_cachots_defensseurs = array_cachots_defensseurs.filter((_, index) => results[index]);
                    
                    


                    await client.updateFaction(faction_defensseurs.name, {cachot:new_array_cachots_defensseurs}); // V "- Tous les membres de la faction adverse emprisonnés dans les geôles seront délivrés", 
                    await client.addCasusBelli(faction_defensseurs, faction_attaquants, "2"); // V "- Obtient un casus belli de vengeance \"Vengenace - Emprisonnement\" envers la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, -300, "prestige"); // V "- Perte de 300 points de prestige"
                    await client.editPoint(client, maitre_defensseur, -150, "redoutabilite"); // V "- Perte de 150 points de redoutabilité", 

                    
                    
        
                } else if(faction_decision_id == 1) { //en tant que Défenseur

                    //Attaquant:

                    // "- Perd le casus belli \"Emprisonnement\" envers la faction adverse.", 
                    let array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    client.editPoint(client, maitre_attaquant, -300, "prestige");    // "- Perte de 300 points de prestige"
                    client.editPoint(client, maitre_attaquant, -150, "redoutabilite"); // "- Perte de 150 points de redoutabilité",
                     
                

                    //Defenseur:

                    client.editPoint(client, maitre_defensseur, 350, "prestige"); // "- Gagne 350 points de prestige"
                    client.editPoint(client, maitre_defensseur, 400, "redoutabilite"); // "- Gagne 400 points de redoutabilité", 
                }
                //TODO envoyer ce message dans le #décision-RPG
                message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${(faction_decision_id == 0) ? faction_attaquants.displayname + "** a gagné !" : faction_defensseurs.displayname + "** a gagné !"}\n\nCette guerre avait pour but, la libération des membres ${faction_attaquants.displayname} des cachots, ${(faction_decision_id == 0) ? "ce fut une réussite, tous les membres ont été délivrés !" : "ce fut un échec. Les membres n'ont pas été délivrés..."}\n${(faction_decision_id == 0) ? faction_attaquants.displayname + " a gagné beaucoup de prestige et de redoutabilité, tandis que " + faction_defensseurs.displayname + " en a perdu, cependant, la faction possède à présent un casus belli de vengeance !" : faction_defensseurs.displayname + " a gagné beaucoup de prestige et de redoutabilité, tandis que " + faction_attaquants.displayname + " en a perdu !"}`)
            } 
            
            else if(decision_id == 1) { //paix blanche
               //TODO envoyer ce message dans le #décision-RPG
                message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**La paix blanche a été déclarée !**\n\nCette guerre avait pour but, la libération des membres ${faction_attaquants.displayname} des cachots de ${faction_defensseurs.displayname}, ils n'ont pas été délivrés.\nAucune des deux factions n'a perdu quoi que ce soit, ${faction_attaquants.displayname} conserve son casus belli. Les deux factions se retrouvent comme juste avant la guerre.`)
                
            } 
            
            else if(decision_id == 2) { // Se rendre
                if(faction_decision_id == 0) { //en tant qu'Attaquant
                    
                    
                    //attaquant
                    //"- Perd le casus belli \"Emprisonnement\" envers la faction adverse.", 
                    let array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    client.editPoint(client, maitre_attaquant, -150, "redoutabilite"); //"- Perte de 150 points de redoutabilité", 
                    client.editPoint(client, maitre_attaquant, -300, "prestige"); //"- Perte de 300 points de prestige"

                    //defenseur
                    client.editPoint(client, maitre_defensseur, 200, "redoutabilite"); //"- Gagne 200 points de redoutabilité", 
                    client.addCasusBelli(faction_defensseurs, faction_attaquants, "2") //"- Obtient un casus belli de vengeance \"Vengenace - Emprisonnement\" envers la faction adverse"

                }
                if(faction_decision_id == 1) { //en tant que defenseur

                    client.editPoint(client, maitre_attaquant, 250, "prestige");   // "- Gagne 250 points de prestige", 
                    client.editPoint(client, maitre_attaquant, 200, "redoutabilite");// "- Gagne 200 points de redoutabilité"

                    // "- Perd le casus belli \"Emprisonnement\" envers la faction adverse"
                    let array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    //Tous les membres emprisonnés dans les cachots de la faction adverse sont délivrés
                    let array_cachots_defensseurs = faction_defensseurs.cachot;
                    let new_array_cachots_defensseurs = array_cachots_defensseurs;
                

                    const promises = array_cachots_defensseurs.map(async (e) => {
                        let memb_temp = message.guild.members.cache.get(e);
                        let dbUsrTemp = await client.getUser(memb_temp);
                        //console.log("FOREEACH: " + dbUsrTemp.username);
                        return dbUsrTemp.faction !== faction_attaquants.name;
                      });
                    
                      const results = await Promise.all(promises);
                      new_array_cachots_defensseurs = array_cachots_defensseurs.filter((_, index) => results[index]);
                    
                    


                    await client.updateFaction(faction_defensseurs.name, {cachot:new_array_cachots_defensseurs}); // V "- Tous les membres de la faction adverse emprisonnés dans les geôles seront délivrés", 
                    // ? Il me semble que c'est mieux, car c'est pas logique que si l'on se rend dès le début de la guerre on puisse retourner si facilement la situation par exemple. Non se rendre ne donne pas de casus belli en tant que défenseur ! (bien sur si c'est l'attaquant qui se rend, ça ça reste !)
                    //await client.addCasusBelli(faction_defensseurs, faction_attaquants, "2"); // V "- Obtient un casus belli de vengeance \"Vengenace - Emprisonnement\" envers la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, -300, "prestige"); // V "- Perte de 300 points de prestige"
                    await client.editPoint(client, maitre_defensseur, -150, "redoutabilite"); // V "- Perte de 150 points de redoutabilité", 
                }
                //TODO envoyer ce message dans le #décision-RPG
                message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${(faction_decision_id == 0) ? faction_defensseurs.displayname + "** a gagné ! " + faction_attaquants.displayname + " s'est rendu." : faction_attaquants.displayname + "** a gagné ! " + faction_defensseurs.displayname + " s'est rendu."}\n\nCette guerre avait pour but, la libération des membres ${faction_attaquants.displayname} des cachots, ${(faction_decision_id == 1) ? "ce fut une réussite, tous les membres ont été délivrés !" : "ce fut un échec. Les membres n'ont pas été délivrés..."}\n${(faction_decision_id == 0) ? faction_defensseurs.displayname + " a gagné beaucoup de redoutabilité et obtient un casus belli de vengeance, tandis que " + faction_attaquants.displayname + " a perdu en plus de prestige de la redoutabilité !" : faction_attaquants.displayname + " a gagné beaucoup de prestige et de redoutabilité, tandis que " + faction_defensseurs.displayname + " en a perdu !"}`)
            
            }
        } 
        
        else if (casusbelli_id == 1) { //ALliance Rompue
            if(decision_id == 0) { //appuyer les exigeances
                if(faction_decision_id == 0) { //en tant qu'Attaquant

                    //attaquant
                    
                    let tenpercent_facdef = Math.floor(faction_defensseurs.bank * 0.1);
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank + tenpercent_facdef}) //"- Récupère 10% de l'or de la faction adverse."
                    await client.editPoint(client, maitre_attaquant, Math.floor(maitre_defensseur.redoutabilite * 0.2), "redoutabilite"); //"- Récupère 20% de la redoutabilité de la faction adverse"
                    await client.editPoint(client, maitre_attaquant, 350, "prestige"); //"- Récupère 20% de la redoutabilité de la faction adverse"
                    await client.editRelation(faction_attaquants, faction_defensseurs, 1); //"- Force la signature d'un pacte de non-agression",
                    change_relation = false;
                    
                    //"- Perd le casus belli \"Alliance Romptue\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})
                    
                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank - tenpercent_facdef}) //"- Perd 10% d'or pour le bénéfice de la faction adverse"
                    await client.editPoint(client, maitre_defensseur, 0 - Math.floor(maitre_defensseur.redoutabilite * 0.2), "redoutabilite"); //"- Perd 20% de redoutabilité pour le bénéfice de la faction adverse"
                    await client.editPoint(client, maitre_defensseur, -350, "prestige"); //"- Perd de 350 points de prestige pour le bénéfice de la faction adverse", 
                
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_attaquants.displayname}** a gagné !\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par ${faction_defensseurs.displayname}. Ce fut une réussite, un pacte de non-agression a également été signé entre les deux factions !\n${faction_attaquants.displayname} a gagné beaucoup de redoutabilité et de prestige ainsi que des poyns, volés à la faction adverse ! Tandis que ${faction_defensseurs.displayname} a perdu, en plus de ces poyns, du prestige et évidemment de la redoutabilité...`)
            
                    
                }
                else if(faction_decision_id == 1) { //en tant que defenseur 
                    //attaquant

                    //"- Perd le casus belli \"Alliance Romptue\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})
                    
                    let tenpercent_redoutabilite_facatt = Math.floor(maitre_attaquant.redoutabilite * 0.1);
                    await client.editPoint(client, maitre_attaquant, 0 - tenpercent_redoutabilite_facatt, "redoutabilite"); //"- Perd 10% de redoutabilité pour le bénéfice de la faction adverse", 
                    await client.editPoint(client, maitre_attaquant, -350, "prestige"); //"- Perd 350 points de prestige pour le bénéfice de la faction adverse"
                    //defenseur
                    await client.editPoint(client, maitre_defensseur, tenpercent_redoutabilite_facatt, "redoutabilite"); //"- Récupère 10% de la redoutabilité de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, 350, "prestige"); //"- Récupère 350 points de prestige de la faction adverse"],
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_defensseurs.displayname}** a gagné !\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par ${faction_defensseurs.displayname}. Ce fut un échec complet !\n${faction_defensseurs.displayname} a gagné beaucoup de redoutabilité et de prestige ! Tandis que ${faction_attaquants.displayname} en a perdu, en plus d'avoir échoué la signature d'un pacte de non-agression...`)
            
                    
                }
            }   
            else if(decision_id == 1) { //Paix blanche
                //attaquant
                //"- Conserve le casus belli"

                //defenseur
                // "- Rien ne se passe..."

                //TODO envoyer ce message dans le #décision-RPG
                message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**La paix blanche a été déclarée !**\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par ${faction_defensseurs.displayname}.\nAucune des deux factions n'a perdu quoi que ce soit, ${faction_attaquants.displayname} conserve son casus belli. Les deux factions se retrouvent comme juste avant la guerre.`)
            
        
            } 
            else if(decision_id == 2) { //se rendre
                if(faction_decision_id == 0) { //en tant qu'Attaquant
                    //attaquant

                    //"- Perd le casus belli \"Alliance Romptue\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    let tenpercent_redoutabilite_facatt_sr = Math.floor(maitre_attaquant.redoutabilite * 0.1);
                    await client.editPoint(client, maitre_attaquant, 0 - tenpercent_redoutabilite_facatt_sr, "redoutabilite") //"- Perd 10% de redoutabilité pour le bénéfice de la faction adverse", 
                    await client.editPoint(client, maitre_attaquant, -350, "prestige"); //"- Perd 350 points de prestige pour le bénéfice de la faction adverse"
                    
                    //defenseur
                    await client.editPoint(client, maitre_defensseur, tenpercent_redoutabilite_facatt_sr, "redoutabilite") //"- Récupère 10% de la redoutabilité de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, 350, "prestige"); //"- Récupère 350 points de prestige de la faction adverse"
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_defensseurs.displayname}** a gagné ! ${faction_attaquants.displayname} s'est rendu.\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par ${faction_defensseurs.displayname}. Ce fut un échec complet !\n${faction_defensseurs.displayname} a gagné beaucoup de redoutabilité et de prestige ! Tandis que ${faction_attaquants.displayname} en a perdu, en plus d'avoir échoué la signature d'un pacte de non-agression...`)
            
                    
                    
                    
                }
                else if(faction_decision_id == 1) { //en tant que defenseur 
                    //attaquant

                    //"- Perd le casus belli \"Alliance Romptue\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    await client.editRelation(faction_attaquants, faction_defensseurs, 1); //"- Force la signature d'un pacte de non-agression",
                    change_relation = false;
                    await client.editPoint(client, maitre_attaquant, 300, "prestige"); //"Récupère 300 points de prestige de la faction adverse", 

                    let _8percent_or_facdef =  Math.floor(faction_defensseurs.bank * 0.08);
                    let _18percent_redoutabilite_facdef =  Math.floor(faction_defensseurs.redoutabilite * 0.18);

                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank + _8percent_or_facdef}) //"- Récupère 8% de l'or de la faction adverse.", 
                    await client.editPoint(client, maitre_attaquant, _18percent_redoutabilite_facdef, "redoutabilite"); //"- Récupère 18% de la redoutabilité de la faction adverse", 

                    
                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank - _8percent_or_facdef}) //"- Perd 8% d'or pour le bénéfice de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, 0 - _18percent_redoutabilite_facdef, "redoutabilite"); //"- Perd 18% de redoutabilité pour le bénéfice de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, -300, "prestige");
                                
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_attaquants.displayname}** a gagné ! ${faction_defensseurs.displayname} s'est rendu.\n\nCette guerre avait pour but, la réparation de trahison pour le bris de l'alliance entraînée par ${faction_defensseurs.displayname}. Ce fut une réussite, un pacte de non-agression a également été signé entre les deux factions !\n${faction_attaquants.displayname} a gagné beaucoup de redoutabilité et de prestige ainsi que des poyns, volés à la faction adverse ! Tandis que ${faction_defensseurs.displayname} a perdu, en plus de ces poyns, du prestige et évidemment de la redoutabilité...`)
            
                }
            }  
        }

        else if (casusbelli_id == 1) { //Vengeance - Emprisonnement
            if(decision_id == 0) { //appuyer les exigeances
                if(faction_decision_id == 0) { //en tant qu'Attaquant
                    //attaquant

                    let or_faction_def_huitperc = faction_defensseurs.bank * 0.08;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank + (or_faction_def_huitperc)}) // "- Vole 8% de l'or de la faction adverse.",
                    await client.editPoint(client, maitre_attaquant, 500, "redoutabilite"); // "- Gagne 500 points de redoutabilité", 
                    
                    
                    
                    //"- Perd le casus belli \"Vengeance - Emprisonnement\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank - (or_faction_def_huitperc)}) //"- Perd 8% d'or pour le bénéfice de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, Math.floor(-maitre_defenseur_db.redoutabilite + (maitre_defenseur_db.redoutabilite * 0.90)), "redoutabilite"); // perd 10% de redoutabilité
                    await client.editPoint(client, maitre_defensseur, -200, "prestige"); //"- Perd 200 points de prestige"
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_attaquants.displayname}** a gagné !\n\nCette guerre avait pour but, la vengeance relative à la délivrance des membres ${faction_defensseurs.displayname} des cachots ${faction_attaquants.displayname}. Ce fut une réussite !\n${faction_attaquants.displayname} a gagné beaucoup de redoutabilité ainsi que des poyns, volés à la faction adverse ! Tandis que ${faction_defensseurs.displayname} a perdu, en plus de ces poyns, du prestige et évidemment de la redoutabilité...`)
            
                }
                else if(faction_decision_id == 0) { //en tant que Defenseur
                    //attaquant

                    //"- Perd le casus belli \"Vengeance - Emprisonnement\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})
                    
                    await client.editPoint(client, maitre_attaquant, Math.floor(-maitre_attaquant_db.redoutabilite + (maitre_attaquant_db.redoutabilite * 0.75)), "redoutabilite"); //"- Perd 25 % de redoutabilité", 
                    await client.editPoint(client, maitre_attaquant, -400, "prestige"); // "- Perd 400 points de prestige"

                    let or_faction_att_huitperc = faction_attaquants.bank * 0.08;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank - (or_faction_att_huitperc)}) //"- perd 8% de la l'or pour le bénéfice de la faction adverse", 

                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank + (or_faction_att_huitperc)}) //"- Récupère 8% de la l'or de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, Math.floor(maitre_defensseur_db.redoutabilite * 0.08), "redoutabilite"); //"- gagne 8% de redoutabilité", 
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_defensseurs.displayname}** a gagné !\n\nCette guerre avait pour but, la vengeance relative à la délivrance des membres ${faction_defensseurs.displayname} des cachots ${faction_attaquants.displayname}. Ce fut un échec complet !\n${faction_defensseurs.displayname} a gagné beaucoup de redoutabilité et de poyn ! Tandis que ${faction_attaquants.displayname} en a perdu, en plus de prestige.`)
            

                }
            } else if (decision_id == 1) { //paix blanche
                    //attaquant
                    //"- Perd le casus belli \"Vengeance - Emprisonnement\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})
                    


                    //defenseur
                    //"- Rien ne se passe..."

                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**La paix blanche a été déclarée !**\n\nCette guerre avait pour but, la vengeance relative à la délivrance des membres ${faction_defensseurs.displayname} des cachots ${faction_attaquants.displayname}.\nAucune des deux factions n'a perdu quoi que ce soit, sauf ${faction_attaquants.displayname} qui perd son casus belli. Les deux factions se retrouvent comme si la guerre n'avait pas eu lieu.`)
            

                    
            } else if (decision_id == 2) { //se rendre
                if(faction_decision_id == 0) { //en tant qu'Attaquant
                    //attaquant
                    //"- Perd le casus belli \"Vengeance - Emprisonnement\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})
                    await client.editPoint(client, maitre_attaquant, Math.floor(-maitre_attaquant_db.redoutabilite + (maitre_attaquant_db.redoutabilite * 0.80)), "redoutabilite"); // perd 20% de redoutabilité
                    await client.editPoint(client, maitre_attaquant, -300, "prestige"); //"- Perd 300 points de prestige"

                     


                    //defenseur
                    await client.editPoint(client, maitre_defensseur, 450, "redoutabilite"); // "- Gagne 450 points de redoutabilité", 
                    await client.editPoint(client, maitre_defensseur, 100, "prestige"); // "- Récupère 100 points de prestige"


                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_defensseurs.displayname}** a gagné ! ${faction_attaquants.displayname} s'est rendu.\n\nCette guerre avait pour but, la vengeance relative à la délivrance des membres ${faction_defensseurs.displayname} des cachots ${faction_attaquants.displayname}. Ce fut un échec complet !\n${faction_defensseurs.displayname} a gagné beaucoup de redoutabilité et de poyn ! Tandis que ${faction_attaquants.displayname} en a perdu, en plus de prestige.`)
            
                    
                }
                else if(faction_decision_id == 0) { //en tant que Defenseur

                    //attaquant

                    let or_faction_def_huitperc = faction_defensseurs.bank * 0.08;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank + (or_faction_def_huitperc)}) // "- Vole 8% de l'or de la faction adverse.",
                    await client.editPoint(client, maitre_attaquant, 500, "redoutabilite"); // "- Gagne 500 points de redoutabilité", 
                    
                    //"- Perd le casus belli \"Vengeance - Emprisonnement\" envers la faction adverse"
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})


                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank - (or_faction_def_huitperc)}) //"- Perd 8% d'or pour le bénéfice de la faction adverse", 
                    await client.editPoint(client, maitre_defensseur, Math.floor(-maitre_defenseur_db.redoutabilite + (maitre_defenseur_db.redoutabilite * 0.92)), "redoutabilite"); // perd 8% de redoutabilité
                    await client.editPoint(client, maitre_defensseur, -250, "prestige"); //"- Perd 250 points de prestige"
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_attaquants.displayname}** a gagné ! ${faction_defensseurs.displayname} s'est rendu.\n\nCette guerre avait pour but, la vengeance relative à la délivrance des membres ${faction_defensseurs.displayname} des cachots ${faction_attaquants.displayname}. Ce fut une réussite !\n${faction_attaquants.displayname} a gagné beaucoup de redoutabilité ainsi que des poyns, volés à la faction adverse ! Tandis que ${faction_defensseurs.displayname} a perdu, en plus de ces poyns, du prestige et évidemment de la redoutabilité...`)
            
                }
            }
        }

        else if (casusbelli_id == 1) { //Hérésie
            if(decision_id == 0) { //appuyer les exigeances
                if(faction_decision_id == 0) { //en tant qu'Attaquant
                    //attaquant
                    //"- Perd le casus belli \"Hérésie\" envers la faction adverse."
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    await client.editPoint(client, maitre_attaquant, Math.floor(maitre_attaquant_db.piete * 0.5), "piete"); //"- Gagne 50% de piété", 

                    let or_faction_def_vingtperc = faction_defensseurs.bank * 0.2;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank + (or_faction_def_vingtperc)})//"- Vole 20% d'or à la faction adverse", 
                    
                    

                    //defenseur
                    //"- Atteint 100 piété si elle se situe en dessous.", 
                    if(faction_defensseurs.chapelain != "NULL") {
                        const chapelain_defenseur_db = await client.getUser(message.guild.members.cache.get(faction_defensseurs.chapelain));
                        if(chapelain_defenseur_db.piete < 100) {
                            await client.editPoint(client, message.guild.members.cache.get(faction_defensseurs.chapelain), (-chapelain_defenseur_db.piete) + 100, "piete"); //"- Atteint 100 piété si elle se situe en dessous.", 
                        }
                    } else {
                        if(maitre_defensseur.piete < 100) {
                            await client.editPoint(client, maitre_defensseur, (-maitre_defensseur_db.piete) + 100, "piete"); //"- Atteint 100 piété si elle se situe en dessous.", 
                        }
                    }

                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank - (or_faction_def_vingtperc)})//"- Perd 20% d'or pour le bénéfice de la faction adverse." 
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_attaquants.displayname}** a gagné !\n\nCette guerre avait pour but, le combat contre l'hérésie de ${faction_defensseurs.displayname}. Ce fut une réussite grandiose !\n${faction_attaquants.displayname} a gagné énormément de piété ainsi que des poyns, récupérés à la faction adverse ! Tandis que ${faction_defensseurs.displayname} a perdu ces poyns, et se retrouve à nouveau avec de la piété positive !`)


                }
                else if(faction_decision_id == 0) { //en tant que Defenseur
                    //attaquant

                    //"- Perd le casus belli \"Hérésie\" envers la faction adverse."
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    await client.editPoint(client, maitre_attaquant, -500, "prestige"); //"- Perd 500 points de prestige", 

                    let or_faction_att_vingtcinqperc = faction_attaquants.bank * 0.25;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank - (or_faction_att_vingtcinqperc)}) //"Perd 25% d'or pour le benéfice de la faction adverse.", 
                    
                    
                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank + (or_faction_att_vingtcinqperc)}) //"- Gagne 25% d'or de la faction adverse."

                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_defensseurs.displayname}** a gagné !\n\nCette guerre avait pour but, le combat contre l'hérésie de ${faction_defensseurs.displayname}. Ce fut un échec lamentable !\n${faction_attaquants.displayname} a perdu beaucoup de prestige et s'est fait volé le quart de ses poyns par ${faction_defensseurs.displayname}.`)

                    
                }
            } else if (decision_id == 1) { //paix blanche
                    //attaquant
                    //"- Conserve le casus belli"

                    //defenseur
                    //"- Rien ne se passe..."

                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**La paix blanche a été déclarée !** :dove:\n\nCette guerre avait pour but, le combat contre l'hérésie de ${faction_defensseurs.displayname}.\nAucune des deux factions n'a perdu quoi que ce soit, ${faction_attaquants.displayname} conserve son casus belli. Les deux factions se retrouvent comme juste avant la guerre.`)


                    
            } else if (decision_id == 2) { //se rendre
                if(faction_decision_id == 0) { //en tant qu'Attaquant
                    
                    //attaquant

                    //"- Perd le casus belli \"Hérésie\" envers la faction adverse."
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    await client.editPoint(client, maitre_attaquant, -600, "prestige"); //"- Perd 600 points de prestige", 

                    let or_faction_att_dixhuitperc = faction_attaquants.bank * 0.18;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank - (or_faction_att_dixhuitperc)}) //"Perd 18% d'or pour le benéfice de la faction adverse.", 
                    

                    //defenseur
                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank + (or_faction_att_dixhuitperc)}) //"- Gagne 18% d'or de la faction adverse."

                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_defensseurs.displayname}** a gagné ! ${faction_attaquants.displayname} s'est rendu.\n\nCette guerre avait pour but, le combat contre l'hérésie de ${faction_defensseurs.displayname}. Ce fut un échec !\n${faction_attaquants.displayname} a perdu beaucoup de prestige et s'est fait volé énormément de poyns par ${faction_defensseurs.displayname}.`)

                    

                }
                else if(faction_decision_id == 0) { //en tant que Defenseur
                   
                    //attaquant
                    //"- Perd le casus belli \"Hérésie\" envers la faction adverse."
                    array_cassusbelli_fac_att = faction_attaquants.casusbelli;
                    array_cassusbelli_fac_att.splice(id_casusbelli_faction_attaquante, 1);
                    await client.updateFaction(faction_attaquants.name, {casusbelli:array_cassusbelli_fac_att})

                    await client.editPoint(client, maitre_attaquant, Math.floor(maitre_attaquant_db.piete * 0.5), "piete"); //"- Gagne 50% de piété", 

                    let or_faction_def_dixhuitperc = faction_defensseurs.bank * 0.18;
                    await client.updateFaction(faction_attaquants.name, {bank: faction_attaquants.bank + (or_faction_def_dixhuitperc)})//"- Vole 18% d'or à la faction adverse", 
                    
                    

                    //defenseur
                    //"- Atteint 100 piété si elle se situe en dessous.", 
                    if(faction_defensseurs.chapelain != "NULL") {
                        const chapelain_defenseur_db = await client.getUser(message.guild.members.cache.get(faction_defensseurs.chapelain));
                        if(chapelain_defenseur_db.piete < 100) {
                            await client.editPoint(client, message.guild.members.cache.get(faction_defensseurs.chapelain), (-chapelain_defenseur_db.piete) + 100, "piete"); //"- Atteint 100 piété si elle se situe en dessous.", 
                        }
                    } else {
                        if(maitre_defensseur.piete < 100) {
                            await client.editPoint(client, maitre_defensseur, (-maitre_defensseur_db.piete) + 100, "piete"); //"- Atteint 100 piété si elle se situe en dessous.", 
                        }
                    }

                    await client.updateFaction(faction_defensseurs.name, {bank: faction_defensseurs.bank - (or_faction_def_dixhuitperc)})//"- Perd 18% d'or pour le bénéfice de la faction adverse." 
                    
                    //TODO envoyer ce message dans le #décision-RPG
                    message.channel.send(`:crossed_swords: La guerre entre **${faction_attaquants.displayname}** et **${faction_defensseurs.displayname}** est terminée ! :crossed_swords:\n\n**${faction_attaquants.displayname}** a gagné ! ${faction_defensseurs.displayname} s'est rendu.\n\nCette guerre avait pour but, le combat contre l'hérésie de ${faction_defensseurs.displayname}. Ce fut une réussite grandiose !\n${faction_attaquants.displayname} a gagné énormément de piété ainsi que des poyns, récupérés à la faction adverse ! Tandis que ${faction_defensseurs.displayname} a perdu ces poyns, et se retrouve à nouveau avec de la piété positive !`)


                }
            }
        }

        // Reset toutes les variables lors de la fin de la guerre pour les deux factions.
        /*
        relations -> array
        en_guerre -> bool
        attaquant -> string
        defensseur -> string
        casusbelli_utilise -> int
        date_debut_guerre -> Date
        cooldown_battle -> Date
        score_guerre -> int
        */

        //ne met la relation à neutre uniquement si la relation n'a pas été changé dans les résultats de guerre (exemple: lorsque l'attaquant gagne le Bris d'alliance)
        if(change_relation == true) {
            await client.editRelation(faction_attaquants, faction_defensseurs, 0);
        }

        await client.updateFaction(faction_attaquants, {en_guerre: false});
        await client.updateFaction(faction_attaquants, {attaquant: "NULL"});
        await client.updateFaction(faction_attaquants, {defensseur: "NULL"});
        await client.updateFaction(faction_attaquants, {casusbelli_utilise: -1});
        await client.updateFaction(faction_attaquants, {date_debut_guerre: 0});
        await client.updateFaction(faction_attaquants, {cooldown_battle: 0});
        await client.updateFaction(faction_attaquants, {score_guerre: 0});
        
        await client.updateFaction(faction_defensseurs, {en_guerre: false});
        await client.updateFaction(faction_defensseurs, {attaquant: "NULL"});
        await client.updateFaction(faction_defensseurs, {defensseur: "NULL"});
        await client.updateFaction(faction_defensseurs, {casusbelli_utilise: -1});
        await client.updateFaction(faction_defensseurs, {date_debut_guerre: 0});
        await client.updateFaction(faction_defensseurs, {cooldown_battle: 0});
        await client.updateFaction(faction_defensseurs, {score_guerre: 0});
        
    }

};