<!--/*
* @Author: dingli
* @Desc: 分类弹框
* @Date: 2022-1-21
*/-->
<template>
  <div
    v-show="isShow"
    width="1280px"
    class="classify-dialog">
    <div class="classify-wrap">
      <div v-show="showflag" class="source">
        <div v-for="(item, k) in DIALOG_TYPE" :key="k" class="type-wrap">
          <div class="tags-wrap">
            <span class="cls-title">{{ k }}</span>
            <span
              v-for="d in item.list"
              :key="d[prop.value]"
              class="tag-item cursor"
              :class="{active:item.activeId==d[prop.value], 'is-select':tagSelectedClass(d, k)}"
              @click="clickTag(d, k)">{{ d[prop.label] }}</span>
            <div v-show="item.showSub" class="tags-sub-wrap">
              <span class="cursor" :class="{active:item.checkAllFlag==1}" @click="clickCheckAll(k)">全选</span>
              <span
                v-for="sd in item.subList"
                :key="sd[prop.value]"
                class="cursor"
                :class="{active:subTagActiveClass(sd, k)}"
                @click="clickSubTag(sd, k)">{{ sd[prop.label] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="type-wrap mb0 result-wrap">
      <div>筛选结果<span></span>个</div>
      <div class="tags-wrap">
        <span v-for="tag in selected" :key="tag.showId" class="search-item cursor">
          <span class="text">{{ tag.show }}</span>
          <i class="line"></i>
          <i class="c-icon-close" @click="handleDel(tag)" />
        </span>
        <span v-show="selected.length" class="hover clear" @click="clickClear">清空</span>
      </div>
    </div> -->
  </div>
</template>
<script>
import { queryTagTree, queryRuleList } from '@/api/index'
// import * as APP_ENUMS from '@/views/pack-manage-app/enums.js'
import { applyTypeList } from '@/config'
export default {
  name: 'ClassifyDialog',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    packType: {
      type: Number,
      default: 1
    },
    showflag: Boolean,
    hideLabel: {
      type: Boolean,
      default: false
    },
    hideScene: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const DIALOG_TYPE = {}
    if (+this.packType === 2) {
      DIALOG_TYPE['资源分类'] = {
        list: [],
        activeId: '',
        showSub: false,
        checkAllFlag: '', // 1全选 2半全选 3非全选
        subList: []
      }
      // DIALOG_TYPE['资源状态'] = {
      //   list: Object.keys(APP_ENUMS.APP_STATUS).map(k => ({ groupName: APP_ENUMS.APP_STATUS[k], groupId: k })),
      //   activeId: '',
      //   showSub: false,
      //   checkAllFlag: '',
      //   subList: []
      // }
      DIALOG_TYPE['使用方式'] = {
        list: applyTypeList.filter(d => +d.value !== 2).map(d => ({ groupName: d.label, groupId: d.value })),
        activeId: '',
        showSub: false,
        checkAllFlag: '',
        subList: []
      }
    } else {
      DIALOG_TYPE['标签分类'] = {
        list: [],
        activeId: '',
        showSub: false,
        checkAllFlag: '',
        subList: []
      }
      DIALOG_TYPE['使用方式'] = {
        list: [{ groupId: 1, groupName: '资源下载' }, { groupId: 2, groupName: '资源订阅' }],
        activeId: '',
        showSub: false,
        checkAllFlag: '',
        subList: []
      }
    }
    return {
      activeType: '',
      searchVal: '',
      selectedMap: {},
      prop: { label: 'groupName', value: 'groupId', pvalue: 'parentId', childList: 'childList' },
      DIALOG_TYPE: DIALOG_TYPE,
      searchValId: `-search-search-search-search-search-search-search-`
    }
  },
  computed: {
    selected() {
      const list = Object.values(this.selectedMap)
      // this.changeSelectedMap(list)
      return list
    },
    isShow() {
      if (this.showflag) return true
      if (this.selected.length > 1) return true
      if (this.selected.length === 1 && this.selected[0].showId !== this.searchValId) return true
      return false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(data) {
      const selectedMap = {}
      if (data && data.length) {
        data.forEach(d => {
          selectedMap[d.showId] = d
        })
      }
      this.selectedMap = selectedMap
      this.queryData(1)
      this.queryData(2)
      this.queryRuleData()
    },
    clickSeach(val) {
      if (val) {
        const selectedMap = { ...this.selectedMap }
        selectedMap[this.searchValId] = {
          show: `名称：${val}`,
          value: val,
          showId: this.searchValId,
          type: '查询'
        }
        this.selectedMap = selectedMap
      }
      this.changeSelectedMap()
    },
    changeSelectedMap() {
      console.log('----ok')
      this.$emit('ok', this.selected)
    },
    clickClear() {
      this.selectedMap = {}
      this.changeSelectedMap()
    },
    subTagActiveClass(stag, type) {
      const { value, pvalue } = this.prop
      const id = `${type}-${stag[pvalue]}-${stag[value]}`
      return !!this.selectedMap[id]
    },
    tagSelectedClass(tag, type) {
      const { value } = this.prop
      const id = `${type}-${tag[value]}`
      if (this.selectedMap[id]) {
        return true
      }
      for (const k in this.selectedMap) {
        if (k.startsWith(id + '-')) {
          return true
        }
      }
      return false
    },
    handleDel(tag) {
      const selectedMap = { ...this.selectedMap }
      delete selectedMap[tag.showId]
      this.selectedMap = selectedMap
      this.changeSelectedMap()
    },
    clickTag(tag, type) {
      const { value, label, childList } = this.prop
      // 一级节点与二级节点关联显示
      const itemObj = this.DIALOG_TYPE[type]
      // 点击一级节点时 全选按钮设置为非全选
      itemObj.checkAllFlag = 3
      itemObj.subList = tag[childList] || []
      if (tag[value] === itemObj.activeId) {
        itemObj.showSub = tag[childList] && tag[childList].length ? !itemObj.showSub : false
      } else {
        itemObj.showSub = !!(tag[childList] && tag[childList].length)
      }
      itemObj.activeId = itemObj.showSub ? tag[value] : null

      const id = `${type}-${tag[value]}`
      const selectedMap = { ...this.selectedMap }
      if (!(tag[childList] && tag[childList].length)) {
        if (selectedMap[id]) {
          delete selectedMap[id]
        } else {
          selectedMap[id] = {
            ...tag,
            label: tag[label],
            pValue: undefined,
            value: tag[value],
            type: type,
            show: `${type}：${tag[label]}`,
            showId: id
          }
        }
        this.selectedMap = selectedMap
        this.changeSelectedMap()
      }
    },
    clickCheckAll(type) {
      const { value, label, pvalue } = this.prop
      const itemObj = this.DIALOG_TYPE[type]
      const selectedMap = { ...this.selectedMap }
      itemObj.checkAllFlag = +itemObj.checkAllFlag === 1 ? 3 : 1
      console.log(itemObj.checkAllFlag, '---')
      itemObj.subList.forEach(stag => {
        const id = `${type}-${stag[pvalue]}-${stag[value]}`
        if (itemObj.checkAllFlag === 1) {
          selectedMap[id] = {
            ...stag,
            label: stag[label],
            pValue: stag[pvalue],
            value: stag[value],
            type: type,
            show: `${type}：${stag[label]}`,
            showId: id
          }
        } else {
          delete selectedMap[id]
        }
      })
      // 资源分类 全选 需要将一级节点选中
      if (type === '资源分类') {
        const ptag = itemObj.list.find(d => d[value] === itemObj.activeId)
        const pid = `${type}-${itemObj.activeId}`
        if (itemObj.checkAllFlag === 1) {
          selectedMap[pid] = {
            ...ptag,
            label: ptag[label],
            pValue: null,
            value: ptag[value],
            type: type,
            show: `${type}：${ptag[label]}`,
            showId: pid
          }
        } else {
          delete selectedMap[pid]
        }
      }
      console.log(selectedMap)
      this.selectedMap = selectedMap
      this.changeSelectedMap()
    },
    clickSubTag(stag, type) {
      const { value, label, pvalue } = this.prop
      const itemObj = this.DIALOG_TYPE[type]
      const id = `${type}-${stag[pvalue]}-${stag[value]}`
      const selectedMap = { ...this.selectedMap }
      if (selectedMap[id]) {
        delete selectedMap[id]
      } else {
        selectedMap[id] = {
          ...stag,
          label: stag[label],
          pValue: stag[pvalue],
          value: stag[value],
          type: type,
          show: `${type}：${stag[label]}`,
          showId: id
        }
      }
      this.selectedMap = selectedMap
      // 设置全选按钮状态
      const isCheckAll = itemObj.subList.filter(stag => {
        const id = `${type}-${stag[pvalue]}-${stag[value]}`
        return !!selectedMap[id]
      })
      if (isCheckAll.length === itemObj.subList.length) {
        this.checkAllFlag = 1
      } else if (isCheckAll.length === 0) {
        this.checkAllFlag = 3
      } else {
        this.checkAllFlag = 2
      }
      this.changeSelectedMap()
    },
    async queryRuleData() {
      try {
        this.DIALOG_TYPE['自定义'].list = []
        const res = await queryRuleList()
        this.DIALOG_TYPE['自定义'].list = res.data.map(d => ({ ...d, groupName: d.showContent, groupId: d.id, childList: [] }))
      } catch (e) {
        //
      }
    },
    async queryData(groupType) {
      if (this.hideLabel && +groupType === 2) return
      if (this.hideScene && +groupType === 1) return
      const key = +groupType === 1 ? '资源分类' : '标签分类'
      try {
        this.DIALOG_TYPE[key].list = []
        const res = await queryTagTree({ groupType })
        this.DIALOG_TYPE[key].list = res.data
      } catch (e) {
        //
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.classify-dialog {
  width: 100%;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  border-radius: 4px;
}
.cursor {
  cursor: pointer;
}

.classify-wrap {
  position: relative;
  color: #202020;
  padding-top: 20px;
  padding-bottom: 1px;
  background: #FFFFFF;
  .collapse {
    position: absolute;
    width: 120px;
    height: 42px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: url(~@/assets/imgs/collapse.png) no-repeat center;
  }
}
.cls-title {
  display: inline-block;
  flex-shrink: 0;
  margin-right: 40px;
  padding-left: 16px;
  width: 96px;
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  color: #8A8A8A;
  background: linear-gradient(90deg, #EBF9FF 0%, rgba(235,249,255,0.00) 100%);
  border-left: 4px solid $primaryColor;
}
.source {
  position: relative;
}
.type-wrap {
  display: flex;
}
.tags-wrap {
  flex: 1;
  padding: 0 20px;
}
.tag-item {
  display: inline-block;
  margin-right: 40px;
  margin-bottom: 20px;
  padding: 0 8px;
  height: 34px;
  line-height: 34px;
  border: 1px solid transparent;
  border-radius: 2px;
  &:hover {
    color: $primaryColor;
  }
  &.active {
    border: 1px solid $primaryColor;
    background: #EBF9FF;
  }
  &.is-select {
    border: 1px solid $primaryColor;
    background: #EBF9FF;
    color: $primaryColor;
  }
}
.tags-sub-wrap {
  margin-bottom: 20px;
  padding-left: 12px;
  padding-top: 16px;
  width: 100%;
  background: #F6F8FD;
  border-radius: 4px;
  border: 1px solid #FFFFFF;
  color: #4B4B4B;
  span {
    display: inline-block;
    padding: 0 20px 16px 20px;
  }
  span:hover, span.active, span.is-select {
    color: $primaryColor;
  }
}
.clear {
  margin-left: 18px;
  color: #8A8A8A;
}
.hover{
  cursor: pointer;
  &:hover {
    color: $primaryColor;
  }
}
.mb0 {
  margin-bottom: 0 !important;
}
.c-icon-close {
  margin-left: 10px;
}
.search-item {
  margin-right: 8px;
  height: 26px;
  line-height: 26px;
  padding: 0px 6px 0px 12px;
  background: #F6F9FB;
  border: 1px solid #E4E8EB;
  color: #3F4254;
  font-size: 16px;
  &:hover {
    border: 1px solid $primaryColor;
    background: #EBF9FF;
    .c-icon-close {
      color: $primaryColor;
    }
  }
}
.result-wrap {
  margin-top: 20px;
  padding: 28px 40px;
  background: #FFFFFF;
}
</style>
