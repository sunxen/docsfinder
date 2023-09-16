import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function run() {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
  const url = 'https://git-scm.com/docs';
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': userAgent,
    },
  });

  const $ = cheerio.load(data);
  let list = $('.reference-menu a[href]').toArray()
  .map((item) => {
    const $item = $(item);
    return {
      name: $item.text(),
      link: `https://git-scm.com${$item.attr('href')}`,
    };
  });
  // uniqueList
  list = list.filter((item, index) => {
    return list.findIndex((subItem) => subItem.name === item.name) === index;
  });

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
  // sort by kwOrder
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

  // save to /data
  const content = `export default ${JSON.stringify(list, null, 2)}`
  fs.writeFileSync('./src/data/sub/git.ts', content);
}

run();