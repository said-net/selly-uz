const { Schema, model, Types: { ObjectId } } = require('mongoose');
const schema = new Schema({
    id: Number,
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    value: Number,
    created: Number
});
module.exports = model('Fill', schema);