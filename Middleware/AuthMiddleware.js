const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifytoken = (req, res, next) => {
    const token = req.header("Authorization");
    
    if (!token) 
        return res.status(401).json ({error:'Access Defined'});
    try {
        // Decode the token using the secret key
        const decoded = jwt.verify(token,'HCC-COLLECTION-PROJECT');
        req.user_id = decoded.user_id; // Assign decoded values to req object
        req.email = decoded.email;
        req.role = decoded.role;
        
        next(); // Move to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};

// Middleware for Admin only access
exports.adminonly = (req, res, next) => {
    if (req.role !== "Admin") {  // Assuming role is on the decoded JWT token
        return res.status(403).json({ error: "Access Denied. Admin Only" });
    }
    next();
};
 
// Middleware for Collection Manager or Collection Agent only
// exports.staffonly = (req, res, next) => {
//     if (req.role !== "Collection Manager"  && req.role !== "Admin") {
//         return res.status(403).json({ error: "Access Denied. Admin or Collection Agent Only" });
//     }
//     next();
//     // exports.staffonly = (req, res, next) => {
//     //     if (req.role !== "Collection Manager" && req.role !== "Collection Agent") {
//     //         return res.status(403).json({ error: "Access Denied. Collection Agent or Collection Manager Only" });
//     //     }
//     //     next();
// };


exports.staffonly = (req, res, next) => {
    if (req.role !== "Collection Manager"  && req.role !== "Admin" && req.role !== "Collection Agent") {
        return res.status(403).json({ error: "Access Denied. Admin or Collection Agent Only or Collection Manager" });
    }
    next();
    // exports.staffonly = (req, res, next) => {
    //     if (req.role !== "Collection Manager" && req.role !== "Collection Agent") {
    //         return res.status(403).json({ error: "Access Denied. Collection Agent or Collection Manager Only" });
    //     }
    //     next();
};