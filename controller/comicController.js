const Comic = require('../model/Comic');

const newComic = async (req, res) => {
  const { title, author, genre, pdfName, imgName } = req.body;
  await Comic.create({
    title,
    author,
    genre,
    thumbnailName: imgName,
    pdfFileName: pdfName,
  });
  res.json({ msg: 'comic created' });
};

module.exports = {
  newComic,
};
