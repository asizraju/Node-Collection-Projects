const { default: axios } = require("axios");
const User = require("../Modules/UserModules")
const crypto = require ("crypto")
const bcrypt = require('bcrypt');
const jwt = require ("jsonwebtoken")
const UserImages = require ("../Uploads/Upload");
const { error } = require("console");



// exports.createUser = [
//     // Use the UserImages middleware to handle the file upload
//     UserImages.single('photos'), // 'photos' should be the field name in the form data

//     // The actual handler function
//     async (req, res) => {
//         try {
//             // Hash the password using bcrypt
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);

//             // Destructure values from the request body
//             const { username, email, phone_number, city, role, sent, client_id } = req.body;

//             // Handle file upload if there is a file
//             const photo = req.file ? req.file.path : null; // Assuming 'path' is the location of the saved file

//             // Create the new user in the database
//             const user = await User.create({
//                 username,
//                 email,
//                 password: hashedPassword,
//                 phone_number,
//                 city,
//                 role,
//                 photo,   // Save the file path or null if no file is uploaded
//                 sent,
//                 client_id
//             });

//             // Respond with success message and user info
//             res.status(201).json({ message: 'User Created Successfully', user });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'User Not Created', details: error.message });
//         }
//     }
// ];




// Define the route handler for user creation
const isValidEmail = (email) => /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/.test(email);

exports.createUser = [
    UserImages.single('photo'),  // Multer middleware for handling 'photo' field
    async (req, res) => {
      try {
        if (!isValidEmail(req.body.email)) {
            return res.status(400).json({error:'Invalid Email Formate'})
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        // Get the uploaded photo's file path or set it to null if no file
        const photoPath = req.file ? req.file.path : null;
  
        // Create the user object with the provided data
        const user = {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          phone_number: req.body.phone_number,
          city: req.body.city,
          role: req.body.role,
          photo: photoPath,  // Save the path of the uploaded photo
          sent: req.body.sent
        };
  
        // Insert the user data into the database
        const result = await User.create(user);  // Ensure this function handles the DB insertion
  
        // Send a success response
        res.status(201).json({ message: 'User Created Successfully',id: result });
      } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'User Not Created', details: error.message });
      }
    }
  ];

  
  exports.createDistributor = async (req, res) => {
    try {
        const distributor = {
            username: req.body.username,
            phone_number: req.body.phone_number,
            role: req.body.role,
            // sent: req.body.sent || 0  // Providing a default value for `sent`
        };

        const result = await User.createdistribute(distributor);
        res.status(201).json({ message: "Distributor Created Successfully", id: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Distributor Not Created", details: error.message });
    }
};


  
// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find the user by email (case-sensitive)
//         const user = await User.findByEmail(email);
//         if (!user) {
//             return res.status(404).send({
//                 userFound: false,
//                 message: 'User Not Available'
//             });
//         }
//         // Compare the password with the hashed password in the database
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).send({
//                 userFound: true,
//                 message: 'Password Not Matching'
//             });
//         }

//         const token = jwt.sign(
//             {user_id : user.user_id,
//                 email : user.email,
//                 role : user.role},
//                 'HCC-COLLECTION-PROJECT'
//                 // {expiresIn:'5m'}
//         )
//         res.status(200).send({
//             userFound: true,
//             token,
//             message: 'Login Successfully',
//             user: {
//                 user_id: user.user_id,
//                 username: user.username,
//                 email: user.email, 
//                 // phone_number: user.phone_number,
//                 role:user.role,
//                 // sent:user.sent
//             }
//         });

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: 'Error Logging In' });
//     }
// };


const validator = require('validator'); // Make sure to install the validator package

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email format is valid
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid Email Format' });
        }


        // Optional: Check for specific domain, e.g., only allow "@company.com"
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).send({
                userFound: false,
                message: 'Only emails from @gmail.com are allowed'
            });
        }

        // Find the user by email (case-sensitive)
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).send({
                userFound: false,
                message: 'User Not Available'
            });
        }
        if (user.role !== 'Admin' && user.role !== 'Collection Manager' && user.role !=='Collection Agent') {
            return res.status(403).send({
                userFound: true,
                message: 'Only admins and collection manager and collection agents can log in'
            });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                userFound: true,
                message: 'Password Not Matching'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            'HCC-COLLECTION-PROJECT'
            // {expiresIn: '5m'} // Optional expiry
        );

        // Respond with success message and token
        res.status(200).send({
            userFound: true,
            token,
            message: 'Login Successfully',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error Logging In' });
    }
};



exports.list = async (req, res) => {
    try {
        const user = await User.findAll()
        res.status(200).json(user)
    } catch (error) {
        console.log("List Details Error", error)
        res.status(500).json("Error Accured in List")
    }
}

exports.delete = [
    async (req, res) => {
        try {
            const user_id = req.params.id; // Extract user_id from URL parameter
            // Call User.delete and await its result
            const result = await User.delete(user_id);

            // Check if any rows were affected (deleted)
            if (result.affectedRows > 0) {
                // If rows are affected, send a success response
                res.status(200).send({ message: `User with user_id ${user_id} deleted successfully.` });
            } else {
                // If no rows are affected, user might not exist or other issue
                res.status(404).send({ message: `User with user_id ${user_id} not found.` });
            }
        } catch (err) {
            // Catch any errors and send an error response
            console.error(err); // Log the error for debugging purposes
            res.status(500).send({ message: 'Error deleting user.', error: err.message });
        }
    }
];

exports.update = [
    async (req,res) =>{
        // const {email,username,phone_number,photo,city,role} = req.body
        try {
            await User.update (req.params.id , req.body)
            res.status (200).json({message:'User Updated Successfully'})
            
        } catch (error) {
            console.log(error)
            res.status(400).json({error:error.message || "Failed to Updated Collection"})
        }
    }
]
const moment = require("moment");

exports.updatedistributoramount= async (req, res) => { 
    try {
        let dataArray = req.body;  // Expecting an array

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ error: "Input must be a non-empty array." });
        }

        // Format the date for each entry
        dataArray = dataArray.map(({ user_id, today_rate_date, Distributor_today_rate }) => {
            if (!user_id || !today_rate_date || Distributor_today_rate === undefined) {
                throw new Error(`Invalid data for user_id: ${user_id}`);
            }

            return {
                user_id,
                today_rate_date: moment(today_rate_date, "DD-MM-YYYY").format("YYYY-MM-DD"),
                Distributor_today_rate
            };
        });

        // Call the function with the correctly formatted data array
        await User.updateDistributorAmounts(dataArray);

        res.status(200).json({ message: "All users updated successfully" });
    } catch (error) {
        console.error("Error updating distributor amount:", error);
        res.status(500).json({ error: error.message || "Failed to update distributor amount" });
    }
};


// exports.fetchUserID = async (req, res) => {
//     try {
//         const user = await User.fetchUserlistID(); // Assuming this method fetches the user list
//         res.status(200).json({
//             success: true,
//             data: user // Sending the fetched user data in the response
//         });
//     } catch (error) {
//         console.error(error.message, "FetchUser List Error");
//         res.status(500).json({
//             success: false,
//             message: "Error occurred while fetching users",
//             error: error.message // Optional: Include the error message for debugging
//         });
//     }
// };




// exports.resetPassword= async(req, res) => {
//     const { token, newPassword } = req.body;

//     User.findByResetToken(token, (err, users) => {
//       if (err || users.length === 0) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//       }

//       const user = users[0];

//       if (user.reset_token_expiry < new Date()) {
//         return res.status(400).json({ message: 'Reset token has expired' });
//       }

//       // Hash the new password
//       bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
//         if (err) {
//           return res.status(500).json({ message: 'Error hashing password', error: err });
//         }

//         // Update the password in the database
//         User.updatePassword(user.id, hashedPassword, (err, result) => {
//           if (err) {
//             return res.status(500).json({ message: 'Error updating password', error: err });
//           }

//           // Clear the reset token fields after successful reset
//           User.clearResetToken(user.id, (err) => {
//             if (err) {
//               return res.status(500).json({ message: 'Error clearing reset token', error: err });
//             }

//             res.status(200).json({ message: 'Password reset successfully' });
//           });
//         });
//       });
//     });
//   },

  
exports.requestupdate_password  = async (req,res) =>{
    try {
        const {email} = req.body
        const user  = await User.findByEmail(email)
        if (!user|| user.length === 0 ) {
            return res.status(404).json ({message :"Email-ID Not Available"})
        }   
        const resettoken = crypto.randomBytes(32).toString('hex')
        const resettokenExpiry = new Date(Date.now()+3600000)
        try {
            await User.updateResetToken(user.email,resettoken,resettokenExpiry)

        } catch (error) {
            return res.status(500).json({message:'Error updating rest token' ,error:error.message})
        }
        res.status(200).json({
            message :"Password reset token genrated. please check your email ." , resettoken
        })
    } catch (error) {
        console.error ("Error updated password" , error)
        res.status(400).json({error:error.message || "Failed  to Request password link"})
    }
}


exports.restPassword = async (req, res) => {
    try {
        // Find the user by email provided in the request
        const user = await User.findByEmail({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        try {
            await User.updated_Password(email, hashedPassword); // Assuming updatePassword is the correct method
        } catch (error) {
            return res.status(500).json({ message: "Error updating password", error: error });
        }

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error resetting password", error: error });
    }
};


exports.updatepassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Call the service to update the password with the hashed password
        const result = await User.updated_Password(email, hashedPassword);


        return res.status(200).json({ message: "Password reset successfully",result });

       
    } catch (error) {
        console.error('Error updating password:', error);  // Log error for debugging purposes
        return res.status(500).json({ success: false, message: 'Error updating password' });
    }
};


// exports.requestupdate_password = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Find the user by email
//         const user = await User.findByEmail(email);

//         // Check if user exists
//         if (!user || user.length === 0) {
//             return res.status(404).json({ message: "Email-ID Not Available" });
//         }

//         // Generate a reset token and its expiration time
//         const resettoken = crypto.randomBytes(32).toString('hex');
//         const resettokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

//         // Update the reset token and its expiry in the database
//         await User.updateResetToken(user.id, resettoken, resettokenExpiry);
//         res.status(200).json({
//             message: "Password reset token generated. Please check your email."
//         });

//     } catch (error) {
//         console.error("Error updating password:", error);
//         res.status(400).json({ error: error.message || "Failed to request password link" });
//     }
// };

 // Reset Password (Verify Token and Update Password)

 // Assuming express-validator is used




exports.fetchUserID = async (req, res) => {    
    try {
        const user = await User.fetchUserlistID(req.params.id); // Assuming this method fetches the user list
        res.status(200).json({
            success: true,
            clientdata: user // Sending the fetched user data in the response
        });
    } catch (error) {
        console.error(error.message, "FetchUser List Error");
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching users",
            error: error.message // Optional: Include the error message for debugging
        });
    }
};


exports.fetchUserIDS = async (req, res) => {
    try {
        const { user_id, assigned_date } = req.body;  // Get user_id and filterdata from the request body

        // Call the function to fetch combined data
        const result = await User.fetchUserlistIDS(user_id, assigned_date);

        // Send the combined data back as the response
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching user details' });
    }
};


exports.fetchUserIDSS = async (req, res) => {
    try {
        const user = await User.fetchUserlistIDS(req.params.id, req.params.assigned_date);
        // Return success response
        res.status(200).json({
            success: true,
            clientdata: user // Send the fetched user data in the response
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching user details' });
    }
};


