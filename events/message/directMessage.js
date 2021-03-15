module.exports = (client, message) => {
    const user = message.author;
    const msg = message.content.toLowerCase();
    if(user.bot) return;

    if(msg.indexOf('oui') >= 0) {
        message.channel.send("Ok boomer.");
    } else if(msg.indexOf('poulet') >= 0) {
        message.channel.send("HMMMMMM OUIII LE POULEEEET **:)))**");
    } else {
        message.channel.send(`Comment ça, "${message.content}", tu te fous de ma gueule là ?`);
    }
}