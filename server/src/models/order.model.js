const { Schema, model, Types: { ObjectId } } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    name: String,
    phone: String,
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    comment: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 1
    },
    price: Number,
    // 
    for_seller: Number,
    seller: {
        type: ObjectId,
        ref: 'User'
    },
    // 
    for_supplier: Number,
    supplier: {
        type: ObjectId,
        ref: 'User'
    },
    for_operator: Number,
    operator: {
        type: ObjectId,
        ref: 'User'
    },
    operator_verified: {
        type: Boolean,
        default: false
    },
    // 
    courier: {
        type: ObjectId,
        ref: 'User'
    },
    delivery_price: Number,
    courier_status: {
        type: String,
        default: 'sended'//recontact, sended, delivered, reject
    },
    // 
    status: {
        type: String,
        default: 'new'//reject, archive, copy, recontact, success, sended, delivered
    },
    verified: {
        type: Boolean,
        default: false
    },
    // 
    party: {
        type: ObjectId,
        ref: 'Party'
    },
    // 
    created: {
        type: Number,
        default: 0
    },
    up_time: Number,
    day: Number,
    month: Number,
    week: Number,
    year: Number,
    comission: Number,
    stream: {
        type: ObjectId,
        ref: 'Stream'
    },
    region: Number,
    city: String,
});
module.exports = model('Order', schema)