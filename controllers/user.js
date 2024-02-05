// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');

const User = require("../models/User");
const auth = require("../auth");


//[SECTION] User registration
module.exports.registerUser = (req,res) => {

	// Checks if the email is in the right format
	if (!req.body.email.includes("@")){
	   	return res.status(400).send({ error: "Email invalid" });
	}
	// Checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11){
	    return res.status(400).send({ error: "Mobile number invalid" });
	}
	// Checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
	    return res.status(400).send({ error: "Password must be atleast 8 characters" });
	
	} else {

	
		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10)
		});

		
		return newUser.save()
				.then((user) => res.status(201).send({ message: "Registered Successfully" }))
				.catch(err => {
					console.error("Error in saving: ", err)
					return res.status(500).send({ error: "Error in save"})
				})
		
	}
};

//[SECTION] User authentication
module.exports.loginUser = (req,res) => {

	if(req.body.email.includes("@")){

		return User.findOne({ email : req.body.email })
		.then(result => {

			if(result == null){

				return res.status(404).send({ error: "No Email Found" });

			} else {

				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if (isPasswordCorrect) {

					return res.status(200).send({ access : auth.createAccessToken(result)});

				} else {

					return res.status(401).send({ message: "Email and password do not match" });

				}

			}

		})
		.catch(err => {
					console.error("Error in find: ", err)
					return res.status(500).send({ error: "Error in find"})
				})

	} else {

		return res.status(400).send({error: "Invalid Email"})

	}

	
};


//[SECTION] Retrieve user details
module.exports.getProfile = (req, res) => {

	const userId = req.user.id;

	// The "return" keyword ensures the end of the getProfile method.
	// Since getProfile is now used as a middleware it should have access to "req.user" if the "verify" method is used before it.
	// Order of middlewares is important. This is because the "getProfile" method is the "next" function to the "verify" method, it receives the updated request with the user id from it.
	return User.findById(userId)
	        .then(user => {
	            if (!user) {
	                return res.status(404).send({ error: 'User not found' });
	            }

	            // Exclude sensitive information like password
	            user.password = undefined;

	            return res.status(200).send({ user });
	        })
	        .catch(err => {
	        	console.error("Error in fetching user profile", err)
	        	return res.status(500).send({ error: 'Failed to fetch user profile' })
	        });


};

// Function to reset the password
module.exports.updatePassword = async (req, res) => {
  try {

  	console.log(req.body);

    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

};

// Function to update another user as an admin
module.exports.updateAdmin = async (req, res) => {
    try {
        // Check if the requesting user has admin privileges
        const requestingUser = req.user; 
        if (!requestingUser || !requestingUser.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
        }

        // Extract user ID from the request body
        const userIdToUpdate = req.params.userId;
        if (!userIdToUpdate) {
            return res.status(400).json({ error: 'User ID is required in the request body.' });
        }

        // Retrieve the user to be updated from the database
        const userToUpdate = await User.findById(userIdToUpdate);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Save the updated user to the database
        await userToUpdate.save();

        // Return success message
        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};