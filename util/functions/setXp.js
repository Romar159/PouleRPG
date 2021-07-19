module.exports = (client, member, message) => {
    client.setXp = async (client, member, xp) => {
        const list_badges = require('../../assets/rpg/badges.json');
        const userToUpdate = await client.getUser(member);
        let updatedXp = parseInt(userToUpdate.experience) + parseInt(xp);
        let updatedlvl = parseInt(userToUpdate.level);
        
        while(updatedXp >= ((700 * parseInt(userToUpdate.level)) / Math.sqrt(parseInt(userToUpdate.level)))) {
           updatedlvl++;
           updatedXp -= Math.round((700 * parseInt(userToUpdate.level)) / Math.sqrt(parseInt(userToUpdate.level)));
        }
        if(updatedXp < 0) updatedXp = 0;
        await client.updateUser(member, {experience: updatedXp, level: updatedlvl});

        if(updatedlvl >= 50) {
            if(await client.addBadge(client, member, userToUpdate, "1")) {
                client.channels.cache.get('415945814045884427').send(`WOW !! ${member} vient de gagner le badge **${client.filterById(list_badges, 1).name}** !`);
            }
        }

    }
};