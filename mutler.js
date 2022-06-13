const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;

const uploadFile = (fileName) => {
  const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const fileNameDB = Date.now() + '__' + fileName;
        const fileInfo = {
          filename: fileNameDB,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    },
  });

  const upload = multer({ storage });

  return upload;
};

module.exports = uploadFile;
