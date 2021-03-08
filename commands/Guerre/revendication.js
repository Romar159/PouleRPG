const {MessageEmbed} = require("discord.js");
const {randomInt} = require("../../util/functions/randominteger");

module.exports.run = async (client, message, args, settings, dbUser, command) => {
   
    if(message.channel.id != "616652710942343222") return message.reply('Cette commande ne peut être executée que dans le salon <#616652710942343222>');

    const faction = await client.getFaction(dbUser.faction);
    if(!faction.en_guerre) return message.reply("Vous n'êtes pas en guerre.");
    const factionEnemy = await client.getFaction(faction.ennemy);

    if(faction.ptsvictoire >= 3) {

        const taux = randomInt(35, 40); // taux en pourcentage de gain de l'or adverse.
        const gain = Math.round((taux * factionEnemy.bank) / 100);

        await client.updateFaction(dbUser.faction, {bank: faction.bank + gain}); // Gain de guerre.
        await client.updateFaction(faction.ennemy, {bank: factionEnemy.bank - gain}); // perte de guerre.

        // Retrait de la guerre.
        await client.updateFaction(faction.ennemy, {en_guerre: false, ennemy: "", ptsvictoire: 0});
        await client.updateFaction(dbUser.faction, {en_guerre: false, ennemy: "", ptsvictoire: 0});
        //Todo: post bêta il y aura probablement de nouvelles choses qui se passe à la fin de la guerre.

        return message.channel.send(`La faction <@&${faction.roleid}> est victorieuse sur <@&${factionEnemy.roleid}>\n ${faction.name} Récupère donc ${gain} du coffre de ${factionEnemy.name}`);

    } else if(factionEnemy.ptsvictoire >= 3) {
        return message.channel.send("La faction adverse domine la guerre. Elle peut à présent appuyer ses revendications.");

    } else {
        return message.channel.send("La guerre n'est pas terminée. Aucune des faction n'a assez de points de victoire.");
    }

}

module.exports.help = {
    name: "revendication",
    aliases: ['revendication', 'rvdcat'],
    category: "guerre",
    desription: "Appuie les revendications de votre faction et fini la guerre !",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false
};