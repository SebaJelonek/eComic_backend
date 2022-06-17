const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

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
  const pdfID = req.files.pdf[0].id.toString();
  const imgID = req.files.thumbnail[0].id.toString();
  res.json({ msg: 'files uploaded', pdfID, imgID });
};

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

const downloadFilesByID = ({ params: { id } }, res) => {
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, file) => {
    if (err) {
      return res.status(400).json({ msg: 'error file not found' });
    }
    if (!file || file.length === 0) {
      return res.status(400).json({ msg: 'no file exists' });
    }
    gfs.openDownloadStream(_id).pipe(res);
  });
};

module.exports = { uploadFiles, uploadFields, downloadFilesByID };
