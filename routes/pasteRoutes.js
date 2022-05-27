const { Router } = require('express');

const {
  postNewPaste,
  postFindPasteByName,
  getAllPastes,
  putEditPaste,
  deletePaste,
} = require('../controller/pasteController');

const pasteRouter = Router();

// pasteRouter.post('/api/user/new-paste', postNewPaste);
// pasteRouter.post('/api/user/get-pastas', postFindPasteByName);
pasteRouter.get('/api/get-pastas', getAllPastes);
pasteRouter.put('/api/user/edit-pasta', putEditPaste);
pasteRouter.delete('/api/user/delete-pasta', deletePaste);

module.exports = pasteRouter;
