const { Router } = require('express');

const {
  uploadFiles,
  uploadFields,
  downloadFilesByID,
} = require('../controller/fileController');

const router = new Router();

router.post('/api/admin/filesUpload', uploadFields, uploadFiles);
router.get('/api/file/:id', downloadFilesByID);

module.exports = router;
