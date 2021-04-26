module.exports.run = (client, message, args) => {

    message.guild.members.fetch().then(fetchAll => {
        fetchAll.map(m => m.send(":fish:"));
    });
}

module.exports.help = {
    name: "fish",
    aliases: ['fish'],
    category: "experiments",
    desription: "Envoie un poisson à tout le monde.",
    usage: "",
    cooldown: 1,
    permissions: true,
    args: false 
};