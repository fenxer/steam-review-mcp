import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { exit } from 'node:process'
import { camelCase } from 'change-case'
import { initSync, parse } from 'es-module-lexer'
import { globSync } from 'tinyglobby'

const syncPattern = ['prompt', 'tool', 'resource']

/**
 * Extracts external content from the target file.
 * @param {string} targetFile
 * @returns string - external content
 */
function extractExternalContent(targetFile) {
  initSync()
  const source = readFileSync(targetFile, 'utf-8')
  const hasEolLast = source.endsWith('\n')
  let externalContent = ''
  const [imports, facade] = parse(source)

  if (facade === false) {
    console.error(`ERROR: ${targetFile} - Pure import/export statements only`)
    exit(1)
  }

  const hasExternalImports = (imports.length > 0 && imports[0].ss !== 0)
    || imports.some(({ n }) => !syncPattern.includes(n.match(/\.([^.]+)$/)?.[1]))

  if (hasExternalImports) {
    let lastIndex = 0
    for (const { ss, se, n } of imports) {
      externalContent += source.slice(lastIndex, syncPattern.includes(n.match(/\.([^.]+)$/)?.[1]) ? ss : se)
      lastIndex = se
    }
    externalContent += `${source.slice(lastIndex, source.length)}${hasEolLast ? '' : '\n'}`
  }

  return externalContent.replace(/\n\s*\n/g, '\n\n')
}

/**
 * Generates synchronized content
 * @param {Array<{ importPath: string; varName: string; }>} list - auto find from src/building-block
 * @returns {string} Generated content
 */
function generateSyncContent(list) {
  return `${list.map(({ importPath, varName }) => `export { default as ${varName} } from '${importPath}'`).join('\n')}\n`
}

const rootDir = join(dirname(import.meta.dirname), 'src/building-block')

const syncList = globSync(`**/*.{${syncPattern.join(',')}}.ts`, { cwd: rootDir }).map(path => ({
  importPath: `./${path.replace(/\.ts$/, '')}`,
  varName: camelCase(basename(path, '.ts')),
}))

const targetFile = join(rootDir, 'index.ts')

const newContent = `${
  existsSync(targetFile) && statSync(targetFile).isFile() ? extractExternalContent(targetFile) : ''
}${generateSyncContent(syncList)}`

writeFileSync(targetFile, newContent, 'utf-8')
