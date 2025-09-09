const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        emailid:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;