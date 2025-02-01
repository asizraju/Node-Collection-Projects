const { default: axios } = require("axios");
const User = require("../Modules/UserModules")
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require ("jsonwebtoken")
const UserImages = require ("../Uploads/Upload")



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
exports.createUser = [
    UserImages.single('photo'),  // Multer middleware for handling 'photo' field
    async (req, res) => {
      try {
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
        res.status(201).json({ message: 'User Created Successfully' });
      } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'User Not Created', details: error.message });
      }
    }
  ];

  
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email (case-sensitive)
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).send({
                userFound: false,
                message: 'User Not Available'
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

        const token = jwt.sign(
            {user_id : user.user_id,
                email : user.email,
                role : user.role},
                'HCC-COLLECTION-PROJECT'
                // {expiresIn:'30m'}
        )
        res.status(200).send({
            userFound: true,
            token,
            message: 'Login Successfully',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email, 
                // phone_number: user.phone_number,
                role:user.role,
                // sent:user.sent
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
        try {
            await User.update (req.params.id , req.body)
            res.status (200).json({message:'User Updated Successfully'})
            
        } catch (error) {
            console.log(error)
            res.status(400).json({error:error.message || "Failed to Updated Collection"})
        }
    }
]

exports.fetchUserID = async (req, res) => {
    try {
        const user = await User.fetchUserlistID(); // Assuming this method fetches the user list
        res.status(200).json({
            success: true,
            data: user // Sending the fetched user data in the response
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

 // Assuming express-validator is used

exports.fetchUserIDS = async (req, res) => {
    
    try {
        const user = await User.fetchUserlistIDS(req.params.id); // Assuming this method fetches the user list
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