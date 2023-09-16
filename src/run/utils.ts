import axios from 'axios';
import { DocItem } from '../docs';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

export async function getHTML(url: string) {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': userAgent,
    },
  });
  return data;
}

export async function getDocs(base: string, path: string, selector: string) {
  const html = await getHTML(`${base}${path}`);
  const $ = cheerio.load(html);
  const list = $(selector).toArray()
  .map((item) => {
    const $item = $(item);
    return {
      name: $item.text().trim(),
      link: `${base}${$item.attr('href')}`,
    };
  });

  return list;
}

export function makeListUnique(list: DocItem[], linkPrefix = '') {
  // filter same name + link
  list = list.filter((item, index) => {
    return list.findIndex((subItem) => subItem.name === item.name && subItem.link === item.link) === index;
  });

  // find the same name items, and add link to description
  const confilcNames = new Set<string>();
  list.forEach((item, index) => {
    const sameNameIndex = list.findIndex((subItem) => subItem.name === item.name);
    if (sameNameIndex !== index) {
      confilcNames.add(item.name);
    }
  });
  for (const name of confilcNames) {
    // add link to description
    list.forEach((item) => {
      if (item.name === name) {
        item.description = linkPrefix ? item.link.replace(linkPrefix, '') : item.link;
      }
    });
  }
  
  return list;
}

export function writeData(list: DocItem[], path: string) {
  const content = `export default ${JSON.stringify(list, null, 2)}`
  fs.writeFileSync(`./src/data${path}`, content);
}