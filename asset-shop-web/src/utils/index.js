import Vue from 'vue'
import { downloadFile } from './downLoad'
import { createSocket } from './websocket'
import service from './request'
import { getToken, removeToken } from '@l/utils/auth'
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
/**
 *
 * @param {*} obj
 * @returns
 *
 * obj={
	"openapi": "3.0.3",
	"info": {
		"title": "tz-txr-1208002y0wRxNIq",
		"description": "体征平台_API服务接口文档",
		"contact": {
			"name": "cestc"
		},
		"version": "1.3.0"
	},
	"servers": [{
		"url": "http://10.32.132.57:9887",
		"description": "Inferred Url"
	}],
	"security": [{
		"default": []
	}],
	"tags": [{
		"name": "API开发接口",
		"description": "Api Config Controller"
	}],
	"paths": {
		"/cityie/citysignsApi/api/http://tz-txr-1208002": {
			"post": {
				"tags": ["API开发接口"],
				"summary": "tz-txr-1208002",
				"operationId": "http:UsingPOST",
				"responses": {
					"200": {
						"description": "OK",
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Result"
								}
							}
						}
					},
					"201": {
						"description": "Created"
					},
					"401": {
						"description": "Unauthorized"
					},
					"403": {
						"description": "Forbidden"
					},
					"404": {
						"description": "Not Found"
					}
				},
				"security": [{
					"default": []
				}],
				"x-throttling-tier": "Unlimited"
			}
		}
	},
	"components": {
		"schemas": {
			"Result": {
				"title": "Result",
				"required": ["code", "data"],
				"type": "object",
				"properties": {
					"msg": {
						"type": "string",
						"description": "消息提示"
					},
					"code": {
						"type": "integer",
						"description": "响应码",
						"format": "int32"
					},
					"data": {
						"type": "object",
						"description": "数据"
					}
				}
			}
		},
		"securitySchemes": {
			"default": {
				"type": "oauth2",
				"flows": {
					"implicit": {
						"authorizationUrl": "https://test.com",
						"scopes": {}
					}
				}
			}
		}
	}
}
 *
 */
const formatInterfaceShowData = function(obj) {
  console.log(obj, 'obj')
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
          _obj.inputData = [] // 入参列表
          _obj.outputData = []// 出参列表
          let requestBody = {}// 请求对象
          // 获取request的schema.$ref
          const requestBodyRef = methodInfo.requestBody ? methodInfo.requestBody.content['application/json'] && methodInfo.requestBody.content['application/json'].schema['$ref'] || '' : methodInfo.parameters && methodInfo.parameters.filter(item => item.name === 'body')[0] || '' ? methodInfo.parameters.filter(item => item.name === 'body')[0].schema.$ref : ''
          if (requestBodyRef) {
            const paths = requestBodyRef.split('/')
            const [first, ..._paths] = [...paths]
            if (first === '#') {
              requestBody = getObj(obj, _paths) || {}
            }
          }
          // 如果是url入参
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
          // 解析body入参
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
          console.log(methodInfo, 'methodInfo')
          // 解析出参
          // 解析响应码200，响应方式application/json
          if (methodInfo.responses && methodInfo.responses['200'] && methodInfo.responses['200'].content && methodInfo.responses['200'].content['application/json']) {
            // 响应值类型是对象
            if (methodInfo.responses['200'].content['application/json'].schema.type === 'object') {
              if (methodInfo.responses['200'].content['application/json'].schema.items.$ref.startWith('#')) {
                const paths = methodInfo.responses['200'].content['application/json'].schema.items.$ref.split('/')
                const [first, ..._paths] = [...paths]
                console.log(first)
                const res = (getObj(obj, _paths) || {}).properties
                console.log(res, 'res======')
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
              // 响应值存在schema
              if (methodInfo.responses['200'] && methodInfo.responses['200'].content['application/json'] && methodInfo.responses['200'].content['application/json'].schema) {
                // 响应值类型是array 对象映射数组
                if (methodInfo.responses['200'].content['application/json'].schema.type &&
                methodInfo.responses['200'].content['application/json'].schema.type === 'array'
                ) {
                  // 解析映射
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
                  // 响应值类型是映射
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
          // 解析响应码200，响应方式*/*
          if (methodInfo.responses && methodInfo.responses['200'] && methodInfo.responses['200'].content && methodInfo.responses['200'].content['*/*']) {
            if (methodInfo.responses['200'].content['*/*'].schema.type === 'object') {
              if (methodInfo.responses['200'].content['*/*'].schema.items.$ref.startWith('#')) {
                const paths = methodInfo.responses['200'].content['*/*'].schema.items.$ref.split('/')
                const [first, ..._paths] = [...paths]
                console.log(first)
                const res = (getObj(obj, _paths) || {})
                console.log(res, 'res======')
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
              if (methodInfo.responses['200'] && methodInfo.responses['200'].content['*/*'] && methodInfo.responses['200'].content['*/*'].schema) {
                if (methodInfo.responses['200'].content['*/*'].schema.type &&
                methodInfo.responses['200'].content['*/*'].schema.type === 'array'
                ) {
                  if (methodInfo.responses['200'].content['*/*'].schema.items &&
                  methodInfo.responses['200'].content['*/*'].schema.items.$ref &&
                  methodInfo.responses['200'].content['*/*'].schema.items.$ref.indexOf('#') === 0) {
                    const paths = methodInfo.responses['200'].content['*/*'].schema.items.$ref.split('/')
                    const [first, ..._paths] = [...paths]
                    console.log(first)
                    const res = getObj(obj, _paths) || {}
                    _obj.body = JSON.stringify([res])
                  }
                } else {
                  if (methodInfo.responses['200'].content['*/*'].schema.$ref &&
                  methodInfo.responses['200'].content['*/*'].schema.$ref.indexOf('#') === 0) {
                    const paths = methodInfo.responses['200'].content['*/*'].schema.$ref.split('/')
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
  downloadFile,
  formatInterfaceShowData,
  createSocket,
  getToken,
  removeToken,
  service,
  addParamToUrl
}
