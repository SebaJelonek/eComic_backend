const { Router } = require('express');

const { newComic } = require('../controller/comicController');

const pasteRouter = Router();

pasteRouter.post('/api/admin/new-comic', newComic);

module.exports = pasteRouter;
