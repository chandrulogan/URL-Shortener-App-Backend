const mongoose = require('mongoose');


const signin = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
});

const signupModal = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})
const userModal = mongoose.model('userData', signin, signupModal);
module.exports = userModal;