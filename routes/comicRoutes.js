const { Router } = require('express');

const {
  newComic,
  comicList,
  userComicCollection,
  unConfirmedComicList,
  confirmComic,
  rejectComic,
} = require('../controller/comicController');

const comicRoutes = Router();

comicRoutes.get('/api/comic-list', comicList);
comicRoutes.post('/api/admin/new-comic', newComic);
comicRoutes.get('/api/comic-collection/:userEmail', userComicCollection);
comicRoutes.get('/api/unconfirmed-comics', unConfirmedComicList);
comicRoutes.post('/api/confirm-comic', confirmComic);
comicRoutes.post('/api/reject-comic', rejectComic);

module.exports = comicRoutes;
