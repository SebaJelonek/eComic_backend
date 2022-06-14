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
  res.json({ msg: 'comic created' });
};

const comicList = async (req, res) => {
  const comic = await Comic.find();
  console.log(comic);
  const { pdfFileName, thumbnailName } = comic;
  console.log(pdfFileName);
  res.json({ msg: 'we goot', comic });
};

module.exports = {
  newComic,
  comicList,
};
