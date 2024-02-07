// [SECTION] Dependencies and Modules
const express = require("express");

const productController = require("../controllers/product");

const { verify, verifyAdmin, isLoggedIn } = require("../auth"); 

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Create Product
router.post("/", verify, verifyAdmin, productController.createProduct);

//[SECTION] Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// [SECTION] Get All Active
router.get("/active", productController.getAllActive );

// [SECTION] Retrieve single product
router.get("/:productId", productController.getProduct );

// [SECTION] Update product information
router.patch("/:productId", verify, verifyAdmin, productController.updateProduct );

//[SECTION] Route for product archive/activate
router.patch("/archive/:productId", verify, verifyAdmin, productController.archiveProduct);
router.patch("/activate/:productId", verify, verifyAdmin, productController.activateProduct);

//[SECTION] Search Product By Name
router.post("/searchByName", productController.searchByName);

//[SECTION] Search Product By Price Range
router.post("/searchByPrice", productController.searchByPriceRange);

module.exports = router;