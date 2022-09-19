const {EmbedBuilder} = require("discord.js");

module.exports.run = async (client, message, args, settings, dbUser) => {
    client.writeLog(`Commande ${this.help.name} executée par ${message.author.tag} (${message.author.id})`);

    const bdd_faction = [':house:', ':house_abandoned:', ':house_with_garden:', ':european_castle:', ':japanese_castle:'];
    const bdd_position = [':black_heart:', ':blue_heart:', ':brown_heart:', ':white_heart:', ':purple_heart:', ':green_heart:', ':orange_heart:', ':yellow_heart:', ':heart:'];

    if(args[0] == "bdd" || args[0] == undefined) { // Veut voir la liste des emotes.
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Liste affiché. BDD_FACTION=${bdd_faction.length} éléments chargés | BDD_POSITION=${bdd_position.length} éléments chargés`);
        message.channel.send(`FACTION: \nID 0 -> ${bdd_faction[0]} \nID 1 -> ${bdd_faction[1]} \nID 2 -> ${bdd_faction[2]} \nID 3 -> ${bdd_faction[3]} \nID 4 -> ${bdd_faction[4]}`);
        message.channel.send(`POSITION: \nID 0 -> ${bdd_position[0]} \nID 1 -> ${bdd_position[1]} \nID 2 -> ${bdd_position[2]} \nID 3 -> ${bdd_position[3]} \nID 4 -> ${bdd_position[4]} \nID 5 -> ${bdd_position[5]} \nID 6 -> ${bdd_position[6]} \nID 7 -> ${bdd_position[7]} \nID 8 -> ${bdd_position[8]}`);
    }
    else if(args[0] == "faction" || args[0] == "position") {
        const id = parseInt(args[1]);
        client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - faction||position | ID=${parseInt(args[1])}`);
        
        if(args[0] == 'faction') {
            if(id < 0 || id > bdd_faction.length - 1 || isNaN(args[1])) 
                return message.reply(`vous devez renseigner un identifiant valide. \n**ICI :** p<designprofil ${args[0]} ->**${args[1]}**`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Identifiant Invalide. MESSAGE=${message.content} `, "err");

            await client.updateUser(message.member, {profil_emote_faction: bdd_faction[id]});
            message.channel.send(`Le nouvel emote de faction pour votre profil est désormais : ${bdd_faction[id]}`)
            client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Emote Faction Changé. ANCIEN=${dbUser.profil_emote_faction} -> ${bdd_faction[id]}`);
        }
        else if(args[0] == 'position') {
            if(id < 0 || id > bdd_position.length - 1 || isNaN(args[1])) 
                return message.reply(`vous devez renseigner un identifiant valide. \n**ICI :** p<designprofil ${args[0]} ->**${args[1]}**`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Identifiant Invalide. MESSAGE=${message.content} `, "err");
            
            await client.updateUser(message.member, {profil_emote_position: bdd_position[id]});
            message.channel.send(`Le nouvel emote de votre position favorite pour votre profil est désormais : ${bdd_position[id]}`)
            client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Emote Position Changé. ANCIEN=${dbUser.profil_emote_position} -> ${bdd_position[id]}`);
        
        }
    } else {
        return message.reply(`Vous devez choisir une emote à changer. tapez \`p<designprofil\` ou \`p<designprofil bdd\` pour afficher la liste des emotes disponibles.`) & client.writeLog(`Commande ${this.help.name} : ${message.author.tag} (${message.author.id}) - Arguments Invalides. MESSAGE=${message.content}`, "err");
    }
}

module.exports.help = {
    name: "designprofil",
    aliases: ['desprof'],
    category: "entertainment",
    desription: "Design votre profil utilisateur.",
    usage: "<bdd/emote_a_modifier:faction/position> [id]",
    cooldown: 5,
    permissions: false,
    args: false
};