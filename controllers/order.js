// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../auth");

//[SECTION] Checkout
module.exports.checkout = async (req, res) => {
    try {
        // Find the cart by cartId and userId
        const cart = await Cart.findOne({ _id: req.body.cartId, userId: req.user.id });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        // Check if the cart is empty
        if (cart.cartItems.length === 0) {
            return res.status(409).send({ message: 'Cart is empty' });
        }

        // Create a new order with cartItems and totalPrice
        const newOrder = new Order({
            userId: req.user.id,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        });

        // Save the new order
        await newOrder.save();

        return res.status(201).send({ message: 'Order checkout successful',
        							order: newOrder }
        );
    } catch (err) {
        console.error('Error in checkout: ', err);
        return res.status(500).send({ error: 'Error checking out' });
    }
};
