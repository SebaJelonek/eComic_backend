const { Router } = require('express');

const { newComic, comicList } = require('../controller/comicController');

const comicRoutes = Router();

comicRoutes.get('/api/comic-list', comicList);
comicRoutes.post('/api/admin/new-comic', newComic);

module.exports = comicRoutes;
