import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const stubFile = resolve('build/index.mjs')

function isStubBuilt() {
  if (!existsSync(stubFile))
    return false

  const content = readFileSync(stubFile, 'utf-8')

  return content.includes('createJiti')
}

if (!isStubBuilt()) {
  console.log('[dev] stub 尚未建立，執行 unbuild...')
  execSync('pnpm run stub', { stdio: 'inherit' })
}
else {
  console.log('[dev] 已偵測到 stub 模式輸出，跳過 build。')
}
