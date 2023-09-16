import list from './devdocs'
import * as fs from 'fs'

const set = new Set()
const kwList: string[] = []
list.forEach((item) => {
  if (!set.has(item.name) && item.links?.home) {
    set.add(item.name)
    kwList.push(item.name)
  }
})

const code = 'export default ' + JSON.stringify(kwList, null, 2)
fs.writeFileSync('./src/data/kw.ts', code)
