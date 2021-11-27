module.exports.run = (client, message) => {
        
        const personne = [`Un PD`, `Chintok`, `La mémé de la Rochelle`, `Medyl`, `Léa`, `Zineb`, `Chloé`, `Donald Trump`, `Une tortue de mer`, `Un poulet`, `Romar1`, `Noxali`, `Zheo`, `DraxyCUL`, `La Vénitienne`, `PouleRPG`, `Dieu Poulet`, `Jérémerde`, `Zêta`, `Le Maître Lyomah`, `Le frère con`, `Hitler`, `Une enfant`, `Un psychopathe`, `Un entraineur`, `Un juge`, `Le procureur`, `Ch'veux verts`, `Bordel`, `Princesseuh`, `DarkDavy`, `Damben`, `Dark`, `Darky`, `BanjoBoi`, `KriixMerde`, `TetreMerde`, `Tatsumakmerde`, /*`Romar la pute de luxe`,*/ `Epsilon`, `Un pokémon`, /*`Des animaux de la ferme`,*/ `Un chat`, `Un chien`, `Un rongeur`, `Une souris`, `Un animal`, `Emmanuel Macron`, `Kim Jong-Un`, `Un dictateur`, `Gigi`, `Un bon gros fils de pute`, `Dio`, `Jojo`, 'Vinciane Giordani']; //personnage
		const action   = [`imagine ses morts à`, `meurt devant`, `mange`, `vend`, `détruit`, `fait disparaître`, `lance`, `consomme`, `découpe lentement`, `donne`, `rage à cause (d')`, `pénètre`, `regarde`, `écoute`, `juge`, `se procure`, `fait un rite satanique avec`, `s'entraine avec`, `poste`, `chante avec`, `théorise sur`, `réfléchit à ne pas cheat avec`, `envoie un cookie à`, `prie`, `meurt à cause (d')`, `fait chier`, `hack les logs (d')`, `claque`, `rit de (d')`, `fait apparaître`, `dors grâce à`, `boit`, `fait la lessive pour`, `fait à manger à`, /*`fait le ménage pour`,*/ `insulte`/*, `crie`*/, 'viole']; //action
		const objet    = [`une pomme`, `un radiateur`, `une ampoule`, `une vitre`, `du poulet`, `des grilles pain`, `un nouveau né`, `des points vénitienne`, `la loi paragraphe 4, sous-tiret 2, alinéa 1`, `la boite de jeu de "Link faces to evil"`, `les recettes de cuisine de Noxali`, `des funérailles`, `un banc de messe`, `une porte d'église`, `un bénitier`, `des produits illicites`, `un cercueil`,`un enfant`, `la musique`, `un hentai`, `un mouton`, `un boeuf`, `un mandat`, `un ralentisseur de type "dos d'âne"`, `la loi paragraphe 4, sous-tiret 3, alinéa 1`, `une porte`, `un fruit`, `un juif`, `une boîte en carton`, `une voiture`, `un panneau`, `un tableau`, `une craie`, `un feutre`, `un crayon de couleur`, `une contravention`]; //objet1
		const conjCoord= [`avec`]; //conjonction
        const objet2   = [`un couteau`, `de la confiture`, `un frigo`, `du rhum`, `de l'alcool`, `la daronne de Draxy`, `un verre`, `Zheo`, `le curé`, `des enfants`, `un cheval`, `un veau`]; //objet2
		const lieu     = [`dans son salon`, `dans la cuisine du voisin`, `sur l'Empire Du Poulet`, `dans une église`, `dans la cave`, `dans un laboratoire`, `dans une maison close`, `dans la chambre de Zheo`, `dans un cimetière`, `à un mariage`, `dans la cathédrale Dieu Poulet`, `à Auschwitz`, 'en Chine']; //lieu
		//const temps    = [`à 23h30`, `le lundi matin`, `avant son travail`, `après le déjeuner`, `à minuit`, `à l'heure de la sieste`, `au goûter`, `pendant sa douche`, `à l'heure de manger`, `pendant le repas`, `à la Repä`, `pendant le Goc International`, `à l'ouverture des jeux olympiques`, `pendant la 3ème guerre mondiale`, `au claire de lune`, `au moment où l'astre stellaire n'est plus visible que de moitié`]; //temps

        const personne_ran = client.randomInt(0, personne.length);
        const action_ran = client.randomInt(0, action.length);
        const objet_ran = client.randomInt(0, objet.length);
        const conjCoord_ran = 0
        const objet2_ran = client.randomInt(0, objet2.length);
        const lieu_ran = client.randomInt(0, lieu.length);
        //const temps_ran = randomInt(0, temps.length);

        message.channel.send(`${personne[personne_ran]} ${action[action_ran]} ${objet[objet_ran]} ${conjCoord[conjCoord_ran]} ${objet2[objet2_ran]} ${lieu[lieu_ran]}`);
}

module.exports.help = {
    name: "phrase",
    aliases: [],
    category: "entertainment",
    desription: "Génère une phrase 'drôle' aléatoirement.",
    usage: "",
    cooldown: 1,
    permissions: false,
    args: false
};