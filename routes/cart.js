// [SECTION] Dependencies and Modules
const express = require("express");

const cartController = require("../controllers/cart");

const { verify, verifyAdmin, isLoggedIn } = require("../auth"); 

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Get Cart
router.get("/", verify, isLoggedIn, cartController.getCart);

// [SECTION] Add to Cart
router.post("/addToCart", verify, isLoggedIn, cartController.addToCart);

// [SECTION] Update Quantity
router.patch("/updateQuantity", verify, isLoggedIn, cartController.updateQuantity);

router.patch("/:productId/removeFromCart", verify, isLoggedIn, cartController.removeProduct);

router.patch("/clearCart", verify, isLoggedIn, cartController.clearCart);

module.exports = router;