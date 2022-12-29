
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');


//create user
exports.createUserController = async (req, res, next) =>{
    const {avatar} = req.body.avatar
    try {
        const result = await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })
       
        res.status(200).json({
            success: true,
            user
            // result
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse('Server error', 500));
    }
}

//show users controller
exports.userController = async (req, res, next) =>{

    // enable pagination
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find().sort({createdAt: -1})
        .skip(pageSize * (page-1))
        .limit(pageSize)

        res.status(200).json({
            success: true,
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse('Server error', 500));
    }
}

//show single user controller
exports.userSingleController = async (req, res, next) =>{

    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse('Server error', 500));
    }
}


//update user controller
exports.userEditController = async (req, res, next) =>{

    const currentUser = await User.findById(req.params.id)
    const {name, email, password} = req.body; 

    //build the object data
    const data = {
        name: name || currentUser.name,
        email: email || currentUser.email,
        password: password || currentUser.password,
    }     
    
    //modify the avatar image conditionnaly
    if (req.body.avatar !== ''){
        const avatarId = currentUser.avatar.public_id;
        if (avatarId){
            await cloudinary.uploader.destroy(avatarId);
        }
        
        const newAvatar  = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'profile',
            width: 200,
            crop: "scale"
        });

        data.avatar ={
            public_id: newAvatar.public_id,
            url: newAvatar.secure_url  
        }
    }

     try {
        const user = await User.findByIdAndUpdate(req.params.id, data, {new: true});
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse('Server error', 500));
    }
}

//delete user controller
exports.deleteUserController = async (req, res) =>{

    const currentUser = await User.findById(req.params.id)
    
    //delete user avatar image in cloudinary       
    const avatarId = currentUser.avatar.public_id;
    if (avatarId){
        await cloudinary.uploader.destroy(avatarId);
    }

    try {
        
        const user = await User.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Usúario deletado"
        });

    } catch (error) {
        console.log(error)
    }

}