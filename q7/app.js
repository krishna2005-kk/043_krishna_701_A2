const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

const app = express();
app.use(express.urlencoded({extended:true}));

app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose.connect("mongodb://127.0.0.1:27017/shop");

app.use((req,res,next)=>{
  res.locals.admin = req.session.admin; 
  next();
});

app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/shop"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
