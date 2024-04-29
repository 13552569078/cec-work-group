// 改用本地存储存 token
export function getToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    removeToken()
  }
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function setProfile(form) {
  localStorage.setItem('profile', JSON.stringify(form))
}

export function getProfile() {
  // 获取 profile , 如果发现是空，则删除缓存里的值
  if (!localStorage.getItem('profile')) {
    localStorage.removeItem('profile')
  }
  const profile = localStorage.getItem('profile')
  return JSON.parse(profile)
}

export function setConfig(config) {
  localStorage.setItem('config', JSON.stringify(config))
}

export function getConfig() {
  // 获取 config , 如果发现是空，则删除缓存里的值
  if (!localStorage.getItem('config')) {
    localStorage.removeItem('config')
  }
  const config = localStorage.getItem('config')
  return JSON.parse(config)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

export function setSidebarStatus(val) {
  localStorage.setItem('sidebarStatus', val)
}

export function getSidebarStatus() {
  return JSON.parse(localStorage.getItem('sidebarStatus'))
}

export function getCustomizeTopConfig() {
  const customizeTopConfig = localStorage.getItem('customizeTopConfig')
  if (!customizeTopConfig) {
    removeCustomizeTopConfig()
  }
  return customizeTopConfig ? JSON.parse(customizeTopConfig) : {}
}

export function setCustomizeTopConfig(value) {
  localStorage.setItem('customizeTopConfig', JSON.stringify(value))
}

export function removeCustomizeTopConfig() {
  localStorage.removeItem('customizeTopConfig')
}

export function getCustomizeTableConfig(defaultValue) {
  const customizeTableConfig = localStorage.getItem('customizeTableConfig')
  return customizeTableConfig ? JSON.parse(customizeTableConfig) : defaultValue
}

export function setCustomizeTableConfig(value) {
  localStorage.setItem('customizeTableConfig', JSON.stringify(value))
}

export function getAccessToken(value) {
  // console.log('eslint')
}
