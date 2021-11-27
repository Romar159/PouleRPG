module.exports = client => {
    client.randomInt = (min, max) => {
        return Math.floor((Math.random() * (max - min + 1)) + min)
    }

    client.randomFloat = (min, max) => {
        return Math.random() * (min - max) + max;        
    };
}
