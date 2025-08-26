const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

function isAuth(req,res,next){
  if(req.session.admin) return next();
  res.redirect("/admin/login");
}

router.get("/login",(req,res)=>{
  res.render("admin/login");
});

router.post("/login",(req,res)=>{
  const {username,password} = req.body;
  if(username==="admin" && password==="admin123"){
    req.session.admin = true;
    return res.redirect("/admin/categories");
  }
  res.send("Invalid credentials <a href='/admin/login'>Try again</a>");
});

router.get("/logout",(req,res)=>{
  req.session.destroy(()=>res.redirect("/"));
});

router.get("/categories", isAuth, async (req,res)=>{
  const cats = await Category.find();
  res.render("admin/categories",{cats});
});
router.post("/categories", isAuth, async (req,res)=>{
  await Category.create({name:req.body.name});
  res.redirect("/admin/categories");
});

router.get("/products", isAuth, async (req,res)=>{
  const prods = await Product.find().populate("category");
  const cats = await Category.find();
  res.render("admin/products",{prods,cats});
});
router.post("/products", isAuth, async (req,res)=>{
  await Product.create({
    name:req.body.name,
    price:req.body.price,
    category:req.body.category
  });
  res.redirect("/admin/products");
});

module.exports = router;
