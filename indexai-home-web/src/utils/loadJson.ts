import axios from 'axios'

/**
 * 通过模块ID和名称加载json文件
 * * （无缓存）
 */
export default function loadjson(moduleId: string, name: string, meta: any) {
  return new Promise((resolve) => {
    // 加载
    axios.get(`./${moduleId}/${name}.json`).then((res) => {
      console.log('异步加载', res)
      if (res.status === 200) {
        // statusText
        // 正常
        Object.assign(meta, res.data)
        meta.reload = !meta.reload // 添加重新绑定的开关
        resolve(meta)
      }
    })
  })
}
/**
 *
 * @param {参数名}} name
 * @returns string
 */
export function GetQueryString(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.href.substr(1).match(reg) //获取url中"?"符后的字符串并正则匹配
  let context = ''
  if (r != null) context = r[1]
  r = null
  return context == null || context == '' || context == 'undefined' ? '' : context
}
