const {MessageEmbed} = require('discord.js');

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

    if(!message.mentions.users.first()) return message.reply(`vous devez renseigner un utilisateur valide.\n**ICI -> ${args[0]}**`);
    if(isNaN(args[1])) return message.reply(`vous devez renseigner une valeur numérique.\n**ICI -> ${args[1]}**`);
    if(args[1] < 1) return message.channel.send(`Valeur trop faible.`);

    const member_ran = message.mentions.members.first();
    const faction = await client.getFaction(dbUser.faction);
    let dataUser = await client.getUser(member_ran);
    if(!dataUser) {
        await client.createUser({
            guildID: member_ran.guild.id,
            guildName: member_ran.guild.name,
        
            userID: member_ran.id,
            username: member_ran.user.tag,
        });

        if(member_ran.roles.cache.has('415947454626660366')) await client.updateUser(member_ran, {faction: "epsilon"});
        if(member_ran.roles.cache.has('415947455582961686')) await client.updateUser(member_ran, {faction: "daïros"});
        if(member_ran.roles.cache.has('415947456342130699')) await client.updateUser(member_ran, {faction: "lyomah"});
        if(member_ran.roles.cache.has('665340021640921099')) await client.updateUser(member_ran, {faction: "alpha"});
    }
    dataUser = await client.getUser(member_ran); //update
    

    if(dataUser.faction != dbUser.faction) return message.reply("cet utilisateur ne fait pas partie de votre faction.");
    
    const or = parseInt(args[1]);

    if(faction.bank < or) return message.reply("il n'y a pas assez d'argent dans le coffre de faction.");

    await client.updateFaction(dbUser.faction, {bank: faction.bank - or});
    await client.setOr(client, member_ran, args[1], message);

    const embed = new MessageEmbed()
    .setColor('F2F23C')
    .setAuthor(`Virement effectué !`, message.author.displayAvatarURL())
    .setDescription(`**${or}** :coin: versé à ${member_ran} du coffre de la faction **${faction.name.charAt(0).toUpperCase() + faction.name.slice(1)}**.`);

    message.channel.send({ embeds: [embed] });
};

module.exports.help = {
    name: "virementcoffre",
    aliases: ['vc'],
    category: "politique, diplomatie et economie",
    desription: "Transfère de l'or du coffre de faction vers la banque personnel d'un membre.",
    usage: "<@USER> <or>",
    cooldown: 3,
    permissions: false,
    args: true,
};