const {Collection,  ChannelType} = require('discord.js');
const {PREFIX} = require('../../config');

module.exports = async (client, interaction) => {
    
    if(interaction.isCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if(!cmd) return interaction.reply("Cette commande n'existe pas");
        /*
        let args = 0;
        let settings = 0;
        let dbUser = 0;
        let command = 0;
        let mentionnedUser = 0;
        */

        cmd.runSlash(client, interaction);
    }


};