const {army_edition} = require("../../util/commands_modules/guerre_modules/army_edition");
const {units_achat} = require("../../util/commands_modules/guerre_modules/units_achat");
const {units_vente} = require("../../util/commands_modules/guerre_modules/units_vente");
const {diplomatie} = require("../../util/commands_modules/guerre_modules/diplomatie");
const {nommer_commandants} = require("../../util/commands_modules/guerre_modules/nommer_commandants");
const {etat} = require("../../util/commands_modules/guerre_modules/etat");
const {bataille} = require("../../util/commands_modules/guerre_modules/bataille");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");


module.exports.run = async (client, message, args, settings, dbUser) => {

    if(!client.isMaster(message)) {
        console.log(client.isConseiller(message.member, 901))
        if(await client.isConseiller(message.member, 901) == false) {
            return message.reply(`Vous n'êtes pas maître de faction ou maréchal. Vous ne pouvez pas utiliser cette commande.`)
        }
    }
    
    if(dbUser.in_jail == 'true') {
        return message.reply(`Vous êtes actuellement enfermé dans les cachots. Il vous est donc impossible de gérer la guerre.`)
    }



    //TODO:Bêta: dans chaque module, le bouton retour le plus haut (premier embed quand on ouvre la catégorie) devra réouvrir l'interface de guerre cité ci-dessus. Tout en quittant évidemment les collector et tout mais ça je crois que c'est déjà géré
    //* Note, on le fera donc en bêta, ça se fait en ajoutant un module guerre pour l'interface principale. Que cette commande ne fait que le lancer comme les autres. Et que les autres modules lancent donc ce module également en quittant.

    //TODO ne pas oublier qu'il faudra empêcher certains modules si une guerre n'est pas en cours. Ou du moins vérifier qu'on peut pas tout faire planter
    //todo par exemple avec le fait qu'un if vérifie les factions attaquantes et défenseurs mais vérifie pas s'il sont nulles etc...
    //todo le mieux serait donc d'empêceher l'execution de certains module, mais dans le meilleur cas ce serait d'afficher un embed similaire à l'interface
    //todo avec autre chose d'écrit. Comme l'état par exemple juste afficher un bel embed "Vous n'êtes en guerre contre personne."


    
    
    
    
    
    
    

    if(args[0] == "edit") {
        army_edition(client, message, dbUser);
    }
    else if(args[0] == "achat") {
        
        units_achat(client, message, dbUser);
    } else if(args[0] == "vente") {

        units_vente(client, message, dbUser);

    } else if(args[0] == "diplomatie") {

        diplomatie(client, message, dbUser);

    } else if(args[0] == "commandants") {

        nommer_commandants(client, message, dbUser);

    } else if(args[0] == "état") {
        etat(client, message, dbUser);
    } else if(args[0] == "bataille") {
        bataille(client, message, dbUser);
    } else {

        var embed_guerre = new EmbedBuilder()
        .setColor('3C4C66')
        .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTitle(`Guerre`)
        .setDescription("Gérez l'aspect que vous souhaitez par rapport à la guerre et aux relations diplomatiques.");
    
    
    //Relié au Embed du dessus :
    const rowMenuGuerre_part1 = new ActionRowBuilder()
        .addComponents(
        
        new ButtonBuilder()
            .setCustomId(`btnedit` + message.author.id)
            .setLabel('Gérer l\'armée')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnachat` + message.author.id)
            .setLabel('Acheter des unités')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btnvente` + message.author.id)
            .setLabel('Vendre des unités')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`btncommandants` + message.author.id)
            .setLabel('Gérer les commandants')
            .setStyle(ButtonStyle.Secondary)
    ); 

    const rowMenuGuerre_part2 = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setCustomId(`btndiplomatie` + message.author.id)
            .setLabel('Gérer la diplomatie')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`btnetat` + message.author.id)
            .setLabel('Gérer la guerre')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`btnbataille` + message.author.id)
            .setLabel('Lancer une bataille')
            .setStyle(ButtonStyle.Danger)
    ); 



    
        
    
    const filter = i => (
        i.customId === 'btnedit' + message.author.id ||
        i.customId === 'btnachat' + message.author.id || 
        i.customId === 'btnvente' + message.author.id ||
        i.customId === 'btndiplomatie' + message.author.id||
        i.customId === 'btncommandants' + message.author.id || 
        i.customId === 'btnetat' + message.author.id ||
        i.customId === 'btnbataille' + message.author.id) && 
        i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 }); //2 minutes

    await collector.on('collect', async i => {
        if(i.isButton()) {
            if(i.customId == "btnedit" + i.user.id) {
                await i.deferUpdate();
                army_edition(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
            if(i.customId == "btnachat" + i.user.id) {
                await i.deferUpdate();
                units_achat(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
            if(i.customId == "btnvente" + i.user.id) {
                await i.deferUpdate();
                units_vente(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
            if(i.customId == "btndiplomatie" + i.user.id) {
                await i.deferUpdate();
                diplomatie(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
            if(i.customId == "btncommandants" + i.user.id) {
                await i.deferUpdate();
                nommer_commandants(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
            if(i.customId == "btnetat" + i.user.id) {
                await i.deferUpdate();
                etat(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
            if(i.customId == "btnbataille" + i.user.id) {
                await i.deferUpdate();
                bataille(client, message, dbUser);
                collector.stop();
                i.deleteReply()
            }
        }
    });

    message.channel.send({embeds:[embed_guerre], components:[rowMenuGuerre_part1, rowMenuGuerre_part2]});

    }
    
}

module.exports.help = {
    name: "guerre",
    aliases: ['guerilla', 'thewar', 'tchounasslecombat', 'laguerrenemeurtjamais', 'easy', 'ez'],
    category: "faction",
    desription: "Gérez tous les aspects de la guerre en une seule commande ! Notez que pour la majorité des options vous aurez un quart d'heure pour les modifier. Veillez à bien quitter les menus si vous n'utilisez plus le bot avant ce temps-là pour l'alléger un peu, merci à ceux qui y penserons ! :)",
    usage: '',
    cooldown: 1, 
    permissions: false,
    args: false,
};