import { getDocs, makeListUnique, writeData } from './utils';

async function vue() {
  // https://vuejs.org/guide/introduction.html
  let list = await getDocs('https://vuejs.org', '/guide/introduction.html', '#VPSidebarNav a.link[href]');
  list = makeListUnique(list);
  writeData(list, '/sub/vue.ts');
}

async function vite() {
  // https://vitejs.dev/guide/
  let list = await getDocs('https://vitejs.dev', '/guide/', '#VPSidebarNav a.link[href]');
  list = list.concat(await getDocs('https://vitejs.dev', '/config/', '#VPSidebarNav a.link[href]'));
  list = makeListUnique(list);
  writeData(list, '/sub/vite.ts');
}

vue();
// vite();