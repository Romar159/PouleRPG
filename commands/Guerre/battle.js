const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    var roles_maitre = ["445617906072682514", "445617911747313665", "445617908903706624", "665340068046831646"];
    var est_maitre = false;

    for(let y=0; y<roles_maitre.length; y++) {
        if(message.member.roles.cache.has(roles_maitre[y])) {
            est_maitre = true;
            break;
        } else {
            est_maitre = false;
        }
    }
    if(!est_maitre) return message.reply("commande utilisable que par les maîtres de faction.");


    const faction1db = await client.getFaction(dbUser.faction);
   // message.channel.send("DEBUG: faction: " + faction1db);
    if(!faction1db.en_guerre) return message.reply("vous n'êtes pas en guerre.");
    const faction2db = await client.getFaction(faction1db.ennemy);


    const dailyCD = 8.64e+7;
    const lastDaily = await faction1db.cooldown_battle;

    if(lastDaily !== null && dailyCD - (Date.now() - lastDaily) > 0) { //cooldown pas encore passé.
        const cdTime = dailyCD - (Date.now() - lastDaily);
        message.reply(`il reste **${Math.floor(cdTime / (1000*60*60) % 24)}** heures, **${Math.floor(cdTime / (1000*60) % 60)}** minutes et **${Math.floor(cdTime / (1000) % 60)}** secondes avant que les armées soient de nouveau opérationnels. :hourglass:`);
    } else { // Si le cooldown est passé.

        var level_pelos = 0;
        var points_pelos = 0;
        var role_pelo = 0;
        var class_pelo = 0;

        var role_maitre = 0.95;
        var positions_pelos = 0;
        var bonusshop = 1;

        

        const maitre_faction1 = await client.getUser(message.guild.members.cache.get(faction1db.idmaitre));

        if(faction1db.a1 != "NULL") {
            try {
                const user_a1 = await client.getUser(message.guild.members.cache.get(faction1db.a1));
                if(message.guild.members.cache.get(user_a1.userID)) {
                    level_pelos = level_pelos + user_a1.level;
                    points_pelos = points_pelos + user_a1.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.a1));
                    role_pelo = role_pelo + user_a1.level_mee6;
        
                    if(user_a1.combat_favoriteposition == "gauche") positions_pelos = positions_pelos + 0.02;
                    if(user_a1.combat_hatedposition == "gauche") positions_pelos = positions_pelos - 0.02;
    
                    if(user_a1.class == "cavalier") class_pelo = class_pelo + 6;
                    if(user_a1.class == "guerrier") class_pelo = class_pelo - 1;
                    if(user_a1.class == "archer")   class_pelo = class_pelo + 3;
                    if(user_a1.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {a1: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {a1: "NULL"});
            }
        } 
        if(faction1db.a2 != "NULL") {
            try {
                const user_a2 = await client.getUser(message.guild.members.cache.get(faction1db.a2));
                if(message.guild.members.cache.get(user_a2.userID)) {
                    level_pelos = level_pelos + user_a2.level;
                    points_pelos = points_pelos + user_a2.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.a2));
                    role_pelo = role_pelo + user_a2.level_mee6;
        
                    if(user_a2.combat_favoriteposition == "centre") positions_pelos = positions_pelos + 0.02;
                    if(user_a2.combat_hatedposition == "centre") positions_pelos = positions_pelos - 0.02;
    
                    if(user_a2.class == "cavalier") class_pelo = class_pelo + 6;
                    if(user_a2.class == "guerrier") class_pelo = class_pelo - 1;
                    if(user_a2.class == "archer")   class_pelo = class_pelo + 3;
                    if(user_a2.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {a2: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {a2: "NULL"});
            }
        }
        if(faction1db.a3 != "NULL") {
            try {
                const user_a3 = await client.getUser(message.guild.members.cache.get(faction1db.a3));
                if(message.guild.members.cache.get(user_a3.userID)) {
                    level_pelos = level_pelos + user_a3.level;
                    points_pelos = points_pelos + user_a3.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.a3));
                    role_pelo = role_pelo + user_a3.level_mee6;
        
                    if(user_a3.combat_favoriteposition == "droite") positions_pelos = positions_pelos + 0.02;
                    if(user_a3.combat_hatedposition == "droite") positions_pelos = positions_pelos - 0.02;
    
                    if(user_a3.class == "cavalier") class_pelo = class_pelo + 6;
                    if(user_a3.class == "guerrier") class_pelo = class_pelo - 1;
                    if(user_a3.class == "archer")   class_pelo = class_pelo + 3;
                    if(user_a3.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {a3: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {a3: "NULL"});
            }
        }



        if(faction1db.b1 != "NULL") {
            try {
                const user_b1 = await client.getUser(message.guild.members.cache.get(faction1db.b1));
                if(message.guild.members.cache.get(user_b1.userID)) {
                    level_pelos = level_pelos + user_b1.level;
                    points_pelos = points_pelos + user_b1.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.b1));
                    role_pelo = role_pelo + user_b1.level_mee6;
        
                    if(user_b1.combat_favoriteposition == "gauche") positions_pelos = positions_pelos + 0.02;
                    if(user_b1.combat_hatedposition == "gauche") positions_pelos = positions_pelos - 0.02;
    
                    if(user_b1.class == "cavalier") class_pelo = class_pelo + 3;
                    if(user_b1.class == "guerrier") class_pelo = class_pelo + 6;
                    if(user_b1.class == "archer")   class_pelo = class_pelo - 1;
                    if(user_b1.class == "NULL")   class_pelo = class_pelo - 3;

    
                } else {
                    await client.updateFaction(dbUser.faction, {b1: "NULL"});
                }  
            } catch (e) {
                await client.updateFaction(dbUser.faction, {b1: "NULL"});
            }
        } 
        if(faction1db.b2 != "NULL") {
            try {
                const user_b2 = await client.getUser(message.guild.members.cache.get(faction1db.b2));
                if(message.guild.members.cache.get(user_b2.userID)) {
                    level_pelos = level_pelos + user_b2.level;
                    points_pelos = points_pelos + user_b2.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.b2));
                    role_pelo = role_pelo + user_b2.level_mee6;
        
                    if(user_b2.combat_favoriteposition == "centre") positions_pelos = positions_pelos + 0.02;
                    if(user_b2.combat_hatedposition == "centre") positions_pelos = positions_pelos - 0.02;
    
                    if(user_b2.class == "cavalier") class_pelo = class_pelo + 3;
                    if(user_b2.class == "guerrier") class_pelo = class_pelo + 6;
                    if(user_b2.class == "archer")   class_pelo = class_pelo - 1;
                    if(user_b2.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {b2: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {b2: "NULL"});

            }
        }
        if(faction1db.b3 != "NULL") {
            try {
                const user_b3 = await client.getUser(message.guild.members.cache.get(faction1db.b3));
                if(message.guild.members.cache.get(user_b3.userID)) {
                    level_pelos = level_pelos + user_b3.level;
                    points_pelos = points_pelos + user_b3.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.b3));
                    role_pelo = role_pelo + user_b3.level_mee6;
        
                    if(user_b3.combat_favoriteposition == "droite") positions_pelos = positions_pelos + 0.02;
                    if(user_b3.combat_hatedposition == "droite") positions_pelos = positions_pelos - 0.02;
    
                    if(user_b3.class == "cavalier") class_pelo = class_pelo + 3;
                    if(user_b3.class == "guerrier") class_pelo = class_pelo + 6;
                    if(user_b3.class == "archer")   class_pelo = class_pelo - 1;
                    if(user_b3.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {b3: "NULL"});
                }
            } catch(e) {
                await client.updateFaction(dbUser.faction, {b3: "NULL"});
            }
        }



        if(faction1db.c1 != "NULL") {
            try {
                const user_c1 = await client.getUser(message.guild.members.cache.get(faction1db.c1));
                if(message.guild.members.cache.get(user_c1.userID)) {
                    level_pelos = level_pelos + user_c1.level;
                    points_pelos = points_pelos + user_c1.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.c1));
                    role_pelo = role_pelo + user_c1.level_mee6;
        
                    if(user_c1.combat_favoriteposition == "gauche") positions_pelos = positions_pelos + 0.02;
                    if(user_c1.combat_hatedposition == "gauche") positions_pelos = positions_pelos - 0.02;
    
                    if(user_c1.class == "cavalier") class_pelo = class_pelo - 1;
                    if(user_c1.class == "guerrier") class_pelo = class_pelo + 3;
                    if(user_c1.class == "archer")   class_pelo = class_pelo + 6;
                    if(user_c1.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {c1: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {c1: "NULL"});
                
            }
        } 
        if(faction1db.c2 != "NULL") {
            try {
                const user_c2 = await client.getUser(message.guild.members.cache.get(faction1db.c2));
                if(message.guild.members.cache.get(user_c2.userID)) {
                    level_pelos = level_pelos + user_c2.level;
                    points_pelos = points_pelos + user_c2.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.c2));
                    role_pelo = role_pelo + user_c2.level_mee6;
        
                    if(user_c2.combat_favoriteposition == "centre") positions_pelos = positions_pelos + 0.02;
                    if(user_c2.combat_hatedposition == "centre") positions_pelos = positions_pelos - 0.02;
    
                    if(user_c2.class == "cavalier") class_pelo = class_pelo - 1;
                    if(user_c2.class == "guerrier") class_pelo = class_pelo + 3;
                    if(user_c2.class == "archer")   class_pelo = class_pelo + 6;
                    if(user_c2.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {c2: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {c2: "NULL"});
            }
        }
        if(faction1db.c3 != "NULL") {
            try {
                const user_c3 = await client.getUser(message.guild.members.cache.get(faction1db.c3));
                if(message.guild.members.cache.get(user_c3.userID)) { 
                    level_pelos = level_pelos + user_c3.level;
                    points_pelos = points_pelos + user_c3.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction1db.c3));
                    role_pelo = role_pelo + user_c3.level_mee6;
        
                    if(user_c3.combat_favoriteposition == "droite") positions_pelos = positions_pelos + 0.02;
                    if(user_c3.combat_hatedposition == "droite") positions_pelos = positions_pelos - 0.02;
    
                    if(user_c3.class == "cavalier") class_pelo = class_pelo - 1;
                    if(user_c3.class == "guerrier") class_pelo = class_pelo + 3;
                    if(user_c3.class == "archer")   class_pelo = class_pelo + 6;
                    if(user_c3.class == "NULL")   class_pelo = class_pelo - 3;

                } else {
                    await client.updateFaction(dbUser.faction, {c3: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(dbUser.faction, {c3: "NULL"});
            }
        }

        var mxbk = [10, 35, 80, 120, 200, 350, 550, 800, 1000];
        for(let i=0;i<mxbk.length;i++) {
            role_maitre = role_maitre + 0.05;
            if(maitre_faction1.maxbank == mxbk[i]) break;
        }



        // * FACTION 2 * \\


        var level_pelos2 = 0;
        var points_pelos2 = 0;
        var role_pelo2 = 0;
        var class_pelo2 = 0;

        var role_maitre2 = 0.95;
        var positions_pelos2 = 0;
        var bonusshop2 = 1;

        var maitre_faction2;
        
        try {
            maitre_faction2 = await client.getUser(message.guild.members.cache.get(faction2db.idmaitre));
        }
        catch(e) {
            maitre_faction2 = "NULL";
        }

        if(faction2db.a1 != "NULL") {
            try {
                const user2_a1 = await client.getUser(message.guild.members.cache.get(faction2db.a1));
                if(message.guild.members.cache.get(user2_a1.userID)) {
                    level_pelos2 = level_pelos2 + user2_a1.level;
                    points_pelos2 = points_pelos2 + user2_a1.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.a1));
                    role_pelo2 = role_pelo2 + user2_a1.level_mee6;
        
                    if(user2_a1.combat_favoriteposition == "gauche") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_a1.combat_hatedposition == "gauche") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_a1.class == "cavalier") class_pelo2 = class_pelo2 + 6;
                    if(user2_a1.class == "guerrier") class_pelo2 = class_pelo2 - 1;
                    if(user2_a1.class == "archer")   class_pelo2 = class_pelo2 + 3;
                    if(user2_a1.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_a1.faction, {a1: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(user2_a1.faction, {a1: "NULL"});
            }
        } 
        if(faction2db.a2 != "NULL") {
            try {
                const user2_a2 = await client.getUser(message.guild.members.cache.get(faction2db.a2));
                if(message.guild.members.cache.get(user2_a2.userID)) {
                    level_pelos2 = level_pelos2 + user2_a2.level;
                    points_pelos2 = points_pelos2 + user2_a2.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.a2));
                    role_pelo2 = role_pelo2 + user2_a2.level_mee6;
        
                    if(user2_a2.combat_favoriteposition == "centre") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_a2.combat_hatedposition == "centre") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_a2.class == "cavalier") class_pelo2 = class_pelo2 + 6;
                    if(user2_a2.class == "guerrier") class_pelo2 = class_pelo2 - 1;
                    if(user2_a2.class == "archer")   class_pelo2 = class_pelo2 + 3;
                    if(user2_a2.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_a2.faction, {a2: "NULL"});
                }
                
            } catch (e) {
                await client.updateFaction(user2_a2.faction, {a2: "NULL"});
                
            }
        }
        if(faction2db.a3 != "NULL") {
            try {
                const user2_a3 = await client.getUser(message.guild.members.cache.get(faction2db.a3));
                if(message.guild.members.cache.get(user2_a3.userID)) {
                    level_pelos2 = level_pelos2 + user2_a3.level;
                    points_pelos2 = points_pelos2 + user2_a3.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.a3));
                    role_pelo2 = role_pelo2 + user2_a3.level_mee6;
        
                    if(user2_a3.combat_favoriteposition == "droite") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_a3.combat_hatedposition == "droite") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_a3.class == "cavalier") class_pelo2 = class_pelo2 + 6;
                    if(user2_a3.class == "guerrier") class_pelo2 = class_pelo2 - 1;
                    if(user2_a3.class == "archer")   class_pelo2 = class_pelo2 + 3;
                    if(user2_a3.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_a3.faction, {a3: "NULL"});
                }
                
            } catch (e) {
                
                await client.updateFaction(user2_a3.faction, {a3: "NULL"});
            }
        }



        if(faction2db.b1 != "NULL") {
            try {
                const user2_b1 = await client.getUser(message.guild.members.cache.get(faction2db.b1));
                if(message.guild.members.cache.get(user2_b1.userID)) {
                    level_pelos2 = level_pelos2 + user2_b1.level;
                    points_pelos2 = points_pelos2 + user2_b1.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.b1));
                    role_pelo2 = role_pelo2 + user2_b1.level_mee6;
        
                    if(user2_b1.combat_favoriteposition == "gauche") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_b1.combat_hatedposition == "gauche") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_b1.class == "cavalier") class_pelo2 = class_pelo2 + 3;
                    if(user2_b1.class == "guerrier") class_pelo2 = class_pelo2 + 6;
                    if(user2_b1.class == "archer")   class_pelo2 = class_pelo2 - 1;
                    if(user2_b1.class == "NULL")   class_pelo2 = class_pelo2 - 3;

    
                } else {
                    await client.updateFaction(user2_b1.faction, {b1: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(user2_b1.faction, {b1: "NULL"});
            }
        } 
        if(faction2db.b2 != "NULL") {
            try {
                const user_b2 = await client.getUser(message.guild.members.cache.get(faction2db.b2));
                if(message.guild.members.cache.get(user2_b2.userID)) {
                    level_pelos2 = level_pelos2 + user2_b2.level;
                    points_pelos2 = points_pelos2 + user2_b2.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.b2));
                    role_pelo2 = role_pelo2 + user2_b2.level_mee6;
        
                    if(user2_b2.combat_favoriteposition == "centre") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_b2.combat_hatedposition == "centre") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_b2.class == "cavalier") class_pelo2 = class_pelo2 + 3;
                    if(user2_b2.class == "guerrier") class_pelo2 = class_pelo2 + 6;
                    if(user2_b2.class == "archer")   class_pelo2 = class_pelo2 - 1;
                    if(user2_b2.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user_b2.faction, {b2: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(user_b2.faction, {b2: "NULL"});
                
            }
        }
        if(faction2db.b3 != "NULL") {
            try {
                const user2_b3 = await client.getUser(message.guild.members.cache.get(faction2db.b3));
                if(message.guild.members.cache.get(user2_b3.userID)) {
                    level_pelos2 = level_pelos2 + user2_b3.level;
                    points_pelos2 = points_pelos2 + user2_b3.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.b3));
                    role_pelo2 = role_pelo2 + user2_b3.level_mee6;
        
                    if(user2_b3.combat_favoriteposition == "droite") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_b3.combat_hatedposition == "droite") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_b3.class == "cavalier") class_pelo2 = class_pelo2 + 3;
                    if(user2_b3.class == "guerrier") class_pelo2 = class_pelo2 + 6;
                    if(user2_b3.class == "archer")   class_pelo2 = class_pelo2 - 1;
                    if(user2_b3.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_b3.faction, {b3: "NULL"});
                }
            } catch (e) {    
                await client.updateFaction(user2_b3.faction, {b3: "NULL"});
            }
        }



        if(faction2db.c1 != "NULL") {
            try {
                const user2_c1 = await client.getUser(message.guild.members.cache.get(faction2db.c1));
                if(message.guild.members.cache.get(user2_c1.userID)) {
                    level_pelos2 = level_pelos2 + user2_c1.level;
                    points_pelos2 = points_pelos2 + user2_c1.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.c1));
                    role_pelo2 = role_pelo2 + user2_c1.level_mee6;
        
                    if(user2_c1.combat_favoriteposition == "gauche") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_c1.combat_hatedposition == "gauche") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_c1.class == "cavalier") class_pelo2 = class_pelo2 - 1;
                    if(user2_c1.class == "guerrier") class_pelo2 = class_pelo2 + 3;
                    if(user2_c1.class == "archer")   class_pelo2 = class_pelo2 + 6;
                    if(user2_c1.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_c1.faction, {c1: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(user2_c1.faction, {c1: "NULL"});
                
            }
        } 
        if(faction2db.c2 != "NULL") {
            try {
                const user2_c2 = await client.getUser(message.guild.members.cache.get(faction2db.c2));
                if(message.guild.members.cache.get(user2_c2.userID)) {
                    level_pelos2 = level_pelos2 + user2_c2.level;
                    points_pelos2 = points_pelos2 + user2_c2.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.c2));
                    role_pelo2 = role_pelo2 + user2_c2.level_mee6;
        
                    if(user2_c2.combat_favoriteposition == "centre") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_c2.combat_hatedposition == "centre") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_c2.class == "cavalier") class_pelo2 = class_pelo2 - 1;
                    if(user2_c2.class == "guerrier") class_pelo2 = class_pelo2 + 3;
                    if(user2_c2.class == "archer")   class_pelo2 = class_pelo2 + 6;
                    if(user2_c2.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_c2.faction, {c2: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(user2_c2.faction, {c2: "NULL"});
                
            }
        }
        if(faction2db.c3 != "NULL") {
            try {
                const user2_c3 = await client.getUser(message.guild.members.cache.get(faction2db.c3));
                if(message.guild.members.cache.get(user2_c3.userID)) { 
                    level_pelos2 = level_pelos2 + user2_c3.level;
                    points_pelos2 = points_pelos2 + user2_c3.powerpoints;
        
                    client.getPeloRole(message.guild.members.cache.get(faction2db.c3));
                    role_pelo2 = role_pelo2 + user2_c3.level_mee6;
        
                    if(user2_c3.combat_favoriteposition == "droite") positions_pelos2 = positions_pelos2 + 0.02;
                    if(user2_c3.combat_hatedposition == "droite") positions_pelos2 = positions_pelos2 - 0.02;
    
                    if(user2_c3.class == "cavalier") class_pelo2 = class_pelo2 - 1;
                    if(user2_c3.class == "guerrier") class_pelo2 = class_pelo2 + 3;
                    if(user2_c3.class == "archer")   class_pelo2 = class_pelo2 + 6;
                    if(user2_c3.class == "NULL")   class_pelo2 = class_pelo2 - 3;

                } else {
                    await client.updateFaction(user2_c3.faction, {c3: "NULL"});
                }
            } catch (e) {
                await client.updateFaction(user2_c3.faction, {c3: "NULL"});
            }
        }

        if(maitre_faction2 != "NULL") {
            var mxbk2 = [10, 35, 80, 120, 200, 350, 550, 800, 1000];
            for(let i=0;i<mxbk2.length;i++) {
                role_maitre2 = role_maitre2 + 0.05;
                if(maitre_faction2.maxbank == mxbk2[i]) break;
            }     
        }

        const grande_addition_faction1 = faction1db.bank + level_pelos + role_pelo + points_pelos + class_pelo;
        const grande_addition_faction2 = faction2db.bank + level_pelos2 + role_pelo2 + points_pelos2 + class_pelo2;

        const grande_multiplication_faction1 = (role_maitre + positions_pelos) * bonusshop;
        const grande_multiplication_faction2 = (role_maitre2 + positions_pelos2) * bonusshop2;

        const random_faction1 = Math.random() * (1.25 - 0.75) + 0.75;
        const random_faction2 = Math.random() * (1.25 - 0.75) + 0.75;

        // message.channel.send(`DEBUG\nbank: ${faction1db.bank}\nlevel_pelos: ${level_pelos}\nrole_pelo: ${role_pelo}\npoints_pelo: ${points_pelos}\nclass_pelo: ${class_pelo}\nrole_maitre: ${role_maitre}\npositions_pelos: ${positions_pelos}\nbonusshop: ${bonusshop}\n\nGrande addition: ${grande_addition_faction1}\nGrande multiplication: ${grande_multiplication_faction1}\n RANDOM1: ${random_faction1}`);
        // message.channel.send(`DEBUG 2\nbank: ${faction2db.bank}\nlevel_pelos: ${level_pelos2}\nrole_pelo: ${role_pelo2}\npoints_pelo: ${points_pelos2}\nclass_pelo: ${class_pelo2}\nrole_maitre: ${role_maitre2}\npositions_pelos: ${positions_pelos2}\nbonusshop: ${bonusshop2}\n\nGrande addition: ${grande_addition_faction2}\nGrande multiplication: ${grande_multiplication_faction2}\n RANDOM1: ${random_faction2}`);


        const battle_puissance_faction1 = Math.round((grande_addition_faction1 * grande_multiplication_faction1) * random_faction1);
        const battle_puissance_faction2 = Math.round((grande_addition_faction2 * grande_multiplication_faction2) * random_faction2);

        console.log("POWER FACTION1: " + battle_puissance_faction1 + "\nPOWER FACTION2: " + battle_puissance_faction2);
        //message.channel.send("DEBUG: BATTLE -> puissance faction 1: " + battle_puissance_faction1 + "\nPuissance faction 2: " + battle_puissance_faction2); 
        
        // ? DraxyNote: C'est ici à styliser (en dessous dans les if), si tu veux toutes les autres variables (mais j'ai un doute parce que osef 'xD) elles sont au dessus dans les debugs commentés.
        // ? DraxyNote: Tu peux aussi envoyer des messages plus RP si tu veux ! Peut être même des randoms etc. c'est assez facile à coder 
        if(battle_puissance_faction1 > battle_puissance_faction2) { // faction1 Gagne
            message.channel.send(`${faction1db.name} Gagne cette bataille !`);
            client.updateFaction(faction1db.name, {ptsvictoire: faction1db.ptsvictoire + 1});
           
            if(faction2db.ptsvictoire > 0)
                client.updateFaction(faction2db.name, {ptsvictoire: faction2db.ptsvictoire - 1});


        } else if(battle_puissance_faction1 < battle_puissance_faction2) { // faction 2 gagne
            message.channel.send(`${faction2db.name} Gagne cette bataille !`);
            client.updateFaction(faction2db.name, {ptsvictoire: faction2db.ptsvictoire + 1});

            if(faction1db.ptsvictoire > 0)
                client.updateFaction(faction1db.name, {ptsvictoire: faction1db.ptsvictoire - 1});


        } else if(battle_puissance_faction1 = battle_puissance_faction2) { // Egalité
            // ? On ne fait rien ici ? (carrément impossible en vrai d'arriver ici donc bon ... 'xD)
            message.channel.send(`C'est une égalité !`);
        }

        client.updateFaction(faction1db.name, {cooldown_battle: Date.now()});
        client.updateFaction(faction2db.name, {cooldown_battle: Date.now()});

    }
};

module.exports.help = {
    name: "bataille",
    aliases: [],
    category: "guerre",
    desription: "Démarre une bataille.",
    usage: "",
    cooldown: 3,
    permissions: false,
    args: false,
};