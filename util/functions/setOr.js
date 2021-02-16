module.exports = (client, member, message) => {
    client.setOr = async (client, member, or, message) => {
        await client.updateMaxBank(client, member);
        const userToUpdate = await client.getUser(member);
        let updatedOr = parseInt(userToUpdate.or) + parseInt(or);
        
        if (updatedOr > parseInt(userToUpdate.maxbank)) {
            const buffer = updatedOr - parseInt(userToUpdate.maxbank);
            /*
             TODO: ajoute à la banque de faction le buffer. (On lance une fonction avant qui Update 
            * la faction de l'utilisateur, puis une seconde qui met à jour l'or de faction). 
            * je le fais dans une sépapré parce que on peut n'avoir besoin que d'une fonction à la fois. notamment la première.
            */
            message.channel.send(`TMP ${buffer} or ajouté à la banque de faction.`)
            updatedOr = parseInt(userToUpdate.maxbank);
        }

        if (updatedOr < 0) updatedOr = 0;
        await client.updateUser(member, { or: updatedOr});
    }
};