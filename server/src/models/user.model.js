const { Schema, model } = require('mongoose');
const schema = new Schema({
    id: Number,
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    sms_code: String,
    sms_duration: Number,
    access: String,
    admin: {
        type: Boolean,
        default: false,
    },
    operator: {
        type: Boolean,
        default: false,
    },
    operator_freedom: {
        type: Boolean,
        default: false
    },
    courier: {
        type: Boolean,
        default: false,
    },
    region: Number,
    seller: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    },
    supplier: {
        type: Boolean,
        default: false
    },
    reg_time: Number
});
module.exports = model('User', schema);