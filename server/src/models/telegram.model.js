const { model, Schema, Types: { ObjectId } } = require('mongoose');
const schema = new Schema({
    telegram: String,
    user: {
        type: ObjectId,
        ref: 'User'
    },
    new: {
        type: Boolean,
        default: true
    },
    recontact: {
        type: Boolean,
        default: true
    },
    reject:{
        type: Boolean,
        default: true
    },
    archive:{
        type: Boolean,
        default: true
    },
    copy: {
        type: Boolean,
        default: true
    },
    success: {
        type: Boolean,
        default: true
    },
    sended: {
        type: Boolean,
        default: true
    },
    delivered: {
        type: Boolean,
        default: true
    }
});
module.exports = model('Telegram', schema);