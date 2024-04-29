import { deepClone, getSpeLeafByVal } from '@/utils'

export default {
  computed: {
    speType() {
      return this.$route.query.speType || ''
    },
    speTypeList() {
      return this.$store.getters.getBsDictsByType('lifeline_special_type')
    },
    speTypeMap() {
      const speMap = {}
      this.speTypeList.forEach(item => {
        speMap[item.dictValue] = item
      })
      return speMap
    },
    speTypeOptions() {
      // const options = deepClone(this.$store.getters.speTypeTree)
      // 筛选专项树----需求改了不存在了
      // if (this.$route.query.speType && this.$route.query.speType !== 'all') {
      //   const spe = this.speTypeList.find(item => item.dictValue === this.$route.query.speType)
      //   if (spe) {
      //     const treeData = filterSpeTypeTree(options, this.$route.query.speType)
      //     return treeData
      //   } else {
      //     return []
      //   }
      // }
      return this.$store.getters.speTypeTree
    },
    ldzh_speTypeOptions() {
      return this.$store.getters.ldzhspeTypeTree
    },
    ldzh_speTypeList() {
      return this.$store.getters.getBsDictsByType('linkage_special_type')
    },
    eventTypeCode() {
      return this.$route.query.eventTypeCode || ''
    },
    allEventTypesList() {
      return this.$store.getters.allEventTypesList
    }
  },
  methods: {
    // 查找所有父级---专项
    getAllParent(val) {
      if (val) {
        const arr = [val]
        let obj = this.speTypeList.find(item => item.dictValue === val)
        while (obj && obj.parentValue) {
          const pObj = this.speTypeList.find(item => item.dictValue === obj.parentValue)
          pObj && arr.unshift(pObj.dictValue)
          if (pObj && pObj.parentValue !== '0') {
            obj = pObj
          } else {
            obj = null
          }
        }
        return arr
      }
      return []
    },
    getAllParent_ldzh(val) {
      if (val) {
        const arr = [val]
        let obj = this.ldzh_speTypeList.find(item => item.dictValue === val)
        while (obj && obj.parentValue) {
          const pObj = this.ldzh_speTypeList.find(item => item.dictValue === obj.parentValue)
          pObj && arr.unshift(pObj.dictValue)
          if (pObj && pObj.parentValue !== '0') {
            obj = pObj
          } else {
            obj = null
          }
        }
        return arr
      }
      return []
    },
    // 需求变更  用不到了，先保留
    // 根据eventCode获取本级及以上所有事件id
    getAllEtParentIds(eventTypeCode) {
      const resObj = {
        eventTypeLId: '',
        eventTypeMId: '',
        eventTypeId: '',
        eventTypeIdFour: '',
        eventTypeIdFive: '',
        nodeName: ''
      }
      if (eventTypeCode) {
        let obj = this.allEventTypesList.find(item => item.code === eventTypeCode)
        const arr = obj ? [obj.id] : []
        if (obj) resObj.nodeName = obj.name
        while (obj && obj.parentId) {
          const pObj = this.allEventTypesList.find(item => item.id === obj.parentId)
          pObj && arr.unshift(pObj.id)
          if (pObj && pObj.parentId) {
            obj = pObj
          } else {
            obj = null
          }
        }
        if (arr.length) {
          resObj.eventTypeId = arr[0] || ''
          resObj.eventTypeMId = arr[1] || ''
          resObj.eventTypeId = arr[2] || ''
          resObj.eventTypeIdFour = arr[3] || ''
          resObj.eventTypeIdFive = arr[4] || ''
        }
      }
      return resObj
    },
    // 根据speType获取所有叶子
    getSpeParam(speTypeStr, dispatchDeal) {
      const speTypeList = speTypeStr ? speTypeStr.split(',') : []
      let leafArr = []
      if (dispatchDeal === '0' || !dispatchDeal) {
        speTypeList.forEach(speType => {
          leafArr = leafArr.concat(getSpeLeafByVal(deepClone(this.speTypeOptions), speType) || [])
        })
      }
      if (dispatchDeal === '1' || !dispatchDeal) {
        speTypeList.forEach(speType => {
          leafArr = leafArr.concat(getSpeLeafByVal(deepClone(this.ldzh_speTypeOptions), speType) || [])
        })
      }
      const uniqueArray = Array.from(new Set(leafArr))
      return uniqueArray.join(',')
    }
  }
}
