const { MessageReaction } = require("discord.js");

module.exports = async (client, MessageReaction, user) => {
    const message = MessageReaction.message;
    const member = message.guild.members.cache.get(user.id);
    const emoji = MessageReaction.emoji.name;
    const channel = message.guild.channels.cache.find(c => c.id === "415945814045884427");
    const dbUser = await client.getUser(member);

    const guerreRole = message.guild.roles.cache.get("867514642360041502");

    if(member.user.bot) return;

    if(["EP_GIGA_SATANAS"].includes(emoji) && message.channel.id === channel.id) {
        switch(emoji) {
            case "EP_GIGA_SATANAS":
                member.roles.add(guerreRole);
                message.channel.send("C'est cadeau :)");
                client.addFoundedEasterEgg(client, member, dbUser, 8);
            break;
        }
    }
}