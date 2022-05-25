const scrapeController = require('../scrape-controller/penyakit-controller');
const { ROOT_URL } = require('../../config/source');

async function penyakitcatController(req, res, next) {
  try {
    const url = `${ROOT_URL}/otak`;
    const data = await scrapeController(url);
    return res.json(data);
  } catch (err) {
    next(Error(err.message));
  }
}

module.exports = penyakitcatController;
