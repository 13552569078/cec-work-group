<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="top-search-wrap">
    <div class="search-wrap">
      <div class="search-input-wrap">
        <c-cascader
          v-if="(packType==1)"
          ref="refAssetType"
          v-model="assetType"
          :options="TYPE_TREE"
          placeholder="全部资源类型"
          :props="{children: 'childList'}"
          clearable
          :show-all-levels="true" />
        <c-cascader
          v-if="(packType==2)"
          ref="refAppStatus"
          v-model="appStatus"
          :options="APP_STATUS"
          placeholder="全部状态"
          :props="{children: 'childList'}"
          clearable
          :show-all-levels="false" />
        <i class="line"></i>
        <c-input ref="refPackName" v-model="searchVal" clearable placeholder="请输入" @change="clickSearch" />
        <span class="search-btn" @click.stop="clickSearch">搜索</span>
      </div>
      <span class="cls-expand cursor" @click="clickExpand">{{ isExpand?'收起筛选':'展开筛选' }}<i :class="`${isExpand?'c-icon-arrow-up':'c-icon-arrow-down'}`"></i></span>
    </div>
    <classify-dialog ref="refClassifyDialog" :showflag="isExpand" :pack-type="packType" @ok="classifyDialogOk" />
    <div class="result-wrap">
      <div class="result">筛选结果<span>{{ count }}</span>个</div>
      <div class="tags-wrap" :class="{'tags-wrap-only':labelList.length>3}">
        <span v-for="tag in labelList" :key="tag.showId" class="search-item cursor">
          <span class="text">{{ tag.show }}</span>
          <i class="line"></i>
          <i class="c-icon-close" @click="handleDel(tag)" />
        </span>
        <span v-show="labelList.length" class="cursor clear" @click="clickClear">清空</span>
      </div>
      <div class="order">
        <span class="cursor order-box mr16" @click.stop="clickApplynums">
          <span :class="{active:order=='downloadCount'}">申请次数</span>
          <span class="icon-sort-box">
            <i class="c-icon-caret-top" :class="{active:order=='downloadCount'&&orderType=='asc'}" />
            <i class="c-icon-caret-bottom" :class="{active:order=='downloadCount'&&orderType=='desc'}" />
          </span>
        </span>
        <span class="cursor order-box" @click.stop="clickOrder">
          <span :class="{active:order=='packTime'}">更新时间</span>
          <span class="icon-sort-box">
            <i class="c-icon-caret-top" :class="{active:order=='packTime'&&orderType=='asc'}" />
            <i class="c-icon-caret-bottom" :class="{active:order=='packTime'&&orderType=='desc'}" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import ClassifyDialog from './classify-dialog.vue'
import * as APP_ENUMS from '@/views/pack-manage-app/enums.js'
export default {
  name: '',
  components: { ClassifyDialog },
  props: {
    packType: {
      type: Number,
      default: 1
    },
    count: [Number, String]
  },
  data() {
    return {
      isExpand: true,
      assetType: '',
      appStatus: '',
      searchVal: '',
      labelList: [],
      order: 'packTime',
      orderType: 'desc', // desc、asc
      orderList: {
        downloadCount: '最多下载',
        packTime: '最新上架'
      },
      APP_STATUS: Object.keys(APP_ENUMS.APP_STATUS).map(k => ({ label: APP_ENUMS.APP_STATUS[k], value: k })),
      ASSET_TYPE_TREE: window.ENUMS.TAB_ASSET_TYPE.filter(d => +d.value !== 99),
      APP_TYPE_TREE: window.ENUMS.TAB_APP_TYPE
    }
  },
  computed: {
    TYPE_TREE() {
      if (this.packType === 2) {
        return this.APP_TYPE_TREE
      }
      return this.ASSET_TYPE_TREE
    }
  },
  watch: {
    assetType(nv) {
      this.search()
    },
    appStatus() {
      this.search()
    }
  },
  created() {
    this.search()
  },
  methods: {
    clickClear() {
      this.$refs.refClassifyDialog.clickClear()
    },
    handleDel(tag) {
      this.$refs.refClassifyDialog.handleDel(tag)
    },
    clickApplynums() {
      if (this.order === 'downloadCount') {
        this.orderType = this.orderType === 'desc' ? 'asc' : 'desc'
      } else {
        this.orderType = 'desc'
      }
      this.order = 'downloadCount'
      this.search()
    },
    clickOrder() {
      if (this.order === 'packTime') {
        this.orderType = this.orderType === 'desc' ? 'asc' : 'desc'
      } else {
        this.orderType = 'desc'
      }
      this.order = 'packTime'
      this.search()
    },
    clickSearch() {
      const val = this.searchVal
      this.$refs.refClassifyDialog.clickSeach(val)
      this.searchVal = ''
    },
    classifyDialogOk(data) {
      this.labelList = data
      this.search()
    },
    clickExpand() {
      this.isExpand = !this.isExpand
    },
    search() {
      console.log(this.labelList, '---search')
      const params = {
        sceneIdList: [],
        tagIdList: [],
        assetTypeList: [],
        assetSubtypeList: [],
        statIdList: [],
        orderKey: this.order,
        orderType: this.orderType,
        packName: this.searchVal
      }
      if (+this.packType === 2) {
        params.appStatusList = this.appStatus || []
        params.assetTypeList = [99]
        if (this.assetType[0]) {
          params.assetSubtypeList = [+this.assetType[0]]
        }
      } else {
        if (this.assetType[0]) {
          params.assetTypeList = [+this.assetType[0]]
        }
        if (this.assetType[1]) {
          params.assetSubtypeList = [+this.assetType[1]]
        }
      }
      this.labelList.forEach(d => {
        if (d.type === '资源分类') {
          params.sceneIdList.push(d.value)
        } else if (d.type === '标签分类') {
          params.tagIdList.push(d.value)
        } else if (d.type === '查询') {
          params.packName = d.value
        } else if (d.type === '自定义') {
          params.statIdList.push(d.value)
        } else if (d.type === '使用方式') {
          params.applyTypeList = params.applyTypeList || []
          params.applyTypeList.push(d.value)
        }
      })
      this.$emit('search', params)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.cursor {
  cursor: pointer;
  &:hover {
    color: $primaryColor !important;
  }
}
.active {
  color: $primaryColor !important;
}
.line {
  margin: 0 2px;
  height: 24px;
  width: 1px;
  background: #D8D8D8;
}
.top-search-wrap {
  width: 1280px;
  margin: auto;
  margin-top: 20px;
}
.order-box {
  display: flex;
  .icon-sort-box {
    margin-left: 4px;
    display: flex;
    flex-direction: column;
    i {
      font-size: 14px;
      height: 7px;
      line-height: 8px;
    }
  }
}
.search-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96px;
  padding: 0 40px;
  border: 1px solid #FFFFFF;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
  .search-input-wrap {
    display: flex;
    align-items: center;
    width: 974px;
    height: 48px;
    border-radius: 4px;
    border: 1px solid #8DACFA;
    .search-btn {
      height: 100%;
      line-height: 48px;
      width: 96px;
      width: 96px;
      color: #FFFFFF;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      background: linear-gradient(90deg, #8DACFA 0%, #638BEE 100%);
      text-align: center;
      cursor: pointer;
    }
  }
}
.cls-expand {
  color: #8A8A8A;
  i {
    margin-left: 8px;
  }
}
.result-wrap {
  position: relative;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 28px 40px;
  min-height: 80px;
  background: #FFFFFF;
  .result {
    position: absolute;
    top: 34px;
    left: 40px;
    margin-right: 40px;
    padding-left: 24px;
    font-size: 16px;
    color: #3F4254;
    background-image: url(~@/assets/imgs/icon-filter.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
    background-position: 0px center;
    span {
      margin: 0 4px;
      color: $primaryColor;
    }
  }
  .order {
    display: flex;
    position: absolute;
    top: 34px;
    right: 40px;
    margin-left: 40px;
    font-size: 16px;
    color: #8A8A8A;
    .mr16{
      margin-right: 16px;
    }
  }
  .tags-wrap {
    padding-left: 160px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }
  .tags-wrap-only {
    padding-left: 0;
    padding-top: 30px;
    width: 100%;
    .search-item, .clear {
      margin-top: 8px;
    }
  }
  .search-item {
    flex-shrink: 0;
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
  .clear {
    margin-left: 16px;
    height: 26px;
    line-height: 26px;
    color: #8A8A8A;
  }
}
::v-deep.c-input {
  flex: 1;
  .c-input__inner {
    width: 100%;
    border: none;
    background: transparent;
  }
}
::v-deep.c-cascader {
  width: 170px;
  .c-input__inner {
    width: 200px;
    border: none;
    background: transparent;
  }
}
</style>
