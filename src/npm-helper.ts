import * as fs from 'fs';
import * as path from 'path';

/**
 * find the project's package.json file, analyze the dependencies and devDependencies
 * @param targetFile 
 */
export async function getProjectPkgs(targetFile: string) {
  const pkgPath = getPkgPath(targetFile)
  if(!pkgPath){
    return []
  }
  const pkg = require(path.join(pkgPath, 'package.json'))
  const deps = Object.keys(pkg.dependencies || {})
  const devDeps = Object.keys(pkg.devDependencies || {})
  return [...deps, ...devDeps]
}

function getPkgPath(targetFile: string): string{
  const dirList: string[] = []
  let dir = path.dirname(targetFile)
  while(!dirList.includes(dir)){
      dirList.push(dir)
      dir = path.dirname(dir)
  }
  for (const item of dirList){
      if(fs.existsSync(path.join(item, 'package.json'))){
          return item
      }
  }
  return ''
}