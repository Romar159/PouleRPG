module.exports.run = async (client, message, args) => {
    message.guild.members.fetch().then(async fetchAll => {
        const dailyCD = (8.64e+7) * 7;
        const inactifs = fetchAll.filter(m => (dailyCD - (Date.now() -  m.joinedAt) < 0));

        var roleslvl_ids = ["445253268176633891", "445253591465328660", "445253561648021514", "445253809640308746", "445257669918588948", "650832087993024522", "445257144011587594", "612469098466639893", "650828967716192269"];
        let inactifs2 = inactifs.filter(m2 => !m2.roles.cache.get(roleslvl_ids['445253268176633891']));

        for(let i=0;i<roleslvl_ids.length;i++) {
            inactifs2 = inactifs2.filter(m2 => !m2.roles.cache.get(roleslvl_ids[i]));
        }
        inactifs2 = inactifs2.filter(m3 => !m3.user.bot);
        
        try {
            
            message.channel.send(`Voulez vous vraiment kick :\n ${inactifs2.map(m=>m.user.tag).join('\n')} ? (oui)`);
            const filter = m => (message.author.id === m.author.id);
            const userEntry = await message.channel.awaitMessages(filter, {
                max:1, time:5000, errors: ['time']
            });
    
            if(userEntry.first().content.toLowerCase() === "oui") {
                inactifs2.map(m=> m.kick());            
            } else {
                message.channel.send('Timeout.');
            }
        } catch(e) {
            message.channel.send('Timeout.');
        }

    });
};
  
module.exports.help = {
    name: "kickinactifs",
    aliases: ['kickinactifs', 'ki'],
    category: "admin",
    desription: "Kick tous les utilisateurs ayant rejoint le serveur depuis plus de 7 jours et qui n'ont pas le rôle paysan ou plus.",
    usage: '',
    cooldown: 2, 
    permissions: true,
    args: false
};