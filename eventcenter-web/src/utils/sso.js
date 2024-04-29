import Cookies from 'js-cookie'

const ssoCookieKey = 'sso-token'
const ssoCookieDomain = '.xxx.com'
// const ssoCookieDomain = 'localhost'

/**
 * 处理 sso 登录过程中的错误信息
 *
 * error, 后台返回的错误信息
 * 一般情况下, error 中的结构为
 * {
 *  request: xxx,
 *  response: {
 *    data: {
 *      errorMsg
 *      errorCode
 *      module
 *    }
 *  }
 * }
 */
const ssoErrorHandler = function(error) {
  // 需要在此处覆写你的 sso 的处理

  console.warn('%c write your sso handler code here in sso.js file', 'background: yellow')

  /**
   *
   * 以下内容只是作为参考可用, 如果 errorMsg 与 errorCode  甚至结构都不同,
   * 需要具体的项目进行覆写  --- begin --------
   */
  const getRedirUrl = function(error) {
    const responseData = error && error.response && error.response.data
    if (responseData && responseData.errorMsg && responseData.errorCode) {
      const { errorMsg, errorCode } = responseData
      if (errorMsg === 'SSO Unauthenticated' && errorCode === '401') {
        return responseData.module && responseData.module['sso_login_url']
      }
    }
    return ''
  }

  try {
    const redirectUrl = getRedirUrl(error)

    console.log('redirectUrl: ', redirectUrl)

    // 为了不影响项目, 此处不进行主动跳转
    // window.location.href = redirectUrl
  } catch (_) {
    console.warn('%c write your sso handler code here in sso.js file', 'background: yellow')
  }

  /**
   *
   * 以下内容只是作为参考可用, 如果 errorMsg 与 errorCode  甚至结构都不同,
   * 需要具体的项目进行覆写  --- end --------
   */
}

/**
 * 解析后台跳转页面传递过来的 hash 内容, 如果具体的结构有不相同,
 * 需要具体的项目进行处理
 */
function getAccessTokenFromHash(hash) {
  const cookieKeyInHash = 'access_token'
  if (hash) {
    const keyValues = hash.split('&')
    const keyValue = keyValues.find(key => key.indexOf(cookieKeyInHash) > -1)
    const arr = keyValue.split('=')
    if (arr.length > 1) {
      return arr[1]
    }
  }
  return ''
}

/**
 * 设置 sso 需要的 cookie 信息
 */
function setSSOCookie(accessToken, key = ssoCookieKey, domainName = ssoCookieDomain) {
  if (accessToken) {
    Cookies.set(key, accessToken, { domain: domainName })
  }
}

function getSSOToken(key = ssoCookieKey) {
  return Cookies.get(key)
}

export {
  ssoCookieKey,
  ssoCookieDomain,
  ssoErrorHandler,
  getAccessTokenFromHash,
  setSSOCookie,
  getSSOToken
}
