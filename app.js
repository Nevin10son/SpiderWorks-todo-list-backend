const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("./models/User");
const todoModel = require("./models/Todo")

dotenv.config();

let app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.post("/create",async(req,res) =>{
    let input = req.body
    console.log(input)
    let token = req.headers.token
    jwt.verify(token,"userToken",async(error,decoded)=>{
        if(decoded && decoded.emailid) {
            let result = new todoModel(input)
            await result.save()
            res.json(result);
            res.json({"status":"Success"})
        }else {
            res.json({"Status":"Invalid Authentication"})
        }
    })
})

app.post("/viewtodo",(req,res) =>{
    let input = req.body
    console.log(input)
    let token = req.headers.token
    jwt.verify(token,"userToken",(error, decoded) => {
        if(decoded && decoded.emailid) {
                todoModel.find(input).then(
                    (items) => {
                        res.json(items)
                    }
                ).catch(
                    (error) => {
                        res.json({"Status":"Error",error})
                    }
                )
        } else {
            res.json({"Status":"Invalid Authentication"})
        }       
        }
    )
    })

app.put("/edit/:id", async (req, res) => {
  let input = req.body;
  let token = req.headers.token;
  jwt.verify(token, "userToken", async (error, decoded) => {
    if (decoded && decoded.emailid) {
      try {
        let updatedTodo = await todoModel.findByIdAndUpdate(
          req.params.id,
          input,
          { new: true } 
        );
        if (!updatedTodo) {
          return res.json({ Status: "Todo not found" });
        }
        res.json({ Status: "Success", data: updatedTodo });
      } catch (error) {
        console.log("Error updating todo:", error);
        res.json({ Status: "Error", Message: "Database update failed" });
      }
    } else {
      res.json({ Status: "Invalid Authentication" });
    }
  });
});

app.delete("/delete/:id", async (req, res) => {

  let todoId = req.params.id;
  let token = req.headers.token;
  jwt.verify(token, "userToken", async (error, decoded) => {
    if (decoded && decoded.emailid) {
      try {
        let deletedTodo = await todoModel.findByIdAndDelete(todoId);
        if (!deletedTodo) {
          return res.json({ Status: "Todo not found" });
        }
        res.json({ Status: "Success", Message: "Todo deleted successfully" });
      } catch (err) {
        console.error("Error deleting todo:", err);
        res.json({ Status: "Error", Message: "Database delete failed" });
      }
    } else {
      res.json({ Status: "Invalid Authentication" });
    }
  });
});

app.put("/status/:id", async (req, res) => {

  let todoId = req.params.id;
  let token = req.headers.token;
  jwt.verify(token, "userToken", async (error, decoded) => {
    if (decoded && decoded.emailid) {
      try {
        let todo = await todoModel.findById(todoId);
        if (!todo) {
          return res.json({ Status: "Todo not found" });
        }
        todo.status = todo.status === "Pending" ? "Completed" : "Pending";
        await todo.save();

        res.json({ Status: "Success", data: todo });
      } catch (err) {
        console.log("Error toggling status:", err);
        res.json({ Status: "Error", Message: "Database update failed" });
      }
    } else {
      res.json({ Status: "Invalid Authentication" });
    }
  });
});

app.post("/login", (req, res) => {
    console.log(req.body)
     userModel.find({emailid:req.body.emailid}).then(
        (details) => {
            
            if (details.length > 0) {
                let comparepassword = bcrypt.compareSync(req.body.password, details[0].password);
                if (comparepassword){
                jwt.sign({emailid:req.body.emailid},"userToken",{expiresIn:"1d"},
                    (error,token) => {
                        if (error){
                            res.json({"Status":"error","Error":error});
                        }
                        else{
                            res.json({"Status":"Success","Token":token,"UserId":details[0]._id})
                        }
                    }
                )
                }
                else {
                    res.json({"Status":"Invalid password" })
                } 
            } else {
                res.json({"Status":"Invalid Emailid"});
            }
        }
    )
})

app.post("/signUp",(req, res)=> {
    let data = req.body;
    console.log(data)
    let hashedpwd = bcrypt.hashSync(req.body.password,10);
    req.body.password = hashedpwd;
    
    userModel.find({emailid:req.body.emailid}).then(
        (userdata)=> {
            if (userdata.length > 0)
            res.json({"Status":"This email is currently in use"});

            else {
                let item = new userModel(data);
                item.save();
                res.json({"Status":"Success"})
            }
        }
    ).catch((error) => {
        console.log('Error saving the user', error);
         res.json({ Status: "Error", Message: "Database save failed" })
    }
    )  
})

app.listen(8000, ()=> {
    console.log("Server started");
})