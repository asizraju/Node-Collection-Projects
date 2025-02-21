// const mysql = require('mysql2');
const { body } = require("express-validator");
const db = require("../config/Database")

// Class for handling collection data
class connection {
    // Method to wrap queries in promises
    static query(sql, params) {
        return new Promise((resolve, reject) => {

            db.query(sql, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    // static async create(data) {
    //     const { client_name, client_contact, client_city, amount, date, updated_amount, paid_amount_time, paid_amount_date, overall_amount, paid_and_unpaid, Sucess_and_unsucess,send ,user_id} = data;

    //     const result = await connection.query(
    //         'INSERT INTO collectionlist (client_name, client_contact, client_city, amount, date, updated_amount, paid_amount_time, paid_amount_date, overall_amount, paid_and_unpaid, Sucess_and_unsucess,send,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)',
    //         [client_name, client_contact, client_city, amount, date, updated_amount, paid_amount_time, paid_amount_date, overall_amount, paid_and_unpaid, Sucess_and_unsucess,send,,user_id]
    //     );
    //     return result.insertId;
    // }

    // static async createarray(data) {
    //     const { 
    //         client_name, 
    //         client_contact, 
    //         client_city, 
    //         amount, 
    //         date, 
    //         updated_amount, 
    //         paid_amount_time, 
    //         paid_amount_date, 
    //         overall_amount, 
    //         paid_and_unpaid, 
    //         success_and_unsuccess,
    //         send,
    //         sent,
    //         user_id
    //     } = data;

    //     // Insert the 'send' and 'sent' fields as boolean values (true/false)
    //     const result = await connection.query(
    //         'INSERT INTO collectionlistarrays (client_name, client_contact, client_city, amount, date, updated_amount, paid_amount_time, paid_amount_date, overall_amount, paid_and_unpaid,success_and_unsuccess, send, sent,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    //         [
    //             client_name,             // Store as plain value
    //             JSON.stringify(client_contact), // Store as JSON array (if it is an array)
    //             client_city,             // Store as plain value
    //             JSON.stringify(amount),  // Store as JSON array (if it is an array)
    //             date,    // Store as JSON array (if it is an array)
    //             JSON.stringify(updated_amount),  // Store as JSON array (if it is an array)
    //             JSON.stringify(paid_amount_time),     // Store as JSON array (if it is an array)
    //             JSON.stringify(paid_amount_date), // Store as JSON array (if it is an array)
    //             JSON.stringify(overall_amount),     // Store as JSON array (if it is an array)
    //             paid_and_unpaid,    // Store as JSON array of boolean values
    //             success_and_unsuccess, // Store as JSON array of boolean values
    //             send,
    //             sent,  
    //             JSON.stringify(user_id)             // Store as boolean value (true/false)
    //         ]
    //     );

    //     return result.insertId;
    // }
    static async createarrays(data) {
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
            sent,
            user_id,
            Distributor_id,
            assigned_date,
            picture,
            today_rate,
            accno,
            bank_name,
            ifsc_code,
            accoun_type,
            name_of_the_beneficiary,
            address_of_the_beneficiary,
            sender_information,
            narration,
            bank_type,
            local,
            international
        } = data;

        // Insert the 'send' and 'sent' fields as boolean values (true/false)
        const result = await connection.query(
            'INSERT INTO collectionlistarrayss (client_name, client_contact, client_city, amount, date, updated_amount, paid_amount_time, paid_amount_date, overall_amount, paid_and_unpaid, success_and_unsuccess, send, sent, user_id,Distributor_id,assigned_date, picture, today_rate,accno,bank_name,ifsc_code,accoun_type,name_of_the_beneficiary,address_of_the_beneficiary,sender_information,narration,bank_type,local,international) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                client_name,             // Store as plain value
                JSON.stringify(client_contact), // Store as JSON array (if it is an array)
                client_city,             // Store as plain value
                JSON.stringify(amount),
                JSON.stringify(date),    // Store as JSON array (if it is an array)
                JSON.stringify(updated_amount),  // Store as JSON array (if it is an array)
                JSON.stringify(paid_amount_time),     // Store as JSON array (if it is an array)
                JSON.stringify(paid_amount_date), // Store as JSON array (if it is an array)
                JSON.stringify(overall_amount),     // Store as JSON array (if it is an array)
                paid_and_unpaid,    // Store as JSON array of boolean values
                success_and_unsuccess, // Store as JSON array of boolean values
                JSON.stringify(send),
                sent,
                user_id,
                Distributor_id,
                JSON.stringify(assigned_date),
                picture,
                JSON.stringify(today_rate),
                JSON.stringify(accno),
                JSON.stringify(bank_name),
                JSON.stringify(ifsc_code),
                JSON.stringify(accoun_type),
                JSON.stringify(name_of_the_beneficiary),
                JSON.stringify(address_of_the_beneficiary),
                JSON.stringify(sender_information),
                JSON.stringify(narration),
                JSON.stringify(bank_type),
                local,
            international
            ]
        );

        return result.insertId;
    }


    static async clientupdate(client_id, data) {
        const { client_name, client_contact, client_city, amount, updated_amount, overall_amount, success_and_unsuccess, 
            sent,
            Distributor_id,
            today_rate,
            accno,
            bank_name,
            ifsc_code,
            accoun_type,
            name_of_the_beneficiary,
            address_of_the_beneficiary,
            sender_information,
            narration,
            bank_type,
            local,
            international
        } = data
        const result = await connection.query(
            'UPDATE collectionlistarrayss SET client_name = ?, client_contact = ?, client_city = ?, amount = ?,  updated_amount = ?, overall_amount = ?,  success_and_unsuccess = ? ,sent = ?, Distributor_id = ?, today_rate = ? , accno = ?,bank_name= ?,ifsc_code= ?,accoun_type=?,name_of_the_beneficiary =?,address_of_the_beneficiary =?,sender_information=? ,narration = ?,bank_type = ?, local = ? , international = ? WHERE client_id = ?',
            [client_name,
                JSON.stringify(client_contact),
                client_city,
                JSON.stringify(amount),
                JSON.stringify(updated_amount),
                JSON.stringify(overall_amount),
                success_and_unsuccess,
                sent,
                Distributor_id,
                JSON.stringify(today_rate),
                JSON.stringify(accno),
                JSON.stringify(bank_name),
                JSON.stringify(ifsc_code),
                JSON.stringify(accoun_type),
                JSON.stringify(name_of_the_beneficiary),
                JSON.stringify(address_of_the_beneficiary),
                JSON.stringify(sender_information),
                JSON.stringify(narration),
                JSON.stringify(bank_type),
                local,
            international,
                client_id]
        );
        return result;
    }

    static async update(client_id, data) {
        const {
            paid_amount_time,
            paid_amount_date,
            paid_and_unpaid,
        } = data;
        await connection.query(
            'UPDATE collectionlistarrayss SET  paid_amount_time = ?, paid_amount_date = ?,paid_and_unpaid = ? WHERE client_id = ?',
            [JSON.stringify(paid_amount_time),     // Store as JSON array (if it is an array)
            JSON.stringify(paid_amount_date),
                paid_and_unpaid,
                client_id]
        );
    }

    static async updatebankdetails(client_id, data) {
        const {
            today_rate,
            accno,
            amount,
            bank_name,
            ifsc_code,
            accoun_type,
            name_of_the_beneficiary,
            address_of_the_beneficiary,
            sender_information
        } = data;
        await connection.query(
            'UPDATE collectionlistarrayss SET today_rate = ? , accno = ?, amount = ?, bank_name= ?,ifsc_code= ?,accoun_type=?,name_of_the_beneficiary =?,address_of_the_beneficiary =?,sender_information=? WHERE client_id = ?',
            [
                JSON.stringify(today_rate),
                JSON.stringify(accno),
                JSON.stringify(amount),
                JSON.stringify(bank_name),
                JSON.stringify(ifsc_code),
                JSON.stringify(accoun_type),
                JSON.stringify(name_of_the_beneficiary),
                JSON.stringify(address_of_the_beneficiary),
                JSON.stringify(sender_information),
                client_id]
        );
    }


    // static async update_client (client_id ,data) {
    //     const{
    //         client_name,
    //         client_contact,
    //         client_city,

    //     }
    // }


   
    static async pushClientID(client_id, data) {
        const { user_id,assigned_date , sent } = data
        const result = await connection.query(
            'UPDATE collectionlistarrayss SET user_id = ?,  assigned_date = ? ,sent = ? WHERE client_id = ?',
            [user_id,
                assigned_date,
                sent,
                client_id
            ]
        )
        return result;
    }

    static async push(client_id, data) {
        const { paid_amount, paid_amount_date } = data;

        try {
            // Step 1: Retrieve the current values from the database
            const [rows] = await connection.promise().query(
                'SELECT paid_amount, paid_amount_date FROM collectionlistarrayss WHERE client_id = ?',
                [client_id]
            );

            if (rows.length === 0) {
                throw new Error(`Client with ID ${client_id} not found.`);
            }

            let current_paid_amount = JSON.parse(rows[0].paid_amount || '[]');
            let current_paid_amount_date = JSON.parse(rows[0].paid_amount_date || '[]');

            // Step 3: Push the new values to the respective arrays
            if (paid_amount) {
                current_paid_amount.push(paid_amount);
            }
            if (paid_amount_date) {
                current_paid_amount_date.push(paid_amount_date);
            }

            // Step 4: Update the database with the new values (after converting arrays back to JSON)
            await connection.promise().query(
                'UPDATE collectionlistarrayss SET paid_amount = ?, paid_amount_date = ?  WHERE client_id = ?',
                [
                    JSON.stringify(current_paid_amount),
                    JSON.stringify(current_paid_amount_date),
                    client_id
                ]
            );

            return { message: `Successfully updated client ${client_id} with new data.` };
        } catch (error) {
            console.error('Error updating collection:', error);
            throw error; // Optionally rethrow or handle error here
        }
    }


    static async pushToArray(clientId, field, newValue) {
        // The field (e.g., 'paid_amount') is dynamically provided
        // Append the new value to the existing JSON array

        const query = `
            UPDATE collectionlistarrayss 
            SET ${field} = JSON_ARRAY_APPEND(${field}, '$', ?)
            WHERE client_id = ?
        `;

        const result = await connection.query(query, [newValue, clientId]);

        return result;
    }

    // static async pushToArrays(clientId, field, newValue, dateValue) {
    //     // Append newValue to the specified field and add the corresponding paid_amount_date
    //     const query = `
    //         UPDATE collectionlistarrayss 
    //         SET ${field} = JSON_ARRAY_APPEND(${field}, '$', ?),
    //             paid_amount_date = JSON_ARRAY_APPEND(paid_amount_date, '$', ?)
    //         WHERE client_id = ?
    //     `;

    //     const result = await connection.query(query, [newValue, dateValue, clientId]);

    //     return result;
    // }


    // static async pushToArrayss(client_id, field, data) {
    //     // Initialize the query string
    //     let query = `
    //         UPDATE collectionlistarrayss
    //         SET ${field} = JSON_ARRAY_APPEND(${field}, '$', ?)
    //         WHERE client_id = ?
    //     `;

    //     // Prepare the result variable
    //     let result = null;

    //     // Loop through the data and insert each item
    //     for (const item of data) {
    //         // Prepare the values for the current item [amount, date] as an array
    //         const values = [[item.amount, item.date], client_id];

    //         // Execute the query with the correct parameters for each item
    //         result = await connection.query(query, values);
    //     }

    //     // Return the final result
    //     return result;
    // }



    static async findAll() {
        const result = await connection.query('SELECT * FROM collectionlistarrayss');
        return result
    }

    static async delete(client_id) {
        const result = await connection.query('DELETE FROM collectionlistarrayss WHERE client_id = ?', [client_id]);
        return result;
    }

    static async getbyid(client_id) {
        const result = await connection.query('SELECT FROM collectionlistarrays WHERE client_id = ? ', [client_id])
        return result;
    }


    static async fetchall() {
        try {
            // Fetch all from collectionlistarray
            const result1 = await connection.query('SELECT * FROM collectionlistarray');

            // Join collectionlistarray with paidlist
            const query = `
                SELECT
                   c.client_id, 
                   c.client_name, 
                   c.client_contact, 
                   c.client_city, 
                   c.amount, 
                   c.date, 
                   c.updated_amount, 
                   p.paid_amounts AS paid_amount,
                   c.overall_amount, 
                   c.paid_and_unpaid, 
                   c.Sucess_and_unsucess, 
                   c.send, 
                   c.sent,
                    p.paid_id, 
                   p.paid_amounts,
                   p.paid_amounts_date_time, 
                   p.send AS paidlist_send
                FROM 
                    collectionlistarray c
                JOIN 
                    paidlist p ON c.client_id = p.client_id;
            `;

            // Execute the join query
            const result2 = await connection.query(query);

            // Return both results
            return {
                collectionlists: result1,
                paidlistJoin: result2
            };
        } catch (error) {
            console.error('Error executing queries:', error.message); // Log error message for debugging
            throw new Error('Error fetching data'); // Consider returning more specific error
        }
    }

    static async fetchUserlist() {
        try {
            // Fetching data from collectionlistarrayss
            const resultUser = await connection.query('SELECT * FROM collectionlistarrayss');

            // Corrected query with the right JOIN structure
            const query = `
                SELECT 
                  U.user_id,
                    U.username,
                    U.phone_number,
                    U.sent AS collected_sent,
                    c.client_id, 
                    c.client_name, 
                    c.client_contact, 
                    c.client_city, 
                    c.amount, 
                    c.date, 
                    c.updated_amount, 
                    c.paid_amount_time,
                    c.paid_amount_date,
                    c.overall_amount, 
                    c.paid_and_unpaid, 
                    c.success_and_unsuccess, 
                    c.send, 
                    c.sent
                  
                FROM
                    collectionlistarrayss c
                JOIN
                    registertable U ON c.user_id = U.user_id 
            `;
            // Fetching the collection data from registertable and collectionlistarrayss
            const resultCollection = await connection.query(query);

            // Example of working with the arrays if needed
            const combinedData = resultUser.map(client => {
                // Find matching collection for each user
                const userCollection = resultCollection.filter(collection =>

                    collection.client_id === client.client_id);
                return {
                    ...client,
                    collections: userCollection // Adding collections data to user object
                };
            });

            return {
                // Userlist: resultUser,
                Collectionlist: resultCollection,
                // CombinedData: combinedData // Returning combined data with user and collections merged
            };

        } catch (error) {
            console.error("Error fetching user details:", error.message);
            throw new Error("Error fetching all details");
        }
    }


}

// Export the MySQL connection
module.exports = connection;
