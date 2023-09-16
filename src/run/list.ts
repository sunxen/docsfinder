// 提取数据生成一级列表

import { DocItem } from '../docs'
import list from './devdocs'
import kwOrder from '../data/kw-order'
import * as fs from 'fs'

const set = new Set()
const docs: DocItem[] = []
list.forEach((item) => {
  if (!set.has(item.name) && item.links?.home) {
    set.add(item.name)
    docs.push({
      name: item.name,
      link: item.links.home,
    })
  }
})

// order by kwOrder
docs.sort((a, b) => {
  const aIndex = kwOrder.indexOf(a.name)
  const bIndex = kwOrder.indexOf(b.name)
  if (aIndex === -1 && bIndex === -1) {
    return a.name.localeCompare(b.name)
  }
  if (aIndex === -1) {
    return 1
  }
  if (bIndex === -1) {
    return -1
  }
  return aIndex - bIndex
})

const code = 'export default ' + JSON.stringify(docs, null, 2)
fs.writeFileSync('./src/data/list.ts', code)
