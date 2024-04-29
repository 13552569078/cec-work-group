// 各个系统前缀配置
const baseUrlMap = {
  'root': '', // 不带前缀, 根路径
  'mock': '/mock', // mock数据
  'gateway': '/api', // 网关
  'uc': '/api/gc', // 用户中心
  'event': '/api/event', // 指挥平台
  'bs': '/api/bs', // 基础服务
  'base': '/api/base-service',
  'igridcenter': '/api/igridcenter',
  'msg': '/api/message-center', // 消息中心
  'ninex': '/api/9x' // 9+x
}
export default baseUrlMap
