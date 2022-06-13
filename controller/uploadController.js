const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileNameDB = Date.now() + '__' + file.originalname;
      const fileInfo = {
        filename: fileNameDB,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  },
});
const upload = multer({ storage });

// upload files by field names
// name of the field must much the name of the field on front-end
// or the name on FormData object
const uploadFields = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

const uploadFiles = (req, res) => {
  const pdfName = req.files.pdf[0].filename;
  const imgName = req.files.thumbnail[0].filename;
  res.json({ msg: 'files uploaded', pdfName, imgName });
};

module.exports = { uploadFiles, uploadFields };
