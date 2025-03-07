const { Collection } = require("mongoose");
const db = require ("../config/Database");
const UserImages = require ("../Uploads/Upload")
// const { create } = require("./CollectonModules");


class User {
    static query (sql,params) {
        return new Promise ((resolve,reject)=>{
            db.query (sql,params,(err,results)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(results)
                }
            })
        })
    }

// const Users = {
//     create: (username, email, hashedPassword, role, callback) => {
//       const query = 'INSERT INTO users (username, email, encrypted_password, role) VALUES (?, ?, ?, ?)';
//       db.query(query, [username, email, hashedPassword, role], callback);
//     },

// }



static async create (data) {
  
    const {username , email , password, phone_number ,city, photo,role,sent } = data

    const result = await User.query(
        'INSERT INTO registertable (username , email, password , phone_number ,city,photo, role,sent ) VALUES (?,?,?,?,?,?,?,?)',
        [username, email,password,phone_number ,city,photo, role,sent]
    );
    return result.insertid;
}

static async findAll() {
    const result = await User.query('SELECT * FROM registertable');
    return result; // Array of user objects
}

static async delete(user_id) {
    const result = await User.query('DELETE FROM registertable WHERE user_id = ?', [user_id]);
    return result;
}

static async update(user_id,data) {
    try {
        const {email, username, phone_number, city, role, photo} = data
        const result = await User.query(
            'UPDATE registertable SET email = ?, username = ?, phone_number = ?, city = ?, role = ?, photo = ? WHERE user_id = ?',
            [email, username,  phone_number, city, role, photo,user_id]
        );
        return result;  // Returns the result of the update operation
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;  // Rethrow the error so it can be handled later
    }
}

static async updateDistributorAmounts(user_id, data) {
    const { today_rate_date, Distributor_today_rate } = data;

    try {
        // Ensure user_id is provided
        if (!user_id) {
            throw new Error("User ID is required");
        }

        // Update the distributor amount for the user
        const result = await User.query(
            `UPDATE registertable
             SET today_rate_date = ?, Distributor_today_rate = ?
             WHERE user_id = ?`,
            [today_rate_date, Distributor_today_rate, user_id]
        );

        // Create an event to reset distributor rate daily (for all users)
        await User.query(
            `CREATE EVENT IF NOT EXISTS reset_distributor_rate
             ON SCHEDULE EVERY 1 DAY
             DO UPDATE registertable SET Distributor_today_rate = 0.00 
             WHERE today_rate_date < CURDATE() - INTERVAL 1 DAY`
        );

        return { success: true, message: "Updated and reset event scheduled.", result };
    } catch (error) {
        console.error("Error updating distributor amounts:", error);
        throw error;
    }
}

// static async updateDistributorAmounts(user_id, data) {
//     const { today_rate_date, Distributor_today_rate } = data;

//     try {
//         const result = await User.query(
//             `UPDATE registertable
//              SET  
//                  today_rate_date = ?, 
//                  Distributor_today_rate = CASE 
//                      WHEN today_rate_date < CURDATE() - INTERVAL 1 DAY THEN NULL 
//                      ELSE ? 
//                  END
//              WHERE user_id = ?`,
//             [today_rate_date, Distributor_today_rate, user_id]
//         );

//         return { success: true, result };
//     } catch (error) {
//         console.error("Error updating distributor amounts:", error);
//         return { success: false, error: error.message };
//     }
// }


// static async fetchUserlistID() {
//     try {
//         const resultUser = await User.query('SELECT * FROM registertable');
        
//         const query = `
//             SELECT 
//                 U.user_id,
//                 U.username,
//                 U.phone_number,
//                 c.client_id, 
//                 c.client_name, 
//                 c.client_contact, 
//                 c.client_city, 
//                 c.amount, 
//                 c.date, 
//                 c.updated_amount, 
//                 c.paid_amount_time,
//                 c.paid_amount_date,
//                 c.overall_amount, 
//                 c.paid_and_unpaid, 
//                 c.success_and_unsuccess, 
//                 c.send, 
//                 c.sent AS collected_sent
//             FROM
//                 registertable U
//             JOIN
//                 collectionlistarrayss c ON U.user_id = c.user_id
//         `;

//         const resultCollection = await User.query(query);

//         // Example of working with the arrays if needed
//         const combinedData = resultUser.map(user => {
//             // Find matching collection for each user
//             const userCollection = resultCollection.filter(collection => 
                
//                 collection.user_id === user.user_id);
//             return {
//                 ...user,
//                 collections: userCollection // Adding collections data to user object
//             };
//         });

//         return {
//             // Userlist: resultUser,
//             // Collectionlist: resultCollection,
//             CombinedData: combinedData // Returning combined data with user and collections merged
//         };

//     } catch (error) {
//         console.error(error.message, "Error fetching user details");
//         throw new Error("Error fetching all details");
//     }
// }

static async fetchUserlistID(user_id) {
    try {
        // Query for user details from the registertable based on a specific user_id
        const resultUser = await User.query('SELECT * FROM registertable WHERE user_id = ?', [user_id]);
        
        // Query for collections data based on the provided user_id
        const query = `
            SELECT 
                U.user_id,
                U.username,
                U.phone_number,
                c.client_id, 
                c.client_name, 
                c.client_contact, 
                c.client_city, 
                c.amount, 
                c.date, 
                c.updated_amount, 
                c.assigned_date,
                c.today_rate,
                c.paid_amount_time,
                c.paid_amount_date,
                c.overall_amount, 
                c.paid_and_unpaid, 
                c.success_and_unsuccess, 
                c.send, 
                c.sent AS collected_sent
            FROM
                registertable U
            JOIN
                collectionlistarrayss c ON U.user_id = c.user_id
            WHERE
                U.user_id = ?
        `;
        const resultCollection = await User.query(query, [user_id]);

        // Combine user and collection data into a single object
        const combinedData = resultUser.map(user => {
            const userCollection = resultCollection.filter(collection => collection.user_id === user.user_id);
            return {
                ...user,
                collections: userCollection // Adding collections data to the user object
            };
        });

        return {
            CombinedData: combinedData // Returning combined data with user and collections merged
        };

    } catch (error) {
        console.error(error.message, "Error fetching user details");
        throw new Error("Error fetching user details");
    }
}


static async fetchUserlistIDS(user_id ,assigned_date) {
    try {
        // Query for user details from the registertable based on a specific user_id
        
        const resultUser = await User.query('SELECT * FROM registertable WHERE user_id = ?', [user_id]);
        
        const query = `
            SELECT 
                U.user_id,
                U.username,
                U.phone_number,
                c.client_id, 
                c.client_name, 
                c.client_contact, 
                c.client_city, 
                c.amount, 
                c.date, 
                c.updated_amount, 
                c.assigned_date,
                c.today_rate,
                c.paid_amount_time,
                c.paid_amount_date,
                c.overall_amount, 
                c.paid_and_unpaid,
                c.success_and_unsuccess, 
                c.send, 
                c.sent AS collected_sent
            FROM
                registertable U
            JOIN
                collectionlistarrayss c ON U.user_id = c.user_id 
            WHERE
                U.user_id = ? AND c.assigned_date = ?
        `; 
        const resultCollection = await User.query(query, [user_id,assigned_date]);

        // Combine user and collection data into a single object
        const combinedData = resultUser.map(user => {
            const userCollection = resultCollection.filter(collection => collection.user_id === user.user_id);
            // userCollection.forEach(item => {
            //     item.assigned_date = new Date(); // For example, assigning the current date
            // });
            // userCollection.map(users=>{
            //     const usersCollection = resultCollection.filter (collection => collection.assigned_date === user.assigned_date)
            // })

            return {
                ...user,
                collections: userCollection // Adding collections data to the user object
            };
        });

        return {
            CombinedData: combinedData // Returning combined data with user and collections merged
        };

    } catch (error) {
        console.error(error.message, "Error fetching user details");
        throw new Error("Error fetching user details");
    }
}

static async login(email, password) {
    
    const user = await User.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      
        throw new Error('Invalid password');
    }
    return user;
}

static async updateResetToken(email, token) {
    try {
        const result = await User.query(
            'UPDATE registertable SET rest_token = ?, rest_token_expiry = ? WHERE email = ?',
            [token, email]
        );
        return result;
    } catch (error) {
        console.error("Token not generated", error);
    }
}



static async findByEmail(email) {
    const result = await User.query("SELECT * FROM registertable WHERE email = ?", [email]);
    return result.length ? result[0] : null; // Return user if found, otherwise return null
}

static async updated_Password(email, password) {
    try {
        const result = await User.query(
            'UPDATE registertable SET password = ? WHERE email = ?',
            // 'UPDATE registertable SET password = ?, rest_token = NULL, rest_token_expiry = NULL WHERE email = ?',
            [password, email]
        );
        return result;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error; // Rethrow or handle error as needed
    }
}

static async setResetToken(email, token, expiry) {
    try {
        const result = await User.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
            [token, expiry, email]
        );
        return result;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error updating reset token:', error);
        throw error;  // Optional: rethrow the error so it can be handled by the caller
    }
}

static async clearResetToken(email) { 
    try {
        const result = await User.query(
            'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
            [email]
        );
        return result;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error clearing reset token:', error);
        throw error;  // Optional: rethrow the error so it can be handled by the caller
    }
}

static async creates (data) {
    const {username , email , password, phone_number ,city, role , photo ,send,id } = data

    const result = await User.query(
        'INSERT INTO registertable (username , email, password , phone_number ,city, role , photo,send,id ) VALUES (?,?,?,?,?,?,?,?,?)',
        [username, email,password,phone_number ,city, role , photo ,send,id]
    );
    return result.insertid;
}

}

module.exports = User