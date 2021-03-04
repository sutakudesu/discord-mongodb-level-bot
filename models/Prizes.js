const mongoose = require("mongoose");

const prizeSchema = mongoose.Schema({
    guildId: String,
    levelPrizes: { type: Array, default: [] },
});

module.exports = mongoose.model("Prizes", prizeSchema);