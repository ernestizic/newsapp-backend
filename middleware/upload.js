const multer = require('multer');
const path = require('path');
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary')


// STORAGE FOR CLOUDINARY
const fileStorageEngine = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'images',
    }
})



// Check file type
const checkFileType =(file, cb)=> {
    // Allowed extentions
    const filetypes = /jpeg|jpg|png|gif|jfif/;
    // Check extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname){
        return cb(null, true);
    }else {
        cb("Error: Images Only!")
    }
}

// initialize and export upload
module.exports = multer({
    storage: fileStorageEngine,
    limits: {fileSize: 1000000}, //1000000 Bytes = 1 MB
    fileFilter: (req, file, cb)=> {
        checkFileType(file, cb);
    }
}).single('myImage');
