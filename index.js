// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const port = 4002;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(cors());

// [SECTION] Database Connection
mongoose.connect("mongodb+srv://admin:admin123@b337.ytyxk3v.mongodb.net/Capstone2-API?retryWrites=true&w=majority",
		{
			useNewUrlParser : true,
			useUnifiedTopology : true
		}
);

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
app.use("/b2/users", userRoutes);
app.use("/b2/products", productRoutes);
app.use("/b2/cart", cartRoutes);
app.use("/b2/orders", orderRoutes);

// [SECTION] Server Gateway Response
if(require.main === module){

	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port }`)
	})

}

module.exports = { 	app, 
					mongoose };

