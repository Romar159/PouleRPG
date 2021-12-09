module.exports = (client, member, message) => {
    client.setOr = async (client, member, or, message) => {

        await client.updateMaxBank(client, member);
        const userToUpdate = await client.getUser(member);
        let updatedOr = parseInt(userToUpdate.or) + parseInt(or);
        
        if (updatedOr > parseInt(userToUpdate.maxbank)) {
            const buffer = updatedOr - parseInt(userToUpdate.maxbank);

            if(userToUpdate.faction == "NULL") {
                message.channel.send(`Vous n'avez pas de faction, l'or est alors rendu à PouleRPG.`);
            } else {
                const fac = await client.getFaction(userToUpdate.faction);
                await client.updateFaction(userToUpdate.faction, {bank: fac.bank + buffer});

                message.channel.send(`${message.guild.members.cache.get(userToUpdate.userID).user.username}, **${buffer}** :coin: ajouté(s) au coffre de votre faction.`) // ? DraxyNote : Ici faut styliser :)
            }
            updatedOr = parseInt(userToUpdate.maxbank);
        }

        //if (updatedOr < 0) updatedOr = 0; // ! Avoir de l'argent en négatif.
        await client.updateUser(member, { or: updatedOr});
    }
};