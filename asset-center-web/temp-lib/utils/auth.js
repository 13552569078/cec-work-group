import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey) || localStorage.getItem(TokenKey)
}

export function setToken(token) {
  Cookies.set(TokenKey, token)
  localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(TokenKey)
  localStorage.removeItem(TokenKey)
}
