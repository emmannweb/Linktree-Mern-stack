const express = require('express');
const router = express.Router();
const {createClient,
     allClients,
     singleClient, 
     updateSingleClient,
     deleteSingleClient,
     updateSingleLink,
     deleteSingleLink,
     addNewSingleLink} = require('../controllers/clientController');

const {isAuthenticated, isSuperAdmin} = require('../middleware/auth');

//CLIENT ROUTE / api/v1/client/create
router.post('/client/create', isAuthenticated, createClient);
router.get('/clients/all', isAuthenticated,  allClients);
router.get('/client/:slug',  singleClient);
router.put('/client/update/:slug', isAuthenticated, updateSingleClient);
router.put('/client/link/update/:link_id', isAuthenticated, updateSingleLink);
router.put('/client/link/delete/:slug', deleteSingleLink);
router.put('/client/addlink/:slug', addNewSingleLink);
router.delete('/client/delete/:slug', isAuthenticated, isSuperAdmin, deleteSingleClient);
module.exports = router;