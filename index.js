const Discord = require('discord.js'), bot = new Discord.Client()
const ajax = require("ajax");
const fs = require("fs");
const mkdirp = require("mkdirp");
const snekfetch = require("snekfetch");
const http = require("http");
const https = require("https");
let crypto = require('crypto');
let getRandomValues = require('get-random-values');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const wiki = require('wikijs').default;

var serv;

const hash = crypto.createHash('md5')
	.update('password')
	.digest('hex')

const config = require("./data/config.json");
const { list } = require('pm2');

bot.login(config.token);

let DraxyEmpereurID = 211911771433205760;
let RomarEmpereurID = 421400262423347211;


let prefix = (config.prefix);

let bot_version = "0.3.7";
let bot_lignes = "3572"; 


let MaitreFac_Epsilon;
let MaitreFac_Gamma;
let MaitreFac_Zeta;
let MaitreFac_Omega;

let factionDe_Request = "";
let MaitreFac = "";


	let maxbanque_esclave = 10;
	let maxbanque_paysan = 35;
	let maxbanque_bourgeois = 80;
	let maxbanque_courtisan = 120;
	let maxbanque_baron = 200;
	let maxbanque_compte = 350;
	let maxbanque_marquis = 550;
	let maxbanque_duc = 800;
	let maxbanque_vassal = 1000;



const talkedRecently_arene = new Set();
const talkedRecently_pray = new Set();
const talkedRecently_coinsdf = new Set();
const tmp_arene = new Set();




let xp_level_up_required_BASE = 50; //nombre d'xp qu'il faut pour level de base (sans multiplicateur de level) OBSOLETE


let buffer_thunas;

var Date1;
var Date2;
		

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
	return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);   // SI je me souviens bien : retourne sous la forme d'un Date, le temps passé en paramètres (milisecondes) -> ou plutôt le unix time en Date)
}


function addOr(id_usrF, orToAdd) { 

	getMaxBankSize(id_usrF);
	// Faire en sorte que l'on ne puisse pas être en thune négative !!! 
	// (sinon on pourrait acheter n'importe quoi même si on est à -10000 ce serait comme de l'argent infini !)
	// Voir si on doit ou non (le truc qui empêche d'être au dessus de notre bank max)

	let id_usr = id_usrF.id;
	console.log("ID_USR !!!!!!!! " + id_usr);

	let or_a_ecrire; // Contient l'or total à ajouter
	let or_in_json; // Contient l'or se trouvant dans le json
	var max_bank = 0; // Contient le niveau de bank max se trouvant dans le json
	let date = 0; // Contient la date à écrire lorsque le fichier user n'existe pas


	/*

	if (fs.existsSync('json/or/or_' + id_usr + ".json")) { // Le fichier user or existe, on pourra donc le traiter
		//checkBankMax(id_usr);
		console.log("Le fichier existe !");
	} else { // le fichier n'existe pas, on le crée pour le traiter par la suite.

	console.log("Le fichier n'existe pas !");





	let file = fs.readFileSync("data/temp/tempmxbk.json");
	let json_maxbank = JSON.parse(file);
	max_bank = json_maxbank.tmp;
	or_a_ecrire = orToAdd;
	console.log(max_bank);


	fs.writeFileSync('json/or/or_' + id_usr + '.json', `
				{
					"or": ` + or_a_ecrire + `,
					"date": 0,
					"maxbanque": ` + max_bank + ` 
				}
					
				`, function(error) {
					if (error) {
						console.log(error);
					}
				});
	
	//console.log(json_maxbank.tmp);

	/*
		fs.readFile(`./data/temp/tempmxbk.json`, function(fichier1) {

			console.log("On est arrivé ici.");


			
			json_mxbk = JSON.parse(fichier1);
			max_bank = json_mxbk.tmp;

			console.log("max_bank = " + max_bank);

			or_a_ecrire = orToAdd;
			//max_bank = 0;

			console.log("addOr function : LE FICHIER N'EXISTE PAS !");
			console.log("or_a_ecrire : " + or_a_ecrire + "\nmax_bank : " + max_bank);

			fs.writeFileSync('json/or/or_' + id_usr + '.json', `
				{
					"or": ` + or_a_ecrire + `,
					"date": 0,
					"maxbanque": ` + max_bank + ` 
				}
					
				`, function(error) {
					if (error) {
						console.log(error);
					}
				});

		});
		*/ /*

		console.log("FIN de la création du fichier.");
		return;
	//ici on récup le maxbank



	// Il faut test si ça marche, si quelqu'un ensuite fait la commande sans avoir le même niveau de max bank
	// Le problème c'est que la première fois qu'on fait le arene sans le fichier or, cela n'ajoute pas l'or qu'on vient de gagner
	// MAIS SEULEMENT LA PREMIERE FOIS !!
	} */
	// Fichier crée !

	// On a forcément un fichier à traiter.

	console.log("Traitement...");

	fs.readFile(`json/users_files/${id_usr}.json`/*`json/or/or_${id_usr}.json`*/, function(error, fichier) {

		console.log("Lecture en cours ...");

		json_or = JSON.parse(fichier);

		
		or_in_json = json_or.or;
		
		console.log("or_in_json b4 parse -> " + or_in_json);
		or_in_json = parseInt(or_in_json);
		console.log("or_in_json after parse -> " + or_in_json);
		orToAdd = parseInt(orToAdd);

		max_bank = json_or.maxbanque;
		date = json_or.date;

		// Calcul de l'or passé en paramètres + or déjà présent ;

		or_a_ecrire = orToAdd + or_in_json;

		// Calcul du buffer -> Si l'or est suppérieur à la taille de la banque max, retirer l'argent en surplus
		// et l'envoyer dans la banque de faction (une autre fonction sera call (celle pour ajouter de l'or dans 
		// la banque de faction))

		if (or_a_ecrire > max_bank) {

			let buffer_thunas = 0;

					buffer_thunas = or_a_ecrire - max_bank; //contient le surplus d'or
					or_a_ecrire = or_a_ecrire - buffer_thunas; //enlève le surplus à l'or final

					// ici mettre buffer_thunas dans la banque de faction !

					if(id_usrF.roles.find(r => r.name === "Epsilon")) { factionDe_Request = "Epsilon"; }
					else if(id_usrF.roles.find(r => r.name === "Gamma")) { factionDe_Request = "Gamma"; 	 }
					else if(id_usrF.roles.find(r => r.name === "Zeta")) { factionDe_Request = "Zeta";   }
					else if(id_usrF.roles.find(r => r.name === "Omega")) { factionDe_Request = "Omega";   }
					
					let chan1 = bot.channels.get('415945814045884427');

					if (factionDe_Request == "Epsilon") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						chan1.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Epsilon." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
						addOrFaction(1, buffer_thunas); // Envoie à epsilon du surplus d'or

					} else if (factionDe_Request == "Gamma") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						chan1.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Gamma." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
						addOrFaction(3, buffer_thunas); // Envoie à Gamma le surplus

					} else if (factionDe_Request == "Zeta") {
						//ENVOIE DANS LE COFFRE DE EPSILON
						chan1.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Zeta." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
						addOrFaction(2, buffer_thunas); // Envoie à Zeta le surplus

					} else if (factionDe_Request == "Omega") {

						chan1.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Omega." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
						addOrFaction(4, buffer_thunas); // Envoie à Oméga le surplus

					} else {
						message.channel.send("Le surplus d'argent à été rendu à PouleRPG : -" + buffer_thunas + " or." + " (Montez de niveau pour augmenter la capacité de votre banque.)");
					} 



					// or_a_ecrire = max_bank;

		}

		if (or_a_ecrire < 0) {
			or_a_ecrire = 0;
		}

		// écriture final dans le fichier.

		// date ; max_bank : or_a_ecrire.

		json_or.or = or_a_ecrire;
		json_or.date = date;
		json_or.maxbanque = max_bank;
		fs.writeFileSync(`json/users_files/${id_usr}.json`, JSON.stringify(json_or, null, 2));
	})
} // fin function addOre


function addOrFaction(factionID, montant) {

	
	// faction ID :

	// Epsilon = 1
	// Zêta = 2
	// Gamma = 3
	// Oméga = 4
	let faction;

	switch(factionID) {
		case 1:
			faction = "Epsilon";
		break;
		
		case 2:
			faction = "Zeta";
		break;
				
		case 3:
			faction = "Gamma";	
		break;
			
		case 4:
			faction = "Omega";
		break;
						
	}

	if (factionID > 4 || factionID < 1) {
		console.log("FATAL ERROR[2]: FactionID is not valide.")
		return;
	}

	let BankFile = require("./json/data_factions/" + faction + "/Banque_" + faction + ".json"); 

	let total = montant + BankFile.or;

	let Orbank = { 
		or: total,
	};
	 
	let data = JSON.stringify(Orbank);
	fs.writeFileSync("./json/data_factions/" + faction + "/Banque_" + faction + ".json", data);
}


function addXpOLD(id_usr, xpToAdd) { //Obsolète ! ( ancienne fonction addXp -> avant équilibrage Draxy) //Fonction permettant d'éditer l'XP d'un utilisateur : elle peut être utiliser pour retirer ou pour ajouter des points d'XP

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
			console.log("addXp Function : LE FICHIER EXISTE PAS !")
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

function addXp(id_usr, xpToAdd) { // Nouvelle fonction pour l'xp : équilibrage par DraxyDow ; Dev : Romar1
	//let xpfile = require("./json/xp/xp_" + id_usr);

	xpToAdd = parseInt(xpToAdd);

	/* if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà
		console.log("Existe !");
	} else {
			fs.writeFileSync("./json/xp/xp_" + id_usr + ".json", `
{
	"xp": 0, 
	"xplevel": 1
}`, function(error) {
				if (error) {
					return console.log(error);
				}
			});
			console.log("N'existe pas !");
	} */ // Inutile de vérifier s'il existe, il existe forcément !!

		fs.readFile(`json/users_files/${id_usr}.json`, function(error, file) {



			
			let xpfile = JSON.parse(file);

			let xp_init = xpfile.xp; // xp initiale de l'utilisateur (aka. xp dans le json avant ajout).
			let xplvl_init = xpfile.xplevel;

			let xp_final;
			let xplvl_final;
			let xpmaxlvl_init; // contient le maximum d'xp de ce level initial; (550x / √x) - 200
			//xp_init = xp_init - xpToAdd;
			console.log("xpinit: " + xp_init + "\nxplvlinit: " + xplvl_init); // Debug

			// fonction & calculs
			xpmaxlvl_init = Math.round((550 * xplvl_init / Math.sqrt(xplvl_init))) - 200; // Xp nécéssaire pour le level up avant ajout d'xp
			xp_final = xpToAdd + xp_init;
			xplvl_final = xplvl_init;

			if (xp_final > xpmaxlvl_init) { // vérifie le level up
				xp_final = xp_final - xpmaxlvl_init;
				xplvl_final = xplvl_init + 1;
			}

			if (xp_final < 0) {
				xp_final = 0;
			}
			//return xpmaxlvl_init;
			
			// ...

			//xp_final = xp_final - xpToAdd;

			xpfile.xp = xp_final;
			xpfile.xplevel = xplvl_final;

			fs.writeFileSync(`json/users_files/${id_usr}.json`, JSON.stringify(xpfile, null, 2));

		

			if(error) {
		 		return console.log(error);
			}

	});
	
}

function getLvlUpReqXP(id_usr) {
	let file = fs.readFileSync("./json/users_files/" + id_usr + ".json")
	let xpfile = JSON.parse(file);

	return Math.round((550 * xpfile.xplevel / Math.sqrt(xpfile.xplevel))) - 200;
}

function viewFactionBank(factionID) {

	let faction;

	switch(factionID) {
		case 1:
			faction = "Epsilon";
		break;
		
		case 2:
			faction = "Zeta";
		break;
				
		case 3:
			faction = "Gamma";	
		break;
			
		case 4:
			faction = "Omega";
		break;
						
	}

	if (factionID > 4 || factionID < 1) {
		console.log("FATAL ERROR[2]: FactionID is not valide.")
		return;
	}

	if (factionID > 0 && factionID < 5) {
		let BankFile = require("./json/data_factions/" + faction + "/Banque_" + faction + ".json"); 
		return BankFile.or;
	}
}

function getMaxBankSize(id_usr) {


	var continuer = true;
	let max_banque_perso_function;
	let final_getMaxBankFunction;

	let revenue_prolo_function;
	let revenue_maitre_function;

	console.log("GetMaxBankSize executed... ID_USR " + id_usr); 


	//bot.on('message', async (message) => { // Il ne rentre pas ici !!

		console.log("bot.on MaxBankSize executé");

		//console.log(id_usr.roles); //-> ce truc SPAM SA GRAND MERE LA CONSOLE avec TOUT le member

		//if (continuer) {

		//console.log(serv.members);
		
			if (id_usr.roles.exists('id','445253268176633891')) {
				max_banque_perso_function = maxbanque_esclave;
				//message.channel.send("OK1 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 1;
				revenue_maitre_function = 1;
			}
			else if (id_usr.roles.exists('id','445253591465328660')) {
				max_banque_perso_function = maxbanque_paysan;
				//message.channel.send("OK2 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 2;
				revenue_maitre_function = 3;
			}
			else if (id_usr.roles.exists('id','445253561648021514')) {
				max_banque_perso_function = maxbanque_bourgeois;
				//message.channel.send("OK3 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 5;
				revenue_maitre_function = 7;
			}
			else if (id_usr.roles.exists('id','445253809640308746')) {
				max_banque_perso_function = maxbanque_courtisan;
				//message.channel.send("OK4 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 6;
				revenue_maitre_function = 9;
			}
			else if (id_usr.roles.exists('id','445257669918588948')) {
				max_banque_perso_function = maxbanque_baron;
			//	message.channel.send("OK5 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 9;
				revenue_maitre_function = 12;
			}
			else if (id_usr.roles.exists('id','650832087993024522')) {
				max_banque_perso_function = maxbanque_compte;
			//	message.channel.send("OK6 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 11;
				revenue_maitre_function = 17;
			}
			else if (id_usr.roles.exists('id','445257144011587594')) {
				max_banque_perso_function = maxbanque_marquis;
			//	message.channel.send("OK7 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 16;
				revenue_maitre_function = 23;
			}
			else if (id_usr.roles.exists('id','612469098466639893')) {
				max_banque_perso_function = maxbanque_duc;
			//	message.channel.send("OK8 !" + max_banque_perso_function);
				continuer = false;
				revenue_prolo_function = 25;
				revenue_maitre_function = 32;
			}
			else if (id_usr.roles.exists('id','650828967716192269')) {
				max_banque_perso_function = maxbanque_vassal;
			//	message.channel.send("OK9 !" + max_banque_perso_function);
				continuer = false;

				revenue_prolo_function = 35;
				revenue_maitre_function = 44;


									//message.guild.members.get(id_usr).roles.exists('id','650828967716192269')
			} // fin test du role
	//	} // fin if continuer

		//console.log(max_banque_perso_function);


		fs.writeFileSync("./data/temp/tempmxbk.json", `{"tmp" : ` + max_banque_perso_function + `, "revenueprolo" : ` + revenue_prolo_function + `, "revenuemaitre" : ` + revenue_maitre_function +`}`, function(err) {
			if (err) {
				console.log(err);
			}
		});

		
	//}); // fin bot on

	var mxbk;

	fs.readFile("./data/temp/tempmxbk.json", function(error, file) {


		if(error) {
			console.log(error);
		}


			
		let ftmp = JSON.parse(file);
		mxbk = ftmp.tmp; // contient le max bank
		console.log(mxbk);
		
	});


	return;	

		
	//return max_banque_perso_function;

} // fin de la fonction


// Fin des fonctions

// function de dev :



// fin fonctions de dev




//Items liste

var item_materiaux = new Array(); // De 0 à 99 (100 items possibles).


// Début bot :


bot.on('ready', function() {
	bot.user.setActivity("PouleRPG | p<help")
	//bot.user.setStatus('dnd');
	console.log("bot 'PouleRPG' has been connected sucessfully!")
	console.log("bot lancé le: " + new Date() + " ");

	let InitializeVariable = 1;
	serv = bot.guilds;
	//console.log(serv);
	
});

// Join member :

bot.on('guildMemberAdd', async (member, message) => {

	let id_usr = member.id;
	// member.guild.channels.get('415943423636537346').send('ID_USR : ' + id_usr);

fs.writeFile('json/users_files/' + id_usr + '.json', `
{
	"class" : "NONE",
	"favpos" : "NONE",
	"hatepos" : "NONE",
	"xp" : 0,
	"xplevel" : 1,
	"or": 0,
	"date": 0,
	"maxbanque": 5,
	"ptsveni": 0,
	"timerarene" : 0
}
`, function(error) { 
				    		if (error) {
									console.log(error);
									return;
							    }
				    		})
	

});




//Main

bot.on('message', async (message) => {


	// check permissions 

	if (message.content.startsWith(prefix)) { //Condition de développement -> permet de whitelist des utilisateurs
		if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760" || message.author.id === "405420810933895168") {
		}
		else if (message.author.id === "624387170580561921") {
			return;
		}
		else {
			message.channel.send("Vous n'avez pas la permission requise pour utiliser le bot.")
			return;
		}
	}

	const emote_or = bot.emojis.find(emoji => emoji.name === "or");
	const emote_giga_gras = bot.emojis.find(emoji => emoji.name === "GIGA_GRAS");
	const emote_bordel = bot.emojis.find(emoji => emoji.name === "BORDEL");
	const emote_pray = bot.emojis.find(emoji => emoji.name === "pray");
	const emote_fakedieu = bot.emojis.find(emoji => emoji.name === "fake_DIEU_POULET");
	const emote_dieudroite = bot.emojis.find(emoji => emoji.name === "DIEU_POULET_droite");
	const emote_dieugauche = bot.emojis.find(emoji => emoji.name === "DIEU_POULET_gauche"); 

	//Ping

	if (message.content === prefix + "ping") { //début ping (le code n'est pas du romar, il est trouvé sur internet)
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Calcul en cours...");
        m.edit( ":ping_pong: **|** Pong!\nTemps de réponse : **" + `${m.createdTimestamp - message.createdTimestamp}ms` + "**");
    } //Fin ping

	if (message.content === prefix + "tmpdev") {
		message.channel.send(addXp(message.author.id, 1));
		//addOrFaction(1, -75);
		message.channel.send("Success.");
	} 

	if (message.content.startsWith(prefix + "tmpdev2 ")) {
		let args = message.content.slice(prefix.length + 8);
		let final = addXpTMP(message.author.id, args);
		message.channel.send("FINAL: " + final);
	}

	if (message.content === prefix + "dev3") {
		
		let final = getMaxBankSize(message.author.id);
		message.channel.send("FINAL: " + final);

	}

	if (message.content === prefix + "dev4") {
		message.channel.send("FINAL: " + getMaxBankSizeTEMP(message.author.id));
	}

	if (message.content === prefix + "dev5") {

		let member1 = message.member;
		message.channel.send("MMM : " + member1.roles);
		getMaxBankSize(member1);
	}
	if (message.content === prefix + "dev6") {
		let member2 = message.member;
		let idmbm = message.member.id;
		message.channel.send("Member2/idmbm = " + member2 + "/" + idmbm);

		addOr(member2, 1);
	}

	if (message.content === prefix + "dev7") {
		message.channel.send("");
		addOrFaction(1, 50);
	}


	




//BIG BIG PARTIE DE L'EMBED HELP


	if (message.content === prefix + "aide" ||  message.content === prefix + "help") {

		let embed_aide = new Discord.RichEmbed()
				.setColor([200, 100, 0])
				.setAuthor("Commandes de PouleRPG", bot.user.displayAvatarURL) 
				.setDescription("**Faites ``p<aide [commande]`` ou ``p<help [commande]`` pour plus de détails sur une certaine commande.**")
				
				.addField(":satellite: UTILITAIRE", "``aide`` **|** ``help`` **|** ``botinfos`` **|** ``ping`` **|** ``list`` **|** ``???``", false)
				.addField(":kite: AMUSEMENT DIVERS", "``phrase`` **|** ``pileouface`` **|** ``say`` **|** ``???``", false)
				.addField(":bar_chart: STATISTIQUES PERSONNELLES", "``or`` **|** ``xp`` **|** ``mes beaux points venitienne`` **|** ``???``", false)
				.addField(":moneybag: GAINS", "``arene`` **|** ``revenue`` **|** ``???``", false)
				.addField(":gear: EXEMPLES", "``p<aide or`` **|** ``p<help phrase`` **|** ``p<aide revenue``", false)
				
				.setFooter("© Bot par Romar1 et DraxyDow.", bot.user.displayAvatarURL)

			message.channel.send(embed_aide);
	}

	//UTILITAIRE
	if (message.content === prefix + "aide aide" || message.content === prefix + "help aide" || message.content === prefix + "aide help" || message.content === prefix + "help help") {
		let embed_aide_aide = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - aide/help :microscope:")
							.setDescription("La commande ``aide`` ou ``help`` affiche la page d'aide ou permet d'avoir plus de précisions sur une commande.\n**Voici comment l'utiliser :**\n``p<aide`` **|** ``p<aide [commande]``\n``p<help`` **|** ``p<help [commande]``")

							message.channel.send(embed_aide_aide);
    }

    if (message.content === prefix + "aide botinfos" || message.content === prefix + "help botinfos") {
		let embed_aide_botinfos = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - botinfos :robot:")
							.setDescription("La commande ``botinfos`` vous montre la version du bot, son nombre de lignes ainsi que ses développeurs.\n**Voici comment l'utiliser :**\n``p<botinfos``")

							message.channel.send(embed_aide_botinfos);
	}

    if (message.content === prefix + "aide ping" || message.content === prefix + "help ping") {
		let embed_aide_ping = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - ping :ping_pong:")
							.setDescription("La commande ``ping`` calcule le temps de réponse du bot et l'affiche.\n**Voici comment l'utiliser :**\n``p<ping``")

							message.channel.send(embed_aide_ping);
    }

    if (message.content === prefix + "aide list" || message.content === prefix + "help list") {
		let embed_aide_list = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - list :scroll:")
							.setDescription("La commande ``list`` vous permet de voir tous les membres d'une faction précise ou de toutes les factions séparément.\n**Voici comment l'utiliser :**\n``p<list [epsilon/zeta/gamma/omega]\np<list factions``")

							message.channel.send(embed_aide_list);
    }

    //AMUSEMENT DIVERS
    if (message.content === prefix + "aide phrase" || message.content === prefix + "help phrase") {
		let embed_aide_phrase = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - phrase :pen_fountain:")
							.setDescription("La commande ``phrase`` écrit une phrase aléatoire grâce à une base de données de mots.\n**Voici comment l'utiliser :**\n``p<phrase``")

							message.channel.send(embed_aide_phrase);
    }

    if (message.content === prefix + "aide pileouface" || message.content === prefix + "help pileouface") {
		let embed_aide_pileouface = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - pileouface :arrows_counterclockwise:")
							.setDescription("La commande ``pileouface`` lance une pièce et donne le résultat, soit pile, soit face.\n**Voici comment l'utiliser :**\n``p<pileouface``")

							message.channel.send(embed_aide_pileouface);
    }

    if (message.content === prefix + "aide say" || message.content === prefix + "help say") {
		let embed_aide_say = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - say :loudspeaker:")
							.setDescription("La commande ``say`` fait en sorte que PouleRPG envoie votre message.\n**Voici comment l'utiliser :**\n``p<say [message]``")

							message.channel.send(embed_aide_say);
    }

    //STATISTIQUES PERSONNELLES
    if (message.content === prefix + "aide or" || message.content === prefix + "help or") {
		let embed_aide_or = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - or " + emote_or)
							.setDescription("La commande ``or`` affiche l'or dont vous êtes en possession.\n**Voici comment l'utiliser :**\n``p<or``")

							message.channel.send(embed_aide_or);
    }

    if (message.content === prefix + "aide xp" || message.content === prefix + "help xp") {
		let embed_aide_xp = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - xp :battery:")
							.setDescription("La commande ``xp`` affiche l'XP ainsi que le level que vous avez.\n**Voici comment l'utiliser :**\n``p<xp``")

							message.channel.send(embed_aide_xp);
    }

    if (message.content === prefix + "aide mes beaux points venitienne" || message.content === prefix + "help mes beaux points venitienne") {
		let embed_aide_venitienne = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - mes beaux points venitienne :woman_red_haired:")
							.setDescription("La commande ``mes beaux points venitienne`` affiche avec honneur ou déshonneur le nombre de magnifiques points vénitiennes dont vous êtes en possession.\n**Voici comment l'utiliser :**\n``p<mes beaux points venitienne``")

							message.channel.send(embed_aide_venitienne);
    }

    //GAINS
    if (message.content === prefix + "aide arene" || message.content === prefix + "help arene") {
		let embed_aide_arene = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - arene :crossed_swords:")
							.setDescription("La commande ``arene`` permet de faire un combat dans l'arène contre le bot pour gagner de l'expérience. Vous pouvez choisir entre 3 armes, la **masse** avec ``p<arene masse`` ou ``p<arene m``, le **tomahawk** avec ``p<arene tomahawk`` ou ``p<arene t``, ou la **lance** avec ``p<arene lance`` ou ``p<arene l``, voici qui l'emporte sur qui :\nLa masse -> le tomahawk **|** Le tomahawk -> la lance **|** La lance -> la masse\nLe combat se fait comme un chifoumi.\n**Voici comment l'utiliser :**\n``p<arene [arme]``")

							message.channel.send(embed_aide_arene);
    }

    if (message.content === prefix + "aide revenue" || message.content === prefix + "help revenue") {
		let embed_aide_revenue = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - revenue :moneybag:")
							.setDescription("La commande ``revenue`` vous permet de gagner un montant assez conséquent d'or suivant le rôle de level dont vous êtes en possession (cf. rôle Mee6). Ce revenue est réinitialisé après **24h** suite à son utilisation.\n**Voici comment l'utiliser :**\n``p<revenue``")

							message.channel.send(embed_aide_revenue);
    }


    if (message.content === prefix + "aide ???" || message.content === prefix + "help ???") {
		let embed_aide_no = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - ??? :grey_question:")
							.setDescription("La commande ``???`` n'existe tout simplement pas, c'est un petit easter egg, voilà tout.\n**Voici comment ne pas l'utiliser :**\n``/``")

							message.channel.send(embed_aide_no);
    }
    //TEMPLATE
    /*
    if (message.content === prefix + "aide X" || message.content === prefix + "help X") {
		let embed_aide_X = new Discord.RichEmbed()
							.setColor([200, 100, 0])
							.setTitle(":microscope: Aide - X :X:")
							.setDescription("La commande ``X`` XXX.\n**Voici comment l'utiliser :**\n``p<X\np<X``")

							message.channel.send(embed_aide_X);
    }
    */

	//FIN DU BIG BIG EMBED HELP



	if (message.content === prefix + "botinfos") {

		let embed_botinfos = new Discord.RichEmbed()
			.setColor([200, 100, 0])
			.setAuthor("Infos de PouleRPG", bot.user.displayAvatarURL)
			.setDescription("Version : **" + bot_version + "**\nLignes de code : **" + bot_lignes + "**\nProgrammation : **Romar1** ; Design Graphique : **DraxyDow**")

		message.channel.send(embed_botinfos);
	}
	


	//Heu qu'est-ce que j'ai chier ici ? C'est quoi ce bordel xD Je le laisse si c'est là c'est que ça doit être utile mais je vois pas pourquoi xD -r
    const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();

	// ce bordel sert à éviter le message.content === prefix + "command", dans chaques if, il suffit juste de "command === "commande"". Mais je ne l'utilise pas
	

    if (message.content.startsWith(prefix + 'arene ')) { //DEBUT ARENE ///FAIT LE COULDOWN de 1 minute, et le fait qu'on gagne de l'xp (aléatoire entre 1 et 3 un truc commas), DE PLUS fait le système qui calcul l'xp de la pleb dans la commande p<xp (en gros, au lieu de verifier le level dxp des cons à chaques fois, là ça permet de verifier le level uniquement quand on fait la commande "xp", ça allègera le bot, et c'est pas très handicappant que le con ne soit pas avertit qu'il level up, ça osef !!)
		/*message.channel.send("Temporairement Désactivée");
		return;*/

		let couldown = 60000;
		let startTimeMS = 0;
		let timeout;
		let tm = 0;

		let aut_usr = message.member;

	

		
		
	
		let id_usr = message.author.id;
    	if (talkedRecently_arene.has(message.author.id)) {
			Date2 = Math.floor(new Date() / 1000);

			/*let pre_final = Date2 - Date1;
			let final = 60 - pre_final;*/
			
			/*message.channel.send("unixtimestamp = " + Unix_timestamp(Date2) + "\nDate2 = " + Date2);
			message.channel.send("Date1 = " + Date1); 
			message.channel.send("Final = " + final); */

			fs.readFile("./json/users_files/" + message.author.id + ".json", function(error, file) {
				let timerfile = JSON.parse(file);
				Date1 = timerfile.timerarene;

				let attente_arene = 60 - (Date2 - Date1);
			
				message.channel.send(":hourglass: **| " + message.author.username + "**, il vous faut attendre encore **" + attente_arene + " secondes** avant de pouvoir vous battre de nouveau dans l'arène !");
				
			});

			
			/*let final = 0;

			message.channel.send("tm = " + tm);

			message.channel.send("restant = " + final); */
				
	    } else {

			
			Date1 = Math.floor(new Date() / 1000);

			fs.readFile("./json/users_files/" + message.author.id + ".json", function(error, file) {
				
				let timerjson = JSON.parse(file);
				timerjson.timerarene = Date1;

				fs.writeFileSync(`json/users_files/${message.author.id}.json`, JSON.stringify(timerjson, null, 2));

				
			});
			
			
			


	    	let arme_ennemi = "ABC"; //Change lorsque l'ennemi a une arme

	    	let arene_choixEnnemy = entierAleatoire(1,3);
	    	console.log("arene_choixEnnemy: " + arene_choixEnnemy); //TEMP

	    	let arene_choixUser = args[0].toLowerCase();

	    	console.log("arene_choixUser: " + arene_choixUser); //TEMP


	    	if(arene_choixEnnemy == 1) {
	    		arme_ennemi = "la masse";
	    	}

	    	if(arene_choixEnnemy == 2) {
	    		arme_ennemi = "le tomahawk";
	    	}

	    	if(arene_choixEnnemy == 3) {
	    		arme_ennemi = "la lance";
			}
			
			


	    	//EMBED
			let embed_arene_victoire = new Discord.RichEmbed()
					.setColor([200, 200, 200])
					.setAuthor("Victoire !", message.author.displayAvatarURL)
					.setDescription("L'ennemi a utilisé " + arme_ennemi + ", vous le terrassez !\n**+7 XP ; +1** " + emote_or)

			let embed_arene_matchnul = new Discord.RichEmbed()
					.setColor([200, 200, 200])
					.setAuthor("Match nul.", message.author.displayAvatarURL)
					.setDescription("L'ennemi a utilisé " + arme_ennemi + ", c'est une égalité.\n**+2 XP**")
					
			let embed_arene_defaite = new Discord.RichEmbed()
					.setColor([200, 200, 200])
					.setAuthor("Défaite...", message.author.displayAvatarURL)
					.setDescription("L'ennemi a utilisé " + arme_ennemi + ", vous vous faites éliminer...\n**-2 XP**")				



				 if (arene_choixUser == "masse" || arene_choixUser == "m") { arene_choixUser = 1; }
			else if (arene_choixUser == "tomahawk" || arene_choixUser == "t") { arene_choixUser = 2; }
			else if (arene_choixUser == "lance" || arene_choixUser == "l") { arene_choixUser = 3; }
			else {
				message.channel.send(":x: **|** Mauvaise synthaxe !\nVous devez choisir entre \"**masse**\", \"**tomahawk**\" et \"**lance**\" !\nFaites '**p<help arene**' pour plus de précisions.");
				return;
			}

			if (arene_choixUser == 1 || arene_choixUser == 2 || arene_choixUser == 3) {
				 
				if (arene_choixUser == 1 && arene_choixEnnemy == 1) { //Masse VS Masse - Match nul
				    message.channel.send(embed_arene_matchnul);
				    addXp(id_usr, 2);
				}
	    		if (arene_choixUser == 1 && arene_choixEnnemy == 2) { //Masse VS Tomahawk - Victoire
					message.channel.send(embed_arene_victoire);
					//getMaxBankSize(id_usr);
	    			addXp(id_usr, 7);
					addOr(aut_usr, 1);
	    		}
	    		if (arene_choixUser == 1 && arene_choixEnnemy == 3) { //Masse VS Lance - Défaite
	    			message.channel.send(embed_arene_defaite);
	    			addXp(id_usr, -2);
	    		}



	    		if (arene_choixUser == 2 && arene_choixEnnemy == 1) { //Tomahawk VS Masse - Défaite
	    			message.channel.send(embed_arene_defaite);
	    			addXp(id_usr, -2);
	    		}
	    		if (arene_choixUser == 2 && arene_choixEnnemy == 2) { //Tomahawk VS Tomahawk - Match nul
	    			message.channel.send(embed_arene_matchnul);
	    			addXp(id_usr, 2);
	    		}
	    		if (arene_choixUser == 2 && arene_choixEnnemy == 3) { //Tomahawk VS Lance - Victoire
	    			message.channel.send(embed_arene_victoire);
	    			addXp(id_usr, 7);
					addOr(aut_usr, 1);
	    		}



	    		if (arene_choixUser == 3 && arene_choixEnnemy == 1) { //Lance VS Masse - Victoire
	    			message.channel.send(embed_arene_victoire);
	    			addXp(id_usr, 7);
					addOr(aut_usr, 1);
	    		}
	    		if (arene_choixUser == 3 && arene_choixEnnemy == 2) { //Lance VS Tomahawk - Défaite
	    			message.channel.send(embed_arene_defaite);
	    			addXp(id_usr, -2);
	    		}
	    		if (arene_choixUser == 3 && arene_choixEnnemy == 3) { //Lance VS Lance - Match nul
	    			message.channel.send(embed_arene_matchnul);
	    			addXp(id_usr, 2);
	    		}
			}

			// Adds the user to the set so that they can't talk for a minute
			talkedRecently_arene.add(message.author.id);
			
	        
	      	 //startTimeMS = new Date().getTime();
	         setTimeout(() => {
			  // Removes the user from the set after a minute
	          talkedRecently_arene.delete(message.author.id);
	        }, couldown);
		}
	} ///FIN ARENE




  


	if (message.content.startsWith(prefix + "or")) { // permet de regarder ses comptes
		

		let id_user_or;

		if (message.mentions.users.first() == undefined) {
			id_user_or = message.author.id;
		} else {
			id_user_or = message.mentions.users.first().id;
		}

		
		let or_usr = 0;


		fs.readFile('json/users_files/' + id_user_or +'.json', 'utf8', function (erreur, donnees)
		{
			if (erreur) {
				message.channel.send(":x: **|** Vous n'avez pas encore de banque perso, pour la créer faites \"p<revenue\" !");
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
			let max_bank = JSON.parse(donnees);
			max_bank = max_bank.maxbanque;
			
			let embed_or;


			if (message.mentions.users.first() == undefined) {

			embed_or = new Discord.RichEmbed()
									.setColor([255, 200, 0])
									.setAuthor("Banque de " + message.author.username, message.author.displayAvatarURL)
									.setDescription("**" + or_usr + "/" + max_bank + "** " + emote_or)
			} else {

			embed_or = new Discord.RichEmbed()
									.setColor([255, 200, 0])
									.setAuthor("Banque de " +message.mentions.users.first().username, message.mentions.users.first().displayAvatarURL)
									.setDescription("**" + or_usr + "/" + max_bank + "** " + emote_or)	
									
			}



			message.channel.send(embed_or);


		});


	} //FIN or


	if (message.content === prefix + 'revenue') {
		let id_usr = message.author.id;
		let utime_now = Math.floor(new Date().getTime() / 1000); //Date lors de l'execution de la commande
		
		let date_in_file; // contient la date du fichier user.
		let or_in_file; // contient l'or déjà présente dans le fichier user
		let revenue; // contient l'or du revenue
		let final_or; // contient l'or final qui sera ajouté au fichier.
		let mxbk; // contient le max bank
		let difference_or; // contient la différence d'or si on dépasse la banque, à envoyer vers le coffre de faction.

		getMaxBankSize(message.member);

		fs.readFile("./data/temp/tempmxbk.json", function(error, file) {
			if(error) {
				console.log(error);
			}

			let ftmp = JSON.parse(file);

			mxbk = ftmp.tmp; // contient le max bank

			let Maitre_Epsilon = message.guild.roles.get('445617906072682514').members.map(m=>m.user.id);
			let Maitre_Gamma = message.guild.roles.get('445617908903706624').members.map(m=>m.user.id);
			let Maitre_Zeta = message.guild.roles.get('445617911747313665').members.map(m=>m.user.id);
			let Maitre_Omega = message.guild.roles.get('665340068046831646').members.map(m=>m.user.id);

			if (message.author.id == Maitre_Epsilon
			 || message.author.id == Maitre_Gamma 
			 || message.author.id == Maitre_Zeta 
			 || message.author.id == MaitreFac_Omega) {

				revenue = ftmp.revenuemaitre; // maitre
			} else {
				revenue = ftmp.revenueprolo; //non maitre
			}




			// partie 2 :

			
				fs.readFile(`json/users_files/${id_usr}.json`, 'utf8', function (error, data) {

				let usrfile = JSON.parse(data);

				or_in_file = usrfile.or;
				date_in_file = usrfile.date;


				if (Math.abs(utime_now - date_in_file) <= 86400) { // si cela ne fait pas 24h depuis le dernier daily
					//message.channel.send("Ne fait pas 24h");

					let time_left = Math.abs(Math.abs(utime_now - date_in_file) - 86400) * 1000; // nombre de MILIseconde à attendre entre les deux daily !
					message.channel.send(`:hourglass: **| ${message.author.username}**, il vous faut attendre **${msToTime(time_left)}** avant de pouvoir obtenir de nouveau votre revenue !`);
				
					return;
				}

			

				final_or = revenue + or_in_file;

				if (final_or > mxbk) { // surplus d'argent dans le banque de faction
					difference_or = final_or - mxbk;
					final_or = mxbk

					revenue = revenue - difference_or;
					

					message.channel.send(`+${difference_or} dans votre banque de faction.`);

					if (message.member.roles.find(r => r.name === "Epsilon")) { 
						addOrFaction(1, difference_or);
					}
					else if (message.member.roles.find(r => r.name === "Zêta")) { 
						addOrFaction(2, difference_or);
					}
					else if (message.member.roles.find(r => r.name === "Gamma")) {
						addOrFaction(3, difference_or);
					}
					else if (message.member.roles.find(r => r.name === "Oméga")) {
						addOrFaction(4, difference_or);
					}
					
				}

				usrfile.or = final_or;
				usrfile.date = utime_now;
				usrfile.maxbanque = mxbk;

				if (revenue != 0) {
					//message.channel.send(`+${revenue} TOTAL : ${final_or}/${mxbk}`);

					let embed_revenue = new Discord.RichEmbed()
					.setColor([255, 200, 0])
					.setAuthor("Revenue quotidien !", message.author.displayAvatarURL)
					.setDescription("**+" + revenue + "** " + emote_or + "\nVous avez actuellement **" + final_or + "/" + mxbk + "** " + emote_or)

					 message.channel.send(embed_revenue);
				}


				fs.writeFileSync(`json/users_files/${id_usr}.json`, JSON.stringify(usrfile, null, 2));
			});
		});
	}







	//listage des membres des factions

	if (message.content === prefix + "list epsilon") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Epsilon')
            .setColor([170, 60, 0])
            .setDescription(message.guild.roles.get('415947454626660366').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed); 
	} 

	if (message.content === prefix + "list gamma") {
			const ListEmbed = new Discord.RichEmbed()
	            .setTitle('Membres de la faction Gamma')
	            .setColor([100, 200, 50])
	            .setDescription(message.guild.roles.get('415947456342130699').members.map(m=>m.user.tag).join('\n'));
	        message.channel.send(ListEmbed); 
	} 

	if (message.content === prefix + "list zeta" || message.content === prefix + "list zêta") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Zêta')
            .setColor([50, 100, 200])
            .setDescription(message.guild.roles.get('415947455582961686').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed); 
	} 

	if (message.content === prefix + "list omega" || message.content === prefix + "list oméga") {
		const ListEmbed = new Discord.RichEmbed()
            .setTitle('Membres de la faction Oméga')
            .setColor([170, 150, 40])
            .setDescription(message.guild.roles.get('665340021640921099').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);

	}

	if (message.content === prefix + "list sigma") {
		message.channel.send("T'es vieux !?");
	}


	if (message.content === prefix + "list factions") {
		
		let idE = 0;
		let idZ = 0; 
		let idG = 0;
		let idO = 0;

		let list_epsilon = message.guild.roles.get('415947454626660366').members.map(m=>m.user.tag).join('\n')
		let list_zeta = message.guild.roles.get('415947455582961686').members.map(m=>m.user.tag).join('\n')
		let list_gamma = message.guild.roles.get('415947456342130699').members.map(m=>m.user.tag).join('\n')
		let list_omega = message.guild.roles.get('665340021640921099').members.map(m=>m.user.tag).join('\n')
		const ListEmbed = new Discord.RichEmbed()
            .setAuthor('Membres des factions', bot.user.displayAvatarURL)
            .setColor([100, 100, 100])
            .addField("**Epsilon**", "`" + list_epsilon + "`", true)
            .addField("**Zêta**", "`" + list_zeta + "`", true)
            .addBlankField()
            .addField("**Gamma**", "`" + list_gamma + "`", true)
            .addField("**Oméga**", "`" + list_omega + "`", true)
            //.setDescription("**Epsilon**\n\n" + list_epsilon + "\n\n**Zêta**\n\n" + list_zeta + "\n\n**Gamma**\n\n" + list_gamma + "\n\n**Oméga**\n\n" + list_omega + "\n");
        
        message.channel.send(ListEmbed);
	}



//SERT D'EXEMPLE
    /*if(message.content === prefix + "list") {
        const ListEmbed = new Discord.RichEmbed()
            .setTitle('Users with the go4 role:')
            .setDescription(message.guild.roles.get('659904895809224725').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);                    
	}*/
	

		if (message.content.startsWith(prefix + "xp")) { //permet de voir son xp ou l'xp de quelqu'un
		
			let id_usr;
			let member;

			// vérifie si l'on regarde sin xp ou celle d'un autre utilisateur.
				if (message.mentions.users.first() !== undefined) {
					id_usr = message.mentions.users.first().id;
					member = message.mentions.users.first();
					//message.channel.send("La mention est valide !"); //DEV
				} else {
					id_usr = message.author.id;
					member = message.author;
					//message.channel.send("La mention est invalide ! Ou n'existe pas !"); //DEV
				}

			if (!fs.existsSync('json/users_files/' + id_usr + '.json')) { //si le fichier de l'utilisateur n'existe pas
				message.channel.send("ERROR, fichier inexistant, membre invalide. (Si vous estimez que le membre devrait être valide, contactez un administrateur.");
				return;
			}


			fs.readFile(`json/users_files/${id_usr}.json`, function(erreur, fichier) {
				let json_xp = JSON.parse(fichier)
				

				let xplvl_init = json_xp.xplevel;
				let xp_level_up_required = Math.round((550 * xplvl_init / Math.sqrt(xplvl_init))) - 200;


				let embed_xp = new Discord.RichEmbed()
				.setColor([50, 200, 110])
				.setAuthor("XP de " + member.username, member.displayAvatarURL)
				.setDescription(`**XP : ${json_xp.xp}/${xp_level_up_required}\nLevel : ${json_xp.xplevel}**`);
				
				message.channel.send(embed_xp);
			});
	}

	






	if (message.content.startsWith("J'adore le poulet")) { //Une commande useless
		let poulet_ran = entierAleatoire(1, 5);
		let giga_gras = bot.emojis.find(emoji => emoji.name === "GIGA_GRAS");
		let bordel = bot.emojis.find(emoji => emoji.name === "BORDEL");

		switch (poulet_ran) {
			case 1: 
			message.channel.send(`MOI AUZZIIII J'ADORE LE POUUULLEEET ${giga_gras}`)
			break;
			case 2:
			message.channel.send("AH NAN MAIS OUÉÉÉÉ, NAN MAIS LE **POULET** QUOIIII !!!")
			break;
			case 3:
			message.channel.send(`SERIEUX ? TOI AUSSI ${giga_gras}`)
			break;
			case 4:
			message.channel.send(`OUI ! ET HEUREUSEMENT !! ${bordel}`)
			break;
			case 5:
			message.channel.send("Moi je vie poulet.")
			break;
		}	
	}

	if (message.content.startsWith(prefix + "say")) { // permet de faire dire n'importe quoi au bot.
		//message.channel.send("Original : " + message.content);
		let m = message.content.slice(5);
		message.channel.send(m);
		message.delete();
	}





	//CE CODE CI-DESSOUS EST DEGEULASSE OUI MAIS OSEF. :) EDIT 30.08.2020 : Un peu mieux grâce au nouveau système de fichier.
	if (message.content.startsWith(prefix + "point venitienne ")) { //Seul le romar peut exécuter cette commande, c'est un privilège que de recevoir un point vénitienne, elle permet simplement de donner un point venitienne lorsque le romar approuve quelque chose, nottament une blague. 
			let contenu_json;
		if (message.mentions.users.first().id) {
			if (message.author.id == "421400262423347211") {
				message.channel.send("Point venitienne accordé !");
				let id_selection = message.mentions.users.first().id;

				

					let id_usr = message.author.id;

					if (fs.existsSync(`json/users_files/${id_selection}.json`)) { //si le fichier de l'utilisateur existe déjà
				    		fs.readFile(`json/users_files/${id_selection}.json`, function(erreur, file) {
			   				
								let veni_json = JSON.parse(file)
								let pts_veni_total = veni_json.ptsveni + 1;
								veni_json.ptsveni = pts_veni_total;

								fs.writeFileSync(`json/users_files/${id_selection}.json`, JSON.stringify(veni_json, null, 2));
			   				})
				    	
					} else { //si le fichier de l'utilisateur n'existe pas
						message.channel.send("ERROR, fichier inexistant, membre invalide. (Si vous estimez que le membre devrait être valide, contactez un administrateur.");
						return;
					}



			} else {
				message.channel.send("Vous n'êtes pas la venitienne, vous ne pouvez donc pas accorder de \"points venitienne\"");
			}
		} else {
			message.channel.send("ERROR [3]");
		}
		
	} //Fin retrait point venitienne

		if (message.content.startsWith(prefix + "retrait point venitienne ")) { //Seul le romar peut exécuter cette commande, c'est un privilège que de recevoir un point vénitienne, elle permet simplement de donner un point venitienne lorsque le romar approuve quelque chose, nottament une blague. 
			let contenu_json;
		if (message.mentions.users.first().id) {
			if (message.author.id == "421400262423347211") {
				message.channel.send("Point venitienne retiré !");

				let id_selection = message.mentions.users.first().id;
				let id_usr = message.author.id;

					if (fs.existsSync(`json/users_files/${id_selection}.json`)) { //si le fichier de l'utilisateur existe déjà
				    		fs.readFile(`json/users_files/${id_selection}.json`, function(erreur, file) {
			   				
								let veni_json = JSON.parse(file)
								let pts_veni_total = veni_json.ptsveni - 1;
								veni_json.ptsveni = pts_veni_total;

								fs.writeFileSync(`json/users_files/${id_selection}.json`, JSON.stringify(veni_json, null, 2));
			   				})
					} else { //si le fichier de l'utilisateur n'existe pas
						message.channel.send("ERROR, fichier inexistant, membre invalide. (Si vous estimez que le membre devrait être valide, contactez un administrateur.");
						return;
					}
			} else {
				message.channel.send("Vous n'êtes pas la venitienne, vous ne pouvez donc pas accorder de \"points venitienne\"");
			}
		} else {
			message.channel.send("Invalid User");
		}
		
	} //Fin retrait point venitienne

	if (message.content === prefix + "mes beaux points venitienne") { //voir ses points venitienne

		if (message.author.id === "421400262423347211") {
			message.channel.send("Vous avez : ∞ points venitienne.");

		} else {
			let id_usr = message.author.id;

			if (fs.existsSync(`json/users_files/${id_usr}.json`)) { //si le fichier de l'utilisateur existe déjà
		    		fs.readFile(`json/users_files/${id_usr}.json`, function(erreur, file) {
	   				
	   				let veni_json = JSON.parse(file)
	   				let pts_veni_total = veni_json.ptsveni;
	   				
	   				message.channel.send("Vous avez : " + pts_veni_total + " points venitienne.");
	   				
	   				})
		    	
			} else { //si le fichier de l'utilisateur n'existe pas
				message.channel.send("ERROR, fichier inexistant, membre invalide. (Si vous estimez que le membre devrait être valide, contactez un administrateur.");
				return;
			}
		}
	} //Fin de la commande pour voir points venitienne

	if (message.content.startsWith(prefix + "ses beaux points venitienne ")) { //voir les points venitienne de quelqu'un

		let id_usr_selected = message.mentions.users.first().id;

		if (id_usr_selected == undefined) {
			message.channel.send("FATAL ERROR[3]: Invalide Mention");
			return;
		}

		if (id_usr_selected === "421400262423347211") {
			message.channel.send(`<@${id_usr_selected}> a : ∞ points venitienne.`);

		} else {
			

			if (fs.existsSync(`json/users_files/${id_usr_selected}.json`)) { //si le fichier de l'utilisateur existe déjà
		    		fs.readFile(`json/users_files/${id_usr_selected}.json`, function(erreur, file) {
	   				
	   				let veni_json = JSON.parse(file)
	   				let pts_veni_total = veni_json.ptsveni;
	   				
	   				message.channel.send(`<@${id_usr_selected}> a : ` + pts_veni_total + " points venitienne.");
	   				
	   				})
		    	
			} else { //si le fichier de l'utilisateur n'existe pas
				message.channel.send("ERROR, fichier inexistant, membre invalide. (Si vous estimez que le membre devrait être valide, contactez un administrateur.");
				return;
			}
		}
	} //Fin de la commande pour voir les points vénitienne de quelqu'un.





	if (message.content !== undefined && message.author.id !== bot.user.id) {
		var test = message.content;
		if( test.indexOf('Bonne nuit') >= 0 || test.indexOf('bonne nuit') >= 0 ||  test.indexOf('Bon nuit') >= 0 || test.indexOf('Bonne Nuit') >= 0 || test.indexOf('bon nuit') >= 0 || test.indexOf('Bon nui') >= 0 || test.indexOf('Bonne nui') >= 0 || test.indexOf('bonne nui') >= 0){
			
			let random_nuit = entierAleatoire(1, 5);

			switch(random_nuit) {
				case 1:
					message.channel.send("BONNE NUUIIIT :))");
					break;

				case 2:
					message.channel.send("Je vous souhaite à vous aussi une agréable nuit, ainsi que de faire de doux rêves pleins de bonheur.");
					break;

				case 3:
					message.channel.send("bon nui.");
					break;
				
					case 4:
					message.channel.send("**BONNNNEUUUUH NUUUUUUIIIIIT A TOI AUZIIIIIII !!!!!!** " + emote_giga_gras);
					break;

				case 5:
					message.channel.send("Douce nuit à toi !");
					break;
			}
		}
	}

	


	


	





	//Connerie : mini jeu phrases :

	if (message.content === prefix + "phrase") {

		let loopCasio = true;
		//Personne, action, objet, lieu, temps
		let personne = [`Un PD`, `Chintok`, `La mémé de la Rochelle`, `Medyl`, `Léa`, `Zineb`, `Chloé`, `Donald Trump`, `Une tortue de mer`, `Un poulet`, `Romar1`, `Noxali`, `Zheo`, `DraxyCUL`, `La Vénitienne`, `PouleRPG`, `Dieu Poulet`, `Jérémerde`, `Zêta`, `Le Maître Gamma`, `Le frère con`, `Hitler`, `Une enfant`, `Un psychopathe`, `Un entraineur`, `Un juge`, `Le procureur`, `Romar1`, `Chveux Vert`, `Bordel`, `Princesseuh`, `DarkDavy`, `Damben`, `Dark`, `Darky`, `BanjoBoi`, `KriixMerde`, `TetreMerde`, `Tatsumakmerde`, /*`Romar la pute de luxe`,*/ `Epsilon`, `Un pokémon`, /*`Des animaux de la ferme`,*/ `Un chat`, `Un chien`, `Une souris`, `Un animal`, `Emmanuel Macron`, `Kim Jong-Un`, `Un dictateur`, `Gigi`, `Un bon gros fils de pute`]; //personnage
		let action   = [`Imagine ses morts à`, `meurt devant`,`mange`, `vend`, `détruit`, `fait disparaître`, `lance`, `consomme`, `découpe lentement`, `donne`, `rage à cause (d')`, `pénètre`, `regarde`, `écoute`, /*`à une relation incestueuse avec`,*/ `juge`, `se procure`, `fait un rite satanique avec`, `s'entraine avec`, `poste`, `chante avec`, `théorise sur`, `réfléchit à ne pas cheat avec`, `envoie un cookie à`, `prie`, `meurt à cause (d')`, `fait chier`, `hack les logs (d')`, `claque`, `rit de (d')`, `fait apparaître`, `dors grâce à`, `bois`, `fait la lessive pour`, `fait à manger à`, /*`fait le ménage pour`,*/ `insulte`/*, `crie`*/]; //action
		let objet    = [`une pomme`, `un radiateur`, `une ampoule`, `une vitre`, `du poulet`, `des grilles pain`, `un nouveau née`, `des points vénitienne`, `la loi paragraphe 4, sous-tiret 2, alinéa 1`, /*`une arme de destruction massive`,*/ `la boite de jeu de "Link faces to evil"`, `les recettes de cuisine de Noxali`, `des funérailles`, `un banc de messe`, `une porte d'église`, `un bénitier`, `des produits illicites`, `un cercueil`, /*`un film`, `une série`,*/ `un enfant`, `la musique`, `un hentai`, `un mouton`, `un boeuf`, `un mandat`, /*`une vidéo virale`,*/ `un ralentisseur de type "dos d'âne"`, `la loi paragraphe 4, sous-tiret 3, alinéa 1`, `une porte`, `un fruit`, /*`une armes blanches`, `un jeu Nintendo`,*/ `une boîte en carton`, `une voiture`, `un panneau`, `un tableau`, `une craie`, `un feutre`, `un crayon de couleur`, `une contravention`/*, `un film`*/]; //objet1
		let objet2   = [/*`une aiguille`, */`un couteau`, /*`du taboulé`, `du chocolat`,*/ `de la confiture`, /*`une anguille`,*/ `un frigo`, `du rhum`, `de l'alcool`, `la daronne de Draxy`, `un verre`, `Zheo`, `le curé`, `des enfants`, `un cheval`, `un veau`]; //objet2
		let conjCoord= [`avec`]; //conjonction
		let lieu     = [`à Londres`, `à Stockholm`, `en nouvelle Zélande`, `dans son salon`, `dans la cuisine du voisin`, `sur l'Empire Du Poulet`, `dehors`, /*`au ministère de la justice`,*/ `dans une église`, `dans la cave`, `dans un laboratoire`, `dans une maison close`, `dans l'espace`, `dans la chambre de Zheo`, `dans un cimetière`, `à un mariage`, `dans la cathédrale Dieu Poulet`, /*`dans un karaoké`,*/ `dans un centre commercial`, `dans les toilettes`, `dans un cinéma`, `au Super U du coin`, `à Auschwitz` /*`au journal`, `au japon`, `sur Snapchat`, `sur Twitter`, `sur un mur`, `sur Pinterest`*/]; //lieu
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
				let ran2 = entierAleatoire(1, 6);
				if (ran2 == 1 || ran2 == 2 || ran2 == 3) {
					message.channel.send(`${personne[choix_personne]} ${action[choix_action]} ${objet[choix_objet]} ${conjCoord[choix_conjCoord]} ${objet2[choix_objet2]} ${lieu[choix_lieu]}`/*${temps[choix_temps]}`*/);
				} else if (ran2 == 4) {
					message.channel.send(`${personne[choix_personne]} ${action[choix_action]} ${objet[choix_objet]}`);
				} else if (ran2 == 5 || ran2 == 6) {
					message.channel.send(`${personne[choix_personne]} ${action[choix_action]} ${objet[choix_objet]} ${conjCoord[choix_conjCoord]} ${objet2[choix_objet2]}`/*${temps[choix_temps]}`*/);
				}
				
				loopCasio = false;
			} else {
				console.log("On continue y'a un undefined dans la phrase (casionost phrase)");
			}
		}
	} //Fin du p<phrase


	if (message.content.startsWith(prefix + "random ")) {
		let argsRandom = message.content.slice(prefix.length).trim().split(/ +/g);
			//message.channel.send(argsRandom + `<-args5 ; \n ${args[0]}, ${args[1]}`);
			let nbrAexe = args[2];
			let minR = args[0];
			let maxR = args[1];
			let nombreRan = 0;

			console.log(nbrAexe + "\n" + minR + "\n" + maxR)

			for(i=1;i <= nbrAexe; i++) {
				nombreRan = entierAleatoire(minR, maxR);
				message.channel.send(nombreRan);
				nombreRan = 0;
			}
			message.channel.send("END.")
	}	

	/*

	if (message.author.id === "159985870458322944") { // si un message est envoyé par mee6

		let max_banque_perso = 0;

		if (message.mentions.users.first() == undefined) { // Si le message de mee6 n'est pas un level up
			
			//message.channel.send("N'est pas un message mee6 valide pour le test !");
			return;
		} else {
			//message.channel.send("Est un message mee6 valide pour le test !");
			let id_usr2 = message.mentions.users.first().id;


			if (message.guild.members.get(id_usr2).roles.exists('id','445253268176633891')) {
		 		max_banque_perso = maxbanque_esclave;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','445253591465328660')) {
		 		max_banque_perso = maxbanque_paysan;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','445253561648021514')) {
		 		max_banque_perso = maxbanque_bourgeois;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','445253809640308746')) {
		 		max_banque_perso = maxbanque_courtisan;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','445257669918588948')) {
		 		max_banque_perso = maxbanque_baron;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','650832087993024522')) {
		 		max_banque_perso = maxbanque_compte;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','445257144011587594')) {
		 		max_banque_perso = maxbanque_marquis;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','612469098466639893')) {
		 		max_banque_perso = maxbanque_duc;
		 	}
		 	else if (message.guild.members.get(id_usr2).roles.exists('id','650828967716192269')) {
		 		max_banque_perso = maxbanque_vassal;
		 	}

		 	// ecrire ICI DANS LE FICHIER OR si il existe, et si non le créer ! dans les deux cas on doit noter le maxbanque

		 	let id_usr = message.mentions.users.first().id;
		 	console.log(id_usr);

		 	if (fs.existsSync('json/or/or_' + id_usr + '.json')) { //si le fichier de l'utilisateur existe déjà
				    		fs.readFile('json/or/or_' + id_usr + '.json', function(erreur, file) {
			   				
			   				let or_json = JSON.parse(file);
			   				let or_in_json = or_json.or;
			   				let banquemax_in_json = or_json.maxbanque;
			   				let date = or_json.date;

			   			

			   				fs.writeFile('json/or/or_' + id_usr + '.json', `

			   					{
			   						"or": ` + or_in_json + `,
			   						"date": ` + date + `,
			   						"maxbanque": ` + max_banque_perso + `
			   					}
			   					`, function(erreur) { 
					    		if (erreur) {
								        console.log(erreur)
								    }
					    		})
			   				})


				    	
				    	
					} else { //si le fichier de l'utilisateur n'existe pas
						 				

						let date = 0;
						let or_in_json = 0;
						
						fs.writeFile('json/or/or_' + id_usr + '.json', `

		   					{
		   						"or": ` + or_in_json + `,
		   						"date": ` + date + `,
		   						"maxbanque" ` + max_banque_perso + `
		   					}
		   					`, function(erreur) { 
				    		if (erreur) {
							        console.log(erreur)
							    }
				    		})
					}
		 }


	} // Fin du test de niveau de bank */

	

	if (message.content.startsWith(prefix + "info faction ")) {
		let argsFac = message.content.slice(prefix.length + 13);
		let factionExist = false;
		let faction = "";
		let factionFS;
		let faction_channel_id;
		let maitre;


		if (argsFac == "epsilon") {
			factionExist = true;
			faction = "Epsilon";
			factionFS = "Epsilon";
			faction_channel_id = 445289059892461578;

			maitre = message.guild.roles.get('445617906072682514').members.map(m=>m.user.username).join('\n'); // Maitre Epsilon

		} else if (argsFac == "zeta") {
			factionExist = true;
			faction = "Zêta";
			factionFS = "Zeta";
			faction_channel_id = 445289032419770378;

			maitre = message.guild.roles.get('445617911747313665').members.map(m=>m.user.username).join('\n'); // Maitre Epsilon

		} else if (argsFac == "gamma") {
			factionExist = true;
			faction = "Gamma";
			factionFS = "Gamma";
			faction_channel_id = 445289003156242434;

			maitre = message.guild.roles.get('445617908903706624').members.map(m=>m.user.username).join('\n'); // Maitre Epsilon

		} else if (argsFac == "omega") {
			factionExist = true;
			faction = "Oméga";
			factionFS = "Omega";
			faction_channel_id = 667858618342834216;

			maitre = message.guild.roles.get('665340068046831646').members.map(m=>m.user.username).join('\n'); // Maitre Epsilon

		}

		if (factionExist == false) {
			message.channel.send("ERROR [1] : Synthax Error");
			return;
		} else if (factionExist == true) {
			if (message.channel.id == faction_channel_id) {
				// envoyer ici les informations privées ET publiques de la faction.
				message.channel.send("Informations Privées");

				message.channel.send(`${faction}\n Maître : ${maitre}`);

				fs.readFile('json/data_factions/' + factionFS + '/Banque_' + factionFS + '.json', function(error, file) {
	   				
					let facbankjson = JSON.parse(file)
					let facbank = facbankjson.or;
					
					message.channel.send(`OR BANQUE FACTION ${faction} : ${facbank}`);
				});

				


			} else {
				// envoyer ici les informations publiques de la faction.
				
				message.channel.send("Informations Publiques");

			

				

				
				
				
			}
		}

		//Pour avoir son or, membres de l'armée etc... (garder privé la banque de faction -> vérifier si l'utilisateur est bien dans la faction, et dans ce cas lui envoyer en dm)
	}

	

	// Général Epsilon ID : 445289059892461578
	// Général Zêta ID    : 445289032419770378
	// Général Gamma ID   : 445289003156242434
	// Général Oméga ID   : 667858618342834216

	






	

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
	} // fin request war



	//Guerres :

	if (message.content.startsWith(prefix + "startWar ")) {
		if (message.author.id == DraxyEmpereurID || message.author.id == RomarEmpereurID) {

			//Initialisation et tests :

			let argsStartWar = message.content.slice(prefix.length).trim().split(/ +/g);

			let firstFaction = args[0];
			let secondFaction = args[1];
			let faction1 = "";
			let faction2 = "";
			let factionExist = false;
			let factionExist2 = false;

			if (firstFaction == "epsilon" || firstFaction == "Epsilon") {
				factionExist = true;
				faction1 = "Epsilon";
			} else if (firstFaction == "zeta" || firstFaction == "Zeta" || firstFaction == "zêta" || firstFaction == "Zêta") {
				factionExist = true;
				faction1 = "Zêta";
			} else if (firstFaction == "gamma" || firstFaction == "Gamma") {
				factionExist = true;
				faction1 = "Gamma"
			} else if (firstFaction == "omega" || firstFaction == "Omega" || firstFaction == "oméga" || firstFaction == "Oméga") {
				factionExist = true;
				faction1 = "Oméga";
			}

			if (secondFaction == "epsilon" || secondFaction == "Epsilon") {
				factionExist2 = true;
				faction2 = "Epsilon";
			} else if (secondFaction == "zeta" || secondFaction == "Zeta" || secondFaction == "zêta" || secondFaction == "Zêta") {
				factionExist2 = true;
				faction2 = "Zêta";
			} else if (secondFaction == "gamma" || secondFaction == "Gamma") {
				factionExist2 = true;
				faction2 = "Gamma"
			} else if (secondFaction == "omega" || secondFaction == "Omega" || secondFaction == "oméga" || secondFaction == "Oméga") {
				factionExist2 = true;
				faction2 = "Oméga";
			}


			if (!factionExist || !factionExist2) {
				message.channel.send("[ERROR] [4] Unknowed Faction");
				return;
			}

			if (faction1 == faction2 || faction2 == faction1) {
				message.channel.send("[ERROR] [5] Same name");
				return;
			}

			message.channel.send("Guerre opposant: " + faction1 + " et " + faction2);

			// Fin initialisation


		}
	} // fin startWar


	if (message.content === prefix + "pileouface") {
		let ran = entierAleatoire(1, 2);
		if (ran == 1)
			message.channel.send("Pile");
		if (ran == 2)
			message.channel.send("Face");
	}

	if (message.content !== undefined && message.author.id !== bot.user.id) {
		let pray = message.content;
		let midnight = new Date();
		midnight.setHours(24,0,0,0); 
		let now = new Date();
		let msToMidnight = midnight - now;
		let couldown = msToMidnight;

		//message.channel.send("msToMidNight : " + couldown + "\n minute untilMidnight : " + (couldown / 1000) / 60 + "\n Hour: " + (((couldown / 1000) / 60) / 60));

		
			
		
			if(test.indexOf(`🙏`) >= 0) {
				if (test.indexOf(`${emote_fakedieu}`) >= 0 || test.indexOf(`${emote_dieudroite}`) >= 0 || test.indexOf(`${emote_dieugauche}`) >= 0 || test.indexOf(`🐔`) >= 0) {
					if (message.channel.id === "445370665395159060") {

						if (talkedRecently_pray.has(message.author.id)) {
							//message.channel.send("A deja prié aujourd'hui");
						} else {
							//message.channel.send("N'a pas encore prié !");
							talkedRecently_pray.add(message.author.id);


							//message.channel.send("prie !");
							let ranPray = entierAleatoire(1, 15);
							if (ranPray == 1) { // Une chance sur 15
								let mbm = message.member;
								addOr(mbm, 3);
								message.author.send("Dieu Poulet à entendu votre prière, 3 or " + emote_or + " apparaissent étrangement dans votre main.")
							}
						}
					}
				}
			}

			
			 
			setTimeout(() => {
			talkedRecently_pray.delete(message.author.id);
		}, couldown); // le couldown sera égale au temps qu'il reste avant 00H (en ms).

		
	}

	if (message.content === prefix + "tossACoinToYourSDF") {
		let midnight = new Date();
		midnight.setHours(24,0,0,0); 
		let now = new Date();
		let msToMidnight = midnight - now;
		let couldown = msToMidnight;
		

		if (talkedRecently_coinsdf.has(message.author.id)) {
			message.channel.send("Vous avez déjà jeté un sous à votre SDF aujourd'hui " + emote_giga_gras + "\n attendez encore : **" + Math.round(((couldown / 1000) / 60) / 60) + " Heure(s)**.")

		} else {
			let member_ran;

			member_ran = message.guild.members.random();
			//console.log("member_ran : " + member_ran);

			if (member_ran.user.bot) {
				while(member_ran.user.bot) {
					member_ran = message.guild.members.random();
					//console.log("member_ran : " + member_ran);
					console.log("Retry -> BOT");
				//	message.channel.send("BOT")
				}
			}	
			// message.channel.send("USER trouvé");

			addOr(member_ran, 1);
			addOr(message.member, -1);
			message.channel.send("Vous avez jeté un sous à ce SDF de " + member_ran.displayName);
			talkedRecently_coinsdf.add(message.author.id);
			
			//message.channel.send("member_ran : " + member_ran);
			
			
		}

		setTimeout(() => {
			talkedRecently_coinsdf.delete(message.author.id);
		}, couldown); // le couldown sera égale au temps qu'il reste avant 00H (en ms).


	}



	//commande de dev pour voir le contenu du fichier user.
	if (message.content === prefix + "UserProfile") {

		let fileid = message.author.id;
		
		fs.readFile(`json/users_files/${fileid}.json`, function(error, file) {
	   				
			let usrprofile_json = JSON.parse(file);

			let up_class = usrprofile_json.class;
			let up_favpos = usrprofile_json.favpos;
			let up_hatepos = usrprofile_json.hatepos;
			let up_xp = usrprofile_json.xp;
			let up_xplevel = usrprofile_json.xplevel;
			let up_or = usrprofile_json.or;
			let up_date = usrprofile_json.date;
			let up_maxbanque = usrprofile_json.maxbanque;

			message.channel.send(`Profile \n Class : ${up_class} \n favpos : ${up_favpos} \n hatepos : ${up_hatepos} \n xp : ${up_xp} \n xplevel : ${up_xplevel} \n or : ${up_or} \n date : ${up_date} \n maxbank : ${up_maxbanque}`);

		});
	} 

	

	/*
	if (message.content.startsWith(prefix + "ChangeFavPos ")) {


		fs.writeFile(`json/users_files/${message.author.id}.json`, `
					{ 
						"or": ${or_a_retirer},
						"date": 0
					}`, function(err) {
						if(err) {
							return console.log(err);
						}
					});

	} 

	if (messsage.content === prefix + "ChangeHatePos") {

	} */


	












































	//Commandes admin :


	if (message.author.id === "421400262423347211" || message.author.id === "211911771433205760") {
		
		if (message.content.startsWith(prefix + "viewFactionBank ")) {
			let id = message.content.slice(prefix.length + 16);
	
			if (id == undefined) {
				message.channel.send("Error [1]");
				return;
			}
			//message.channel.send("DEBUG: ID: " + id);
			id = parseInt(id);
			if (viewFactionBank(id) != null) {
				message.channel.send("Or : " + viewFactionBank(id));
			} else {
				message.channel.send("Error [1] || Error [2]");
			}
		}

		

		if (message.content.startsWith(prefix + "setOr ")) {
			console.log("Message Original : " + message.content);

			let argsAddOr = message.content.slice(prefix.length + 6 + 23);

			console.log("Message slicé : " + argsAddOr);

			if (message.mentions.users.first() != undefined) {	
				if (argsAddOr > 0 || argsAddOr < 0) {
					let id_usr = message.mentions.users.first().id;

					let aut_usr = message.mentions.members.first();
					console.log("id_usr : " + id_usr);
					//let or = parseInt(argsAddOr, 10);
					let or = argsAddOr;
					console.log("OR : " + or);
					//getMaxBankSize(id_usr);
					addOr(aut_usr, or);	
					message.channel.send(`+${or} ${emote_or} ajouté(s) avec succès à ${message.mentions.users.first().username}`)
				} else {
					message.channel.send("ERROR [6]: Invalide Arguments");
					return;
				}
			} else {
				message.channel.send("ERROR [1]: Synthaxe Error");
				return;
			}
		}

		if (message.content.startsWith(prefix + "setXp ")) {
			console.log("Message Original : " + message.content);

			let argsAddXp = message.content.slice(prefix.length + 6 + 23);

			console.log("Message slicé : " + argsAddXp);

			if (message.mentions.users.first() != undefined) {
				if (argsAddXp > 0 || argsAddXp < 0) {
					message.channel.send("argsAddXP : " + argsAddXp)	
					let id_usr = message.mentions.users.first().id;
					console.log("id_usr : " + id_usr);
					//let or = parseInt(argsAddOr, 10);
					let xp = argsAddXp;
					xp = parseInt(xp);
					console.log("xp : " + xp);
					addXp(id_usr, xp);	
				} else {
					message.channel.send("ERROR [6]: Invalide Arguments");
					return;
				}
			} else {
				message.channel.send("ERROR [1]: Synthaxe Error");
				return;
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

                if (member.roles.find("name", "Esclave") || member.roles.find("name", "Paysan") || member.roles.find("name", "Bourgeois") || member.roles.find("name", "Courtisan")) {
                    // Si le membre est Esclave ou plus

                    // On le met dans une faction random
                    switch(fac) {
                        case 1:
                        message.channel.send(`<@${id_mention}> va dans : Epsilon`);
                        member.addRole('415947454626660366'); //ajoute Epsilon 
                        break;

                        case 2:
                        message.channel.send(`<@${id_mention}> va dans : Zêta`);
                        member.addRole('415947455582961686'); //ajoute Zeta 
                        break;

                        case 3:
                        message.channel.send(`<@${id_mention}> va dans : Gamma`);
                        member.addRole('415947456342130699'); //ajoute Gamma 
                        break;
                        
                        case 4:
                        message.channel.send(`<@${id_mention}> va dans : Oméga`);
                        member.addRole('665340021640921099'); //ajoute Omega 
                        break;
                    }
                    console.log("Commande exécutée. -> Admin Test Passé -> switch effectué");
                    message.delete();
                } else {
                        //message.channel.send("KICK");
                        member.kick();
                        message.channel.send(`<@${id_mention}> a été kick, nous n'acceptons pas les inactifs sur le serveur.`);
                        message.delete();
                }

                
            } else {
                message.channel.send("Cette commande est réservée aux Empereurs.");
                console.log("Commande exécutée. -> Admin Test Refusé");
            }
		}
		if (message.content.startsWith(prefix + "mkfile ")) {
			if (message.mentions.users.first() == undefined) {
				message.channel.send("ERROR [3]");
			} else {

				let id_usr = message.mentions.users.first().id;

				if (fs.existsSync('json/users_files/' + id_usr + '.json')) {
					message.channel.send("Le fichier de cet utilisateur existe déjà.");
					return;
				}
			
				fs.writeFile('json/users_files/' + id_usr + '.json', `
{
	"class" : "NONE",
	"favpos" : "NONE",
	"hatepos" : "NONE",
	"xp" : 0,
	"xplevel" : 1,
	"or": 0,
	"date": 0,
	"maxbanque": 5,
	"ptsveni": 0,
	"timerarene" : 0
}
				`, function(error) { 
					if (error) {
							console.log(error);
							return;
						}
					})
			}
		}
	} //Fin des commandes admin

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


		if (message.content.startsWith(prefix + "dit-moi tout wikimerde ")) {
			let argsDmT = message.content.slice(prefix.length + 23);

			if (argsDmT == undefined) {
				message.channel.send("Erreur -> Aucune recherche.");
				return;
			} else {
				//message.channel.send("argsDmT -> requête : " + argsDmT);
				let data = "";

			// Search here
			wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
	  			.page('chicken')
	  			.then(page => page.html())
	  			.then(data = console.log)

	  			message.channel.send("data " + data);
	 			//CHECK CA !
			}
		}

		if (message.content === prefix + "procGen") {
			message.channel.send("Load Procedure ...");
			message.channel.send("p<ping");
			console.log("CONS: Load procedure ...");

			let c1, c2, c3, c4, c5 = 0; 
			//	*
			// ***
			//	*

			c3 = entierAleatoire(0, 1) // 0 = void ; 1 = solid
			console.log("Value SEED c3 = " + c3);

			message.channel.send("VALUE : 0 : void | 1 : solid. \n\n SEED: " + c3);
			message.channel.send("Loaded Variables ! \n Initialization ... ")

			if (c3 == 0) {
				c1 = 1; 
				c5 = 1;
				c2 = 0;
				c4 = 0;

			} else if (c3 == 1) {

				c1 = 0;
				c5 = 0;
				c2 = 0;
				c4 = 1;

			}

			message.channel.send("Drawing ...");
			message.channel.send("." + c1 + "." + "\n " + c2 + c3 + c4 + "\n." + c5 + ".");
			message.channel.send("END.")
			
		}

		if (message.content === prefix + "testRan") {
			let array = new Uint8Array(1);
			getRandomValues(array);

			message.channel.send("array : " + array);

		}

		if (message.content === prefix + "asyncTEST") {
    	let m = await message.channel.send("Ouverture en cours ...");
    	setTimeout( function() {m.edit({embed: {
                    title: "TEST",
                    color: 11027200,
                    timestamp: new Date(),
                    footer: {
                        text: message.member.user.tag
                    },
                    fields: [
                        {
                            name: "TEST",
                            value: "TEST",
                        }
                    ], 
                    image: {
              url: 'https://i.imgur.com/wSTFkRM.png',
                }}})}, 10000);
    	
    	}

    	if (message.content.startsWith(prefix + "DEV addOr ")) {
    		let args = message.content.slice(prefix.length + 10);
    		console.log("before parse: " + args);
    		args = parseInt(args, 10); 
    		console.log("after parse: " + args);

    		addOr(message.author.id, args);
    	}

	} // fin des commandes de dev



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


/*message.channel.send({embed: {
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
		}});*/


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



	// Ancienne commande XP sur nous même !

	/*

	if (message.content === prefix + "xpOBS") { //permet de voir son xp (Obsolète, servait avant de commande pour voir son xp, à maintenant été remplacé pour une autre qui permet de voir son xp ET celle des autres.)
		let id_usr = message.author.id;

		if (fs.existsSync('json/xp/xp_' + id_usr + '.json')) { //si le fichier xp de l'utilisateur existe déjà
	    	fs.readFile('json/xp/xp_' + id_usr + '.json', function(erreur, fichier) {
			   	let json_xp = JSON.parse(fichier)
			   	let xp_level_up_required = getLvlUpReqXP(message.author.id);

			   	let embed_xp = new Discord.RichEmbed()
			   		.setColor([50, 200, 110])
            		.setAuthor("XP de " + message.author.username, message.author.displayAvatarURL)
            		.setDescription(`**XP : ${json_xp.xp}/${xp_level_up_required}\nLevel : ${json_xp.xplevel}**`);


            	message.channel.send(embed_xp);
				//message.channel.send(`XP de <@${id_usr}> : ${json_xp.xp}/${xp_level_up_required} | Level : ${json_xp.xplevel}`);
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
			   	let xp_level_up_required = getLvlUpReqXP(message.author.id);

			   	let embed_xp = new Discord.RichEmbed()
			   		.setColor([50, 200, 110])
            		.setAuthor("XP de " + message.author.username, message.author.displayAvatarURL)
            		.setDescription(`**XP : ${json_xp.xp}/${xp_level_up_required}\nLevel : ${json_xp.xplevel}**`);

            	message.channel.send(embed_xp);
				//message.channel.send(`XP de <@${id_usr}> : ${json_xp.xp}/${xp_level_up_required} | Level : ${json_xp.xplevel}`);
			})
				})

			

	
	//{
	//"xp" : 0,
	//"xplevel" : 1
	//}
	
		}
	}

	*/

	// l'ancienne commande admin SetXp
		/* if (message.content.startsWith(prefix + "setXpOBS ")) {
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
		} */


		/*
		if (message.content === prefix + "DEV -> UTIL -> IDLIST") {

			let usrs = message.guild.members.map(m=>m.user.id).join('\n');
	
			let usrsBOT = message.guild.roles.get('415953862457950209').members.map(m=>m.user.id).join('\n');
			
			message.channel.send("usrs : \n" + usrs);
			message.channel.send("usrsBOT : \n" + usrsBOT);
		}
		*/




		/* Ancien système de revenue :






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
		 		max_banque_perso = maxbanque_esclave;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253591465328660')) {
		 		or_a_add = 3;
		 		max_banque_perso = maxbanque_paysan;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253561648021514')) {
		 		or_a_add = 7;
		 		max_banque_perso = maxbanque_bourgeois;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253809640308746')) {
		 		or_a_add = 9;
		 		max_banque_perso = maxbanque_courtisan;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257669918588948')) {
		 		or_a_add = 12;
		 		max_banque_perso = maxbanque_baron;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650832087993024522')) {
		 		or_a_add = 17;
		 		max_banque_perso = maxbanque_compte;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257144011587594')) {
		 		or_a_add = 23;
		 		max_banque_perso = maxbanque_marquis;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','612469098466639893')) {
		 		or_a_add = 32;
		 		max_banque_perso = maxbanque_duc;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650828967716192269')) {
		 		or_a_add = 44;
		 		max_banque_perso = maxbanque_vassal;
		 	}

		 } else { //si AUTHOR n'est pas maitre
		 		//donner la thunas normale
		 	if (message.guild.members.get(message.author.id).roles.exists('id','445253268176633891')) {
		 		or_a_add = 1;
		 		max_banque_perso = maxbanque_esclave;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253591465328660')) {
		 		or_a_add = 2;
		 		max_banque_perso = maxbanque_paysan;
		 	}
		 	
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253561648021514')) {
		 		or_a_add = 5;
		 		max_banque_perso = maxbanque_bourgeois;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445253809640308746')) {
		 
		 		or_a_add = 6;
		 		max_banque_perso = maxbanque_courtisan;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257669918588948')) {
		 		or_a_add = 9;
		 		max_banque_perso = maxbanque_baron;
		 	
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650832087993024522')) {
		 		or_a_add = 11;
		 		max_banque_perso = maxbanque_compte;
		 	}
		 	
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','445257144011587594')) {
		 		or_a_add = 16;
		 		max_banque_perso = maxbanque_marquis;
		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','612469098466639893')) {
		 
		 		or_a_add = 25;
		 		max_banque_perso = maxbanque_duc;

		 	}
		 	else if (message.guild.members.get(message.author.id).roles.exists('id','650828967716192269')) {
		 		or_a_add = 35;
		 		max_banque_perso = maxbanque_vassal;
		 	
		 	}
		 }




		if (erreur) { // ca veut dire que l'utilisateur n'a pas de banque encore

		 	message.channel.send(":bank: **Banque perso créée.** :bank:");
		 	

		 	let embed_first_revenue = new Discord.RichEmbed()
					.setColor([255, 200, 0])
					.setAuthor("Revenue quotidien !", message.author.displayAvatarURL)
					.setDescription("**+" + or_a_add + "** " + emote_or + "\nVous avez actuellement **" + or_a_add + "/" + max_banque_perso + "** " + emote_or)

			 message.channel.send(embed_first_revenue);
			 
			 let fileid1 = message.author.id;

		fs.readFile(`json/users_files/${fileid1}.json`, function(error, file) {
	   				
			let usrprofile_json1 = JSON.parse(file);

			usrprofile_json1.or = or_add;
			usrprofile_json1.date = unix_time_now;
			usrprofile_json1.maxbanque = max_banque_perso;

			fs.writeFileSync(`json/users_files/${fileid1}.json`, JSON.stringify(usrprofile_json1, null, 2));
		});

			 	/*fs.writeFile("json/or/or_" + id_usr + ".json", `
				{ 
					"or": ` + or_a_add + `,
					"date": ` + unix_time_now + `,
					"maxbanque": ` + max_banque_perso + `
				}`, function(err) {

				    if(err) {
				        return console.log(err);
				    }

			    	console.log("The file was saved!");
				}); */ /*

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
		 	*/ /*



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
			message.channel.send(":hourglass: **| " + message.author.username + "**, il vous faut attendre **" + msToTime(timeLastInMS) + "** avant de pouvoir obtenir de nouveau votre revenue !"); /*Math.round((((timeLastB4Daily) / 60) / 24))*/ /*
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
						//ENVOIE DANS LE COFFRE DE Epsilon
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Epsilon." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					
					} else if (factionDe_Request == "Gamma") {
						//ENVOIE DANS LE COFFRE DE Gamma
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Gamma." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					
					} else if (factionDe_Request == "Zeta") {
						//ENVOIE DANS LE COFFRE DE Zêta
						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Zeta." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					
					} else if (factionDe_Request == "Omega") {
						//ENVOIE DANS LE COFFRE DE Oméga

						message.channel.send("Le surplus d'argent à été envoyé dans votre coffre de faction : +" + buffer_thunas + " or dans le coffre Omega." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					} else {
					message.channel.send("Le surplus d'argent à été rendu à PouleRPG : -" + buffer_thunas + " or." + " (Montez de niveau pour augmenter la capacité de votre banque.)")
					}
				}

		let fileid = message.author.id;

		fs.readFile(`json/users_files/${fileid}.json`, function(error, file) {
	   				
			let usrprofile_json = JSON.parse(file);

			usrprofile_json.or = or_add;
			usrprofile_json.date = unix_time_now;
			usrprofile_json.maxbanque = max_banque_perso;

			fs.writeFileSync(`json/users_files/${fileid}.json`, JSON.stringify(usrprofile_json, null, 2));
		});

			/*fs.writeFile("json/or/or_" + id_usr + ".json", `
			{ 
				"or": ` + or_add + `,
				"date": ` + unix_time_now + `,
				"maxbanque": ` + max_banque_perso + `
			}`, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    	console.log("The file was saved!");
				}); */ /*
				

			let embed_revenue = new Discord.RichEmbed()
					.setColor([255, 200, 0])
					.setAuthor("Revenue quotidien !", message.author.displayAvatarURL)
					.setDescription("**+" + or_a_add + "** " + emote_or + "\nVous avez actuellement **" + or_add + "/" + max_banque_perso + "** " + emote_or)

			 message.channel.send(embed_revenue);

			} else {
				
				//message.channel.send("ERROR"); //Message d'erreur
			}
		});
	} // FIN DAILY


		*/ 
	
/* // exemple d'utilisation du nouveau système de fichier
		if (message.content === prefix + "TryJson") {

			let fileid = message.author.id;
	
			fs.readFile(`json/users_files/${fileid}.json`, function(error, file) {
						   
				let usrprofile_json = JSON.parse(file);
	
				usrprofile_json.or = 666;
	
				fs.writeFileSync(`json/users_files/${fileid}.json`, JSON.stringify(usrprofile_json));
			});
		}
*/

// ID DE CHANNELS : 

	// Général Epsilon ID : 445289059892461578
	// Général Zêta ID    : 445289032419770378
	// Général Gamma ID   : 445289003156242434
	// Général Oméga ID   : 667858618342834216
