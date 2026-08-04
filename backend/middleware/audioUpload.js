const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({

destination: function(req,file,cb){

cb(null,"uploads/audio");

},


filename: function(req,file,cb){

const uniqueName =
Date.now() +
path.extname(file.originalname);

cb(null,uniqueName);

}

});


const audioUpload = multer({

storage,

limits:{
fileSize: 25 * 1024 * 1024
}

});


module.exports = audioUpload;