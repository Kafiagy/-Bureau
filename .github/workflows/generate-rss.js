const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.mern.dj/';

axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);
    const items = [];

    $('.article').each((index, element) => {
      const title = $(element).find('h1').text().trim();
      const link = $(element).find('a').attr('href');
      const description = $(element).find('p').text().trim();

      if (title && link) {
        items.push({
          title,
          link: link.startsWith('http') ? link : `${url}${link}`,
          description,
          guid: link.startsWith('http') ? link : `${url}${link}`
        });
      }
    });

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>MERN Djibouti — Actualités</title>
    <link>${url}</link>
    <description>Dernières actualités du site MERN Djibouti</description>
    ${items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <guid>${item.guid}</guid>
    </item>`).join('')}
  </channel>
</rss>`;

    fs.writeFileSync('rss.xml', rss);
    console.log('Flux RSS généré avec succès : rss.xml');
  })
 
