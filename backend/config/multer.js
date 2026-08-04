const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");

    },


    filename: function(req, file, cb){

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});


const upload = multer({

    storage: storage,

    limits:{
        fileSize: 10 * 1024 * 1024
    }

});

fileFilter:(req,file,cb)=>{

const allowed = [

"image/png",

"image/jpeg",

"image/jpg"

];

if(allowed.includes(file.mimetype)){

return cb(null,true);

}

cb(new Error("Only images allowed"));

}


module.exports = upload;