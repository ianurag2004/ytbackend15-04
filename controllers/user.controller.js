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

// function to get users

const getUsers = async(req, res) => {
    try{
       // Pagination

       const page = parseInt(req.query.page);
       const limit = parseInt(req.query.limit);

       const skip = (page - 1) * limit;

       // pipeline

       const data = await User.aggregate([
        // stage 1
        {
         $skip : skip
        },
        {
          $limit : limit
        }
       ])

    }catch(err){
      console.log("err", err)
    }
}



module.exports = {createUser, getUsers}