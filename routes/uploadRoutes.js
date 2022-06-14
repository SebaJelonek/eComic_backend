const { Router } = require('express');

const {
  uploadFiles,
  uploadFields,
  downloadFilesByID,
} = require('../controller/uploadController');

const router = new Router();

router.post('/api/admin/filesUpload', uploadFields, uploadFiles);
router.get('/api/get-img/:id', downloadFilesByID);

module.exports = router;
