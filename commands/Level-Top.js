const Discord = require("discord.js");
const Levels = require("../models/Levels.js");

exports.execute = async (client, message, args) => {
    let levelData = await Levels.find({ guildId: message.guild.id }).sort({ totalXp: -1 }).exec();  
    levelData = levelData.filter(x => message.guild.members.cache.has(x.userId)).slice(0, 25).map((x, i) => `\`${i+1}.\` <@${x.userId}> : **${x.level}** Level - **${numberFormat(x.totalXp)}** Xp - (\`${numberFormat(x.xp)}/${numberFormat(x.xpToLevel)}\`)`).join("\n");
    
    if(!levelData.length) levelData = `Veri yok.`;
    let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setThumbnail(message.guild.iconURL({ dynamic: true }));
    embed.setDescription(`**${message.guild.name}** Adlı sunucunun level istatistikleri. \n\n` + levelData)
    message.channel.send(embed);            
};

exports.conf = {
  command: "level-top",
  description: "",
  aliases: ["leveltop"]
};

function numberFormat(num) {
    let numberFormats = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    let i;  
    for (i = numberFormats.length - 1; i > 0; i--) {
        if (num >= numberFormats[i].value) break;
    };
    return (num / numberFormats[i].value).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + numberFormats[i].symbol;
};