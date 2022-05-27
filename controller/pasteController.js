const Comic = require('../model/Comic');

const newPaste = async (req, res) => {
  const { name, pasteTitle, pasteBody } = req.body;
  comic = new Comic({ name, pasteTitle, pasteBody });

  try {
    await Comic.create({ name, pasteTitle, pasteBody });
    res.json({
      status: 'ok',
      message: `${paste.pasteTitle} has been created!`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'error', error });
  }

  console.log(
    `name: ${name}, \r\ntitle: ${pasteTitle}, \r\nbody: ${pasteBody}`
  );
};

const findPasteByName = async (req, res) => {
  const { name } = req.body;
  try {
    const paste = await Paste.find({ name });
    res.json({ status: 'ok', paste });
  } catch (error) {
    res.status(400).json({ status: 'error', error });
  }
};

const getAllPastes = async (req, res) => {
  try {
    const paste = await Paste.find();
    res.json({ status: 'ok', paste });
  } catch (error) {
    res.status(400).json({ status: 'error', error });
  }
};

const putEditPaste = async (req, res) => {
  const { _id, pasteTitle, pasteBody } = req.body;
  try {
    await Paste.findOneAndUpdate({ _id }, { pasteTitle, pasteBody });
    res.json({ status: 'ok', pasteTitle, pasteBody });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deletePaste = async (req, res) => {
  const { _id } = req.body;
  try {
    await Paste.findOneAndDelete({ _id });
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(400).json({ res });
    console.log(error);
  }
};

module.exports = {
  // postNewPaste,
  // postFindPasteByName,
  getAllPastes,
  putEditPaste,
  deletePaste,
};
