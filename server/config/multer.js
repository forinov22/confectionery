const multer = require('multer')
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/confectioneries/');
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);

        cb(null, `${randomString}${extension}`);
    }
});

const upload = multer({ storage: storage })

module.exports = upload;