const multer = require('multer')

function filterFile(props) {
    let { allowedMimeTypes } = props;
    return multer({
        fileFilter: (req, file, callback) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                return callback(err, false);
            }
            callback(null, true);
        },
        onError: (err, next) => {
            next(err);a
        }
    });
}

module.exports = {
    uploadImage:filterFile({
        allowedMimeTypes: [
            'image/png',
            'image/jpeg',
            'image/jpg'
        ]
    })
}