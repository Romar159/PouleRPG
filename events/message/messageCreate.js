const {Collection} = require('discord.js');
const {PREFIX} = require('../../config');

module.exports = async (client, message) => {


    if(!message.author.bot && message.content.startsWith(PREFIX)) {
        if(message.author.id !== "421400262423347211") {
            if(message.author.id !== "211911771433205760") {
                if(message.author.id !== "405420810933895168")
                    return message.reply(`vous n'avez pas la permission requise pour utiliser le bot. DEBUG: MESSAGE AUTHOR ID: ${message.author.id}`);
            }  
        }
    }
    if(message.channel.type === "dm") return;
    
    const dbUser = await client.getUser(message.member);
    const settings = await client.getGuild(message.guild);

    // Dès qu'un utilisateur parle on vérifie s'il existe dans la bdd, sinon on l'ajoute
    if(!dbUser && !message.author.bot) {
        await client.createUser({
            guildID: message.member.guild.id,
            guildName: message.member.guild.name,
        
            userID: message.member.id,
            username: message.member.user.tag,
        });
        await client.updateMaxBank(client, message.member);

        //Màj de la faction si l'utilisateur en a déjà une alors avant de parler
        if(message.member.roles.cache.has('415947454626660366')) return await client.updateUser(message.member, {faction: "epsilon"});
        if(message.member.roles.cache.has('415947455582961686')) return await client.updateUser(message.member, {faction: "daïros"});
        if(message.member.roles.cache.has('415947456342130699')) return await client.updateUser(message.member, {faction: "lyomah"});
        if(message.member.roles.cache.has('665340021640921099')) return await client.updateUser(message.member, {faction: "alpha"});
    } else {
        if(!message.author.bot) {
            if(dbUser.faction == "NULL") {
                //Màj de la faction si l'utilisateur parle et est déjà inscrit dans la bdd 
                if(message.member.roles.cache.has('415947454626660366')) return await client.updateUser(message.member, {faction: "epsilon"});
                if(message.member.roles.cache.has('415947455582961686')) return await client.updateUser(message.member, {faction: "daïros"});
                if(message.member.roles.cache.has('415947456342130699')) return await client.updateUser(message.member, {faction: "lyomah"});
                if(message.member.roles.cache.has('665340021640921099')) return await client.updateUser(message.member, {faction: "alpha"});
            }
        }
    }

    if(!message.author.bot) {
        if(dbUser.faction != "NULL" || dbUser.faction != undefined) {
            if(message.content.startsWith(PREFIX)) {
                client.emit("gameEvents", message);
            }
        }
    }


    //if (message.channel.type === "dm") return client.emit("directMessage", message);
    
    if (!message.content.startsWith(PREFIX) && !message.author.bot) return client.emit("commandWithoutPrefix", message);
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const mentionnedUser = message.mentions.users.first();
    
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
    if(!command) return;

    if(command.help.permissions && !message.member.permissions.has('ADMINISTRATOR')) return message.reply("commande administrateur, permissions requise.");

    if(command.help.args && !args.length) {
        let noArgsReply = `Argument(s) attendu(s) ${message.author}`;

        if(command.help.usage) noArgsReply += `\nSyntaxe : \`${PREFIX}${command.help.name} ${command.help.usage}\``;
        return message.channel.send(noArgsReply);
    }

    if(!client.cooldowns.has(command.help.name)) {
        client.cooldowns.set(command.help.name, new Collection());
    }

    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.help.name);
    const cdAmount = (command.help.cooldown || 5) * 1000;

    if(tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if(timeNow < cdExpirationTime) {
            timeLeft = (cdExpirationTime - timeNow) / 1000;
            return message.reply(`veuillez attendre **${timeLeft.toFixed(0)}** seconde(s) avant de réutiliser la commande.`);
        }
    }

    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);

    command.run(client, message, args, settings, dbUser, command, mentionnedUser);
}