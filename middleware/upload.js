const multer = require('multer');
const path = require('path');


// Multer middleware
// Set storage engine
const fileStorageEngine = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
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
