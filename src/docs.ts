import list from './data/list-checked'

export type DocItem = {
  name: string
  link: string
  alias?: string
  description?: string
  children?: DocItem[]
}

const childrenMap: Record<string, DocItem[]> = {
  'Git': require('./data/sub/git').default,
  'Tailwind CSS': require('./data/sub/tailwind').default,
  'React': require('./data/sub/react').default,
}

const items: DocItem[] = [...list]
for (const item of items) {
  if (childrenMap[item.name]) {
    item.children = childrenMap[item.name]
  }
}

export default items