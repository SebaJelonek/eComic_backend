const Comic = require('../model/Comic');

const newComic = async (req, res) => {
  const { title, author, genre, pdfID, imgID } = req.body;
  await Comic.create({
    title,
    author,
    genre,
    thumbnailID: imgID,
    pdfFileID: pdfID,
  });
  res.json({ msg: 'Comic has been created' });
};

const comicList = async (req, res) => {
  const comic = await Comic.find();
  res.json({ comic });
};

module.exports = {
  newComic,
  comicList,
};
