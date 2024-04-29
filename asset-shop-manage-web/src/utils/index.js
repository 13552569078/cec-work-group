import Vue from 'vue'
import { createSocket } from './websocket'
import service from './request'
import { getToken } from '@l/utils/auth'
const bus = new Vue()

const checkSYSTYPE = function(key) {
  const SYS_TYPE = window.__systemConfig && window.__systemConfig.sysType || 1
  switch (key) {
    case 'tizheng': return (+SYS_TYPE === 2 || +SYS_TYPE === 3)
    case 'jiekou': return (+SYS_TYPE === 2 || +SYS_TYPE === 4)
    case 'default': return !(SYS_TYPE > 1 && SYS_TYPE < 5)
  }
  return false
}
const formatInterfaceShowData = function(obj) {
  const arr = []
  if (!(obj && obj.paths)) return arr
  for (const key in obj.paths) {
    if (Object.hasOwnProperty.call(obj.paths, key)) { // path1
      const _path = obj.paths[key]

      for (const _key in _path) {
        if (Object.hasOwnProperty.call(_path, _key)) { // post
          const _obj = {
            tab: '1',
            path: key
            // protocol: (obj.servers[0] && obj.servers[0].url || '').split(':')[0]
          }
          const methodInfo = _path[_key]
          _obj.method = _key
          _obj.inputData = []
          _obj.outputData = []
          let requestBody = {}
          const requestBodyRef = methodInfo.requestBody ? methodInfo.requestBody.content['application/json'] && methodInfo.requestBody.content['application/json'].schema['$ref'] || '' : methodInfo.parameters && methodInfo.parameters.filter(item => item.name === 'body')[0] || '' ? methodInfo.parameters.filter(item => item.name === 'body')[0].schema.$ref : ''
          if (requestBodyRef) {
            const paths = requestBodyRef.split('/')
            const [first, ..._paths] = [...paths]
            if (first === '#') {
              requestBody = getObj(obj, _paths) || {}
            }
          }
          if (methodInfo.parameters) {
            _obj.inputData = _obj.inputData.concat(methodInfo.parameters.filter(item => item.name !== 'body').map(item => {
              return {
                name: item.name,
                in: item.in,
                required: item.required,
                type: item.schema.type,
                desc: item.desc
              }
            }))
          }
          for (const key in requestBody.properties) {
            if (Object.hasOwnProperty.call(requestBody.properties, key)) {
              const element = requestBody.properties[key]
              _obj.inputData.push({
                name: key,
                in: 'body',
                required: true,
                type: element.type,
                desc: element.example
              })
            }
          }
          if (methodInfo.responses && methodInfo.responses['200'] && methodInfo.responses['200'].content && methodInfo.responses['200'].content['application/json']) {
            if (methodInfo.responses['200'].content['application/json'].schema.type === 'object') {
              if (methodInfo.responses['200'].content['application/json'].schema.items.$ref.startWith('#')) {
                const paths = methodInfo.responses['200'].content['application/json'].schema.items.$ref.split('/')
                const [first, ..._paths] = [...paths]
                console.log(first)
                const res = getObj(obj, _paths) || {}
                for (const key in res) {
                  if (Object.hasOwnProperty.call(res, key)) {
                    const element = res[key]
                    _obj.outputData.push({
                      name: key,
                      in: 'body',
                      required: true,
                      type: element.type,
                      desc: element.example
                    })
                  }
                }
              }
            } else {
              if (methodInfo.responses['200'] && methodInfo.responses['200'].content['application/json'] && methodInfo.responses['200'].content['application/json'].schema) {
                if (methodInfo.responses['200'].content['application/json'].schema.type &&
                methodInfo.responses['200'].content['application/json'].schema.type === 'array'
                ) {
                  if (methodInfo.responses['200'].content['application/json'].schema.items &&
                  methodInfo.responses['200'].content['application/json'].schema.items.$ref &&
                  methodInfo.responses['200'].content['application/json'].schema.items.$ref.indexOf('#') === 0) {
                    const paths = methodInfo.responses['200'].content['application/json'].schema.items.$ref.split('/')
                    const [first, ..._paths] = [...paths]
                    console.log(first)
                    const res = getObj(obj, _paths) || {}
                    _obj.body = JSON.stringify([res])
                  }
                } else {
                  if (methodInfo.responses['200'].content['application/json'].schema.$ref &&
                  methodInfo.responses['200'].content['application/json'].schema.$ref.indexOf('#') === 0) {
                    const paths = methodInfo.responses['200'].content['application/json'].schema.$ref.split('/')
                    const [first, ..._paths] = [...paths]
                    console.log(first)
                    const res = getObj(obj, _paths) || {}
                    _obj.body = JSON.stringify(res)
                  }
                }
              }
            }
          }
          arr.push(_obj)
        }
      }
    }
  }
  return arr
  function getObj(obj, paths) {
    let o = obj
    for (let index = 0; index < paths.length; index++) {
      o = o[paths[index]]
      if (o === undefined) {
        return undefined
      }
    }
    return o
  }
}
/**
 * 在现有url上追加参数
 * @param {*} url
 * @param {key:'x',value:'2'} param
 * @returns
 */
function addParamToUrl(url, params) {
  const { key, value } = params || {}
  var param = ''
  if (key) {
    param = encodeURIComponent(key)
  }
  var r = '([&?]|&amp;)' + param + '\\b(?:=(?:[^&#]*))*'
  var a = document.createElement('a')
  var regex = new RegExp(r)
  var str = param + (value ? '=' + encodeURIComponent(value) : '')
  a.href = url
  var q = a.search.replace(regex, '$1' + str)
  if (q === a.search && !regex.test(a.search)) {
    a.search += (a.search ? '&' : '') + str
  } else {
    a.search = q
  }
  return a.href
}

export {
  bus,
  checkSYSTYPE,
  formatInterfaceShowData,
  addParamToUrl,
  createSocket,
  getToken,
  service
}
