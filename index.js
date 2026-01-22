const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

// user router

const userRouter = require("./routes/user.routes")
const channelRouter = require("./routes/channel.route")

const port = process.env.PORT || 4000

const app = express();

// parsing

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("DB is connected")
}).catch((err) => console.log("err", err.message))

// endpoints

app.use("/api", userRouter)

app.use("/api/channel", channelRouter)

app.listen(port, () => {
    console.log("server is running on port " + port)
})

//.  http://localhost:4000/api/create-user


