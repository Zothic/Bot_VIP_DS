const {Client}= require('discord.js');
const client = new Client();
const prefix = "!";
const {connect} = require('mongoose');

(async () => {
    await connect('mongodb+srv://root:6CDflaqdrV6Qi3eE@cluster0-64pbj.azure.mongodb.net/deathsyndrom', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, (err) => {
        if (!err) {
            console.log('MongoDB Connection Succeeded.')
        } else {
            console.log('Error in DB connection: ' + err)
        }
    });
    return client.login('NjgxNzk0ODM4ODc4MDkzMzIw.Xlafog.7OrFQT-YdoVA8w1KM1ZzFwprGsA');
})();

const Items = require("./models/items.js");

client.on("ready", () => console.info('Connecte avec le bot : '+ client.user.tag ));
client.on("message", message => {
    var mess = message.content.toLowerCase();
    if(mess.includes("tom")) return message.reply('Quel enculé celui la ...');
});
client.on("message", async (message) => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(message.content === "!hi") return message.reply('Salut Nigga !');
    else if(message.content.includes("fdp")) return message.reply('Attention à ton vocabulaire Voltaire !');
    else if(command.includes("add")){
        const items = new Items({
            //_id: message.id,
            Proprietaire: message.author.username,
            Nom: args[0].toLowerCase(),
            Possession: null
        });
        await items.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));
        message.reply("```"+ args[0].toLowerCase() +" a ete save dans la bdd```");
    }
    else if(message.content.includes("!list"))
    {
        var liste = [];
        var req = await Items.find({});
        req.forEach(item => {liste.push(item.Nom+" ===> "+ item.Proprietaire);});
        if(liste.length > 0){
            message.channel.send("Liste des items : \n Item ===> Propriétaire");
            return message.channel.send("```" + liste.join("\n") + "```");
        }
        else return message.channel.send("Banque Vide !");
    }
    else if(command.includes('take')) {
        var query = { Nom: args[0].toLowerCase(), Possession: null };
        var search = await Items.findOne(query);
        if(search.Possession != null) return message.reply("L'item est deja prit par : " + search.Possession+"");
        else {
            var modify = await Items.updateOne(search, {$set: {Possession: message.author.username}});
            return message.channel.send("```"+message.author.username + " a prit l'item : " + args[0].toLowerCase()+"```");
        }
    }
    else if(message.content === "!back all") {
        var result = [];
        var query = {Possession: message.author.username};
        var search = await Items.find(query);
        search.forEach(item => {
            result.push(item.Nom.toLowerCase());
        });
        var modify = await Items.updateMany(query, {$set: {Possession: null}});
        if(result.length > 0) return message.channel.send("```"+ message.author.username + " a rendu les items : \n" + result.join('\n') + "```" );
        else return message.channel.send("``` Tu as aucuns items à rendre dude ! ```" );
    }
    else if(command.includes('back')) {
        var query = { Nom: args[0].toLowerCase(), Possession: message.author.username};
        var search = await Items.findOne(query);
        if(search.Possession != message.author.username) return message.reply("Tu essaye de rendre un item que t'as pas. 7mar !");
        else {
            var modify = await Items.updateOne(query, {$set: {Possession: null}});
            return message.reply("```"+message.author.username + " a rendu l'item : " + args[0].toLowerCase()+"```");
        }
    }
    else if(command.includes('item')) {
        var liste = [];
        var req = await Items.find({ Nom: args[0].toLowerCase()});
        req.forEach(item => {
            if(item.Possession != null) liste.push(item.Nom.toLowerCase() + " est emprunté par : " + item.Possession);
            else liste.push(item.Nom.toLowerCase() + ' est dispo dans le coffre de la maison !');
        });
        return message.channel.send("```" + liste.join('\n') + "```" );
        //if(req.Possession != null) message.reply("```" + args[0].toLowerCase() + " est emprunté par : " + req.Possession + "```");
        //else message.reply("```" + args[0].toLowerCase() + ' est dispo dans le coffre de la maison !```');
    }
    else if(message.content === "!help")
    {
        return message.channel.send("Liste des commandes : \n **!hi** : Dit Bonjour, la politesse avant tout !\n **!add** {item} : Ajoute l'item voulu dans la banque des stuffs. \n "+
        "**!take** {item} : Signaler que je prends l'item voulu. \n **!back** {item} : Signaler que je rends l'item voulu. \n **!list** : Affiche tous les items." + 
        "\n **!item** {item} : Permet de savoir qui possède l'item. \n **!remove** : Permet d'enlever un item qui m'appartiens de la banque. (En cours)");
    }
    else if(command.includes('remove'))
    {
        //todo await Items.deleteOne() ....
    }
    else return message.reply("Tu t'es trompé enculé !");
});

