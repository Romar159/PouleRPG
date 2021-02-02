const { Message } = require("discord.js");

function randomInt(message, min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min)
}


module.exports = {
    randomInt
}