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
router.get("/", productController.getAllActive );

// [SECTION] Retrieve single product
router.get("/:productId", productController.getProduct );

// [SECTION] Update product information
router.patch("/:productId", verify, verifyAdmin, productController.updateProduct );

//[SECTION] Route for product archive/activate
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

module.exports = router;