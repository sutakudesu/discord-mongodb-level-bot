const Discord = require("discord.js")
const Levels = require("../models/Levels.js");

exports.execute = async (client, message, args) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let levelData = await Levels.findOne({ guildId: message.guild.id, userId: user.id });
  
    let rank = await Levels.find({ guildId: message.guild.id }).sort({ totalXp: -1 }).exec();
    rank = rank.filter(x => message.guild.members.cache.has(x.userId)).findIndex(x => x.userId == user.id) + 1;

    let embed = new Discord.MessageEmbed().setAuthor(user.username, user.avatarURL({ dynamic: true })).setDescription(`Seviye: \`${levelData ? levelData.level : 1}\` \nToplam Tecrübe Puanı: \`${numberFormat(levelData ? levelData.totalXp : 0)}\` \nTecrübe Puanı: \`${levelData ? levelData.xp : 0}/${levelData ? levelData.xpToLevel : 123}\` \nRütbe: \`${rank}/${message.guild.memberCount}\``)
    message.channel.send(embed);
};

exports.conf = {
  command: "rank",
  description: "Seviye komutu.", 
  aliases: ["level", "xp"]
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