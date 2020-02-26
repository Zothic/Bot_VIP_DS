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
    return client.login('NjgyMzIwNTI1NzgzMjAzODk1.XlbUlw.cAgoWkfqPAkVfoYI54HmExFkuco');
})();

const Items = require("./models/items.js");

client.on("ready", () => console.info('Connecte avec le bot : '+ client.user.tag ));
client.on("message", async (message) => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(message.content === "!hi") return message.reply('Salut Nigga !');
    else if(command.includes("add")){
        const items = new Items({
            _id: message.id,
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
            message.channel.send("Liste des items : \n");
            return message.channel.send("```" + liste.join("\n") + "```");
        }
        else return message.channel.send("Banque Vide !");
    }
    else if(command.includes('take')) {
        var search = await Items.findOne({ Nom: args[0].toLowerCase()});
        //var req = await Items.findOneAndUpdate({Nom: args[0]}, {$set: {Possession: message.author.username}}, {new: true});
        if(search.Possession != null) return message.reply("L'item est deja prit par : " + search.Possession+"");
        else {
            var modify = await Items.updateOne({Nom: args[0].toLowerCase()}, {$set: {Possession: message.author.username}});
            return message.reply("```"+message.author.username + " a prit l'item : " + args[0].toLowerCase()+"```");
        }
    }
    else if(command.includes('back')) {
        var search = await Items.findOne({ Nom: args[0].toLowerCase()});
        if(search.Possession === message.author.username) {
            var modify = await Items.updateOne({Nom: args[0].toLowerCase()}, {$set: {Possession: null}});
            return message.reply("```"+message.author.username + " a rendu l'item : " + args[0].toLowerCase()+"```");
        }
        else return message.reply("Tu essaye de rendre un item que t'as pas. 7mar !");
    }
    else if(command.includes('item')) {
        var req = await Items.findOne({ Nom: args[0].toLowerCase()});
        if(req.Possession != null) return message.reply("```" + args[0].toLowerCase() + " est emprunté par : " + req.Possession + "```");
        else return message.reply("```" + args[0].toLowerCase() + ' est dispo dans le coffre de la maison !```');
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

