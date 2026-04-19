const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, 
                required: true, 
                unique: [true, "Username already Taken"] 
            },
    email: { type: String,
            unique:[ true, "Acount already exist"],
            required: true },

    password: { type: String, 
                required: true },
});

//creating user named collection in database using the userSchema
const userModal = mongoose.model('Users', userSchema);

module.exports = userModal;