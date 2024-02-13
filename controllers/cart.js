const Product = require("../models/Product");
const Cart = require("../models/Cart");


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
        const productId = req.body.productId;
        const quantity = req.body.quantity;

        // Check if the product with the given productId exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).send({ error: `Product with ID ${productId} not available or not active.` });
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId: req.user.id });

        if (cart) {
            // Check if the product already exists in the cart
            const existingItemIndex = cart.cartItems.findIndex(item => item.productId === productId);
            if (existingItemIndex !== -1) {
                // If the product exists, update its quantity and subTotal
                cart.cartItems[existingItemIndex].quantity += quantity;
                cart.cartItems[existingItemIndex].subTotal = cart.cartItems[existingItemIndex].quantity * product.price;
            } else {
                // If the product doesn't exist, add it to the cart
                const subTotal = quantity * product.price;
                cart.cartItems.push({
                    productId: productId,
                    quantity: quantity,
                    subTotal: subTotal
                });
            }
            // Recalculate totalPrice
            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);
        } else {
            // Create a new cart
            const subTotal = quantity * product.price;
            cart = new Cart({
                userId: req.user.id,
                cartItems: [{
                    productId: productId,
                    quantity: quantity,
                    subTotal: subTotal
                }],
                totalPrice: subTotal
            });
        }

        // Save or update the cart
        await cart.save();

        return res.status(201).send({ message: "Product(s) Added Successfully", Cart: cart });
    } catch (err) {
        console.error("Error in addToCart: ", err);
        return res.status(500).send({ error: "Error in addToCart" });
    }
};


//[SECTION] Update Quantity
module.exports.updateQuantity = async (req, res) => {
    try {
        const {productId, quantity } = req.body;

        // Find the cart by cartId for the user
        const cart = await Cart.findOne({userId: req.user.id });

        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        // Find the cart item to update
        const cartItemIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (cartItemIndex === -1) {
            return res.status(404).send({ error: `Product with ID ${productId} not found in cart` });
        }

        const product = await Product.findById(productId);

        // Update quantity and recalculate subTotal
        cart.cartItems[cartItemIndex].quantity = quantity;
        cart.cartItems[cartItemIndex].subTotal = quantity * product.price;

        // Recalculate totalPrice
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

        // Save the updated cart
        await cart.save();

        return res.status(200).send({ message: "Quantity updated successfully", Cart: cart });
    } catch (err) {
        console.error("Error in updateQuantity: ", err);
        return res.status(500).send({ error: "Error in updateQuantity" });
    }
};


//[SECTION] Remove Product
module.exports.removeProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the cart by cartId for the user
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        // Find the cart item to update
        const cartItemIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (cartItemIndex === -1) {
            return res.status(404).send({ error: `Product with ID ${productId} not found in cart` });
        }
        cart.cartItems.splice(cartItemIndex, 1)

        // Recalculate totalPrice
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

        // Save the updated cart
        await cart.save();

        return res.status(200).send({ message: "Product removed successfully", Cart: cart });
    } catch (err) {
        console.error("Error in product removal: ", err);
        return res.status(500).send({ error: "Error in product removal" });
    }
};


module.exports.clearCart = async (req, res) => {
    try {
    
        // Find the cart by cartId for the user
        const cart = await Cart.findOne({userId: req.user.id });

        if (!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        // Find the cart item to update
        const cartItemElements = cart.cartItems.length;

        cart.cartItems.splice(0, cartItemElements);

        // Recalculate totalPrice
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        return res.status(200).send({ message: "Cart successfully cleared", Cart: cart });
    } catch (err) {
        console.error("Error in clearing cart: ", err);
        return res.status(500).send({ error: "Error in clearing cart" });
    }
};
