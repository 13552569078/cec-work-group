import { LocalStorage, SessionStorage } from './index'
import config from '../../../package.json'
const name = config.name + '_' + config.version

const getKeyName = (key: string) => {
  return name + '_' + key
}

// 根据项目名称和版本号来定义key名，防止同源同名key的localStorage相互污染,
// 需要同源免登录的情况，token等信息可以污染
// 如果不想在此文件定义get、set方法，可以直接引用Storage.set("XXX")
const tokenKey = 'token'
const appIdKey = getKeyName('appId')
const profileKey = 'profile'
const sidebarStatusKey = getKeyName('sidebarStatus')
const dictDataKey = 'dictData'
const orgIdKey = 'orgId'
const configDataKey = getKeyName('config')

//清除localStorage
export function clearLocalStorage() {
  return LocalStorage.clear()
}

// 改用本地存储存 token
export function getToken() {
  return LocalStorage.get(tokenKey)
}

export function setToken(token: string) {
  LocalStorage.set(tokenKey, token)
}

export function removeToken() {
  LocalStorage.remove(tokenKey)
}

export function getAppId() {
  return Number(LocalStorage.get(appIdKey))
}

export function setAppId(id: number) {
  LocalStorage.set(appIdKey, id)
}

export function getOrgId() {
  return Number(LocalStorage.get(orgIdKey))
}

export function setOrgId(id: number) {
  LocalStorage.set(orgIdKey, id)
}

// Profile
export function setProfile(form: any) {
  LocalStorage.set(profileKey, form)
}

export function getProfile() {
  return LocalStorage.get(profileKey)
}

//sidebarStatus
export function setSidebarStatus(val: string) {
  LocalStorage.set(sidebarStatusKey, val)
}

export function getSidebarStatus() {
  return LocalStorage.get(sidebarStatusKey)
}

//dictData
export function setDictData(val: any) {
  LocalStorage.set(dictDataKey, val)
}

export function getDictData() {
  return LocalStorage.get(dictDataKey)
}

//configData(sessionStorage防止污染)
export function setConfigData(val: any) {
  SessionStorage.set(configDataKey, val)
}

export function getConfigData() {
  return SessionStorage.get(configDataKey)
}

export function getUserid() {
  return LocalStorage.get('userid')
}

export function setUserid(token: string) {
  LocalStorage.set('userid', token)
}
