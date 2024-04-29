/**
 * @param {string} path
 * @returns {Boolean}
 * 是否外部链接
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str: string) {
  const valid_map = ['admin', 'editor', 'test01', 'test02', 'test03', 'test04']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {number} num
 * @returns {Boolean}
 */
export function validNumber(num: string) {
  return /^(0|[1-9][0-9]*)$/.test(num)
}

/**
 * @param {number} num
 * @returns {Boolean}
 * 校验是否手机号
 */
export function validPhone(rule: any, value: any, callback: any) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (value && value !== '' && !reg.test(value)) {
    callback(new Error('电话格式错误'))
  } else {
    callback()
  }
}

/**
 * @param {number} num
 * @returns {Boolean}
 * 身份证格式
 */
export function validCard(rule: any, value: any, callback: any) {
  const user_pattern = new RegExp(
    '(?!(^\\d{15}000$))(^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$)'
  )
  const system_pattern = new RegExp(
    '(^(11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)[Xx0-9]{16}$)'
  )
  const year_pattern = new RegExp('(^\\d{6}(18(8[6-9]|9\\d)|19\\d\\d|20[0-2]\\d)[Xx0-9]{8}$)')
  const last_pattern = new RegExp('(^.*(\\d|X)$)')
  if (value && value !== '') {
    if (!user_pattern.test(value)) {
      callback(new Error('身份证号码有效性错误'))
    } else if (!system_pattern.test(value)) {
      callback(new Error('身份证号码有效性错误'))
    } else if (!year_pattern.test(value)) {
      callback(new Error('身份证年份错误'))
    } else if (!last_pattern.test(value)) {
      callback(new Error('身份证号码有效性错误，X请大写'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * @param {String} str
 * @returns {Boolean}
 * 校验是否包含事件流程提交过程中不能识别的特殊字符
 */
export function validCommitStr(str: string) {
  const pattern = new RegExp('[`~#$^&|{}[\\]<>/~#&*]')
  return pattern.test(str)
}

/**
 * @param {String} str
 * @returns {Boolean}
 * 校验经度
 */
export const validateLongitude = (rule: any, value: any, callback: any) => {
  if (value > 180 || value < -180) {
    callback(new Error('经度范围在-180到180之间，请输入正确的经度'))
  }
}

/**
 * @param {String} str
 * @returns {Boolean}
 * 校验纬度
 */
export const validateLatitude = (rule: any, value: any, callback: any) => {
  // 验证数字正则表达式
  console.log(value, callback)
  if (value > 85 || value < -85) {
    callback(new Error('纬度范围在-85到85之间，请输入正确的纬度'))
  }
}
