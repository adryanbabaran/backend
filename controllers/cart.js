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
//[SECTION] Add to Cart 
module.exports.addToCart = async (req, res) => {
    try {
        let totalPrice = 0;
        const cartItems = [];

        // Map each item to a Promise that resolves when the product is found
        const promises = req.body.cartItems.map(async (item) => {
            // Find the product by productId
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
            }
            
            const subTotal = item.quantity * product.price;
            totalPrice += subTotal;

            cartItems.push({
                productId: item.productId,
                quantity: item.quantity,
                subTotal: subTotal
            });
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        // Create a new Cart item with the subtotal
        const newCart = new Cart({
            userId: req.user.id,
            cartItems: cartItems,
            totalPrice: totalPrice
        });

        // Save the new cart item
        await newCart.save();

        return res.status(201).send({ message: "Product(s) Added Successfully", Cart: newCart });
    } catch (err) {
        console.error("Error in add: ", err);
        return res.status(500).send({ error: "Error in add" });
    }
};