const mongoose = require("mongoose")
let todoSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        title:{
            type: String,
            required: true
        },
        description: {
            type: String,
            required:true
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"], 
            default: "Pending"
    },
        DatePosted:{
            type:Date,
            default:Date.now

        }
    }
)
const todoModel = mongoose.model("todos",todoSchema);
module.exports= todoModel;