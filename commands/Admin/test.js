const { MessageActionRow, MessageButton, MessageCollector } = require("discord.js");
const {PREFIX} = require('../../config');

module.exports.run = async (client, message, args, settings, dbUser) => {
    /*let jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    message.reply(jours[new Date().getDay()]);*/

    // si c'est 6 c'est samedi
/*
    const filter = m => (message.author.id === m.author.id);
    var final = `{\n`;

    message.channel.send("ID");
    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
            final = final + `"id" : ${collected.first().content},\n`;
            
            message.channel.send("NAME");
            message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                final = final + `"name" : "${collected.first().content}",\n`;
                    message.channel.send("RARETE");
                    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                        final = final + `"rarete" : ${collected.first().content},\n`;
                            message.channel.send("DESCRIPTION");
                            message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                                final = final + `"description" : "${collected.first().content}",\n`;
                                    message.channel.send("REACTIONS");
                                    message.channel.awaitMessages({ filter, max: 1, time: 30000}).then(collected => {
                                        let array_reacts = collected.first().content.split(" ");
                                        let final_array = `[\\${array_reacts[0]}`;
                                        for(let i = 1; i < array_reacts.length; i++) {
                                            final_array = final_array + `, '\\${array_reacts[i]}'`;
                                        }
                                        final_array = final_array + `]`;
                                        final = final + `"reactions" : ${final_array},\n`;
                                        
                                        message.channel.send(final)
                                            
                                    }).catch(() => {
                                            message.reply('timeout.');
                                    });
                            }).catch(() => {
                                    message.reply('timeout.');
                            });
                    }).catch(() => {
                            message.reply('timeout.');
                    });
            }).catch(() => {
                    message.reply('timeout.');
            });

    }).catch(() => {
            message.reply('timeout.');
    }); */


    //if(dbUser.training == true) message.reply("OUI ! D'accord ! Il s'entraine.");

    
    client.channels.cache.get("415947202649653249").messages.fetch("930886480895823892")
    .then(message => message.react(`❄️`))
    .catch(console.error);

};
  
module.exports.help = {
    name: "test",
    aliases: ['test'],
    category: "admin",
    desription: "un fichier pour faire des tests rapidos.",
    usage: '',
    wiki: 'https://romar159.github.io/poulerpg.github.io/',
    cooldown: 2,  
    permissions: true,
    args: false
};