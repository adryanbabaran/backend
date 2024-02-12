// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../auth");

//[SECTION] Checkout
module.exports.checkout = async (req, res) => {
    try {

    	if (req.user.isAdmin){
    		return res.status(403).send({Error : "Admin accounts cannot checkout"})
    	} else{
	        // Find the cart by cartId and userId
	        const cart = await Cart.findOne({ userId: req.user.id });

	        if (!cart) {
	            return res.status(404).send({ message: "Cart not found. Please add products to cart." });
	        }

	        // Check if the cart is empty
	        if (cart.cartItems.length === 0) {
	            return res.status(409).send({ message: 'Cart is empty' });
	        } else {

	        // Create a new order with cartItems and totalPrice
	        const newOrder = new Order({
	            userId: req.user.id,
	            productsOrdered: cart.cartItems,
	            totalPrice: cart.totalPrice
	        });

	        // Save the new order
	        await newOrder.save();

            await Cart.deleteOne({ userId : req.user.id })

	        return res.status(201).send({ message: 'Order checkout successful',
	        							order: newOrder });
            }
    	}

	} catch (err) {
        console.error('Error in checkout: ', err);
        return res.status(500).send({ error: 'Error checking out' });
    }
};

//[SECTION] Get all orders
module.exports.getAllOrders = (req, res) => {

    return Order.find({})
    .then(orders => {

        if(orders.length > 0){
            return res.status(200).send({ message: "Search complete.",orders: orders });
        }
        else{
            return res.status(200).send({ message: 'No orders found.' });
        }

    })
    .catch(err => {

        console.error("Error in finding all orders", err);

        return res.status(500).send({ error: "Error finding orders"});

    });

};

//[SECTION] Get user orders
module.exports.getMyOrders = (req, res) => {

    return Order.find({userId: req.user.id})
    .then(orders => {

        if(orders.length > 0){
            return res.status(200).send({ message: "My Order History", orders });
        }
        else{
            return res.status(200).send({ message: 'No orders found.' });
        }

    })
    .catch(err => {

        console.error("Error in finding all orders", err);

        return res.status(500).send({ error: "Error finding orders"});

    });

};

