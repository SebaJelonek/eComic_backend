const Comic = require('../model/Comic');

const newComic = async (req, res) => {
  const { title, author, genre, pdfID, imgID, email } = req.body;
  await Comic.create({
    title,
    author,
    genre,
    thumbnailID: imgID,
    pdfFileID: pdfID,
    userEmail: email,
  });
  res.json({ msg: 'Comic has been created' });
};

const comicList = async (req, res) => {
  const comic = await Comic.find();
  res.json({ comic });
};

const userComicCollection = async (req, res) => {
  const { userEmail } = req.params;
  const comicCollection = await Comic.find({ userEmail });
  console.log(comicCollection);
  res.json({ comicCollection });
};

module.exports = {
  newComic,
  comicList,
  userComicCollection,
};
