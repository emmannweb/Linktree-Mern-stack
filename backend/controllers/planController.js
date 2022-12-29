const mongoose = require('mongoose');
const Plan = require('../models/plan');

//CREATE A PLAN
exports.planController = async (req, res) =>{

    try {
        const {name, price} = req.body;
 
        const plan = await Plan.create({ name, price });

        res.status(200).json({
            success: true,
            plan
        
        });
    } catch (error) {
        console.log(error)
    }

}


//SINGLE PLAN
exports.singlePlanController = async (req, res,  next) =>{

    try {
 
        //const plan = await Plan.findById(req.params.id);
        const plan = await Plan.findById(req.params.id);

        res.status(200).json({
            success: true,
            plan
        
        });
        next();
    } catch (error) {
        console.log(error)
    }

}


//ALL PLAN
exports.allPlanController = async (req, res) =>{

    try {

        const plans = await Plan.find();

        res.status(200).json({
            success: true,
            plans
        
        });
    } catch (error) {
        console.log(error)
    }

}


//EDIT SINGLE PLAN
exports.editSinglePlanController = async (req, res) =>{

    try {
        const {name, price} = req.body;
        const plan = await Plan.findByIdAndUpdate(req.params.id, {name, price}, {new:true});

        res.status(200).json({
            success: true,
            plan
        
        });
    } catch (error) {
        console.log(error)
    }

}


//DELETE PLAN
exports.deletePlanController = async (req, res) =>{

    try {
        const {name} = req.body;
        const plan = await Plan.findByIdAndRemove(req.params.id);

        res.status(200).json({
            success: true,
            message: "plan deleted"
        
        });
    } catch (error) {
        console.log(error)
    }

}