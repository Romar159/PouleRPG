const { MessageReaction } = require("discord.js");

module.exports = (client, MessageReaction, user) => {
    const message = MessageReaction.message;
    const member = message.guild.members.cache.get(user.id);
    const emoji = MessageReaction.emoji.name;
    const channel = message.guild.channels.cache.find(c => c.id === "415945814045884427");

    const guerreRole = message.guild.roles.cache.get("750336000193986652");

    if(member.user.bot) return;

    if(["EP_GIGA_SATANAS"].includes(emoji) && message.channel.id === channel.id) {
        switch(emoji) {
            case "EP_GIGA_SATANAS":
                member.roles.add(guerreRole);
                message.channel.send("C'est cadeau :)");
                break;
        }
    }

}