const TokenKey = 'token-asset-center'
const SystemFlag = 'system'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  sessionStorage.removeItem(TokenKey)
}

export function getSystemFlag() {
  return sessionStorage.getItem(SystemFlag)
}

export function setSystemFlag(flag) {
  sessionStorage.setItem(SystemFlag, flag)
}

export function removeSystemFlag() {
  sessionStorage.removeItem(SystemFlag)
}
