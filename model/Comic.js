const mongoose = require('mongoose');

const eComicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Comic title is required'],
    },
    author: {
      type: String,
      required: [true, 'Author of comic is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
    },
    thumbnailID: {
      type: String,
      required: true,
    },
    pdfFileID: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { collection: 'eComic' }
);

const eComic = mongoose.model('eComic', eComicSchema);

module.exports = eComic;
