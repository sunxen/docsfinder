import list from './data/list-checked'

export type DocItem = {
  name: string
  link: string
  alias?: string
  children?: DocItem[]
}

const items: DocItem[] = [...list]
for (const item of items) {
  if (item.name === 'Git') {
    item.children = require('./data/sub/git').default
  }
}

export default items