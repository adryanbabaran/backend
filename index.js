// [SECTION] Dependencies and Modules
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");

// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");

// Allows access to routes defined within our application
const userRoutes = require("./routes/user");

// [SECTION] Environment Setup
const port = 4000;

// [SECTION] Server Setup
// Creates an "app" variable that stores the result of the "express" function that initializes our express application and allows us access to different methods that will make backend creation easy
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
// Allows all resources to access our backend application
app.use(cors());

// [SECTION] Database Connection
// Connect to our MongoDB database
mongoose.connect("mongodb+srv://admin:admin123@b337.ytyxk3v.mongodb.net/Capstone2-API?retryWrites=true&w=majority",
		{
			useNewUrlParser : true,
			useUnifiedTopology : true
		}
);

// Prompts a message in the terminal once the connection is "open" and we are able to successfully connect to our database
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
// http://localhost:4000/
// Defines the "/users" string to be included for all user routes defined in the "user" route file
// Groups all routes in userRoutes under "/users"
app.use("/users", userRoutes);

// [SECTION] Server Gateway Response
if(require.main === module){

	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port }`)
	})

}

module.exports = { 	app, 
					mongoose };

