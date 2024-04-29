/**
 * @Description: webpack 插件 控制文件被引用和修改
 * @Author: zhangsen
 * @Date: 2021-12-02
 */
class FilesDogWebpackPlugin {
  constructor(options) {
    this.options = options || {}
  }
  apply(compiler) {
    const disableImport = this.options.disableImport
    const disableModify = this.options.disableModify
    if (disableImport) {
      compiler.plugin('compilation', function(compilation) {
        compilation.plugin('buildModule', function(module) {
          if (module.resource) {
            if (disableImport instanceof Array) {
              for (let i = 0; i < disableImport.length; i++) {
                if (module.resource.indexOf(disableImport[i]) !== -1) {
                  throw new Error('禁止引用:' + module.resource)
                }
              }
            } else if (typeof disableImport === 'string') {
              if (module.resource.indexOf(disableImport) !== -1) {
                throw new Error('禁止引用:' + module.resource)
              }
            } else {
              compilation.warnings.push('FilesDogWebpackPlugin 插件配置项 disableImport 字段类型只支持 String 或 Array')
            }
          }
        })
      })
    }

    if (disableModify) {
      compiler.hooks.watchRun.tapAsync('FilesDogWebpackPlugin', (compiler, cb) => {
        const mtimes = compiler.watchFileSystem.watcher.mtimes
        const mtimesKeys = Object.keys(mtimes)
        if (mtimesKeys.length > 0) {
          // 改动的文件 mtimesKeys
          if (disableModify instanceof Array) {
            for (let i = 0; i < disableModify.length; i++) {
              for (let j = 0; j < mtimesKeys.length; j++) {
                if (mtimesKeys[j].indexOf(disableModify[i]) !== -1) {
                  throw new Error('禁止改动:' + mtimesKeys[j])
                }
              }
            }
          } else if (typeof disableModify === 'string') {
            for (let i = 0; i < mtimesKeys.length; i++) {
              if (mtimesKeys[i].indexOf(disableModify) !== -1) {
                throw new Error('禁止改动:' + mtimesKeys[i])
              }
            }
          } else {
            console.error('FilesDogWebpackPlugin 插件配置项 disableModify 字段类型只支持 String 或 Array')
          }
        }
        cb()
      })
    }
  }
}
module.exports = FilesDogWebpackPlugin
