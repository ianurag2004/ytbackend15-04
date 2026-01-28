const User = require("../models/User.model");

// controller to create user

const createUser = async(req, res) => {
    try{
       const {username, email} = req.body;

       // create new user

       const newUser = new User({
        username, email
       })

       // save user

       await newUser.save()

       return res.status(201).json({message : "User created", user: newUser})
       
    }catch(err){
        console.log("err", err.message)
    }
}




module.exports = {createUser}