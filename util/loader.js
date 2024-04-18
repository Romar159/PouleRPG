const {readdirSync} = require("fs");

const loadCommands = (client, dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
    
        for (const file of commands) {
            const getFileName = require(`../${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.help.name, getFileName);
            console.log(`Commande chargée: ${getFileName.help.name}`);
        };
    });
};

const loadEvents = (client, dir = "./events/") => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

        for (const event of events) {
            const evt = require(`../${dir}/${dirs}/${event}`);
            const evtName = event.split(".")[0];
            if(evtName === "messageCreate") {
                client.on(evtName, evt.bind(null, client));
            } else if(evtName == "ready") {
                client.once(evtName, evt.bind(null, client));
            } else {
                client.on(evtName, evt.bind(null, client));
            }
            console.log(`Evenement chargé : ${evtName}`);
        };
    }); 
};

const loadGlobalVariables = (client) => {

    global.CommandsCollectors = new Map();

    global.users_use_guerre_cmd = [];
    global.users_use_infofaction_cmd = [];
}


module.exports = {
    loadCommands,
    loadEvents,
    loadGlobalVariables
} 