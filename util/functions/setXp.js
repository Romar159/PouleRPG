module.exports = (client, member, message) => {
    client.setXp = async (client, member, xp) => {
        const userToUpdate = await client.getUser(member);
        let updatedXp = parseInt(userToUpdate.experience) + parseInt(xp);
        let updatedlvl = parseInt(userToUpdate.level);

        while(updatedXp >= (((700 * parseInt(userToUpdate.level)) / Math.sqrt(parseInt(userToUpdate.level))) - 200)) {
           updatedlvl++;
           updatedXp -= Math.round((((700 * parseInt(userToUpdate.level)) / Math.sqrt(parseInt(userToUpdate.level))) - 200));
        }
        if (updatedXp < 0) updatedXp = 0;
        await client.updateUser(member, { experience: updatedXp, level: updatedlvl});
    }
};