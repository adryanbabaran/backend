// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');

const User = require("../models/User");
const auth = require("../auth");

const emailController = require("../controllers/email");


//[SECTION] User registration
/*module.exports.registerUser = async (req, res) => {
    try {
        console.log('Registering user...');
        if (!req.body.email.includes("@")) {
            return res.status(400).send({ error: "Email invalid" });
        } else if (req.body.mobileNo.length !== 11) {
            return res.status(400).send({ error: "Mobile number invalid" });
        } else if (req.body.password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters" });
        } else {
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNo: req.body.mobileNo,
                password: bcrypt.hashSync(req.body.password, 10)
            });

            await newUser.save();
            console.log('User saved successfully.');

            // Call the sendVerificationEmail function here
            console.log('Sending verification email...');
            await emailController.sendVerificationEmail(req.body.email);
            console.log('Verification email sent successfully.');

            return res.status(201).send({ message: "Registered Successfully" });
        }
    } catch (error) {
        console.error("Error in registering user:", error);
        return res.status(500).send({ error: "Error in user registration" });
    }
};
*/
module.exports.registerUser = (req,res) => {

	if (!req.body.email.includes("@")){
	   	return res.status(400).send({ error: "Email invalid" });
	}
	else if (req.body.mobileNo.length !== 11){
	    return res.status(400).send({ error: "Mobile number invalid" });
	}
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

	return User.findById(userId)
	        .then(user => {
	            if (!user) {
	                return res.status(404).send({ error: 'User not found' });
	            }

	           
	            user.password = undefined;

	            return res.status(200).send({ user });
	        })
	        .catch(err => {
	        	console.error("Error in fetching user profile", err)
	        	return res.status(500).send({ error: 'Failed to fetch user profile' })
	        });


};
// [SECTION] Update Password
module.exports.updatePassword = async (req, res) => {
  try {

  	console.log(req.body);

    const { newPassword } = req.body;
    const { id } = req.user; 

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

};
// [SECTION] Update Admin
module.exports.updateAdmin = async (req, res) => {
    try {
        const requestingUser = req.user; 
        if (!requestingUser || !requestingUser.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
        }

        const userIdToUpdate = req.params.userId;
        if (!userIdToUpdate) {
            return res.status(400).json({ error: 'User ID is required in the request body.' });
        }

    
        const userToUpdate = await User.findById(userIdToUpdate);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found.' });
        }

		userToUpdate.isAdmin = true;
        await userToUpdate.save();

    
        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};