import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { getHTML, makeListUnique } from '../utils';

async function run() {
  const base = 'https://react.dev';
  const html = await getHTML(`${base}/reference/react`);
  const $ = cheerio.load(html);
  let list = $('aside nav a[href]').toArray()
  .map((item) => {
    const $item = $(item);
    return {
      name: $item.text().trim(),
      link: `${base}${$item.attr('href')}`,
    };
  });

  list = makeListUnique(list, `${base}/reference/`);

  // save to /data
  const content = `export default ${JSON.stringify(list, null, 2)}`
  fs.writeFileSync('./src/data/sub/react.ts', content);
}

run();