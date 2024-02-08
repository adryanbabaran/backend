// [SECTION] Dependencies and Modules
const express = require("express");

const orderController = require("../controllers/order");

const { verify, verifyAdmin, isLoggedIn } = require("../auth"); 

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Create Product
router.post("/checkout", verify, isLoggedIn, orderController.checkout);

//[SECTION] Route for retrieving all products
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

// [SECTION] Get All Active
router.get("/my-orders", verify, isLoggedIn, orderController.getMyOrders);




module.exports = router;