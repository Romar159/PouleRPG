﻿const Discord = require('discord.js'), bot = new Discord.Client()
const ajax = require("ajax");
const fs = require("fs");
const mkdirp = require("mkdirp");
const snekfetch = require("snekfetch");
const http = require("http");
const https = require("https");
let crypto = require('crypto');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const hash = crypto.createHash('md5')
	.update('password')
	.digest('hex')

const config = require("./data/config.json");

bot.login(config.token);

let DraxyEmpereurID = 211911771433205760;
let RomarEmpereurID = 421400262423347211;


let prefix = ("p<");

let bot_version = "0.2.3";
let bot_lignes = "1793";


let MaitreFac_Epsilon;
let MaitreFac_Gamma;
let MaitreFac_Zeta;
let MaitreFac_Omega;

let factionDe_Request = "";
let MaitreFac = "";

const talkedRecently_arene = new Set();



let xp_level_up_required_BASE = 50; //nombre d'xp qu'il faut pour level de base (sans multiplicateur de level)


let buffer_thunas;
		

//Fontions:

function msToTime(duration) { //Permet de transformer des MS en heure humaine
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  
  if (hours > 0) {
    return hours + " heures, " + minutes + " minutes et " + seconds + " secondes"; //+ milliseconds
  } else if ( minutes > 0)
  {
	return minutes + " minutes et " + seconds + " secondes"; //+ milliseconds
  } else if ( seconds > 0)
	{
    return  seconds + " secondes"; //+ milliseconds
  } else {
	return "1 seconde";
  }
}

function entierAleatoire(min, max) { //Pour avoir un entier aléatoire avec les paramètres passés
	
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function Unix_timestamp(t) { 

	var dt = new Date(t*1000);
	var hr = dt.getHours();
	var m = "0" + dt.getMinutes();
	var s = "0" + dt.getSeconds();
	return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);   // UTILITÉ NON TROUVÉ: (je crois que: retourne sous la forme d'un Date, le temps passé en paramètres (milisecondes))
}



function addXp(id_usr, xpToAdd) { //Fonction permettant d'éditer l'XP d'un utilisateur : elle peut être utiliser pour retirer ou pour ajouter des points d'XP

	let xp_a_ecrire;
	let xp_level_a_ecrire;

	let xp_necess_pour_up; //le nombre d'xp qui faut pour level up à l'utilisateur !

	let json_xp;
	let xp_b4; //contient l'xp avant d'en ajouté !
	let xplevel_b4; //contient le level d'xp avant d'en ajouté !


	if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà

		} else { //si le fichier xp de l'utilisateur n'existe pas
			xp_a_ecrire = 0;
			xp_level_a_ecrire = 1;
			console.log("addXp Function : LE FICHIER EXISTE PAS !!")
			console.log("xp_a_ecrire :" + xp_a_ecrire + "\nxp_level_a_ecrire :" + xp_level_a_ecrire);

			fs.writeFileSync('json/xp/xp_' + id_usr + '.json', `
					{
						"xp" : 0,
						"xplevel" : 1
					}

					`, function(erreur) {
				    if (erreur) {
				        console.log(erreur)
				    }
				});
		}

	//maintenant on à forcément un fichier à traiter, soit il existait déjà et donc on l'utilise, soit on le crée en initialisant ses valeurs au minimum.

	fs.readFile(`json/xp/xp_${id_usr}.json`, function(erreur, fichier) {

		json_xp = JSON.parse(fichier);

		xp_b4 = json_xp.xp;
		xplevel_b4 = json_xp.xplevel;

		
		xp_necess_pour_up = xp_level_up_required_BASE * xplevel_b4; //le calcul basique du nombre d'xp nécéssaire pour lvl up, le level d'xp * le nombre d'xp qu'il faut pour level up au niveau 1 (actuellement '50')


		xp_a_ecrire = xp_b4 + xpToAdd; //Ici on prend l'xp qu'est dans le fichier, et on lui ajoute le nombre défini dans les paramètres de la fonction
		xp_level_a_ecrire = xplevel_b4; // de base on prend le lvl écrit dans le fichier, et après on test si on doit lvl up

		if (xp_a_ecrire >= xp_necess_pour_up) { //test si on doit level up (NOTA_BENE: **on pourrait faire une fonction pour test**)
			xp_a_ecrire = xp_a_ecrire - xp_necess_pour_up; //on retire le nombre d'xp en trop, pour avoir juste ce qui dépassait, et donc ce qu'il faut mettre au level suivant (exemple le level 1 est à 50 xp nécéssaire, si on à 75 d'xp alors ça met ce chiffre à 25 et on sera au level 2 avec 25 xp)
			xp_level_a_ecrire = xplevel_b4 + 1;
		}

		if (xp_a_ecrire < 0 && xp_level_a_ecrire > 1) {
			xp_a_ecrire = 0;
		}

		//maintenant on à le xplevel à écrire, et l'xp à écrire aussi, on peut écrire tout ça dans le fichier utilisateur :

		fs.writeFile(`json/xp/xp_${id_usr}.json`, `
				{ 
					"xp": ` + xp_a_ecrire + `,
					"xplevel": ` + xp_level_a_ecrire + `
				}`, 
		function(err) {

			if(err) {
			    return console.log(err);
			}
			console.log("The file was saved!");
		}); 
	})
}



function addXp2(id_usr, xpToAdd) { //Obsolète !
	let json_xp
	let xp_a_add;
	let xp_level_a_add;
	let xplevel_avant_ajout;
	let xp_level_up_required;

	if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà, dans tous les cas ça le créer.
    	fs.readFile('json/xp/xp_' + id_usr + '.json', function(erreur, fichier) {
		   	json_xp = JSON.parse(fichier)
		   	
		  	
		  	xp_a_add = json_xp.xp + xpToAdd;

		  	xplevel_avant_ajout = json_xp.xplevel;

		  	console.log(xplevel_avant_ajout);
		  	console.log(json_xp.xp);

		  	xp_level_a_add = xplevel_avant_ajout;

		  	xp_level_up_required = xp_level_up_required_BASE * json_xp.xplevel; //xp qu'il faut pour monter de level, si on est level 1 : 50xp (1x50), level 2 : 100 (2x50) etc.

		  	if (json_xp.xp >= xp_level_up_required) {
		  		console.log("xplevel_avant_ajout : " + xplevel_avant_ajout);
		  		xp_level_a_add = xplevel_avant_ajout + 1;
		  		xp_a_add = json_xp.xp - xp_level_up_required;
		  		console.log("xp_a_add quand on dépasse de level : " + xp_a_add);

		  	}

		  	
			

		})

    fs.writeFile("json/xp/xp_" + id_usr + ".json", `
				{ 
					"xp": ` + xp_a_add + `,
					"xplevel": ` + xp_level_a_add + `
				}`, function(err) {

				    if(err) {
				        return console.log(err);
				    }

			    	console.log("The file was saved!");
				}); 
	}
}

function remXp(id_usr, xpToRem) { //Obsolète !
	let xp_a_ecrire;
	let xp_level_a_ecrire;

	let xp_necess_pour_up; //le nombre d'xp qui faut pour level up à l'utilisateur !

	let json_xp;
	let xp_b4; //contient l'xp avant d'en ajouté !
	let xplevel_b4; //contient le level d'xp avant d'en ajouté !


	if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà

	} else { //si le fichier xp de l'utilisateur n'existe pas
		xp_a_ecrire = 0;
		xp_level_a_ecrire = 1;
		console.log("addXp Function : LE FICHIER EXISTE PAS !!")
		fs.writeFile(`json/xp/xp_${id_usr}.json`, `
				{ 
					"xp": ` + xp_a_ecrire + `,
					"xplevel": ` + xp_level_a_ecrire + `
				}`, 
		function(err) {

			if(err) {
			    return console.log(err);
			}
			console.log("The file was saved!");
		}); 
	}

	//maintenant on à forcément un fichier à traiter, soit il existait déjà et donc on l'utilise, soit on le crée en initialisant ses valeurs au minimum.

	fs.readFile(`json/xp/xp_${id_usr}.json`, function(erreur, fichier) {

		json_xp = JSON.parse(fichier);

		xp_b4 = json_xp.xp;
		xplevel_b4 = json_xp.xplevel;

		
		xp_necess_pour_up = xp_level_up_required_BASE * xplevel_b4; //le calcul basique du nombre d'xp nécéssaire pour lvl up, le level d'xp * le nombre d'xp qu'il faut pour level up au niveau 1 (actuellement '50')


		xp_a_ecrire = xp_b4 - xpToAdd; //Ici on prend l'xp qu'est dans le fichier, et on lui ajoute le nombre défini dans les paramètres de la fonction
		xp_level_a_ecrire = xplevel_b4; // de base on prend le lvl écrit dans le fichier, et après on test si on doit lvl up

		if (xp_a_ecrire <= xp_necess_pour_up) { //test si on doit level up (NOTA_BENE: **on pourrait faire une fonction pour test**)
			xp_a_ecrire = xp_a_ecrire - xp_necess_pour_up; //on retire le nombre d'xp en trop, pour avoir juste ce qui dépassait, et donc ce qu'il faut mettre au level suivant (exemple le level 1 est à 50 xp nécéssaire, si on à 75 d'xp alors ça met ce chiffre à 25 et on sera au level 2 avec 25 xp)
			xp_level_a_ecrire = xplevel_b4 - 1;
		}

		//maintenant on à le xplevel à écrire, et l'xp à écrire aussi, on peut écrire tout ça dans le fichier utilisateur :

		fs.writeFile(`json/xp/xp_${id_usr}.json`, `
				{ 
					"xp": ` + xp_a_ecrire + `,
					"xplevel": ` + xp_level_a_ecrire + `
				}`, 
		function(err) {

			if(err) {
			    return console.log(err);
			}
			console.log("The file was saved!");
		}); 
	})
}


bot.on('ready', function() {
	bot.user.setActivity("PouleRPG | p<help")
	console.log("bot 'PouleRPG' has been connected sucessfully!")
	console.log("bot lancé le: " + new Date() + " ");

	let InitializeVariable = 1;
});

//Ping

bot.on('message', async message => {

    if (message.content === prefix + "ping") { //début ping (le code n'est pas du romar, il est trouvé sur internet)
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Calcul en cours...");
        m.edit( ":ping_pong: | Pong!\nTemps de réponse : **" + `${m.createdTimestamp - message.createdTimestamp}ms` + "**");
    } //Fin ping


    

});

//Main

bot.on('message', async (message) => {

	if (message.content.startsWith(prefix)) { //Condition de développement -> permet de whitelist des utilisateurs
		if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760") {
		}
		else {
			message.channel.send("Vous n'avez pas la permission requise pour utiliser le bot.")
			return;
		}
	}


//BIG BIG PARTIE DE L'EMBED HELP


	if (message.content === prefix + "aide" ||  message.content === prefix + "help") {

		message.channel.send({embed: {
			author: {
			name: bot.on.username,
			icon_url: bot.on.avatarURL
			},
			"plainText": "**Commandes de PouleRPG**",
			"title": ":chicken: **Commandes de PouleRPG** :chicken:",
			"color": 0xc86400,
			"fields": [
			//------------------------------
			{
			"name": "BOT",
			"value": "``aide`` | ``ping``",
			"inline": false
			},
			//------------------------------
			{
			"name": "STATS PERSONNELLES",
			"value": "``or`` | ``xp``",
			"inline": false
			},
			//------------------------------
			{
			"name": "COMBAT",
			"value": "``arene``",
			"inline": false
			},
			{
			"name": "INFOS SUPPLÉMENTAIRES",
			"value": "**Faites ``p<aide [commande]`` ou ``p<help [commande]`` pour plus de détails sur une certaine commande.**",
			"inline": false
			},
			{
			"name": "EXEMPLES",
			"value": "``p<aide or\np<help arene``",
			"inline": false
			},
					] 
		}});
	}

	if (message.content === prefix + "aide aide" || message.content === prefix + "help aide" || message.content === prefix + "aide help" || message.content === prefix + "help help") {
		let embed_aide_aide = new Discord.RichEmbed()
							.setColor("#C86400")
							.setTitle(":grey_question: Aide - aide/help :grey_question:")
							.setDescription("La commande ``aide`` ou ``help`` affiche la page d'aide ou permet d'avoir plus de précisions sur une commande, voici comment l'utiliser :\n``p<aide`` | ``p<aide [commande]``\n``p<help`` | ``p<help [commande]``")

							message.channel.send(embed_aide_aide);
    }

    if (message.content === prefix + "aide ping" || message.content === prefix + "help ping") {
		let embed_aide_ping = new Discord.RichEmbed()
							.setColor("#C86400")
							.setTitle(":grey_question: Aide - ping :ping_pong:")
							.setDescription("La commande ``ping`` calcule le temps de réponse du bot et l'affiche, voici comment l'utiliser :\n``p<ping``")

							message.channel.send(embed_aide_ping);
    }

    if (message.content === prefix + "aide arene" || message.content === prefix + "help arene") {
		let embed_aide_arene = new Discord.RichEmbed()
							.setColor("#C86400")
							.setTitle(":grey_question: Aide -  :crossed_swords:")
							.setDescription("La commande ``arene`` permet de faire un combat dans l'arène contre le bot pour gagner de l'expérience, vous pouvez choisir entre 3 armes, la **masse** avec ``p<arene masse`` ou ``p<arene m``, le **tomahawk** avec ``p<arene tomahawk`` ou ``p<arene t``, ou la **lance** avec ``p<arene lance`` ou ``p<arene l``, voici qui l'emporte sur qui :\nLa masse -> le tomahawk\nLe tomahawk -> la lance\nLa lance -> la masse\nLe combat se fait comme un chifoumi. Voici comment l'utiliser :\n``p<arene [arme]``")

							message.channel.send(embed_aide_arene);
	}

    /*if (message.content === prefix + "aide X" || message.content === prefix + "help X") {
		let embed_aide_X = new Discord.RichEmbed()
							.setColor("#C86400")
							.setTitle(":grey_question: Aide - X :X:")
							.setDescription("La commande ``X`` ou ``p<X`` XXX, voici comment l'utiliser :\n``p<X\np<X``")

							message.channel.send(embed_aide_X);
    } Sert de modèle!*/


	//FIN DU BIG BIG EMBED HELP


	if (message.content === prefix + "botinfos") {
		message.channel.send("Version : " + bot_version + "\nLignes : " + bot_lignes + "\nDevs : Programmation : Romar1 ; Design Graphique : DraxyDow\n");
	}

	


	//Heu qu'est-ce que j'ai chier ici ? C'est quoi ce bordel xD Je le laisse si c'est là c'est que ça doit être utile mais je vois pas pourquoi xD -r
    const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();



    if (message.content.startsWith(prefix + 'arene ')) { //DEBUT ARENE ///FAIT LE COULDOWN de 1 minute, et le fait qu'on gagne de l'xp (aléatoire entre 1 et 3 un truc commas), DE PLUS fait le système qui calcul l'xp de la pleb dans la commande p<xp (en gros, au lieu de verifier le level dxp des cons à chaques fois, là ça permet de verifier le level uniquement quand on fait la commande "xp", ça allègera le bot, et c'est pas très handicappant que le con ne soit pas avertit qu'il level up, ça osef !!)
    	let id_usr = message.author.id;
    	if (talkedRecently_arene.has(message.author.id)) {
	            message.channel.send("Il faut attendre 1 minute, avant de pouvoir re rentrer dans l'arène. - " + message.author);
	    } else {

	          
	    	let win_arene = 0; // 0 loose ; 1 : Win : 2 : match nul




	    	let arene_choixEnemy = entierAleatoire(1,3);
	    	console.log("arene_choixEnemy: " + arene_choixEnemy); //TEMP

	    	let arene_choixUser = args[0].toLowerCase();

	    	console.log("arene_choixUser: " + arene_choixUser); //TEMP


				 if (arene_choixUser == "masse" || arene_choixUser == "m") { arene_choixUser = 1; }
			else if (arene_choixUser == "tomahawk" || arene_choixUser == "t") { arene_choixUser = 2; }
			else if (arene_choixUser == "lance" || arene_choixUser == "l") { arene_choixUser = 3; }
			else {
				message.channel.send("Mauvaise synthaxe. Vous devez choisir entre \"masse\", \"tomahawk\", \"lance\" ('p<help arene' pour plus de précisions)");
			}

			if (arene_choixUser == 1 || arene_choixUser == 2 || arene_choixUser == 3){

				if (arene_choixUser == 1 && arene_choixEnemy == 1) { //Masse VS Masse
				    message.channel.send("Vous utilisez la **masse**.\n**L'ennemi aussi !**\n*Match nul...*");
				    win_arene = 2;
				}
	    		if (arene_choixUser == 1 && arene_choixEnemy == 2) { //Masse VS Tomahawk
	    			message.channel.send("Vous utilisez la **masse**.\n**L'ennemi utilise le tomahawk !**\n*Vous gagnez !*");
	    			//Faire que le mec gagne de l'xp
	    			win_arene = 1;
	    		}
	    		if (arene_choixUser == 1 && arene_choixEnemy == 3) { //Masse VS Lance
	    			message.channel.send("Vous utilisez la **masse**.\n**L'ennemi utilise la lance !**\n*Vous perdez...*");
	    			//Faire que le mec perd de l'xp
	    			win_arene = 0;
	    		}


	    		if (arene_choixUser == 2 && arene_choixEnemy == 1) { //Tomahawk VS Masse
	    			message.channel.send("Vous utilisez le **tomahawk**.\n**L'ennemi utilise la masse !**\n*Vous perdez...*");
	    			//Faire que le mec perd de l'xp
	    			win_arene = 0;
	    		}
	    		if (arene_choixUser == 2 && arene_choixEnemy == 2) { //Tomahawk VS Tomahawk
	    			message.channel.send("Vous utilisez le **tomahawk**.\n**L'ennemi aussi !**\n*Match nul...*");
	    			win_arene = 2;
	    		}
	    		if (arene_choixUser == 2 && arene_choixEnemy == 3) { //Tomahawk VS Lance
	    			message.channel.send("Vous utilisez le **tomahawk**.\n**L'ennemi utilise la lance !**\n*Vous gagnez !*");
	    			//Faire que le mec gagne de l'xp
	    			win_arene = 1;
	    		}


	    		if (arene_choixUser == 3 && arene_choixEnemy == 1) { //Lance VS Masse
	    			message.channel.send("Vous utilisez la **lance**.\n**L'ennemi utilise la masse !**\n*Vous gagnez !*");
	    			//Faire que le mec gagne de l'xp
	    			win_arene = 1;
	    		}
	    		if (arene_choixUser == 3 && arene_choixEnemy == 2) { //Lance VS Tomahawk
	    			message.channel.send("Vous utilisez la **lance**.\n**L'ennemi utilise le tomahawk !**\n*Vous perdez...*");
	    			//Faire que le mec perd de l'xp
	    			win_arene = 0;
	    		}
	    		if (arene_choixUser == 3 && arene_choixEnemy == 3) { //Lance VS Lance
	    			message.channel.send("Vous utilisez la **lance**.\n**L'ennemi aussi !**\n*Match nul...*");
	    			win_arene = 2;
	    		}

	    		if (win_arene == 0) { // Si on a perdu
	    			message.channel.send("-1 xp");
					addXp(id_usr, -1);
	    		} else if (win_arene == 1) { // Si on a win
	    			message.channel.send("+2 xp");
					addXp(id_usr, 2);
	    		} else if (win_arene == 2) {
	    			message.channel.send("+0 xp");
					addXp(id_usr, 0);
	    		}
			}

			// Adds the user to the set so that they can't talk for a minute
	        talkedRecently_arene.add(message.author.id);
	        setTimeout(() => {
	          // Removes the user from the set after a minute
	          talkedRecently_arene.delete(message.author.id);
	        }, 60000);
	    }
	} ///FIN ARENE
    	

  


    if (message.content === prefix + 'or') // permet de regarder ses comptes
	{
		let id_user_or = message.author.id;
		let or_usr = 0;


		fs.readFile('json/or/or_' + id_user_or +'.json', 'utf8', function (erreur, donnees)
		{
		 if (erreur) {
		 	message.channel.send("Vous n'avez pas encore de banque perso, pour la créer faite \"p<revenue\" ");
		 /*fs.writeFile("json/or/or_" + id_user_or + ".json", `
			{ 
				"or": 0,
				"date": ""
			}`, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    	console.log("The file was saved!");
			}); */

		 	return; // and continue
		 } 
		 let or_usr = JSON.parse(donnees);
		 console.log(or_usr.or);
		 or_usr = or_usr.or;


		


		let embed_or = new Discord.RichEmbed()
							.setColor("#FFD400")
							.setTitle(":bank: **Banque** :bank:")
							.setDescription("**" + or_usr + " or**")

							message.channel.send(embed_or);
		});


	} //FIN or

	if (message.content === prefix + 'revenue')
	{
		//message.channel.send(Unix_timestamp(1412743274));
		//message.channel.send(new Date().getTime());

		let id_usr = message.author.id;
		let or_usr = 0;
		let unix_time_now = new Date().getTime();

		let or_a_add_first = 0;
		let or_a_add = 0;
		let max_banque_perso = 0;
		
		


		fs.readFile('json/or/or_' + id_usr +'.json', 'utf8', function (erreur, donnees)
		{

			let Maitre_Epsilon = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id);
			let Maitre_Gamma = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id);
			let Maitre_Zeta = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);
			let Maitre_Omega = message.guild.roles.get('665340068046831646').members.map(m=>m.user.id);

			

		if (message.author.id == Maitre_Epsilon || message.author.id == Maitre_Gamma || message.author.id == Maitre_Zeta || message.author.id == MaitreFac_Omega) { //si l'author est maitre
		 		//donner plus de thunas
		 	if (message.guild.members.get(message.author.id).roles.exists('id','445253268176633891')) {
		 		or_a_add = 1;
		 		max_banque_perso = 5;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253591465328660')) {
		 		or_a_add = 3;
		 		max_banque_perso = 15;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253561648021514')) {
		 		or_a_add = 4;
		 		max_banque_perso = 40;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253809640308746')) {
		 		or_a_add = 7;
		 		max_banque_perso = 150;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257669918588948')) {
		 		or_a_add = 15;
		 		max_banque_perso = 300;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650832087993024522')) {
		 		or_a_add = 22;
		 		max_banque_perso = 500;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257144011587594')) {
		 		or_a_add = 35;
		 		max_banque_perso = 750;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','612469098466639893')) {
		 		or_a_add = 70;
		 		max_banque_perso = 1500;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650828967716192269')) {
		 		or_a_add = 100;
		 		max_banque_perso = 3000;
		 	}

		 } else { //si AUHTOR n'est pas maitre
		 		//donner la thunas normale
		 	if (message.guild.members.get(message.author.id).roles.exists('id','445253268176633891')) {
		 		or_a_add = 1;
		 		max_banque_perso = 5;
		 	
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253591465328660')) {
		 		or_a_add = 2;
		 		max_banque_perso = 15;
		 	}
		 	
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253561648021514')) {
		 		or_a_add = 3;
		 		max_banque_perso = 40;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253809640308746')) {
		 
		 		or_a_add = 5;
		 		max_banque_perso = 150;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257669918588948')) {
		 		or_a_add = 10;
		 		max_banque_perso = 300;
		 	
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650832087993024522')) {
		 		or_a_add = 15;
		 		max_banque_perso = 500;
		 	}
		 	
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257144011587594')) {
		 		or_a_add = 25;
		 		max_banque_perso = 750;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','612469098466639893')) {
		 
		 		or_a_add = 50;
		 		max_banque_perso = 1500;

		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650828967716192269')) {
		 		or_a_add = 85;
		 		max_banque_perso = 3000;
		 	
		 	}
		 }




		if (erreur) { // ca veut dire que l'utilisateur n'a pas de banque encore

		 	message.channel.send("Banque perso crée. (ce message apparait quand vous n'avez pas de banque perso)");
		 	
		 	message.channel.send("+" + or_a_add + "/" + max_banque_perso + " or sur votre banque perso.");

			 	fs.writeFile("json/or/or_" + id_usr + ".json", `
				{ 
					"or": ` + or_a_add + `,
					"date": ` + unix_time_now + `,
					"maxbanque": ` + max_banque_perso + `
				}`, function(err) {

				    if(err) {
				        return console.log(err);
				    }

			    	console.log("The file was saved!");
				}); 

		 	return; // and continue
		}


		Maitre_Epsilon = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id);
		Maitre_Gamma = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id);
		Maitre_Zeta = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);
		Maitre_Omega = message.guild.roles.get('665340068046831646').members.map(m=>m.user.id);




		 //DAILY ICI:

		 let or_usr_json = JSON.parse(donnees);
		 console.log(or_usr_json.or);
		 or_usr = or_usr_json.or;
		 unix_time_in_file = or_usr_json.date;
		 //let unix_time_now = new Date().getTime();

		// let or_a_add = 0; //thunas à ajouter
		 //or_add // thunas total après le daily

		 	/*
				ESCLAVE
				PAYSAN
				BOURGEOIS
				COURTISANS
				BARON
				COMPTE
				MARQUIS
				DUC
				VASSAL
		 	*/



		 //or_add : C'est l'or total à ajouter
		 //or_usr : C'est l'or se trouvant déjà sur le compte de l'utilisateur
		 //or_a_add : C'est l'or du daily à ajouter
		 // le calcul étant: or déjà aquis + or gagné par ce daily = or total donc or_add
		 let or_add = or_usr + or_a_add;
		 let msToWaitToDaily = 86400000; //24 Heures:: 86400000
		 let diffUnixInMS = unix_time_now - unix_time_in_file;
		 
		 
		 
		// message.channel.send("unix_time_file: " + unix_time_in_file + "\n unix_time_now: " + unix_time_now + "\n unix_time_difference" + diffUnixInMS);
		
		let secondSinceLastDaily = Math.floor(diffUnixInMS / 1000);
		let msSinceLastDaily = Math.floor(diffUnixInMS);
		let timeLastB4Daily = (msToWaitToDaily / 1000) - secondSinceLastDaily; // ce qui fait donc 30 000 / 1000 fait donc 30 (secondes) donc 30 / par le nombre
		let timeLastInMS = msToWaitToDaily - msSinceLastDaily;
		let hourToWait = (timeLastB4Daily / 60) / 24;
		
			if (timeLastB4Daily >= 0) { // ca veut dire qu'il reste encore du temps avant de daily) 
			message.channel.send("\n Il faut attendre encore: " + msToTime(timeLastInMS) + " avant d'avoir votre revenue."); /*Math.round((((timeLastB4Daily) / 60) / 24))*/
			}
			
			if(diffUnixInMS >= msToWaitToDaily) {
					//console.log(or_add);
					buffer_thunas = 0;
				if (or_add > max_banque_perso) {
					
					buffer_thunas = or_add - max_banque_perso; //contient le surplus d'or
					or_add = or_add - buffer_thunas; //enlève le surplus à l'or final

					if(message.member.roles.find(r => r.name === "Epsilon")) { factionDe_Request = "Epsilon"; }
					else if(message.member.roles.find(r => r.name === "Gamma")) { factionDe_Request = "Gamma"; 	 }
					else if(message.member.roles.find(r => r.name === "Zeta")) { factionDe_Request = "Zeta";   }
					else if(message.member.roles.find(r => r.name === "Omega")) { factionDe_Request = "Omega";   }
					else { }

					if (factionDe_Request == "Epsilon") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Epsilon." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					
					} else if (factionDe_Request == "Gamma") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Gamma." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					
					} else if (factionDe_Request == "Zeta") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Zeta." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					
					} else if (factionDe_Request == "Omega") {

						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Omega." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					} else {
					message.channel.send("Le surplus d'argent à été rendu à PouleRPG : -" + buffer_thunas + " or." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					}
				}

			fs.writeFile("json/or/or_" + id_usr + ".json", `
			{ 
				"or": ` + or_add + `,
				"date": ` + unix_time_now + `,
				"maxbanque": ` + max_banque_perso + `
			}`, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    	console.log("The file was saved!");
				}); 
				



			 message.channel.send("+" + (or_a_add - buffer_thunas) + " or. Vous avez maintenant: " + or_add + "/" + max_banque_perso + " or dans votre banque perso.");

			} else {
				
				//message.channel.send("ERROR"); //Message d'erreur
			}
		});
	} // FIN DAILY



	//listage des membres des factions

	if (message.content === prefix + "list epsilon") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Epsilon')
            .setDescription(message.guild.roles.get('415947454626660366').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed); 
	} 

	if (message.content === prefix + "list gamma") {
			const ListEmbed = new Discord.RichEmbed()
	            .setTitle('Membres de la faction Gamma')
	            .setDescription(message.guild.roles.get('415947456342130699').members.map(m=>m.user.tag).join('\n'));
	        message.channel.send(ListEmbed); 
	} 

	if (message.content === prefix + "list zeta" || message.content === prefix + "list zêta") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Zêta')
            .setDescription(message.guild.roles.get('415947455582961686').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed); 
	} 

	if (message.content === prefix + "list omega" || message.content === prefix + "list oméga") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Oméga')
            .setDescription(message.guild.roles.get('665340021640921099').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);

	}

	if (message.content === prefix + "list factions") {
		
		let idE = 0;
		let idZ = 0; 
		let idG = 0;
		let idO = 0;

		let list_epsilon = message.guild.roles.get('415947454626660366').members.map(m=>m.user.tag).join('\n')
		let list_zeta = message.guild.roles.get('415947455582961686').members.map(m=>m.user.tag).join('\n')
		let list_Gamma = message.guild.roles.get('415947456342130699').members.map(m=>m.user.tag).join('\n')
		let list_Omega = message.guild.roles.get('665340021640921099').members.map(m=>m.user.tag).join('\n')
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres des factions')
            .setDescription("**Epsilon**\n\n" + list_epsilon + "\n\n**Zêta**\n\n" + list_zeta + "\n\n**Gamma**\n\n" + list_Gamma + "\n\n**Oméga**\n\n" + list_Omega + "\n");
        message.channel.send(ListEmbed);
	}



//SERT D'EXEMPLE
    /*if(message.content === prefix + "list") {
        const ListEmbed = new Discord.RichEmbed()
            .setTitle('Users with the go4 role:')
            .setDescription(message.guild.roles.get('659904895809224725').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);                    
    }*/
    		

	if (message.content === prefix + "xp") { //permet de voir son xp
		let id_usr = message.author.id;

		if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà
	    	fs.readFile('json/xp/xp_' + id_usr + '.json', function(erreur, fichier) {
			   	let json_xp = JSON.parse(fichier)
			   	let xp_level_up_required = xp_level_up_required_BASE * json_xp.xplevel;
				message.channel.send(`XP de <@${id_usr}> : ${json_xp.xp}/${xp_level_up_required} | Level : ${json_xp.xplevel}`);
			})
		} else { //si le fichier xp de l'utilisateur n'existe pas
				//let contenu_json = '{' + '\n' + ' \"xp\" : 0, ' + '\n' + ' \"xplevel\" : 1' + '\n' + '}';
				

				//let data_write = JSON.stringify(contenu_json)
				
				fs.writeFile('json/xp/xp_' + id_usr + '.json', `
					{
						"xp" : 0,
						"xplevel" : 1
					}

					`, function(erreur) {
				    if (erreur) {
				        console.log(erreur)
				    }

				    fs.readFile('json/xp/xp_' + id_usr + '.json', function(erreur, fichier) {
			   	let json_xp = JSON.parse(fichier)
			   	let xp_level_up_required = xp_level_up_required_BASE * json_xp.xplevel;
				message.channel.send(`XP de <@${id_usr}> : ${json_xp.xp}/${xp_level_up_required} | Level : ${json_xp.xplevel}`);
			})
				})

			

	/*
	{
	"xp" : 0,
	"xplevel" : 1
	}
	*/
		}
	}

		if (message.content.startsWith(prefix + "xp ")) { //permet de voir l'xp de quelqu'un
		let id_usr = message.mentions.users.first().id;


		if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà
	    	fs.readFile('json/xp/xp_' + id_usr + '.json', function(erreur, fichier) {
			   	let json_xp = JSON.parse(fichier)
			   	let xp_level_up_required = xp_level_up_required_BASE * json_xp.xplevel;
				message.channel.send(`XP de <@${id_usr}> : ${json_xp.xp}/${xp_level_up_required} | Level : ${json_xp.xplevel}`);
			})
		} else { //si le fichier xp de l'utilisateur n'existe pas
				message.channel.send("Cet utilisateur n'a aucune xp");
				//message.channel.send(`XP de <@${id_usr}> : 0/${xp_level_up_required_BASE} | Level : 1`);
		}
	}

	

	if (message.content === "J'adore le poulet") { //Une commande useless
		let poulet_ran = entierAleatoire(1, 5);

		switch (poulet_ran) {
			case 1: 
			message.channel.send("MOI AUZZIIII J'ADORE LE POUUULLEEET <:OMEGA_GRAS:655795195417460756> ")
			break;
			case 2:
			message.channel.send("AH NAN MAIS OUÉÉÉÉ, NAN MAIS LE **POULET** QUOIIII !!!")
			case 3:
			message.channel.send("SERIEUX ? TOI AUSSI <:OMEGA_GRAS:655795195417460756>")
			break;
			case 4:
			message.channel.send("OUI ! ET HEUREUSEMENT !! <:BORDEL:597940572556099604> ")
			break;
			case 5:
			message.channel.send("Moi je vie poulet.")
			break;

		}	
	}





	//CE CODE CI-DESSOUS EST DEGEULASSE OUI MAIS OSEF. :)
	if (message.content.startsWith(prefix + "point venitienne ")) { //Seul le romar peut exécuter cette commande, c'est un privilège que de recevoir un point vénitienne, elle permet simplement de donner un point venitienne lorsque le romar approuve quelque chose, nottament une blague. 
			let contenu_json;
		if (message.mentions.users.first().id) {
			if (message.author.id == "421400262423347211") {
				message.channel.send("Point venitienne accordé !");
				let id_selection = message.mentions.users.first().id;

				

					let id_usr = message.author.id;

					if (fs.existsSync('json/ven/ven_' + id_selection + '.json')) { //si le fichier de l'utilisateur existe déjà
				    		fs.readFile('json/ven/ven_' + id_selection + '.json', function(erreur, file) {
			   				
			   				let veni_json = JSON.parse(file)
			   				let pts_veni_total = veni_json.ptsveni + 1;
			   				contenu_json = '{' + '\n' + ' \"ptsveni\" : ' + pts_veni_total + '\n' + '}';

			   				fs.writeFile('json/ven/ven_' + id_selection + '.json', contenu_json, function(erreur) { 
					    		if (erreur) {
								        console.log(erreur)
								    }
					    		})
			   				})


				    	
				    	
					} else { //si le fichier de l'utilisateur n'existe pas
						 contenu_json = '{' + '\n' + ' \"ptsveni\" : 1 ' + '\n' + '}';							

							//let data_write = JSON.stringify(contenu_json)
							
							fs.writeFile('json/ven/ven_' + id_selection + '.json', contenu_json, function(erreur) {
							    if (erreur) {
							        console.log(erreur)
							    }
							})
					}



			} else {
				message.channel.send("Vous n'êtes pas la venitienne, vous ne pouvez donc pas accorder de \"points venitienne\"");
			}
		} else {
			message.channel.send("Invalid User");
		}
		
	} //Fin retrait point venitienne

		if (message.content.startsWith(prefix + "retrait point venitienne ")) { //Seul le romar peut exécuter cette commande, c'est un privilège que de recevoir un point vénitienne, elle permet simplement de donner un point venitienne lorsque le romar approuve quelque chose, nottament une blague. 
			let contenu_json;
		if (message.mentions.users.first().id) {
			if (message.author.id == "421400262423347211") {
				message.channel.send("Point venitienne retiré !");
				let id_selection = message.mentions.users.first().id;

				

					let id_usr = message.author.id;

					if (fs.existsSync('json/ven/ven_' + id_selection + '.json')) { //si le fichier de l'utilisateur existe déjà
				    		fs.readFile('json/ven/ven_' + id_selection + '.json', function(erreur, file) {
			   				
			   				let veni_json = JSON.parse(file)
			   				let pts_veni_total = veni_json.ptsveni - 1;
			   				contenu_json = '{' + '\n' + ' \"ptsveni\" : ' + pts_veni_total + '\n' + '}';

			   				fs.writeFile('json/ven/ven_' + id_selection + '.json', contenu_json, function(erreur) { 
					    		if (erreur) {
								        console.log(erreur)
								    }
					    		})
			   				})


				    	
				    	
					} else { //si le fichier de l'utilisateur n'existe pas
						 contenu_json = '{' + '\n' + ' \"ptsveni\" : -1 ' + '\n' + '}';							

							//let data_write = JSON.stringify(contenu_json)
							
							fs.writeFile('json/ven/ven_' + id_selection + '.json', contenu_json, function(erreur) {
							    if (erreur) {
							        console.log(erreur)
							    }
							})
					}



			} else {
				message.channel.send("Vous n'êtes pas la venitienne, vous ne pouvez donc pas accorder de \"points venitienne\"");
			}
		} else {
			message.channel.send("Invalid User");
		}
		
	} //Fin retrait point venitienne

	if (message.content === prefix + "mes beaux points venitienne") { //voir ses points venitienne

		let id_usr = message.author.id;

		if (fs.existsSync('json/ven/ven_' + id_usr + '.json')) { //si le fichier de l'utilisateur existe déjà
	    		fs.readFile('json/ven/ven_' + id_usr + '.json', function(erreur, file) {
   				
   				let veni_json = JSON.parse(file)
   				let pts_veni_total = veni_json.ptsveni;
   				
   				message.channel.send("Vous avez : " + pts_veni_total + " points venitienne.");
   				
   				})
	    	
		} else { //si le fichier de l'utilisateur n'existe pas
				message.channel.send("Vous avez : 0 points venitienne.");
		}
	} //Fin de la commande pour voir points venitienne

	


	

	if (message.content.startsWith("Bonne nuit")) {
		
		message.channel.send("BONNE NUUIIIT :))")
	}


	


	





	//Connerie : mini jeu phrases :

	if (message.content === prefix + "phrase") {

		let loopCasio = true;
		//Personne, action, objet, lieu, temps
		let personne = [`Barack Obama`, `Donald Trump`, `Une tortue de mer`, `Un poulet`, `Romar1`, `Noxali`, `Zheo`, `DraxyCUL`, `La Vénitienne`, `PouleRPG`, `Dieu Poulet`, `Jérémy`, `Les Zêtas`, `Le Maître Gamma`, `Le frère con`, `Hitler`, `Une enfant`, `Un psychopathe`, `Un entraineur`, `Un juge`, `Le procureur`, `Donald`, `Picsou`, `Romar1`, `Chveux Vert`, `PD3`, `Bordel`, `Princesseuh`, `DarkDavy`, `Damben`, `Dark`, `Darky`, `BanjoBoi`, `KriixMerde`, `TetreMerde`, `Tatsumakmerde`, `Romar la pute de luxe`, `Les Epsilon`, `Un pokémon`, `Des animaux de la ferme`, `Un chat`, `Un chien`, `Une souris`, `Un animal`, `Emmanuel Macron`, `Kim Jong-Un`, `Un dictateur`, `Gigi`]; //personnage
		let action   = [`mange`, `vend`, `détruit`, `fait disparaître`, `lance`, `consomme`, `découpe lentement`, `donne`, `rage à cause (d')`, `pénètre`, `regarde`, `écoute`, `à une relation incestueuse avec`, `juge`, `se procure`, `fait un rite satanique avec`, `s'entraine avec`, `poste`, `chante avec`, `théorise`, `réfléchit à ne pas cheat avec`, `envoie un cookie à`, `prie`, `meurt à cause (d')`, `fait chier`, `hack les logs (d')`, `a claqué`, `rit de`, `fait apparaître`, `dors grâce à`, `bois`, `fait la lessive pour`, `fait à manger à`, `fait le ménage pour`, `insulte`, `crie`]; //action
		let objet    = [`une pomme`, `un radiateur`, `une ampoule`, `une vitre`, `du poulet`, `des grilles pain`, `un nouveau née`, `des points venitienne`, `la loi paragraphe 4, sous-tiret 2, alinéa 1`, `une arme de destruction massive`, `la boite de jeu de "Link faces to evil"`, `les recettes de cuisine de Noxali`, `des funérailles`, `un banc de messe`, `une porte d'église`, `un bénitier`, `des produits illicites`, `un cercueil`, `un film`, `une série`, `un enfant`, `de la musique`, `un hentai`, `un mouton`, `un boeuf`, `un mandat`, `une vidéo virale`, `un ralentisseur de type "dos d'âne"`, `la loi paragraphe 4, sous-tiret 3, alinéa 1`, `une porte`, `un fruit`, `une armes blanches`, `un jeu Nintendo`, `une boîte en carton`, `une voiture`, `un panneau`, `un tableau`, `une craie`, `un feutre`, `un crayon de papier`, `un crayon de couleur`, `une contravention`, `un film`, `un film pegi 18`, `un ordinateur`, `un téléphone`, `un crayon de bois`, `un critérium`]; //objet1
		let objet2   = [`une aiguille`, `un couteau`, `du taboulé`, `du chocolat`, `de la confiture`, `une anguille`, `un frigo`, `du rhum`, `de l'alcool`, `la daronne de Draxy`, `un verre`, `Zheo`, `le curé`, `des enfants`, `un cheval`, `un veau`]; //objet2
		let conjCoord= [`avec`]; //conjonction
		let lieu     = [`à Londres`, `à Stockholm`, `en nouvelle Zélande`, `dans son salon`, `dans la cuisine du voisin`, `sur l'Empire Du Poulet`, `dehors`, `au ministère de la justice`, `dans une église`, `dans la cave`, `dans un laboratoire`, `dans une maison close`, `dans l'espace`, `dans la chambre de Zheo`, `dans un cimetière`, `à un mariage`, `dans la cathédrale Dieu Poulet`, `dans un karaoké`, `dans un centre commercial`, `dans les toilettes`, `dans un cinéma`, `au Super U du coin`, `au journal`, `au japon`, `sur Snapchat`, `sur Twitter`, `sur un mur`, `sur Pinterest`]; //lieu
		let temps    = [`à 23h30`, `le lundi matin`, `avant son travail`, `après le déjeuner`, `à minuit`, `à l'heure de la sieste`, `au goûter`, `pendant sa douche`, `à l'heure de manger`, `pendant le repas`, `à la Repä`, `pendant le Goc International`, `à l'ouverture des jeux olympiques`, `pendant la 3ème guerre mondiale`, `au claire de lune`, `au moment où l'astre stellaire n'est plus visible que de moitié`]; //temps

		let minCasionostPhrase = 0;

		while(loopCasio)
		{
			let MAXCasionostPhrase = personne.length - 1;
			console.log(MAXCasionostPhrase);
			let choix_personne = entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix Personne: " + choix_personne);

			MAXCasionostPhrase = action.length - 1;
			console.log(MAXCasionostPhrase);
			let choix_action   = entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix Action: " + choix_action);

			MAXCasionostPhrase = objet.length  - 1;
			console.log(MAXCasionostPhrase);
			let choix_objet    = entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix objet: " + choix_objet);
			
			MAXCasionostPhrase = conjCoord.length  - 1;
			console.log(MAXCasionostPhrase);
			let choix_conjCoord= entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix objet: " + choix_objet);
			
			MAXCasionostPhrase = objet2.length  - 1;
			console.log(MAXCasionostPhrase);
			let choix_objet2   = entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix objet: " + choix_objet);

			MAXCasionostPhrase = lieu.length  - 1;
			console.log(MAXCasionostPhrase);
			let choix_lieu     = entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix lieu: " + choix_lieu);

			MAXCasionostPhrase = temps.length  - 1;
			console.log(MAXCasionostPhrase);
			let choix_temps    = entierAleatoire(minCasionostPhrase, MAXCasionostPhrase);
			//message.channel.send("Choix temps: " + choix_temps);

			if (personne[choix_personne] != undefined || action[choix_action] != undefined || objet[choix_objet] != undefined || conjCoord[choix_conjCoord] != undefined || objet2[choix_objet2] != undefined || lieu[choix_lieu] != undefined || temps[choix_temps] != undefined)
			{
				message.channel.send(`${personne[choix_personne]} ${action[choix_action]} ${objet[choix_objet]} ${conjCoord[choix_conjCoord]} ${objet2[choix_objet2]} ${lieu[choix_lieu]} ${temps[choix_temps]}`);
				loopCasio = false;
			} else {
				console.log("On continue y'a un undefined dans la phrase (casionost phrase)");
			}
		}
	} //Fin du p<phrase






	

	if (message.content.startsWith(prefix + "requestWar ")) {
		if(message.guild.members.get(message.author.id).roles.exists('id','445617906072682514')
		 || message.guild.members.get(message.author.id).roles.exists('id','445617911747313665')
		  || message.guild.members.get(message.author.id).roles.exists('id','445617908903706624')
		   || message.guild.members.get(message.author.id).roles.exists('id','665340068046831646')) { //vérifie si l'utilisateur est maître de faction

			let argsReqWar = "";
			argsReqWar = message.content.slice(prefix.length + 11);
			let facmaitre;

			

			if (argsReqWar == "Zêta" || argsReqWar == "Epsilon" || argsReqWar == "Gamma" || argsReqWar == "Oméga" || argsReqWar == "zêta" || argsReqWar == "zeta" || argsReqWar == "zêta" || argsReqWar == "oméga" || argsReqWar == "omega" || argsReqWar == "Omega") {
			
				if(message.guild.members.get(message.author.id).roles.exists('id','445617906072682514')) {
					facmaitre = "Epsilon";
				} else if (message.guild.members.get(message.author.id).roles.exists('id','445617911747313665')) {
					facmaitre = "Zêta";
				} else if (message.guild.members.get(message.author.id).roles.exists('id','445617908903706624')) {
					facmaitre = "Gamma";
				} else if (message.guild.members.get(message.author.id).roles.exists('id','665340068046831646')) {
					facmaitre = "Oméga";
				}

				//message.channel.send(`Faction à attaquer : ${argsReqWar} ; Maître ${facmaitre}`);

				//Ici envoyer un DM au romar et au Draxy.

				message.guild.members.get("421400262423347211").send(`Le maître ${facmaitre} ainsi que sa faction, souhaite attaquer la faction ${argsReqWar}\nEn vu de votre position d'Empereur vous vous devez de vérifier le casus beli de la faction, et si cela est positif vous pourrez accepter et activer la guerre !`); //romar
				message.guild.members.get("211911771433205760").send(`Faction à attaquer : ${argsReqWar} ; Maître ${facmaitre}`); //draxy
				
				//Plus un message expliquant que la décision se fera dans #conference de maître,
				//et que le maître devra prouver son casus beli (au maître en question (avec un message.channel.send !))

				let chanId = "616652710942343222";

				message.channel.send(`Vous avez décidé d'attaquer la faction ${argsReqWar} ! \nPour éviter tout abus, les Empereurs doivent vérifier votre casus beli, la décision se fera dans <#` + chanId + `> ! \nveuillez patienter jusqu'à la réponse des Empereurs.`)

			} else {
				message.channel.send("Mauvaise Synthaxe -> La faction que vous souhaitez attaquer n'existe pas");
				return;
			}




			
		} else {
			message.channel.send("Vous n'êtes pas maître de faction vous ne pouvez donc pas executer cette commande.");
		}
	}



	//Guerres :

	if (message.content === prefix + "startWar ") {
		if (message.author.id == DraxyEmpereurID || message.author.id == RomarEmpereurID) {

		}
	}











































	//Commandes admin :


	if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760") {
		
		if (message.content === prefix + "add1Xp --me") {
			let id_usr = message.author.id; 
			addXp(id_usr, 1);
		}

		if (message.content.startsWith(prefix + "setXp ")) {
			let argsAddXp = message.content.slice(prefix.length + 6 + 23)
			message.channel.send("User: " + message.mentions.users.first() + "\nNombreXP: " + argsAddXp);

			if (message.mentions.users.first() != undefined) {				
				if (argsAddXp < 100) {				
					if (argsAddXp >=100) {
						message.channel.send("Valeur trop haute (MAX: 99)");
					} else {
						let xp = Number(argsAddXp);
						addXp(message.mentions.users.first().id, xp)
					}
				} else {
					message.channel.send("Erreur de synthaxe (p<setXp @USER XP) OU valeur trop haute (MAX: 99)");
				}
			} else {
				message.channel.send("Utilisateur non défini -> Erreur synthaxe (p<setXp @USER XP)");
			}
		}

		if (message.content.startsWith(prefix + "randomFaction ")) { 

		
			console.log("Commande exécutée.");
			if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760") {
				console.log("Commande exécutée. -> Admin Test Passé");
				let args3 = message.content.slice(prefix.length + 14); //.split(' ');
				let id_mention = message.mentions.users.first().id;
				let member = message.mentions.members.first();

				let fac = entierAleatoire(1, 4);

				switch(fac) {
					case 1:
					message.channel.send(`<@${id_mention}> va dans : Epsilon`);
					member.addRole('415947454626660366'); //ajoute Epsilon 
					break;
					case 2:
					message.channel.send(`<@${id_mention}> va dans : Zêta`);
					member.addRole('415947455582961686'); //ajoute Epsilon 
					break;
					case 3:
					message.channel.send(`<@${id_mention}> va dans : Gamma`);
					member.addRole('415947456342130699'); //ajoute Epsilon 
					break;
					case 4:
					message.channel.send(`<@${id_mention}> va dans : Oméga`);
					member.addRole('665340021640921099'); //ajoute Epsilon 
					break;
				}
				console.log("Commande exécutée. -> Admin Test Passé -> switch effectué");
			} else {
				message.channel.send("Cette commande est réservée aux Empereurs.");
				console.log("Commande exécutée. -> Admin Test Refusé");
			}
		}
	}

	//Commandes Dev :


	if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760") {

		if (message.content === prefix + "DEV ROLE") {
			//message.mentions.users.first().addRole('415947454626660366'); //ajoute Epsilon 
		}
		
		//DEV
		if (message.content.startsWith(prefix + "multipleargs ")) {
			let args5 = message.content.slice(prefix.length).trim().split(/ +/g);
			message.channel.send(args5 + `<-args5 ; \n ${args[0]}, ${args[1]}`);
		}

		if (message.content.startsWith(prefix + "crypt ")) {



			let arguments1 = message.content.slice(prefix.length).trim().split(/ +/g);
			let password = arguments1[0];
			let text = message.content.slice(prefix.length + 6 + arguments1[0].length);

			/*
			// On définit notre algorithme de cryptage
			let algorithm = 'aes256';

			// Notre clé de chiffrement, elle est souvent générée aléatoirement mais elle doit être la même pour le décryptage
			//password = 'l5JmP+G0/1zB%;r8B8?2?2pcqGcL^3';

			// On crypte notre texte
			let cipher = crypto.createCipher(algorithm,password);
			let crypted = cipher.update(text,'utf8','hex');
			crypted += cipher.final('hex');
			*/

			const cipher = crypto.createCipher('aes192', password);  
			let encrypted = cipher.update(text, 'utf8', 'hex');  
			encrypted += cipher.final('hex');  


			message.channel.send(" message crypté est : " + encrypted);

			message.delete();
			
		}

		if (message.content.startsWith(prefix + "decrypt ")) {

			let arguments1 = message.content.slice(prefix.length).trim().split(/ +/g);
			let password = arguments1[0];
			let text = message.content.slice(prefix.length + 8 + arguments1[0].length);

			text = "2fb688d5c7ddcdcaf23e8637187cb054";
			password = "PD";

			const decipher = crypto.createDecipher('aes192', password);  
			
			let decrypted = decipher.update(text, 'hex', 'utf8');  
			decrypted += decipher.final('utf8');  


			message.channel.send(" message crypté est : " + decrypted);

		}

		if (message.content === prefix + "DEV encrypt") {
			const algorithm = 'aes-192-cbc';
			const password = 'PASSWORD';
			const text = "DES POULETS"
			const key = crypto.scryptSync(password, text, 24);
			const cipher = crypto.createCipher(algorithm, key);

			let encrypted = '';
			let encSize = encrypted.length;
			cipher.on('readable', () => {
				let chunk;
				while (null !== (chunk = cipher.read())) {
					encrypted += chunk.toString('hex');
				}
				message.channel.send("ENCRYPTED: " + encrypted);

			});
			cipher.on('end', () => console.log(encrypted));

			cipher.write('some clear text data');
			cipher.end;
		}

		if (message.content === prefix + "DEV decrypt") {
			const algorithm = 'aes-192-cbc';
			const password = 'PASSWORD';
			const text = "DES POULETS";
			const key = crypto.scryptSync(password, text, 24);
			const decipher = crypto.createDecipher(algorithm, key);

			let decrypted = '';

			decipher.on('readable', () => {
				let chunk2;
				while (null !== (chunk2 = decipher.read())) {
					decrypted += chunk2.toString('hex');
					message.channel.send("DECRYPTED1: " + decrypted);


				}
				message.channel.send("DECRYPTED2: " + decrypted);

			});
			decipher.on('end', () => console.log(decrypted));

				message.channel.send("DECRYPTED3: " + decrypted);

			const encrypted = '2c647413e5dd31febb3bbc141bf41c81';
			decipher.write(encrypted, 'hex');
					message.channel.send("DECRYPTED4: " + decrypted);

			decipher.end;
					message.channel.send("DECRYPTED5: " + decrypted);
		}

		if (message.content.startsWith(prefix + "retrait or ")) { //permet de retirer de la thunes à quelqu'un (nottament lors d'un enffrain aux lois)
			if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760 ") {
				let id_usr_ret_or = message.mentions.users.first().id;

			let id_user_or = message.author.id;
			let or_usr = 0;

			let mention = message.mentions.users.first();


			let args = message.content.slice(prefix.length + 16 + id_usr_ret_or.length).split(' ');


			let or_a_retirer = args;

			console.log("args : " + args);

			or_a_retirer = 0 - or_a_retirer; //exemple : or_a_retirer=22 : là ça fera -22 (0 - 22(or_a_retirer) = -22)

			console.log("or à retirer : " + or_a_retirer)


			fs.readFile('json/or/or_' + id_usr_ret_or +'.json', 'utf8', function (erreur, donnees)
			{
				if (erreur) {
				 	
				 fs.writeFile("json/or/or_" + id_usr_ret_or + ".json", `
					{ 
						"or": ${or_a_retirer},
						"date": 0
					}`, function(err) {
				    if(err) {
				        return console.log(err);
				    }

				    	console.log("The file was saved!");
					});

				 	return; // and continue
				 } 
				 let or_usr = JSON.parse(donnees);
				 console.log(or_usr.or);
				 or_usr = or_usr.or; 

				 let date_file = or_usr.date;

				 console.log("date_file : " + or_usr.date);

				 fs.writeFile("json/or/or_" + id_usr_ret_or + ".json", `
					{ 
						"or": ${or_usr - or_a_retirer},
						"date": ${date_file}
					}`, function(err) {
				    if(err) {
				        return console.log(err);
				    }

				    	console.log("The file was saved!");
					});

				});
			}
		}

		if (message.content.startsWith(prefix +"romarin ") || message.content === prefix + "romarin dra" || message.content === prefix + "romarin rom") {


			let contenu_json;		
			let id_selection;

			if (message.content === prefix + "romarin dra") {
				id_selection = '211911771433205760';

			} else if (message.content === prefix + "romarin rom") {
				id_selection = '421400262423347211';

			} else {
				id_selection = message.mentions.users.first().id;
			}

			let id_usr = message.author.id;

			if (fs.existsSync('json/romarin/romarin_' + id_selection + '.json')) { //si le fichier de l'utilisateur existe déjà
		    		fs.readFile('json/romarin/romarin_' + id_selection + '.json', function(erreur, file) {
	   				
	   				let romarin_json = JSON.parse(file)
	   				let romarin_total = romarin_json.romarin + 1;
	   				contenu_json = '{' + '\n' + ' \"romarin\" : ' + romarin_total + '\n' + '}';


	   				fs.writeFile('json/romarin/romarin_' + id_selection + '.json', contenu_json, function(erreur) { 
			    		if (erreur) {
						        console.log(erreur)
						    }
			    		})
	   				})

			} else { //si le fichier de l'utilisateur n'existe pas
				 contenu_json = '{' + '\n' + ' \"romarin\" : 1 ' + '\n' + '}';							

					fs.writeFile('json/romarin/romarin_' + id_selection + '.json', contenu_json, function(erreur) {
					    if (erreur) {
					        console.log(erreur)
					    }
					})
			}


			if (fs.existsSync('json/romarin/romarin_' + id_usr + '.json')) { //si le fichier de l'utilisateur existe déjà
    			fs.readFile('json/romarin/romarin_' + id_usr + '.json', function(erreur, file) {
				
				let romarin_json = JSON.parse(file)
				let romarin_total = romarin_json.romarin;

				message.channel.send("Romarin envoyé à ce con :) \n par contre vous, vous avez reçu : " + romarin_total + " romarin");
				
				})

		    		

			} else { //si le fichier de l'utilisateur n'existe pas
				 contenu_json = '{' + '\n' + ' \"romarin\" : 0 ' + '\n' + '}';							

					fs.writeFile('json/romarin/romarin_' + id_usr + '.json', contenu_json, function(erreur) {
					    if (erreur) {
					        console.log(erreur)
					    }
					})

					fs.readFile('json/romarin/romarin_' + id_usr + '.json', function(erreur, file) {
	   				
	   				let romarin_json = JSON.parse(file)
	   				let romarin_total = romarin_json.romarin;

	   				message.channel.send("Romarin envoyé à ce con :) \n par contre vous, vous avez reçu : " + romarin_total + " romarin");
	   				
	   				})
		   				
				}
			} //fin p<romarin


		if (message.content === prefix + "mon beau romarin") { //voir son romarin

			let id_usr = message.author.id;

			if (fs.existsSync('json/romarin/romarin_' + id_usr + '.json')) { //si le fichier de l'utilisateur existe déjà
		    		fs.readFile('json/romarin/romarin_' + id_usr + '.json', function(erreur, file) {
						
						let romarin_json = JSON.parse(file)
						let romarin_total = romarin_json.romarin;
						
						message.channel.send("Vous avez : " + romarin_total + " romarin");
						
						})
		    	
			} else { //si le fichier de l'utilisateur n'existe pas
					message.channel.send("Vous avez : 0 romarin.");
			}
		} //Fin de la commande voir romarin
	}



}); //Fin MAIN bot












//NOTES ET BOUTS DE CODE PRATIQUES : 


/* VALUE ITEMS ARENA
Masse = pierre
Tomahawk = ciseaux
Lance = feuille 
*/




/* SAVOIR LE MAITRE DE FAC ET LA FACTION DE L'UTILISATEUR


factionDe_Request = "";
			 MaitreFac = "";

			 let Maitre_Epsilon = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id);
			 let Maitre_Gamma = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id);
			 let Maitre_Zeta = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);
			 let Maitre_Omega = message.guild.roles.get('667906833255628800').members.map(m=>m.user.id);


			 if(message.member.roles.find(r => r.name === "Epsilon")) { factionDe_Request = "Epsilon"; }
			 else if(message.member.roles.find(r => r.name === "Gamma")) { factionDe_Request = "Gamma"; }	 }
			 else if(message.member.roles.find(r => r.name === "Zeta")) { factionDe_Request = "Zeta";   }
			 else if(message.member.roles.find(r => r.name === "Omega")) { factionDe_Request = "Omega"; }
			 else { message.channel.send("Vous n'avez aucune faction.") }

			 message.channel.send("DEBUG/Vous êtes dans : " + factionDe_Request);

			 if (factionDe_Request == "Epsilon") { MaitreFac = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id); }
			 if (factionDe_Request == "Gamma") 	 { MaitreFac = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id); }
			 if (factionDe_Request == "Zeta") 	 { MaitreFac = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id); }
			 if (factionDe_Request == "Omega") 	 { MaitreFac = message.guild.roles.get('667906833255628800').members.map(m=>m.user.id); }

			message.channel.send("DEBUG/Votre Maitre de Faction est : " + MaitreFac);

*/




/* ARGUMENTS DE COMMANDES:

			 let args = message.content.slice(prefix.length + 25 ).split(' ');
			 let money_demandee = args;

*/

//EMBED OR ANCIEN
//
//message.channel.send(`or de ${message.author} :`);
		//message.channel.send(or_usr);

		/*let embed_or = new Discord.RichEmbed()     //-> VRAIE TRUC OR
							.setColor('#FFD400')
							.setTitle('Or dans votre banque perso')
							.addField("``" + or_usr + "``")
							.setFooter(`____`)
							message.channel.send(embed_or);*/


/* TESTS FONCTIONS
	if (message.content === prefix + "function test") {
		message.channel.send(msToTime(56856745));
		message.channel.send(entierAleatoire(1, 10));
		message.channel.send(Unix_timestamp(56856745));
    }
*/

/* TEST MENTION
    if (message.content === prefix + 'mention') {
        let user = message.author.id;
        message.channel.send(user);
        message.channel.send("tmp");
    } */

//ICI C'EST POUR SAVOIR SI LE AUTHOR IL A LE ROLE CHOISIT ! (entre autre savoir sa faction)
	/*if (message.content === prefix + "DEV/ROLE") {
		if (message.guild.members.get(message.author.id).roles.exists('id','415947455582961686')) {
		///Code here
		message.channel.send("POULET")
		}
	}*/


/// LE COULDOWN GRAVE BIEN FAIT (il faut juste ajouter une variable genre "talkedRecently = new Set()" en gros (voir en haut du code))

/*
	if (message.content === prefix + "dev") {

		if (talkedRecently.has(message.author.id)) {
	            message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
	    } else {

	           // the user can type the command ... your command code goes here :)
	           message.channel.send("TEST")

	        // Adds the user to the set so that they can't talk for a minute
	        talkedRecently.add(message.author.id);
	        setTimeout(() => {
	          // Removes the user from the set after a minute
	          talkedRecently.delete(message.author.id);
	        }, 6000);
	    }

	} */


		/*
	if (message.content === prefix + "dev") {

		if (talkedRecently.has(message.author.id)) {
	            message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
	    } else {

	           // the user can type the command ... your command code goes here :)
	           message.channel.send("TEST")

	        // Adds the user to the set so that they can't talk for a minute
	        talkedRecently.add(message.author.id);
	        setTimeout(() => {
	          // Removes the user from the set after a minute
	          talkedRecently.delete(message.author.id);
	        }, 6000);
	    }

	} */

	/* if (message.content === prefix + "addxp1") { ///IL Y A UN BUG ICI !! Il faut refaire le addxp1 pour mettre à jour le level up, et une fois passé level 2 on peut plus augmenter d'xp !
		let id_usr = message.author.id;
		addXp(id_usr, 250);
		message.channel.send("Success")
	}

	if (message.content === prefix + "remxp1") { ///IL Y A UN BUG ICI !! Il faut refaire le addxp1 pour mettre à jour le level up, et une fois passé level 2 on peut plus augmenter d'xp !
		let id_usr = message.author.id;
		remXp(id_usr, 1);
		message.channel.send("Success")
	} */