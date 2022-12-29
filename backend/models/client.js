const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;



const clientSchema = new mongoose.Schema({

    completeName: {
        type: String,
        trim: true,
        required: [true, 'Please add the user name'],
        maxlength: 50
    },


    featuringTitle: {
        type: String,
        trim: true,
        required: [true, 'Please add the featuring title'],
        maxlength: 50,
        unique: true,
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        //index: true
    },

    description: {
        type: String,
        trim: true,
        required: [true, 'Please add the user description'],
        maxlength: 2000
    },

    youtubeLinkFeaturing: {
        type: String,
        trim: true,
        required: [false, 'Please add a youtube link'],
    },

    status: {
        type: Boolean,
        enum : ["yes", "no"],
        default: 'yes'
    },

    links: [
        {
            socialLink: "",
            socialNetworkName: "",
            icon: "",
            visible: {
                type: Boolean,
                enum : ["yes", "no"],
                default: 'yes'
            },
        }
    ],

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    bannerLink: {
        type: String,  
    },

    plan: {
        type: ObjectId,
        ref: 'Plan',
        required: [true, 'Client must have a plan'],
    },


    user: {
        type: ObjectId,
        ref: 'User', 
        required: true
     },
 
    
}, {timestamps: true})




module.exports = mongoose.model("Client", clientSchema);
