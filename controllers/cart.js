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
        // Find the cart for the user
        const cart = await Cart.findOne({ userId: req.user.id });

        let totalPrice = 0;
        const cartItems = [];
        let error = false;

        // Map each item to a Promise that resolves when the product is found
        const promises = req.body.cartItems.map(async (item) => {
            // Find the product by productId
            const product = await Product.findById(item.productId);
            if (!product && cart) {
                error = true;
                return res.status(404).send({ error: `Failed to add product(s). Product with ID ${item.productId} not found.`,
                    Cart : cart });
            }
            if (!product && !cart) {
                error = true;
                return res.status(404).send({ error: `Failed to create cart. Product with ID ${item.productId} not found.`});
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

        if (error) {return;}
        if (cart) {
            // Update existing cart with new cartItems
            cart.cartItems = cart.cartItems.concat(cartItems);
            cart.totalPrice += totalPrice;
            await cart.save();

            return res.status(201).send({ message: "Product(s) Added Successfully", Cart: cart });
        } else {
            // Create a new Cart item with the subtotal
            const newCart = new Cart({
                userId: req.user.id,
                cartItems: cartItems,
                totalPrice: totalPrice
            });

            // Save the new cart item
            await newCart.save();

            return res.status(201).send({ message: "Cart Created Successfully", Cart: newCart });
        }
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
