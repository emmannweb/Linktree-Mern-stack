const express = require('express');
const router = express.Router();
const {isAuthenticated, isAdmin} = require("../middleware/auth");
const {planController, singlePlanController, allPlanController, editSinglePlanController, deletePlanController } = require('../controllers/planController');

//PLAN ROUTE PREFIX / api/v1/plan/create (ex:)
router.post('/plan/create', isAuthenticated, planController);
router.get('/plan/all', isAuthenticated, allPlanController);
router.get('/plan/:id',  isAuthenticated, singlePlanController);
router.put('/plan/edit/:id', isAuthenticated, editSinglePlanController);
router.delete('/plan/delete/:id', isAuthenticated, deletePlanController);

module.exports = router;