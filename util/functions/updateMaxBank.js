const gameconfig = require("../../assets/gameconfigs");

module.exports = client => {
    client.updateMaxBank = async (client, member) => {

        

        const userToUpdate = await client.getUser(member);
        if (member.roles.cache.has('445253268176633891'))       // Paysan
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_PAYSAN});
        else if (member.roles.cache.has('445253591465328660'))  // Artisan
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_ARTISAN});
        else if (member.roles.cache.has('445253561648021514'))  // Bourgeois
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_BOURGEOIS});
        else if (member.roles.cache.has('445253809640308746'))  // Courtisan
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_COURTISAN});
        else if (member.roles.cache.has('445257669918588948'))  // Baron
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_BARON});
        else if (member.roles.cache.has('650832087993024522'))  // Comte
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_COMTE});
        else if (member.roles.cache.has('445257144011587594'))  // Marquis
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_MARQUIS});
        else if (member.roles.cache.has('612469098466639893'))  // Duc
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_DUC});
        else if (member.roles.cache.has('650828967716192269'))  // Vassal
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_VASSAL});
        else // Si n'a aucun rôle.
            return await client.updateUser(member, { maxbank: gameconfig.MAXBANQUE_NULL});
    };
}; 