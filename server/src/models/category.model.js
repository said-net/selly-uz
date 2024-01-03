const { Schema, model } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    image: String,
    color: String,
    created: Number,
    active: {
        type: Boolean,
        default: true
    }
});
module.exports = model('Category', schema);