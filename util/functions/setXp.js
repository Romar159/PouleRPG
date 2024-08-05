module.exports = (client, member, message) => {
    client.setXp = async (client, member, xp) => {
        const list_badges = require('../../assets/rpg/badges.json');
        const userToUpdate = await client.getUser(member);
        let updatedXp = parseInt(userToUpdate.experience) + parseInt(xp);
        let initiallvl = parseInt(userToUpdate.level);
        let updatedlvl = parseInt(userToUpdate.level);
        let is_level_updated = false;
        
        

        while(updatedXp >= ((1000 * parseInt(userToUpdate.level)) / Math.sqrt(parseInt(userToUpdate.level)) * 1.5)) {
           updatedlvl++;
           if(updatedlvl > 200) {
            updatedlvl = 200;
           }
           updatedXp -= Math.round((1000 * parseInt(userToUpdate.level)) / Math.sqrt(parseInt(userToUpdate.level)) * 1.5);
           is_level_updated = true;
        }

        if(is_level_updated == true) {
            if(updatedlvl == 200) {
                if(initiallvl != 200) {
                    client.channels.cache.get('415945814045884427').send(`${member} vient de passer au niveau **${updatedlvl}** le niveau **maximal** :tada: !!`);
                }
            } else {
                client.channels.cache.get('415945814045884427').send(`${member} vient de passer au niveau **${updatedlvl}** !`);
            }
        }

        if(updatedXp < 0) updatedXp = 0;
        await client.updateUser(member, {experience: updatedXp, level: updatedlvl});

        if(updatedlvl >= 100) {
            if(await client.addBadge(client, member, userToUpdate, "1")) {
                client.channels.cache.get('415945814045884427').send(`WOW !! ${member} vient de gagner le badge **${client.filterById(list_badges, 1).name}** !`);
            }
        }
    }
};