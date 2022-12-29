const Client = require('../models/client');
const slugify = require('slugify');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');


exports.createClient = async (req, res, next) => {

    try {

        const { completeName, featuringTitle, description, status, links, youtubeLinkFeaturing, avatar, image, bannerLink, plan, user } = req.body;

        //profile picture for avatar field
        const result = await cloudinary.uploader.upload(avatar, {
            folder: 'profile',
            width: 200,
            crop: "scale"
        });

        //banner picture for image field
        const banner = await cloudinary.uploader.upload(image, {
            folder: 'banner',
            width: 1000,
            crop: "scale"
        });

        // const slug = slugify(featuringTitle);
        const slug = slugify(featuringTitle, {
            replacement: '-',  // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: false,      // convert to lower case, defaults to `false`
            strict: false,     // strip special characters except replacement, defaults to `false`
            locale: 'vi',       // language code of the locale to use
            trim: true         // trim leading and trailing replacement chars, defaults to `true`
        })

        const client = await Client.create({
            completeName,
            featuringTitle,
            slug,
            description,
            status,
            links: req.body.links,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
            image: {
                public_id: banner.public_id,
                url: banner.secure_url
            },

            bannerLink,

            youtubeLinkFeaturing,

            plan,
            user: req.user._id,

        });

        res.status(200).json({
            success: true,
            client
        });

    } catch (err) {
        next(err);
        console.log(err);
    }
}


//GET ALL CLIENTS
exports.allClients = async (req, res, next) => {
    // enable pagination
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Client.find({}).estimatedDocumentCount();

    try {

        const clients = await Client.find().sort({ createdAt: -1 }).populate("plan", "name").populate("user", "name")
            .skip(pageSize * (page - 1))
            .limit(pageSize)

        res.status(200).json({
            success: true,
            clients,
            page,
            pages: Math.ceil(count / pageSize),
            count
        })
        next();
    } catch (error) {
        //return next(new ErrorResponse('Server error', 500));
        console.log(error);
        next(error);
    }
}


//GET  CLIENT BY SLUG
exports.singleClient = async (req, res, next) => {
    const { slug } = req.params;

    try {
        const client = await Client.findOne({ slug }).populate("plan", "name").populate("user", "name");
        res.status(200).json({
            success: true,
            client
        })
        next();
    } catch (error) {
        //return next(new ErrorResponse('Server error', 500));
        console.log(error);
        next(error);
    }
}


//UPDATE SINGLE CLIENT
// exports.updateSingleClient = async (req, res, next)=>{
//     const {slug} = req.params;

//     const {completeName, featuringTitle,  description, status, avatar, image, plan} = req.body;
//     const data = {

//     }

//     try {
//         const client = await Client.findOneAndUpdate({slug},
//              {completeName, featuringTitle,  description, status, avatar, image, plan},
//              {new:true})

//             res.status(200).json({
//             success: true,
//             client
//         })
//         next();
//     } catch (error) {
//         //return next(new ErrorResponse('Server error', 500));
//         console.log(error);
//         next(error);
//     }
// }

exports.updateSingleClient = async (req, res, next) => {


    try {

        const { slug } = req.params;

        const { completeName, featuringTitle, description, status, youtubeLinkFeaturing, bannerLink, plan, links } = req.body;
        const currentClient = await Client.findOne({ slug })

        //build the object data
        const data = {
            completeName: completeName || currentClient.completeName,
            featuringTitle: featuringTitle || currentClient.featuringTitle,
            description: description || currentClient.description,
            status: status || currentClient.status,
            youtubeLinkFeaturing: youtubeLinkFeaturing,
            bannerLink: bannerLink,
            plan: plan !== '' ? plan : currentClient.plan,
            links
        }

        //modify the banner image conditionnaly
        if (req.body.image !== '') {

            const ImgId = currentClient.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'banner',
                width: 1000,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        }

        //modify the avatar image conditionnaly
        if (req.body.avatar !== '') {
            const avatarId = currentClient.image.public_id;
            if (avatarId) {
                await cloudinary.uploader.destroy(avatarId);
            }

            const newAvatar = await cloudinary.uploader.upload(req.body.avatar, {
                folder: 'profile',
                width: 200,
                crop: "scale"
            });

            data.avatar = {
                public_id: newAvatar.public_id,
                url: newAvatar.secure_url
            }
        }

        const clientUpdate = await Client.findOneAndUpdate({ slug }, data, { new: true })

        res.status(200).json({
            success: true,
            clientUpdate
        })

        next();
    } catch (error) {
        //return next(new ErrorResponse('Server error', 500));
        console.log(error);
        next(error);
    }
}





//UPDATE SINGLE CLIENT LINK
exports.updateSingleLink = async (req, res, next) => {
    const { slug } = req.params;

    // const { socialNetworkName, socialLink, icon} = req.body;

    try {

        const link_id = req.params.link_id;
        const client = await Client.updateOne({ 'links._id': link_id },
            {
                '$set': {
                    'links.$.socialNetworkName': req.body.socialNetworkName,
                    'links.$.socialLink': req.body.socialLink,
                    'links.$.icon': req.body.icon,
                    'links.$.visible': req.body.visible
                }
            },
            { new: true }
        )
        //const result = await client.save();
        res.status(201).json({
            success: true,
            message: "Client update",
            client
        })
        next();

    } catch (error) {
        //return next(new ErrorResponse('Server error', 500));
        console.log(error);
        next(error);
    }
}

//ADD NEW CLIENT LINK
exports.addNewSingleLink = async (req, res, next) => {
    const { slug } = req.params;

    try {

        const client = await Client.findOneAndUpdate({ slug },
            {
                $addToSet: {
                    links: {
                        socialNetworkName: req.body.socialNetworkName,
                        socialLink: req.body.socialLink,
                        icon: req.body.icon
                    }
                }
            },
            { new: true }
        )

        res.status(201).json({
            success: true,
            client
        })
        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
}


//DELETE SINGLE CLIENT LINK ////////////////// NOT YET OK
exports.deleteSingleLink = async (req, res, next) => {

    try {

        // const delete_link_id = req.params.delete_link_id;
        // //  const client = await Client.deleteOne({'links._id': delete_link_id})
        //const {slug} = req.params;
        await Client.findOneAndUpdate({ slug: 'dr-felipe-jonas' },
            {
                $pull: {
                    'links.$.id': '62a29a203813c1be4a49dca7'
                }
            },
            { new: true }
        )
        // const client = await Client.updateOne({'links._id': delete_link_id},
        // {'$pull': {}},
        //  {new: true}
        //  )
        //const result = await client.save();
        res.status(201).json({
            success: true,
            message: "Link deleted",
        })
        next();

    } catch (error) {
        //return next(new ErrorResponse('Server error', 500));
        console.log(error);
        next(error);
    }
}




//DELETE SINGLE CLIENT
exports.deleteSingleClient = async (req, res, next) => {
    const { slug } = req.params;
    const currentClient = await Client.findOne({ slug })

    //delete banner image in cloudinary       
    const ImgId = currentClient.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    //delete avatar image in cloudinary       
    const avatarId = currentClient.image.public_id;
    if (avatarId) {
        await cloudinary.uploader.destroy(avatarId);
    }


    try {
        const client = await Client.findOneAndRemove({ slug })

        res.status(200).json({
            success: true,
            message: "User deleted"
        })
        next();
    } catch (error) {
        //return next(new ErrorResponse('Server error', 500));
        console.log(error);
        next(error);
    }
}