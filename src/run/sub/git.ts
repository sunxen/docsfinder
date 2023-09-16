import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { getHTML, makeListUnique } from '../utils';

async function run() {
  const base = 'https://git-scm.com';
  const html = await getHTML(`${base}/docs`);
  const $ = cheerio.load(html);
  let list = $('.reference-menu a[href]').toArray()
  .map((item) => {
    const $item = $(item);
    return {
      name: $item.text().trim(),
      link: `${base}${$item.attr('href')}`,
    };
  });

  // sort
  const kwOrder = [
    "init",
    "clone",
    "add",
    "commit",
    "status",
    "log",
    "branch",
    "checkout",
    "merge",
    "push",
    "pull",
    "remote",
    "diff",
    "reset",
    "stash",
    "tag",
    "fetch"
  ]
  list.sort((a, b) => {
    const aIndex = kwOrder.indexOf(a.name);
    const bIndex = kwOrder.indexOf(b.name);
    if (aIndex === -1) {
      return 1;
    }
    if (bIndex === -1) {
      return -1;
    }
    return aIndex - bIndex;
  });

  list = makeListUnique(list);

  // save to /data
  const content = `export default ${JSON.stringify(list, null, 2)}`
  fs.writeFileSync('./src/data/sub/git.ts', content);
}

run();