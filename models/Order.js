const mongoose = require("mongoose");

// [SECTION] Schema/Blueprint
const orderSchema = new mongoose.Schema({

	userId: {
		type: String,
		required: [true, "User ID is required"]
	},
	productsOrdered: [
		{
			productId: {
				type: String,
				required: [true, "Product ID is required"]
			},
			quantity: {
				type: Number,
				required: [true, "Quantity is required"]
			},
			subTotal: {
				type: Number,
				required: [true, "Subtotal is required"]
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, "totalPrice is required"]
	},
	orderedOn: {
		type: Date,
		default: Date.now()
	},
	status: {
		type: String,
		default: "Pending"
	}
});

// [SECTION] Model
module.exports = mongoose.model("Order", orderSchema);
/*
	- Make sure to follow the naming convention for model files which should have the folowing:
		- The first letter of the file should be capitalized to indicate that we are accessing the model file.
		- Should use the singular form of the collection.
*/