module.exports.run = async (client, message, args, settings) => {
   const getSetting = args[0];
   const newSetting = args.slice(1).join(" ");

   switch(getSetting) {
       case "prefix": {
           if(newSetting) {
               await client.updateGuild(message.guild, {prefix: newSetting});
               return message.channel.send(`Prefix mit à jour : \`${settings.prefix}\`->\`${newSetting}\``);
           }
           message.channel.send(`Prefix actuel : ${settings.prefix}`);
           break;
       }
   }
};
  
module.exports.help = {
    name: "editguildbdd",
    aliases: [],
    category: "admin",
    desription: "Modifie la base de données",
    usage: '<key> <value>',
    cooldown: 0, 
    permissions: true,
    args: true
};