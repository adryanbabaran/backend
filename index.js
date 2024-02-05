// [SECTION] Dependencies and Modules
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const port = 4000;

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
app.use("/users", userRoutes);
app.use("/products", productRoutes);

// [SECTION] Server Gateway Response
if(require.main === module){

	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port }`)
	})

}

module.exports = { 	app, 
					mongoose };

