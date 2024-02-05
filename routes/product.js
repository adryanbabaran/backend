// [SECTION] Dependencies and Modules
const express = require("express");

const productController = require("../controllers/product");

const { verify, verifyAdmin, isLoggedIn } = require("../auth"); 

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Create Product
router.post("/createProduct", verify, verifyAdmin, productController.createProduct);

//[SECTION] Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// [SECTION] Get All Active
router.get("/", productController.getAllActive );

module.exports = router;