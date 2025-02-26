const express = require ("express")

const UserController = require ("../Controller/UserController")
const {verifytoken,adminonly,staffonly} = require ("../Middleware/AuthMiddleware")
 
const router = express.Router()

router.post ("/signup",UserController.createUser)
router.post("/login",UserController.loginUser)
router.get("/list",UserController.list)
router.delete("/delete/:id",verifytoken,staffonly,UserController.delete)
router.put("/updated/:id",UserController.update)

router.get("/fetchUserlistID/:id",UserController.fetchUserID)

router.post("/fetchUserlistIDS",UserController.fetchUserIDS)
router.get("/fetchUserlistIDSS/:id/:assigned_date",UserController.fetchUserIDSS)
// router.get("/fetchUserlistIDS/:id",UserController.fetchUserIDS)

router.post ("/passwordupdated",verifytoken,staffonly,UserController.updatepassword)
router.post ("/request-password-rest",UserController.requestupdate_password)
router.post("/reset-password",UserController.restPassword)


module.exports = router;