const mongoose = require("mongoose");
const { Guild, User, Faction } = require("../../models/index");

module.exports = client => {
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

        var mxbk = [10, 35, 80, 120, 200, 350, 550, 800, 1000];
        var levels_pelos = [1, 5, 10, 20, 35, 50, 70, 85, 100];

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
        require("./updateMaxBank")(client);
        
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
        if(itemid == 1) { // * Point de puissance.
            await client.setOr(client, member, -price, message);
            let items = parseInt(dbUser.powerpoints) + parseInt(quantity);
            await client.updateUser(member, {"powerpoints": items});
        }

        // ---
        // items classique -> On les mets dans un string par ID tout comme les badges.
    }

    client.removeItemById = async(client, member, dbUser, itemid, quantity) => {
        let item = await client.filterById(shop, itemid);
        
        // ---
        // item spéciaux -> On fait une action spécifique. :
        if(itemid == 1) { // * Point de puissance.
            let items = parseInt(dbUser.powerpoints) - parseInt(quantity);
            await client.updateUser(member, {"powerpoints": items});
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


};