const express = require ("express")

const UserController = require ("../Controller/UserController")
const {verifytoken,staffonly,adminonly} = require ("../Middleware/AuthMiddleware")
 
const router = express.Router()

router.post ("/signup",UserController.createUser)
router.post("/login",UserController.loginUser)
router.get("/list",verifytoken,staffonly,UserController.list)
router.delete("/delete/:id",verifytoken,adminonly,UserController.delete)
router.put("/updated/:id",UserController.update)

router.get("/fetchUserlistID",UserController.fetchUserID)

router.get("/fetchUserlistIDS/:id",UserController.fetchUserIDS)

router.post ("/passwordupdated",UserController.updatepassword)





module.exports = router;