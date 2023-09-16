import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { getHTML } from '../getHTML';

async function run() {
  const base = 'https://tailwindcss.com';
  const html = await getHTML(`${base}/docs/installation`);
  const $ = cheerio.load(html);
  let list = $('#nav li.mt-12 a[href]').toArray()
  .map((item) => {
    const $item = $(item);
    return {
      name: $item.text(),
      link: `${base}${$item.attr('href')}`,
    };
  });

  // uniqueList
  list = list.filter((item, index) => {
    return list.findIndex((subItem) => subItem.name === item.name) === index;
  });

  // save to /data
  const content = `export default ${JSON.stringify(list, null, 2)}`
  fs.writeFileSync('./src/data/sub/tailwind.ts', content);
}

run();