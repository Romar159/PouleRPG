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

    if(!message.mentions.users.first()) return message.reply("Mention invalide.");

    let member_mention = message.guild.members.cache.get(message.mentions.users.first().id);
    let dbMention = await client.getUser(member_mention);

    try {
        if(dbMention.faction != dbUser.faction) return message.reply("Cet utilisateur n'est pas dans votre faction.");
    } catch(e) {
        return message.channel.send("FATAL ERROR 0x000002")
    }

    if(message.mentions.users.first().id == message.author.id) return message.reply("Vous ne pouvez pas vous même partir en mission.");



}


module.exports.help = {
    name: "mission",
    aliases: [],
    category: "geography",
    desription: "Envoyez en mission vos membres pour récolter des ressources naturelles ou diriger des travaux.",
    usage: '<@USER> <mission>',
    cooldown: 3, 
    permissions: false,
    args: true,
};