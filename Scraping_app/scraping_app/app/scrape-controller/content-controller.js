const axios = require('axios');
const cheerio = require('cheerio');
const { ROOT_URL } = require('../../config/source');

async function scrapeTrending(url) {
  try {
    const html = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36',
      },
    });
    const $ = cheerio.load(html.data);
    const data = {
      date: $('.date-article').text().trim(),
      title:
        $('.disease-container h2').text() != ''
          ? $('.disease-container h2').text()
          : $('.title-tag-container h1').text(),
      excerpt: $('.post-content p').first().text(),
      content: getContent1($),
      img: getImg($),
      tag: getTag($),
      doctor: {
        name: JSON.parse(JSON.stringify($('sources-post')[0].attribs))[
          'doctor-name'
        ],
        sources: JSON.parse(JSON.stringify($('sources-post')[0].attribs))[
          'sources'
        ],
      },
      souce: ROOT_URL,
    };
    // var debugimg = $(".post-content img").attr("src");
    // console.log(debugimg);
    // console.log($().find('img').attr('src'));
    return data;
  } catch (err) {
    throw Error(err.message);
  }
}

function getTag($) {
  return Array.from($('.tag-label-container > *')).map((elm) => ({
    app_link: $(elm).attr('href').split('/').pop(),
    tag: $(elm).attr('href').split('/').pop().replace('-', ' '),
    source_link: ROOT_URL + $(elm).attr('href'),
  }));
}

function getImg($) {
  let a = $('#postContent > *:not(div)').length;
  if (a.length > 0) {
    return '#postContent img'.attr('src');
  } else {
    return $('.post-content img').attr('src');
  }
  return 'no img';
  // return $("#postContent img").attr("src") != "" ? $("#postContent img").attr("src") : $(".post-content img").attr("src")
}

function getContent($) {
  let contentType1 = '#postContent > *:not(div)';
  let contentType2 = '.post-content > *:not(div)';
  return contentLoad($, contentType1) != ''
    ? contentLoad($, contentType1)
    : contentLoad($, contentType2);
}

function contentLoad($, parameter) {
  return Array.from($(parameter))
    .map((elm) => $(elm).text().replace(/\n/g, ' '))
    .filter((e) => e !== '');
}

function getContent1($) {
  let contentType1 = '#postContent';
  let contentType2 = '.post-content';
  let contentType3 = '#post-content';
  let contentType4 = '.postContent';
  if (
    contentLoad1($, contentType1) != '' &&
    contentLoad1($, contentType1) != null
  ) {
    return contentLoad1($, contentType1);
  } else if (
    contentLoad1($, contentType2) != '' &&
    contentLoad1($, contentType2) != null
  ) {
    return contentLoad1($, contentType2);
  } else if (
    contentLoad1($, contentType3) != '' &&
    contentLoad1($, contentType3) != null
  ) {
    return contentLoad1($, contentType3);
  } else if (
    contentLoad1($, contentType4) != '' &&
    contentLoad1($, contentType4) != null
  ) {
    return contentLoad1($, contentType4);
  }
}

function contentLoad1($, parameter) {
  if ($(parameter).html() != null) {
    return $(parameter).html().replace(/\n/g, ' ');
  } else {
    return null;
  }
}

module.exports = (url) => scrapeTrending(url);
