
const express = require('express');
const CollectionController = require('../Controller/CollectionController');



// const Auth = require ("../Middleware/AuthMiddleware")

const {verifytoken,adminonly,staffonly  } = require ("../Middleware/AuthMiddleware")



const router = express.Router();




router.post('/acc_insert', CollectionController.createCollection);
router.post('/acc_insertarray',CollectionController.createCollectionarray)


router.post('/acc_insertarrays',CollectionController.createCollectionarrays)

router.get ('/acc_list',verifytoken,CollectionController.list);
// router.get ('/acc_list',CollectionController.list);

router.get ('/acc_list_manager',CollectionController.list);

router.get('/acc_fetchlist',CollectionController.fetchlist);
router.delete('/acc_delete/:id',CollectionController.delete)
router.put('/acc_updated/:id',CollectionController.update)//
router.put ('/updated_bankdetails/:id',CollectionController.updatebankdetails)
router.put ('/acc_clientupdated/:id',CollectionController.clientupdate)
router.put ("/client_IDupdated/:id",CollectionController.pushClientID)
router.post('/push/:client_id',CollectionController.push)
router.post('/pusharray',CollectionController.pushToArray)
router.post('/pusharrays',CollectionController.pushToArrays)
router.post('/pusharrayss',CollectionController.pushToArrayss)
router.post('/pusharraysss',CollectionController.pushToArraysss)
router.get('/acc_getpaidid/:id',CollectionController.getpaidid)

router.get("/fetchUserlist",CollectionController.fetchUserID)

//list 
// router.post("/calculateTodayclient_report",ReportController.getDailyReport)
// router.post("/calculateWeeklyclient_report",ReportController.getWeeklyReport)
// router.post("/calculateMonthlyclient_report",ReportController.getMonthlyReport)
// router.post("/calculateMonthly_report",ReportController.getmonthlyreport)


module.exports=router
