const connection = require('../config/Database');
const Collectiondata = require('../Modules/CollectonModules');
const multer = require("multer")

const UserImages = require ("../Uploads/Upload")





exports.createCollection = async (req, res) => {
    try {
        const { client_name, client_contact, client_city, amount, date, updated_amount, paid_amount_time, paid_amount_date, overall_amount, paid_and_unpaid, Sucess_and_unsucess } = req.body;

        const collectionID = await Collectiondata.create({
            client_name,
            client_contact,
            client_city,
            amount,
            date,
            updated_amount,
            paid_amount_time,
            paid_amount_date,
            overall_amount,
            paid_and_unpaid,
            Sucess_and_unsucess
        });

        res.status(201).json({ message: 'Account created successfully', collectionID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create account' });
    }
};

exports.createCollectionarray =
        async (req, res) => {
    try {
        const {
            client_name,
            client_contact,
            client_city,
            amount,
            date,
            updated_amount,
            paid_amount_time,
            paid_amount_date,
            overall_amount,
            paid_and_unpaid,
            success_and_unsuccess,
            send,
            sent ,
            user_id
        } = req.body;

        const collectionID = await Collectiondata.createarray({
            client_name, // Store normal string value
            client_city, // Store normal string value
            client_contact, // Store as JSON
            amount, // Store as JSON array
            date, // Store as JSON array
            updated_amount, // Store as JSON array
            paid_amount_time, // Store as JSON array
            paid_amount_date, // Store as JSON array
            overall_amount, // Store as JSON array
            paid_and_unpaid, // Store as JSON array
            success_and_unsuccess, // Store as JSON array
            send, // Store as JSON (boolean will be converted to JSON)
            sent,
            user_id,
             // Store as JSON (boolean will be converted to JSON)
        });

        // Send response with the created collection ID
        res.status(201).json({ message: 'Account created successfully', collectionID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create account' });
    }
};

exports.createCollectionarrays = [
    UserImages.single('picture'), // This handles the file upload for the 'picture' field
    async (req, res) => {
        try {
            
            const picturePath = req.file ? req.file.path : null;
            const data = {
                client_name: req.body.client_name,
                client_contact: req.body.client_contact,
                client_city: req.body.client_city,
                amount: req.body.amount,
                date: req.body.date,
                updated_amount: req.body.updated_amount,
                paid_amount_time: req.body.paid_amount_time,
                paid_amount_date: req.body.paid_amount_date,
                overall_amount: req.body.overall_amount,
                paid_and_unpaid: req.body.paid_and_unpaid,
                success_and_unsuccess: req.body.success_and_unsuccess,
                send: req.body.send,
                sent: req.body.sent,
                user_id: req.body.user_id,
                Distributor_id:req.body.Distributor_id,
                assigned_date:req.body.assigned_date,
                picture: picturePath,
                today_rate:req.body.today_rate,
                accno: req.body.accno,
                bank_name: req.body.bank_name,
                ifsc_code: req.body.ifsc_code,
                accoun_type:req.body.accoun_type,
                name_of_the_beneficiary:req.body.name_of_the_beneficiary,
                address_of_the_beneficiary:req.body.address_of_the_beneficiary,
                sender_information:req.body.sender_information,
                narration:req.body.narration,
                bank_type:req.body.bank_type,
                local:req.body.local,
                international:req.body.international
            };
            const result = await Collectiondata.createarrays(data);            
            res.status(200).json({ message: 'Data inserted successfully', id: result,
                 Data:data
             });
        } catch (error) {
            res.status(500).json({ message: 'Error inserting data', error: error.message });
        }
    }
];

exports.clientupdate = async (req,res) =>{
    try {
        await Collectiondata.clientupdate(req.params.id , req.body)
        console.log(req.body)
        res.status(200).json({message:'Client Data Updated Suceesfully'})
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message || "Failed Updated Fields"})
    }
}


exports.update = async (req, res) => {
    try {
        await Collectiondata.update(req.params.id, req.body);
        console.log(req.body);
        console.log(req.params.id);
        res.status(200).json({ message: 'Collection updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to update Collection' });
    }
};


exports.updatebankdetails = async (req, res) => {
        try {
            // Assumes Collectiondata.updatebankdetails is a method that updates bank details in the DB
            await Collectiondata.updatebankdetails(req.params.id, req.body);
            
            // Sending success response when update is successful
            res.status(200).json({ message: 'Bank details updated successfully' });
        } catch (error) {
            // Logging error for debugging purposes
            console.error(error);
            
            // Sending failure response when an error occurs
            res.status(400).json({ error: 'Failed to update bank details' });
        }
    }



exports.pushClientID = [
    async (req,res) =>{
        try {
            await Collectiondata.pushClientID(req.params.id,req.body)
            res.status(200).json({message:'Collection Team Assinging Successfully'})
            
        } catch (error) {
            console.error(error.message,"User ID Not Updated")
            res.status(400).json({error:error.message || "Failed to Updated Collection List"})
        }
    }
]



exports.push = async (req, res) => {
    const client_id = req.params.client_id;  // Get client_id from the URL parameters
    const data = req.body;  // Get the data from the request body

    try {
        // Call the `push` function from the `Collectiondata` class (or object) with the client_id and data
        const result = await Collectiondata.push(client_id, data);

        // Send the response back with a status of 200 and the result from `push`
        res.status(200).send({message:'Collection Team Assinging Successfully',result});
    } catch (error) {
        // Catch any errors and send a 500 status with the error message
        res.status(500).send({ error: error.message });
    }
};

exports.pushToArray = async (req, res) => {
    const { client_id, field, new_value } = req.body;

    // Validate the required fields
    if (!client_id || !field || new_value === undefined) {
        return res.status(400).json({ error: 'client_id, field, and new_value are required' });
    }
    try {
        // Call the `pushToArray` function to update the JSON array in the database
        await Collectiondata.pushToArray(client_id, field, new_value);

        // Send a successful response
        res.status(200).json({ message: 'Value added to the array successfully!' });
    } catch (error) {
        // Log the error and send an error response
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the array' });
    }
};


exports.pushToArrays =  async (req, res) => {
    try {
        const { client_id, field, newValue, dateValue } = req.body;

        // Ensure all necessary data is provided
        if (!client_id || !field || !newValue || !dateValue) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Call the pushToArray method
        const result = await Collectiondata.pushToArrays(client_id, field, newValue, dateValue);

        return res.status(200).json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.pushToArrayss = async (req, res) => {
    // Extracting client_id, field, and data from the request body
    const { client_id, field, data } = req.body;

    // Validate incoming data (if needed)
    if (!client_id || !field || !data) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Assuming Collectiondata.pushToArrays updates the document in MongoDB
        const result = await Collectiondata.pushToArrayss(client_id, field, data);

        // Check if result is empty or null (in case something went wrong in the database method)
        if (!result) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Successfully updated document
        res.status(200).json(result);
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error('Error during pushToArrays:', error);

        // Respond with a generic error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.pushToArraysss = async (req, res) => {
    const { client_id, field, data } = req.body;
    try {
        const result = await pushToArrayss(client_id, field, data);
        res.json(result);  // Return the result to the client
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.list = async (req, res) => {
    try {
        const connection = await Collectiondata.findAll()
        res.status(200).json(connection)

    } catch (error) {
        console.log("List Details Error", error)
        res.status(500).json("Error Accured In List")
    }
}


exports.delete = [
    async (req, res) => {
        try {
            const client_id = req.params.id;
            const result = await Collectiondata.delete(client_id);

            if (result.affectedRows > 0) {

                res.status(200).send({ message: `Client with client_id ${client_id} deleted successfully.` });
            } else {

                res.status(404).send({ message: `Client with client_id ${client_id} not found.` });
            }
        } catch (err) {

            console.error(err);
            res.status(500).send({ message: 'Error deleting client', error: err.message });
        }
    }
];

exports.getpaidid = [
    async (req, res) => {
        try {
            const paid = await Collectiondata.getbyid(req.params.id)
            if (paid) {
                res.json(paid)
            } else {
                res.status(404).json({ error: "Paid Details Not Found" })
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message || "GETBYID list Error" })
        }
    }
]

exports.fetchlist = async (req, res) => {
    try {
        const connection = await Collectiondata.fetchall()
        res.status(200).json(connection)

    } catch (error) {
        console.log("List Details Error", error)
        res.status(500).json("Error Accured In List")
    }
}

exports.fetchUserID = async (req, res) => {
    try {
        const connection = await Collectiondata.fetchUserlist(); // Assuming this method fetches the user list
        res.status(200).json({
            success: true,
            data: connection // Sending the fetched user data in the response
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



