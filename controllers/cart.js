// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');

const Product = require("../models/Product");
const Cart = require("../models/Cart");
const auth = require("../auth");


//[SECTION] Get all products
module.exports.getCart = (req, res) => {

    return Cart.find({userId: req.user.id})
    .then(cartItems => {

        if(cartItems.length > 0){
            return res.status(200).send({ cartItems });
        }
        else{
            return res.status(200).send({ message: 'Your cart is empty.' });
        }

    })
    .catch(err => {

        console.error("Error in finding cart", err);

        return res.status(500).send({ error: "Error finding cart"});

    });

};

//[SECTION] Add to Cart 
module.exports.addToCart = async (req, res) => {
    try {
        // Find the product by productId
        const product = await Product.findById(req.body.productId);
        
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        
        // Calculate the subtotal
        const subTotal = req.body.quantity * product.price;
        const cartItems = [{productId: req.body.productId,
                            quantity: req.body.quantity,
                            subTotal: subTotal}];

        // Create a new Cart item with the subtotal
        const newCart = new Cart({
            userId: req.user.id,
            cartItems: cartItems,
            totalPrice: subTotal
        });

        // Save the new cart item
        await newCart.save();

        return res.status(201).send({ message: "Product Added Successfully", Cart: newCart });
    } catch (err) {
        console.error("Error in add: ", err);
        return res.status(500).send({ error: "Error in add" });
    }
};