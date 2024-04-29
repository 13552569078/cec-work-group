/**
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-02-15
 */
import { findNode } from '@/utils/index'
export default {
  computed: {
    bsDicts() {
      return this.$store.getters.bsDicts
    }
  },
  methods: {
    // 处理搜索条件参数
    searchList() {
      this.$emit('searchList', this.getParams(this.searchFilterItems))
    },
    // 重置
    _reset() {
      this.$emit('reset')
    },
    // tis组件下的清空筛选条件
    clearSearchFilter() {
      this.searchFilterItems.forEach(item => {
        // item.labelKey === 'eventCascader' ||
        if (item.type === 'eventCascader' || item.type === 'eventCascaderHistory') {
          item.nodeName = ''
          item.eventTypeId = ''
          item.eventTypeLId = ''
          item.eventTypeMId = ''
        }
        if (item.labelKey === 'areaCascader') {
          item.nodeNames = []
          item.gridId = ''
          item.levels = []
        }
        if (item.labelKey === 'dateRange') {
          item.value = []
          item.defaultValue = []
        }
        if (item.type === 'platformSource') {
          item.value = ''
          item.defaultValue = ''
        }
        if (item.type === 'elCascader') {
          console.log(item)
          item.value = ''
          item.nodeName = ''
        }
        item.value = item.defaultValue
      })
      this.$forceUpdate()
    },
    // tis组件下的单个删除
    delFilter(key) {
      const obj = this.searchFilterItems.find(item => item.labelKey === key)
      if (key === 'dateRange') { // 默认时间: 可以清除时间
        // obj.value = setDefaultTimeRange()
        obj.value = []
        obj.defaultValue = []
      } else if (key === 'eventCascader' || key === 'eventCascaderHistory') { // 事件类型
        obj.nodeName = ''
        obj.eventTypeId = ''
        obj.eventTypeLId = ''
        obj.eventTypeMId = ''
        obj.eventTypeIdFour = ''
        obj.eventTypeIdFive = ''
      } else if (key === 'areaCascader') {
        obj.nodeNames = []
        obj.gridId = ''
        obj.areaCascader = ''
        obj.levels = []
      } else {
        obj.value = ''
      }
    },
    // 重组 form表单及 tis 组件展示数据
    getParams(paraArr, orgMap) {
      // 对事件类型、事件时间特殊处理
      const arr = paraArr.filter(item => !!item.value || item.value === 0 || item.eventTypeId || item.eventTypeLId || item.eventTypeMId || item.gridId || item.platformSource)

      const displayFilters = []
      const params = {}
      arr.forEach(item => {
        if (item.type === 'select') {
          params[item.labelKey] = item.value
          const obj = item.options.find(op => op.dictValue === item.value)
          const finValue = obj?.dictLabel || obj?.dictDesc
          finValue && displayFilters.push({
            labelKey: item.labelKey,
            val: `${item.label}：${finValue}`
          })
        }
        if (item.type === 'input') {
          params[item.labelKey] = item.value
          displayFilters.push({
            val: `${item.label}：${item.value}`,
            labelKey: item.labelKey
          })
        }
        if (item.type === 'cascade') {
          try {
            const len = item.value.length
            const orgId = item.value[len - 1]
            params[item.labelKey] = orgId
            if (this.speType) orgMap = this.speTypeMap
            if (orgMap) {
              const org = orgMap[orgId]
              if (this.speType) {
                displayFilters.push({
                  val: `${item.label}：${org.dictDesc}`,
                  labelKey: item.labelKey
                })
              } else {
                displayFilters.push({
                  val: `${item.label}：${org.name}`,
                  labelKey: item.labelKey
                })
              }
            }
          } catch (error) {
            console.log('handler cascade', error)
          }
        }
        // 事件类型处理
        if (item.type === 'eventCascader' || item.type === 'eventCascaderHistory') {
          if (item.eventTypeLId) {
            params.eventTypeLId = item.eventTypeLId
          }
          if (item.eventTypeMId) {
            params.eventTypeMId = item.eventTypeMId
          }
          if (item.eventTypeId) {
            params.eventTypeId = item.eventTypeId
          }
          if (item.eventTypeIdFour) {
            params.eventTypeIdFour = item.eventTypeIdFour
          }
          if (item.eventTypeIdFive) {
            params.eventTypeIdFive = item.eventTypeIdFive
          }
          displayFilters.push({
            val: `${item.label}：${item.nodeName}`,
            labelKey: item.labelKey
          })
        }
        // 区域处理
        if (item.type === 'areaCascader') {
          if (item.gridId) {
            params.gridId = item.gridId
          }
          if (Array.isArray(item.levels) && item.levels.length) {
            params.level = item.levels[item.levels.length - 1] || ''
          }
          let _name = ''
          if (Array.isArray(item.nodeNames)) {
            _name = item.nodeNames[item.nodeNames.length - 1] || ''
          }
          displayFilters.push({
            val: `${item.label}：${_name}`,
            labelKey: item.labelKey
          })
        }
        // 事件区间配置, 如果有值，则追加提示条件中
        if (item.timeType === 'daterange') {
          try {
            if (item.value.length) {
              params.createBeginTime = item.value[0]
              params.createEndTime = item.value[1]
              displayFilters.push({
                val: `${item.label}：${item.value.join('-')}`,
                labelKey: item.labelKey
              })
            }
          } catch (error) {
            console.log('getParams handle error', error)
          }
        }
        if (item.type === 'datetimerange') {
          item.labelKey.forEach((key, i) => (params[key] = item.value[i]))
          displayFilters.push({
            val: `${item.label}：${item.value.join('至')}`,
            labelKey: item.labelKey
          })
        }
        // 主处置单位
        if (item.type === 'elCascader') {
          const value = item.value[item.value.length - 1]
          params[item.labelKey] = value
          const found = findNode(value, 'id', item.options)
          displayFilters.push({
            val: `${item.label}：${found?.name}`,
            labelKey: item.labelKey
          })
        }
        // 系统来源
        if (item.type === 'platformSource') {
          params[item.labelKey] = item.value
          const obj = item.options.find(op => op.dictValue === item.value)
          const finValue = obj?.dictLabel || obj?.dictDesc
          displayFilters.push({
            labelKey: item.labelKey,
            val: `${item.label}：${finValue}`
          })
        }
        // 系统来源
        if (item.type === 'platformThirdAll') {
          params[item.labelKey] = item.value
          const obj = item.options.find(op => op.dictValue === item.value)
          const finValue = obj?.dictLabel || obj?.dictDesc
          displayFilters.push({
            labelKey: item.labelKey,
            val: `${item.label}：${finValue}`
          })
        }
      })
      if (this.speType && this.speType !== 'all') {
        params.speType = this.getSpeParam(this.speType)
      }
      return { params, displayFilters }
    }
  }
}
