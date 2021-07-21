const { MessageReaction } = require("discord.js");

module.exports = async (client, MessageReaction, user) => {
    const message = MessageReaction.message;
    const member = message.guild.members.cache.get(user.id);
    const emoji = MessageReaction.emoji.name;
    const channel = message.guild.channels.cache.find(c => c.id === "415945814045884427");

    const guerreRole = message.guild.roles.cache.get("867514642360041502");

    if(member.user.bot) return;

    if(["EP_GIGA_SATANAS"].includes(emoji) && message.channel.id === channel.id) {
        switch(emoji) {
            case "EP_GIGA_SATANAS":
                member.roles.remove(guerreRole);
                message.channel.send("C'est plus cadeau :)");
                break;
        }
    }

}