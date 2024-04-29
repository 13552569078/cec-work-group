/**
 * 检查版本号格式
 */
export function checkVersion(val, cb) {
  if (!val) {
    return cb('请输入版本号')
  }
  if (!/^[a-zA-Z]{1}[0-9a-zA-Z_.]{0,20}$/.test(val)) {
    cb('长度20，字母开头，支持英文、数字、下划线、句点')
  } else {
    cb()
  }
}

// 检查是否是正常编码
export function checkCode(code) {
  const reg = /^[a-zA-Z]{1}[0-9a-zA-Z_]{0,19}$/
  return code && reg.test(code)
}
// 检查是否是正常url
export function checkUrl(path) {
  return /^(https?:)/.test(path)
}

