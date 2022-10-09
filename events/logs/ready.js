module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.channels.cache.get('415945814045884427').send("``Bot lancé``");
    client.channels.cache.get('991872679005130852').sendTyping();
   
    client.user.setPresence({ activities: [{ name: 'comment fonctionne p<aide', type: 'WATCHING'}] });
     
    const devGuild = client.guilds.cache.get('415943423636537344');
    devGuild.commands.set(client.commands.map(cmd => cmd));
} 