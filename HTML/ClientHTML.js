


// //Client Create
// app.get('/account_insert', (req, res) => {
//     const account_insert = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Add New Client</title>
//         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
//       </head>
//       <body>
//         <div class="container mt-5">
//           <div class="modal-header">
//             <h5 class="modal-title">Add New Client</h5>
//           </div>
//           <div class="modal-body">
//             <form action="/acc_insertarrays" method="POST">
//               <div class="txt_field">
//                 <input type="text" name="client_name" required />
//                 <label>Client Name</label>
//               </div>
  
//               <div class="txt_field">
//                 <input type="text" name="client_contact" required />
//                 <label>Client Contact Number</label>
//               </div>
  
//               <div class="txt_field">
//                 <input type="text" name="client_city" required />
//                 <label>City</label>
//               </div>
  
//               <div class="txt_field">
//                 <input type="number" name="amount" required />
//                 <label>Amount</label>
//               </div>
//               <div class="modal-footer">
//                 <button type="button" class="btn btn-secondary">Close</button>
//                 <button type="submit" class="btn btn-primary">Save Changes</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
  
//     res.send(account_insert);
//   });


  
//   app.post('/acc_insertarrays',(req,res)=>{
//     const { client_name, client_contact, client_city, amount} = req.body;
//     res.send('Client data received and processed');
//   });


//   app.get ('/acc_list',(req,res)=>{
//     res.send('Client Details Page')
//   })
