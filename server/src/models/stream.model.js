const {Schema, Types: {ObjectId}, model, models} = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    product:{
        type: ObjectId,
        ref: 'Product'
    },
    seller: {
        type: ObjectId,
        ref: 'User'
    },
    additional: {
        type: Number,
        default: 0
    },
    created: Number,
    active: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    }
});
module.exports = model('Stream', schema);