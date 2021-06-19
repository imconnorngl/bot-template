const mongoose = require('mongoose');
const database = require('../connection')

const modelSchema = new mongoose.Schema({
    id: { type: Number, required: true }
})

const model = database.model('model', modelSchema)
module.exports = model;