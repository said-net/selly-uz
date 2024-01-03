const { Types: { ObjectId }, Schema, model } = require('mongoose');
const schema = new Schema({
    id: Number,
    user: {
        type: ObjectId,
        ref: 'User'
    },
    value: Number,
    type: String,//supplier, seller, operator
    created: Number,
    card: String,
    status: {
        type: String,
        default: 'pending'//reject, pending, success
    }
})
module.exports = model('Payment', schema)