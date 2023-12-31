import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { getHTML, makeListUnique } from '../utils';

async function run() {
  const base = 'https://tailwindcss.com';
  const html = await getHTML(`${base}/docs/installation`);
  const $ = cheerio.load(html);
  let list = $('#nav li.mt-12 a[href]').toArray()
  .filter((item) => {
    const $item = $(item);
    return $item.attr('href')?.startsWith('/docs/');
  })
  .map((item) => {
    const $item = $(item);
    return {
      name: $item.text().trim(),
      link: `${base}${$item.attr('href')}`,
    };
  });

  list = makeListUnique(list, `${base}/docs/`);

  // save to /data
  const content = `export default ${JSON.stringify(list, null, 2)}`
  fs.writeFileSync('./src/data/sub/tailwind.ts', content);
}

run();