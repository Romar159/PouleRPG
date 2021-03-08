const {MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args, settings, dbUser) => {

    //DRAXYNOTE:  Ici c'est pas fini.
    
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
    if(!est_maitre) return message.reply("Commande utilisable que par les maîtres de faction.");

    if(!message.mentions.users.first()) return message.reply("ERROR: Vous devez renseigner un utilisateur valide. {HERE-> " + args[0] + "}");
    if(isNaN(args[1])) return message.reply("ERROR, vous devez renseigner une valeur numérique {HERE-> " + args[1] + "}");

    const member_ran = message.mentions.members.first();
    const faction = await client.getFaction(dbUser.faction);
    const dataUser = await client.getUser(member_ran);
    if(!dataUser) {
        await client.createUser({
            guildID: member_ran.guild.id,
            guildName: member_ran.guild.name,
        
            userID: member_ran.id,
            username: member_ran.user.tag,
        });
    }
    if(dataUser.faction != dbUser.faction) return message.reply("ERROR: cet utilisateur ne fait pas partie de votre faction.");
    await client.setOr(client, member_ran, args[1], message);
    const or = parseInt(args[1]);
    await client.updateFaction(dbUser.faction, {bank: faction.bank - or});

    message.channel.send(`${or} versé à la banque personnel de ${member_ran} depuis le coffre de la faction ${faction.name}`);
};

module.exports.help = {
    name: "vircof",
    aliases: ['virementCoffre'],
    category: "Politique, Diplomatie et Economie",
    desription: "Transfère de l'or du coffre de faction vers la banque personnel d'un membre.",
    usage: "<@USER> <or>",
    cooldown: 3,
    permissions: false,
    args: true,
};