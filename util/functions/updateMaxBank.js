module.exports = client => {
    client.updateMaxBank = async (client, member) => {

        

        const userToUpdate = await client.getUser(member);
        if (member.roles.cache.has('445253268176633891'))       // Paysan
            return await client.updateUser(member, { maxbank: 10});
        else if (member.roles.cache.has('445253591465328660'))  // Artisan
            return await client.updateUser(member, { maxbank: 35});
        else if (member.roles.cache.has('445253561648021514'))  // Bourgeois
            return await client.updateUser(member, { maxbank: 80});
        else if (member.roles.cache.has('445253809640308746'))  // Courtisan
            return await client.updateUser(member, { maxbank: 120});
        else if (member.roles.cache.has('445257669918588948'))  // Baron
            return await client.updateUser(member, { maxbank: 200});
        else if (member.roles.cache.has('650832087993024522'))  // Comte
            return await client.updateUser(member, { maxbank: 350});
        else if (member.roles.cache.has('445257144011587594'))  // Marquis
            return await client.updateUser(member, { maxbank: 550});
        else if (member.roles.cache.has('612469098466639893'))  // Duc
            return await client.updateUser(member, { maxbank: 800});
        else if (member.roles.cache.has('650828967716192269'))  // Vassal
            return await client.updateUser(member, { maxbank: 1000});
        else // Si n'a aucun rôle.
            return await client.updateUser(member, { maxbank: 0});
    };
}; 