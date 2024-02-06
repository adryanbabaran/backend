// [SECTION] Dependencies and Modules
const express = require("express");

const cartController = require("../controllers/cart");

const { verify, verifyAdmin, isLoggedIn } = require("../auth"); 

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Get Cart
router.get("/", verify, isLoggedIn, cartController.getCart);

// [SECTION] Add to Cart
router.post("/add", verify, isLoggedIn, cartController.addToCart);


module.exports = router;