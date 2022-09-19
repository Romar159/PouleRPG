module.exports = client => {

    var animal = function(nom, age) {
        this.nom = nom;
        this.age = age;
        this.getAge = function() {
            return this.age;
        }
    }
    

}