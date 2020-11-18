import fs from 'fs'
import path from 'path'

// app 路径
const appDirectory = fs.realpathSync(process.cwd())

export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath)

export const paths = {
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndex: resolveApp('src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  appBuild: resolveApp('build')
}
