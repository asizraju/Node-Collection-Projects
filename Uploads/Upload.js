const multer = require ("multer")
const path = require ("path")

const userstorage = multer.diskStorage ({
    destination : (req,file,cb) =>{
        cb(null,'\Assetss')  
    },
    filename : (req,file,cb) =>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const UserImages = multer ({storage:userstorage})

module.exports = UserImages