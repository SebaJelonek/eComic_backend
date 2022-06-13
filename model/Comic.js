const mongoose = require('mongoose');

const eComicSchema = new mongoose.Schema({
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
  thumbnailName: {
    type: String,
    required: true,
  },
  pdfFileName: {
    type: String,
    required: true,
  },
});

const eComic = mongoose.model('eComic', eComicSchema);

module.exports = eComic;
