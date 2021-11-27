module.exports.run = (client, message, args) => {

    // 0x1XXXXX -> Erreur en rapport avec le contenu de la BDD
    // 0x2XXXXX -> Erreur en rapport avec le dépassement de la taille d'un contenu
    
    message.channel.send(`
    **0x100001**
        **description** : Erreur fatale sur la faction de l'utilisateur. 
        **diagnostique** : La faction n'existe pas ou rencontre un problème. 
        **résolution** : Réessayez. Si le problème persiste contactez le développeur.

    **0x100002**  
        **description** : Erreur fatale sur la faction d'un utilisateur.
        **diagnostique** : L'utilisateur n'a pas d'identifiant de faction valide ou de fichier utilisateur.
        **résolution** : 
            -> Les bots ne peuvent pas avoir de faction ni de fichier utilisateur, essayez de mentionner un véritable utilisateur.
            -> S'il n'est pas un bot, l'utilisateur peut essayer d'envoyer un message pour se mettre à jour ou bien utiliser la commande \`auto-actualisation\`.
    
    **0x200001**  
        **description** : Erreur fatale sur l'array des reaction d'un event (jsonObject.reactions).
        **diagnostique** : Le bot ou l'utilisateur à tenté d'accéder à une donnée plus haute que l'array.
        **résolution** : Réessayez. Si le problème persiste contactez le développeur.
        
    **0x200002**  
        **description** : Erreur fatale sur l'array des commands d'un event (jsonObject.commands).
        **diagnostique** : Le bot ou l'utilisateur à tenté d'accéder à une donnée inexistante -> Réaction non assignée à une commande.
        **résolution** : Réessayez. Si le problème persiste contactez le développeur.   
    `);
}

module.exports.help = {
    name: "codes-erreur",
    aliases: ['errorcodes', 'errcodes'],
    category: "system",
    desription: "Liste tous les codes d'erreurs fatales ainsi que leurs possibles résolutions.",
    usage: '',
    cooldown: 3, 
    permissions: false,
    args: false,
};