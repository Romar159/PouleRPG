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
};