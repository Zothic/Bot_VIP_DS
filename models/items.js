const mongoose = require('mongoose');

const ItemsSchema = mongoose.Schema({
    //_id: String,
    Nom: String,
    Proprietaire:String,
    Possession: {
        defaut: null,
        type: String
    }
});

module.exports = mongoose.model("items", ItemsSchema);
