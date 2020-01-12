const Discord = require('discord.js'), bot = new Discord.Client()
const ajax = require("ajax");
const fs = require("fs");
const mkdirp = require("mkdirp");
const snekfetch = require("snekfetch");
const http = require("http");
const https = require("https");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const config = require("./data/config.json");

bot.login(config.token);


let prefix = ("p<");

let bot_version = "0.1";


let MaitreFac_Epsilon;
let MaitreFac_Gamma;
let MaitreFac_Sigma;

let factionDe_Request = "";
let MaitreFac = "";



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


bot.on('ready', function() {
	bot.user.setActivity("PouleRPG | p<help")
	console.log("bot 'PouleRPG' are connected sucessfully!")
	console.log("bot lancé le: " + new Date() + " ");

	let InitializeVariable = 1;
});

//Ping

bot.on('message', async message => {

    if (message.content === prefix + "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Calcul en cours...");
        m.edit( ":ping_pong: | Pong!\nTemps de réponse : **" + `${m.createdTimestamp - message.createdTimestamp}ms` + "**");
    }


    

});

//Main

bot.on('message', async (message) => {



	if (message.content === prefix + "help" ||  message.content === prefix + "aide") {

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
			"name": "ROBOT",
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
					] 
		}});
	}

	if (message.content === prefix + "function test") {
		message.channel.send(msToTime(56856745));
		message.channel.send(entierAleatoire(1, 10));
		message.channel.send(Unix_timestamp(56856745));
    }


    if (message.content === prefix + 'mention') {
        let user = message.author.id;
        message.channel.send(user);
        message.channel.send("tmp");
    }

    const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();


    /// Arène (genre pierre feuille ciseaux)

    if (message.content.startsWith(prefix + 'arene ')) {
    	// 1: Pierre ; 2: Feuille; 3: ciseaux
    	let arene_choixEnemy = entierAleatoire(1,3);
    	console.log(arene_choixEnemy);

    	let arene_choixUser = args[0].toLowerCase();

    	console.log(arene_choixUser);



    		

		if (arene_choixUser == "masse" || arene_choixUser == "1" || arene_choixUser == "m") { arene_choixUser = 1; }
		else if (arene_choixUser == "tomahawk" || arene_choixUser == "2" || arene_choixUser == "t") { arene_choixUser = 2; }
		else if (arene_choixUser == "lance" || arene_choixUser == "3" || arene_choixUser == "l") { arene_choixUser = 3; }
		else {
			message.channel.send("Mauvaise synthaxe. Vous devez choisir entre \"masse\", \"tomahawk\", \"lance\" ('p<help arene' pour plus de précisions)");
		}

		if (arene_choixUser == 1 || arene_choixUser == 2 || arene_choixUser == 3){

				    if (arene_choixUser == 1 && arene_choixEnemy == 1) //Masse VS Masse
				    {
				    	message.channel.send("Vous utilisez la **masse**.\n**L'ennemi aussi !**\n*Match nul...*");
				    }
		    		if (arene_choixUser == 1 && arene_choixEnemy == 2) //Masse VS Tomahawk
		    		{
		    			message.channel.send("Vous utilisez la **masse**.\n**L'ennemi utilise la tomahawk !**\n*Vous gagnez !*");
		    			//Faire que le mec gagne de l'xp
		    		}
		    		if (arene_choixUser == 1 && arene_choixEnemy == 3) //Masse VS Lance
		    		{
		    			message.channel.send("Vous utilisez la **masse**.\n**L'ennemi utilise la lance !**\n*Vous perdez...*");
		    			//Faire que le mec perd de l'xp
		    		}


		    		if (arene_choixUser == 2 && arene_choixEnemy == 1) //Tomahawk VS Masse
		    		{
		    			message.channel.send("Vous utilisez la **tomahawk**.\n**L'ennemi utilise la masse !**\n*Vous perdez...*");
		    			//Faire que le mec perd de l'xp
		    		}
		    		if (arene_choixUser == 2 && arene_choixEnemy == 2) //Tomahawk VS Tomahawk
		    		{
		    			message.channel.send("Vous utilisez la **tomahawk**.\n**L'ennemi aussi !**\n*Match nul...*");
		    		}
		    		if (arene_choixUser == 2 && arene_choixEnemy == 3) //Tomahawk VS Lance
		    		{
		    			message.channel.send("Vous utilisez la **tomahawk**.\n**L'ennemi utilise la lance !**\n*Vous gagnez !*");
		    			//Faire que le mec gagne de l'xp
		    		}


		    		if (arene_choixUser == 3 && arene_choixEnemy == 1) //Lance VS Masse
		    		{
		    			message.channel.send("Vous utilisez la **lance**.\n**L'ennemi utilise la masse !**\n*Vous gagnez !*");
		    			//Faire que le mec gagne de l'xp
		    		}
		    		if (arene_choixUser == 3 && arene_choixEnemy == 2) //Lance VS Tomahawk
		    		{
		    			message.channel.send("Vous utilisez la **lance**.\n**L'ennemi utilise la tomahawk !**\n*Vous perdez...*");
		    			//Faire que le mec perd de l'xp
		    		}
		    		if (arene_choixUser == 3 && arene_choixEnemy == 3) //Lance VS Lance
		    		{
		    			message.channel.send("Vous utilisez la **lance**.\n**L'ennemi aussi !**\n*Match nul...*");
		    		}
		}

			 		/* Masse = pierre
			    	Tomahawk = ciseaux
			    	Lance = feuille */

			    	// A la place de pierre, feuille, ciseaux:

			    	// ATTAQUE : pierre
			    	// DEFENSSE : feuille
			    	// PERCÉE : ciseaux

			    	// ATTAQUE > BRISE DEF
			    	// PERCÉE > DEFENSE
			    	// DEFENSE > ATTAQUE

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


		//message.channel.send(`or de ${message.author} :`);
		//message.channel.send(or_usr);

		/*let embed_or = new Discord.RichEmbed()     //-> VRAIE TRUC OR
							.setColor('#FFD400')
							.setTitle('Or dans votre banque perso')
							.addField("``" + or_usr + "``")
							.setFooter(`____`)
							message.channel.send(embed_or);*/

		message.channel.send({embed: {
			author: {
			name: bot.on.username,
			icon_url: bot.on.avatarURL
			},
			"plainText": "**Or dans la banque**",
			"title": ":bank: **Or dans la banque** :bank:",
			"color": 0xffd400,
			"fields": [
			//------------------------------
			{
			"name": "PERSONNELLE",
			"value": "**" + or_usr + " $**",
			"inline": false
			},
			{
			"name": "COFFRE DE FACTION",
			"value": "**NON DEFINI PD !**",
			"inline": false
			}
					]
			}});
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
			let Maitre_Sigma = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);

			

		if (message.author.id == Maitre_Epsilon || message.author.id == Maitre_Gamma || message.author.id == Maitre_Sigma) { //si l'author est maitre
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
		Maitre_Sigma = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);




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



		 
		 let or_add = or_usr + or_a_add;
		 
		 let nombre_de_miliseconde_entre_chaque_daily = 86400000; //24 Heures:: 86400000
		 
		 let difference_unix_time_en_milisecondes = unix_time_now - unix_time_in_file;
		 
		 
		// message.channel.send("unix_time_file: " + unix_time_in_file + "\n unix_time_now: " + unix_time_now + "\n unix_time_difference" + difference_unix_time_en_milisecondes);
		
		let nombre_de_seconde_depuis_le_dernier_daily = Math.floor(difference_unix_time_en_milisecondes / 1000);
		let nombre_de_miliseconde_depuis_le_dernier_daily = Math.floor(difference_unix_time_en_milisecondes);
		
		let temps_restant_avant_daily = (nombre_de_miliseconde_entre_chaque_daily / 1000) - nombre_de_seconde_depuis_le_dernier_daily; // ce qui fait donc 30 000 / 1000 fait donc 30 (secondes) donc 30 / par le nombre
		let temps_restant_avant_daily_en_milisecondes = nombre_de_miliseconde_entre_chaque_daily - nombre_de_miliseconde_depuis_le_dernier_daily;
		
		let heures_a_attendre = (temps_restant_avant_daily / 60) / 24;
		
			if (temps_restant_avant_daily >= 0) // ca veut dire qu'il reste encore du temps avant de daily)
			{
			message.channel.send("\n Il faut attendre encore: " + msToTime(temps_restant_avant_daily_en_milisecondes) + " avant d'avoir votre revenue."); /*Math.round((((temps_restant_avant_daily) / 60) / 24))*/
			}
			
			if(difference_unix_time_en_milisecondes >= nombre_de_miliseconde_entre_chaque_daily){


					console.log(or_add);
					buffer_thunas = 0;
				if (or_add > max_banque_perso) {
					
					buffer_thunas = or_add - max_banque_perso; //contient le surplus d'or
					or_add = or_add - buffer_thunas; //enlève le surplus à l'or final

					if(message.member.roles.find(r => r.name === "Epsilon")) { factionDe_Request = "Epsilon"; }
					else if(message.member.roles.find(r => r.name === "Gamma")) { factionDe_Request = "Gamma"; 	 }
					else if(message.member.roles.find(r => r.name === "Sigma")) { factionDe_Request = "Sigma";   }
					else { }
					if (factionDe_Request == "Epsilon") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Epsilon." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					} else if (factionDe_Request == "Gamma") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Gamma." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					} else if (factionDe_Request == "Sigma") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Sigma." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
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
				
				//message.channel.send("MORT");
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

	if (message.content === prefix + "list sigma") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Sigma')
            .setDescription(message.guild.roles.get('415947455582961686').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed); 
	} 

	

	if (message.content === prefix + "list factions") {
		let list_epsilon = message.guild.roles.get('415947454626660366').members.map(m=>m.user.tag).join('\n')
		let list_sigma = message.guild.roles.get('415947455582961686').members.map(m=>m.user.tag).join('\n')
		let list_Gamma = message.guild.roles.get('415947456342130699').members.map(m=>m.user.tag).join('\n')
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres des factions')
            .setDescription("**Epsilon**\n\n" + list_epsilon + "\n\n**Gamma**\n\n" + list_Gamma + "\n\n**Sigma**\n\n" + list_sigma + "\n");
        message.channel.send(ListEmbed); 
	}
	///RAJOUTER ABSOLUMENT LA LISTE DES MAITRE A LA FIN AUSSI !!!




//HELP
    /*if(message.content === prefix + "list") {
        const ListEmbed = new Discord.RichEmbed()
            .setTitle('Users with the go4 role:')
            .setDescription(message.guild.roles.get('659904895809224725').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);                    
    }*/
    		
	if (message.content.startsWith(prefix + "DemandeDeThuneASonMaitre ")) { // Verifier le role du mec qui fait la commande, par exemple si il est Gamma faire la verification par role de qui est le maitre prendre son id et envoyer le message au maitre


			 const args = message.content.slice(prefix.length + 25 ).split(' ');
			 let money_demandee = args;
			 factionDe_Request = "";
			 MaitreFac = "";

			 let Maitre_Epsilon = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id);
			 let Maitre_Gamma = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id);
			 let Maitre_Sigma = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);


			 if(message.member.roles.find(r => r.name === "Epsilon")) { factionDe_Request = "Epsilon"; }
			 else if(message.member.roles.find(r => r.name === "Gamma")) { factionDe_Request = "Gamma"; 	 }
			 else if(message.member.roles.find(r => r.name === "Sigma")) { factionDe_Request = "Sigma";   }
			 else { message.channel.send("Vous n'avez aucune faction.") }

			 message.channel.send("DEBUG/Vous êtes dans : " + factionDe_Request);

			 if (factionDe_Request == "Epsilon") { MaitreFac = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id); }
			 if (factionDe_Request == "Gamma") 	 { MaitreFac = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id); }
			 if (factionDe_Request == "Sigma") 	 { MaitreFac = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id); }
			
			message.channel.send("DEBUG/Votre Maitre de Faction est : " + MaitreFac);

		if (MaitreFac) {

			bot.fetchUser(MaitreFac ,false).then(user => {
	        user.send(`${message.author} vous demande ${money_demandee} or du coffre de faction, Acceptez-Vous ?`) 
	        .then(function (message) {
              message.react("✅")
              message.react("❌")
              /*message.pin()
              message.delete()*/

            }).catch(function() {
              //Something
             });


        });


		const filter = (reaction, user) => { //IL FAUT QUE CA FASSE QUELQUE CHOSE QUAND ON REAGIT !
                return [':white_check_mark:', ':x:'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.awaitReactions(filter, { max: 1, time: 14400000/*4h*/, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === ':white_check_mark:') {
                    message.reply('Oui');
                } else {
                    message.reply('Non');
            
                }    
            })
            .catch(collected => {
            message.reply('Délai de demande expiré');
            });

			

			
			//MaitreFac.send(`${message.author} vous demande 5 milliards de thunas ? Acceptez-Vous ?`);
	    } //FIN TEST SI ON EST DANS UNE FAC
	}	//FIN COMMANDE DEMANDE DE THUNE AU MAITRE

	if (message.content === prefix + "xp") { //permet de voir son xp
		let id_usr = message.author.id;

		if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà
	    	fs.readFile('json/xp/xp_' + id_usr + '.json', function(erreur, fichier) {
			   	let json_xp = JSON.parse(fichier)
			   	let xp_level_up_required = xp_level_up_required_BASE * json_xp.xplevel;
				message.channel.send(`XP de <@${id_usr}> : ${json_xp.xp}/${xp_level_up_required} | Level : ${json_xp.xplevel}`);
			})
		} else { //si le fichier xp de l'utilisateur n'existe pas
				let contenu_json = '{' + '\n' + ' \"xp\" : 0, ' + '\n' + ' \"xplevel\" : 1' + '\n' + '}';
				

				//let data_write = JSON.stringify(contenu_json)
				
				fs.writeFile('json/xp/xp_' + id_usr + '.json', contenu_json, function(erreur) {
				    if (erreur) {
				        console.log(erreur)
				    }
				})

	/*
	{
	"xp" : 0,
	"xplevel" : 1
	}
	*/
		}
	}

	

	if (message.content === prefix + "J'adore Le Poulet") {
		message.channel.send("MOI AUZZIIII J'ADORE LE POUUULLEEET <:OMEGA_GRAS:655795195417460756> ")
	}


//ICI C'EST POUR SAVOIR SI LE AUTHOR IL A LE ROLE CHOISIT !
	/*if (message.content === prefix + "DEV/ROLE") {
		if (message.guild.members.get(message.author.id).roles.exists('id','415947455582961686')) {
		///Code here
		message.channel.send("POULET")
		}
	}*/

});
