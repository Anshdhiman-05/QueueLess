const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Token = require("./models/Token")
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});



app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.json({ message: "User already exists" });
  }

  const newUser = await User.create({
    username,
    email,
    password,
    role: "user"
  });

  res.json({
    message: "Signup successful",
    user: newUser
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ message: "Wrong password" });
  }

  res.json({
    message: "Login successful",
    role:user.role,
    user: user
  });
});

app.post("/book-token",async (req,res)=>{
  const {userId, username, serviceName} = req.body;
     
  const totalTokens = await Token.countDocuments({
  serviceName: serviceName
  })

  const existingToken = await Token.findOne({
    userId : userId,
    status : "waiting"
  });

  if(existingToken){
    return res.json({
      message:"you already have a token"
    })
  }
  
    const newToken = await Token.create({
      userId,
      username, 
      serviceName,
      tokenNumber:totalTokens+1,
      status:"waiting"
    })
    
    res.json({
      message:"token booked successful",
      token: newToken
    });
  
});

app.get("/tokens",async(req,res)=>{
  const tokens = await Token.find();
  
  res.json({
    message:"tokens fetched successfully",
    tokens
  });
});

app.put("/token/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const token = await Token.findById(id);

  if (!token) {
    return res.json({ message: "Token not found" });
  }

  if (status === "serving") {
    const firstWaitingToken = await Token.findOne({
      serviceName: token.serviceName,
      status: "waiting"
    }).sort({ tokenNumber: 1 });

    if (firstWaitingToken._id.toString() !== id) {
      return res.json({
        message: "You cannot skip the queue"
      });
    }
  }

  const updatedToken = await Token.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json({
    message: "Token status updated successfully",
    token: updatedToken
  });
});



app.get("/my-token/:userId", async (req, res) => {
  const { userId } = req.params;

  const token = await Token.findOne({
    userId,
    status: { $in: ["waiting", "serving"] }
  });

  if (!token) {
    return res.json({
      message: "No active token",
      token: null,
      peopleAhead: 0
    });
  }

  const peopleAhead = await Token.countDocuments({
    serviceName: token.serviceName,
    status: "waiting",
    tokenNumber: { $lt: token.tokenNumber }
  });

  res.json({
    message: "User token fetched",
    token,
    peopleAhead
  });
});

app.put("/cancel-token/:id", async (req, res) => {
  const { id } = req.params;

  const updatedToken = await Token.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { new: true }
  );

  res.json({
    message: "Token cancelled successfully",
    token: updatedToken
  });
});

app.delete("/token/:id", async (req, res) => {
  const { id } = req.params;

  const deletedToken = await Token.findByIdAndDelete(id);

  if (!deletedToken) {
    return res.json({
      message: "Token not found"
    });
  }

  res.json({
    message: "Token deleted successfully",
    token: deletedToken
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});