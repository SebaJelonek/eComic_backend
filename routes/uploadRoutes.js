const { Router } = require('express');

const { uploadFiles, uploadFields } = require('../controller/uploadController');

const uploadRouter = new Router();
uploadRouter.post('/api/admin/filesUpload', uploadFields, uploadFiles);

module.exports = uploadRouter;
