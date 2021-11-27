const data = require("../../assets/rpg/archivesmaitres.json")

module.exports.run = (client, message, args) => {

    if(args[0] == "all") {
        message.channel.send("Tous les maîtres : ");

        for(i=0;i<data.length;i++) {
            let element = client.filterById(data, i); 
            message.channel.send(`Le ${element.debmandat} <@${element.userid}> a été élu(e) maître de la faction **${element.faction}**`);
        }

    } else {
        let max = 0;
        if(data.length > 5) max = 5
        else max = data.length;

        message.channel.send(max + " derniers maîtres : ");

        for(i=0;i<max;i++) {
            let element = client.filterById(data, i); 
            message.channel.send(`Le ${element.debmandat} <@${element.userid}> a été élu(e) maître de la faction **${element.faction}**`);
        }
    }
}

module.exports.help = {
    name: "archivemaitres",
    aliases: ['archivemaitres', 'am'],
    category: "generalrpg",
    desription: "Liste tous les maîtres",
    usage: '[all]',
    cooldown: 3, 
    permissions: false,
    args: false,
};