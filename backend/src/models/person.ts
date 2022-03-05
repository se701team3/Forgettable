const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    organisation: {
        required: true,
        type: String
    }
})

export default mongoose.model('Person', personSchema)