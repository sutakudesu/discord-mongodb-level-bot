const Discord = require("discord.js")
const Prizes = require("../models/Prizes.js");

exports.execute = async (client, message, args) => {
    let prizeData = await Prizes.findOne({ guildId: message.guild.id});
    let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setThumbnail(message.guild.iconURL({ dynamic: true }));

    if(!prizeData) {
         message.channel.send(embed.setDescription(`**${message.guild.name}** Adlı sunucunun level ödülleri listesi. \n\nVeri yok.`));
    } else {
        prizeData = prizeData.levelPrizes.filter(x => message.guild.roles.cache.has(x.role)).sort((x, y) => y.level - x.level).map(x => `<@&${x.role}> - **${x.level}**`).join("\n");
        message.channel.send(embed.setDescription(`**${message.guild.name}** Adlı sunucunun level ödülleri listesi. \n\n` + prizeData));
    };  
};

exports.conf = {
  command: "prizeList",
  description: "Ödül ekleme.", 
  aliases: ["ödül-liste"]
};