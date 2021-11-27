module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.channels.cache.get('415945814045884427').send("``Bot lancé``");
    client.channels.cache.get('910911415974518854').sendTyping();
   
    client.user.setPresence({ activities: [{ name: 'comment fonctionne p<aide', type: 'WATCHING'}] });
     
} 