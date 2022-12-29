const crypto = require('crypto');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');
const sendEmail = require('../utils/sendEmail');





// exports.signup = async (req, res, next)=>{

//     const {name, email, password} = req.body;


//       const useExist = await User.findOne({email});
//       if (useExist){
//         return  next(new ErrorResponse("E-mail already taken", 400));
//       }

//   try {


//     const  user = await User.create(req.body);
//     res.status(201).json({
//         success: true,
//         user
//     });

//   } catch (err) {

//    next(err);
//   }
// }


exports.signup = async (req, res, next) => {

  //check if user exist
  const { email, avatar } = req.body;
  const useExist = await User.findOne({ email });
  if (useExist) {
    return next(new ErrorResponse("E-mail already taken", 400));
  }
  if (!avatar) {
    return next(new ErrorResponse("You must add image", 400));
  }

  try {

    const result = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
      crop: "scale"
    })

    // console.log("console reult", result)
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
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
    return next(error);
  }
}


exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email) {
      return next(new ErrorResponse('Please enter an email ', 403));
    }

    if (!password) {
      return next(new ErrorResponse('Please enter a password', 403));
    }
    // check user email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    //check password
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    sendTokenResponse(user, 200, res);
  }

  catch (err) {
    next(err)
  }
}


// LOG OUT USER
exports.logout = (req, res, next) => {

  res.clearCookie('token');

  res.status(200).json({
    success: true,
    message: "Logged out"
  })
}

//GET CURRENT LOG IN USER
exports.userProfile = async (req, res, next) => {

  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  });

}

//FORGET PASSWORD
exports.forgetPassword = async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //const reset url
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;
  const resetUrl = process.env.RESET_PASSWORD_BASE_URL + `/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this e-mail because you (or someone else) has requested the
  reset of a password.<br/> Please click on the link below: <br/><br/>
  <a target="_blank" href=${resetUrl}>${resetUrl}</a>
  <br/> <br/>N.B: The link will expire in 10mn, if it wasn't you, please ignore this e-mail.`;


  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Password',
      message
    })

    res.status(200).json({
      success: true,
      data: 'Email sent'
    });

  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('email cloud not be sent', 500));

  }
}


//RESET PASSWORD
exports.resetPassword = async (req, res, next) => {

  //hash token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('the link is expired', 400));
    }
    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    next();

    res.status(200).json({
      success: true,
      message: 'password was changed with success!'
    });

  } catch (error) {
    console.log(error)
    return next(error);
  }
}

//send the token
const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.getJwtToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.EXPIRE_TOKEN)
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, role: user.role })
}