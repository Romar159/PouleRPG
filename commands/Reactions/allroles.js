const { MessageReaction, MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
   const guerreRole = message.guild.roles.cache.get("750336000193986652");
   const checkEmoji = message.guild.emojis.cache.get("670675422756732932");

   const embed = new MessageEmbed()
   .setTitle("Roles")
   .setDescription("Cliquez sur la réaction pour avoir le rôle.")
   .setColor("#FFFFFF")
   .addField(
       "les roles dispo sont :",
       `
       ${checkEmoji} - ${guerreRole.toString()}
       `
   )

   client.channels.cache.get('415945814045884427').send(embed).then(async msg => {
       await msg.react(checkEmoji);
   });
}

module.exports.help = {
    name: "allroles",
    aliases: ['allroles'],
    category: "reactions",
    desription: "renvoie un message avec des réactions !",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false
};