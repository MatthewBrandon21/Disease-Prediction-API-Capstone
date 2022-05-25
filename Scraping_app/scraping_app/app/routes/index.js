const express = require('express');
const controller = require('../controllers/index');

function routes() {
  const router = express.Router();

  router.get('/content/:url', controller.contentController);

  router.get('/penyakitcat/:url', controller.penyakitcatController);

  router.get('/penyakit', controller.penyakitController);

  router.get('/obat', controller.obatController);

  return router;
}

module.exports = routes;
