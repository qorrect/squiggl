class PrettyPrinter {
    static print(models) {
        models.forEach(model => console.log(JSON.stringify(model,null,4)));
    }
}

module.exports = PrettyPrinter;