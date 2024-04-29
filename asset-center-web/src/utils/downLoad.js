import {
  getToken
} from '@/utils/auth'
export function downloadFile(url, fileName) {
  const xhr = new XMLHttpRequest()
  //   const fileName = 'file.docx' // 文件名称
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.setRequestHeader('token', getToken()) // 请求头中的验证信息等（如果有）
  xhr.onload = function () {
    if (this.status === 200) {
      const type = xhr.getResponseHeader('Content-Type')

      const blob = new Blob([this.response], {
        type: type
      })
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        /*
         * IE workaround for "HTML7007: One or more blob URLs were revoked by closing
         * the blob for which they were created. These URLs will no longer resolve as
         * the data backing the URL has been freed."
         */
        window.navigator.msSaveBlob(blob, fileName)
      } else {
        const URL = window.URL || window.webkitURL
        const objectUrl = URL.createObjectURL(blob)
        if (fileName) {
          var a = document.createElement('a')
          // safari doesn't support this yet
          if (typeof a.download === 'undefined') {
            window.location = objectUrl
          } else {
            a.href = objectUrl
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            a.remove()
          }
        } else {
          window.location = objectUrl
        }
      }
    }
  }
  xhr.send()
}

export function getUrlRelativePath(url) {
  const arrUrl = url.split('//')

  const start = arrUrl[1].indexOf('/')
  let relUrl = arrUrl[1].substring(start + 1) // stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0]
  }
  return relUrl
}
