module.exports.run = async (client, message, args) => {
    
    if(!message.mentions.users.first()) return message.reply("ERROR, mention invalide.");
    if(isNaN(args[1])) return message.reply("ERROR, valeur invalide.");

    var player1 = message.member;
    var player2 = message.guild.member(message.mentions.users.first());

    var bdd_player1 = await client.getUser(player1);
    var bdd_player2 = await client.getUser(player2);

    var or_pari = args[1];

    var jeu_fini = false;
    var j1_win, j2_win = false;

    var a_p1_de_jouer = true;
    var a_p2_de_jouer = false;

    var board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if(or_pari > bdd_player1.or || or_pari > bdd_player2.or) return message.reply("ERROR, vous ou votre adversaire n'avez pas assez d'argent.");
    if(or_pari <= 0) return message.reply("ERROR, valeur invalide.");

    message.channel.send(`${player2}, ${player1} vous a défié ! (envoyez "accepter" pour jouer !)`);
    const filter = m => (player2.user.id === m.author.id);
        const userEntry = await message.channel.awaitMessages(filter, {
            max:1, time:10000, errors: ['time']
        });
    
    if(userEntry.first().content.toLowerCase() === "accepter") {

        let message_jeu = message.channel.send(`1 2 3\n4 5 6\n7 8 9`);

        while(jeu_fini == false) {


            if(a_p1_de_jouer == true) {
                message.channel.send("Joueur 1, choisissez une case !");
                let filterP1 = m => (player1.user.id === m.author.id);
                let userEntryp1 = await message.channel.awaitMessages(filter, {
                    max:1, time:20000, errors: ['time']
                });
    
                     if(userEntryp1 == 1) board[0] == "X";
                else if(userEntryp1 == 2) board[1] == "X";
                else if(userEntryp1 == 3) board[2] == "X";
                else if(userEntryp1 == 4) board[3] == "X";
                else if(userEntryp1 == 5) board[4] == "X";
                else if(userEntryp1 == 6) board[5] == "X";
                else if(userEntryp1 == 7) board[6] == "X";
                else if(userEntryp1 == 8) board[7] == "X";
                else if(userEntryp1 == 9) board[8] == "X";

                a_p1_de_jouer = false;
                a_p2_de_jouer = true;
            }
            else if(a_p2_de_jouer == true) {
                message.channel.send("Joueur 2, choisissez une case !");

                let filterP2 = m => (player2.user.id === m.author.id);
                let userEntryp2 = await message.channel.awaitMessages(filter, {
                    max:1, time:20000, errors: ['time']
                });
    
                     if(userEntryp2 == 1) board[0] == "O";
                else if(userEntryp2 == 2) board[1] == "O";
                else if(userEntryp2 == 3) board[2] == "O";
                else if(userEntryp2 == 4) board[3] == "O";
                else if(userEntryp2 == 5) board[4] == "O";
                else if(userEntryp2 == 6) board[5] == "O";
                else if(userEntryp2 == 7) board[6] == "O";
                else if(userEntryp2 == 8) board[7] == "O";
                else if(userEntryp2 == 9) board[8] == "O";

                a_p1_de_jouer = true;
                a_p2_de_jouer = false;
            }

            message.channel.send(`${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n ${board[6]} ${board[7]} ${board[8]}`)
            
            if(board[0] == 'X' && board[1] == 'X' && board[2] == 'X') j1_win = true;
            if(board[3] == 'X' && board[4] == 'X' && board[5] == 'X') j1_win = true;
            if(board[6] == 'X' && board[7] == 'X' && board[8] == 'X') j1_win = true;

            if(board[0] == 'X' && board[3] == 'X' && board[6] == 'X') j1_win = true;
            if(board[1] == 'X' && board[4] == 'X' && board[7] == 'X') j1_win = true;
            if(board[2] == 'X' && board[5] == 'X' && board[8] == 'X') j1_win = true;

            if(board[0] == 'X' && board[4] == 'X' && board[8] == 'X') j1_win = true;
            if(board[2] == 'X' && board[4] == 'X' && board[7] == 'X') j1_win = true;


            if(board[0] == 'O' && board[1] == 'O' && board[2] == 'O') j2_win = true;
            if(board[3] == 'O' && board[4] == 'O' && board[5] == 'O') j2_win = true;
            if(board[6] == 'O' && board[7] == 'O' && board[8] == 'O') j2_win = true;

            if(board[0] == '0' && board[3] == 'O' && board[6] == 'O') j2_win = true;
            if(board[1] == '0' && board[4] == 'O' && board[7] == 'O') j2_win = true;
            if(board[2] == '0' && board[5] == 'O' && board[8] == 'O') j2_win = true;
        
            if(board[0] == 'O' && board[4] == 'O' && board[8] == 'O') j2_win = true;
            if(board[2] == 'O' && board[4] == 'O' && board[7] == 'O') j2_win = true;


            if(j1_win == true) {
                await client.setOr(client, player1, or_pari, message);
                await client.setOr(client, player2, -or_pari, message);

                return message.channel.send(`${player1} gagne, et récupère donc ${or_pari} or :coin: à ${player2}.`);
            } else if(j2_win == true) {
                await client.setOr(client, player2, or_pari, message);
                await client.setOr(client, player1, -or_pari, message);

                return message.channel.send(`${player2} gagne, et récupère donc ${or_pari} or :coin: à ${player1}.`);
            }
            /*
            0 1 2
            3 4 5
            6 7 8
            */
        }
    }
}

module.exports.help = {
    name: "morpion",
    aliases: ['ttt', 'tictactoe'],
    category: "entertainment",
    desription: "Défiez un adversaire au TicTacToe, et pariez de l'or !",
    usage: '<@USER> <or>',
    cooldown: 5, 
    permissions: true,
    args: true,
};