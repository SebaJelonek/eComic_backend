const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pasteTitle: {
      type: String,
      required: [true, 'Paste title is required'],
    },
    pasteBody: {
      type: String,
      required: [true, 'Paste body is required'],
      minlength: [10, 'Paste needs at least 10 characters to be valid'],
    },
  },
  { collection: 'paste' }
);

const Paste = mongoose.model('paste', pasteSchema);

module.exports = Paste;
