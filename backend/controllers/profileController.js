const User = require("../models/User");

const uploadAvatar = async(req,res)=>{

const user = await User.findById(req.user.id);

user.avatar=`/uploads/${req.file.filename}`;

await user.save();

res.json(user);

};

module.exports={uploadAvatar};