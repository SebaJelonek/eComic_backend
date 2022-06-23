const { Router } = require('express');

const {
  newComic,
  comicList,
  userComicCollection,
} = require('../controller/comicController');

const comicRoutes = Router();

comicRoutes.get('/api/comic-list', comicList);
comicRoutes.post('/api/admin/new-comic', newComic);
comicRoutes.get('/api/comic-collection/:userEmail', userComicCollection);

module.exports = comicRoutes;
