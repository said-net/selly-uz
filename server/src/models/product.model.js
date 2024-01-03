const { Schema, model, Types: { ObjectId } } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    about: String,
    images: Array,
    main_image: Number,
    video: String,
    price: Number,
    for_seller: Number,
    for_supplier: Number,
    for_operator: Number,
    comission: Number,
    delivery_price: {
        type: Number,
        default: 35000
    },
    category:{
        type: ObjectId,
        ref: 'Category'
    },
    active: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    supplier: {
        type: ObjectId,
        ref: 'User'
    },
    created: Number,
    views: {
        type: Number,
        default: 0
    }
});
module.exports = model('Product', schema);