const Discord = require("discord.js")
const Prizes = require("../models/Prizes.js");

exports.execute = async (client, message, args) => {
    let level = args[0]
    let prizeData = await Prizes.findOne({ guildId: message.guild.id});
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }));
  
    if(!level || isNaN(level) || level < 0) return message.channel.send(embed.setDescription(`Ödül eklenecek geçerli bir **seviye** belirtmelisin!`));
    if(!role) return message.channel.send(embed.setDescription(`**${level}** Seviyesine ödül olarak eklenicek geçerli **rol ve rol id** belirtmelisin!`));
    
    if(!prizeData) {
        let newPrize = new Prizes({
            guildId: message.guild.id,
            levelPrizes: [{ level: level, role: role.id}]
        }).save();
    } else {
        if(prizeData.levelPrizes.find(x => x.level == level && x.role == role.id)) {
            message.channel.send(embed.setDescription(`**${level}** Seviyesinin ödülleri arasında ${role} zaten bulunmakta!`));
        } else {
            prizeData.levelPrizes.push({ level: level, role: role.id});
            prizeData.save();
            message.channel.send(embed.setDescription(`Başarıyla **${level}** seviyesinin ödülleri arasına ${role} eklendi.`));
        };
    };  
};

exports.conf = {
  command: "prizeAdd",
  description: "Ödül ekleme.", 
  aliases: ["ödül-ekle"]
};