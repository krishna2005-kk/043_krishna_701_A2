const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

router.get("/", async (req,res)=>{
  const cats = await Category.find();
  const filter = req.query.category ? {category:req.query.category} : {};
  const prods = await Product.find(filter).populate("category");
  res.render("shop/index",{cats,prods,selected:req.query.category});
});

module.exports = router;
