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

async function nodejs() {
  // https://nodejs.org/api/
  let list = await getDocs('https://nodejs.org/api/', '', '#column2 ul a[href]');
  list = list.filter(item => {
    return !item.link.includes('https://github.com')
  })
  list = makeListUnique(list);
  writeData(list, '/sub/nodejs.ts');
}

// https://nextjs.org/docs
async function nextjs() {
  let list = await getDocs('https://nextjs.org', '/docs', 'nav.styled-scrollbar a[href]');
  list = makeListUnique(list, 'https://nextjs.org/docs/');
  writeData(list, '/sub/nextjs.ts');
}

// https://nuxt.com/docs/api/composables/use-app-config
async function nuxtjs() {
  let list = await getDocs('https://nuxt.com', '/docs/api/composables/use-app-config', 'aside a[href]');
  list = makeListUnique(list);
  writeData(list, '/sub/nuxtjs.ts');
}

// vue();
// vite();
// nodejs();
// nextjs();
nuxtjs();