/**
 * @Description: 字典值
 * @Author: zhangsen
 * @Date: 2021-05-10
 */
const getDefaultState = () => {
  return {
    // 资源类型-大类：1统计、2技术、3对象、4数据、5流程
    // 资源类型-小类：11指标、12模型
    // 资源类型-小类：21：算法、22：接口、23：页面
    assets: {
      statistics: 1,
      technology: 2,
      object: 3,
      data: 4,
      flow: 5,
      indicator: 11,
      model: 12,
      arithmetic: 21,
      interface: 22,
      page: 23
    }
  }
}

const state = getDefaultState()

const mutations = {}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
