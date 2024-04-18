 module.exports.run = async (client, message, args) => {
  
  client.writeLog(`Commande ${this.help.name} a subit une tentation d'execution par ${message.author.tag} (${message.author.id})`, "warn");
  
  return message.channel.send("Par mesure de sécurité. Cette commande est complètement desactivée.")
  /*function clean(text) {
    if (typeof text === "string") 
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  }
 
  if (message.author.id !== "421400262423347211") return;
  
  const code = args.join(" ");
  const evaled = eval(code);
  const cleanCode = await clean(evaled);
  message.channel.send(cleanCode, { code: "js" });*/
};

module.exports.help = {
    name: "eval",
    aliases: ['eval'],
    category: "",
    desription: "renvoie un code JS testé.",
    usage: '<code>',
    cooldown: 2, 
    permissions: true,
    args: true
};