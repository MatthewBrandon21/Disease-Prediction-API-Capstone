const axios = require('axios');
const cherio = require('cheerio');
const { ROOT_URL } = require('../../config/source');

async function scrapeContent(url) {
  try {
    const response = await axios(url);
    const html = response.data;
    const $ = cherio.load(html);
    const data = Array.from($('.index-item'))
      .map((val) => ({
        title: $(val).find('a').text().trim(),
        permalink: $(val).find('a').attr('href'),
        source_url: `${ROOT_URL}/${$(val).find('a').attr('href')}`,
      }))
      .filter((e) => e !== '');
    return {
      data,
      source: ROOT_URL,
    };
  } catch (err) {
    throw Error(err.message);
  }
}

module.exports = (url) => scrapeContent(url);
