const Discord = require("discord.js")
const Prizes = require("../models/Prizes.js");

exports.execute = async (client, message, args) => {
    let level = args[0]
    let prizeData = await Prizes.findOne({ guildId: message.guild.id});
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || args[1];
    let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }));

    if(!level || isNaN(level) || level < 0) return message.channel.send(embed.setDescription(`Ödül kaldırılacak geçerli bir **seviye** belirtmelisin!`));
    if(!role) return message.channel.send(embed.setDescription(`**${level}** Seviyesinin ödülleri arasından kaldırılacak geçerli **rol ve rol id** belirtmelisin!`));
    
    if(!prizeData) {
        let newPrize = new Prizes({
            guildId: message.guild.id,
        }).save().then(data => { 
            return message.channel.send(embed.setDescription(`**${level}** Seviyesinin ödülleri arasında ${role} bulunamadı!`));
        });
    } else {
        if(prizeData.levelPrizes.find(x => x.level == level && x.role == (role.id || role))) {
            prizeData.levelPrizes = prizeData.levelPrizes.filter(x => x.role != (role.id || role));
            prizeData.save();
            message.channel.send(embed.setDescription(`Başarıyla **${level}** seviyesinin ödülleri arasından ${role} kaldırıldı.`));
        } else {
            return message.channel.send(embed.setDescription(`**${level}** Seviyesinin ödülleri arasında ${role} bulunamadı!`));
        };
    };  
};

exports.conf = {
  command: "prizeRemove",
  description: "Ödül kaldırma.", 
  aliases: ["ödül-kaldır"]
};