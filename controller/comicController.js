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
  res.json({ comicCollection });
};

const unConfirmedComicList = async (req, res) => {
  const unConfirmedComicList = await Comic.find({ isConfirmed: false });
  res.json({ unConfirmedComicList });
};

const confirmComic = async (req, res) => {
  const comicId = req.body.comicId;
  console.log(comicId);
  await Comic.findOneAndUpdate({ _id: comicId }, { isConfirmed: true });
  const unConfirmedComicList = await Comic.find({ isConfirmed: false });
  res.status(200).json({ msg: 'comic accepted', unConfirmedComicList });
};

const rejectComic = async (req, res) => {
  const comicId = req.body.comicId;
  const unConfirmedComicList = await Comic.find({ isConfirmed: false });
  Comic.findOneAndUpdate({ _id: comicId }, { isRejected: true });
  res.status(200).json({ msg: 'comic rejected', unConfirmedComicList });
};

module.exports = {
  newComic,
  comicList,
  userComicCollection,
  unConfirmedComicList,
  confirmComic,
  rejectComic,
};
