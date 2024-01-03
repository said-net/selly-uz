const { Schema, model, Types: { ObjectId } } = require('mongoose');
const schema = new Schema({
    id: Number,
    created: Number,
    courier: {
        type: ObjectId,
        ref: 'User'
    },
    up_time: Number,
});
module.exports = model('Party', schema);