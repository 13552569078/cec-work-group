<!--
 * @description 事件分析-类别统计
 * @date 2022-03-28
 * @author lism
-->
<template>
  <div class="event-type-container">
    <fixed-page padding="0" :footer-height="0" :footer-margin="0" :nofooter="true">
      <template v-slot:header>
        <div class="top-search">
          <event-search
            :show-event-type="false"
            :search-form.sync="searchForm"
            @search="search"
            @reset="reset"
          />
        </div>
      </template>
      <template>
        <div class="search-content">
          <div ref="switchType" class="switch-type">
            <div class="left">
              <div v-show="type === typeMap.list">
                <div v-if="listTotal !== 0" class="list-result">
                  <span><i class="selectcount-icon" /></span>
                  <span class="fs16">
                    <span>查询结果</span>
                    <span class="list-count">{{ listTotal }}</span>
                    <span>条数据</span>
                  </span>
                </div>
                <div v-else class="list-no-result fs16">
                  <i class="total-icon" />
                  暂无查询结果
                </div>
              </div>
              <div v-show="type === typeMap.graph" class="title-bar">统计图</div>
              <div v-show="type === typeMap.trend" class="title-bar">趋势图</div>
            </div>
            <div class="right">
              <el-button-group>
                <el-button
                  v-for="(val, key) in typeMap"
                  :key="key"
                  :class="type === val ? 'click-tab-btn' : 'tab-btns'"
                  @click.stop="_changeTab(val)"
                >{{ val }}</el-button>
              </el-button-group>
            </div>
          </div>
          <div class="content">
            <list-result
              v-if="type === typeMap.list"
              ref="listResult"
              :total.sync="listTotal"
              :table-content-height="tableContentHeight"
            />
            <graph-result v-if="type === typeMap.graph" ref="graphResult" />
            <trend-result v-if="type === typeMap.trend" ref="trendResult" />
          </div>
        </div>
      </template>
    </fixed-page>
  </div>
</template>

<script>
import eventSearch from '../components/eventSearch.vue'
import listResult from './listResult.vue'
import graphResult from './graphResult.vue'
import trendResult from './trendResult.vue'
const TYPE_MAP = {
  list: '列表展示',
  graph: '图表展示',
  trend: '趋势展示'
}
export default {
  name: 'EventTypeAn',
  components: {
    eventSearch,
    listResult,
    graphResult,
    trendResult
  },
  data() {
    return {
      type: TYPE_MAP.list,
      searchForm: {},
      listTotal: 0,
      typeMap: TYPE_MAP,
      searchTipsHeight: 0
    }
  },
  computed: {
    tableContentHeight() {
      return this.searchTipsHeight ? `calc(100% - ${this.searchTipsHeight}px - 20px)` : `calc(100% - 20px)`
    }
  },
  watch: {
    type() {
      this.$nextTick(() => {
        this.search()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.searchTipsHeight = this.$refs?.switchType?.$el?.clientHeight
      this.search()
    })
  },
  methods: {
    _changeTab(name) {
      this.type = name
    },
    search() {
      const ref = this.getRefs()
      // 调用子组件的方法
      ref.search(this.searchForm)
    },
    reset() {
      this.search()
    },
    getRefs() {
      switch (this.type) {
        case this.typeMap.list:
          return this.$refs['listResult']
        case this.typeMap.graph:
          return this.$refs['graphResult']
        case this.typeMap.trend:
          return this.$refs['trendResult']
      }
    }
  }
}
</script>

<style scoped lang="scss">
.event-type-container {
  height: 100%;
  .top-search {
    height: 70px;
    margin-bottom: 20px;
  }
  .search-content {
    height: 100%;
    background-color: #fff;
    padding: 10px 20px 0 20px;
    .switch-type {
      height: 40px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        .list-result {
          color: #202020;
          padding-left: 20px;
          .list-count {
            color: #36a4ff;
          }
          span {
            margin-right: 4px;
          }
        }
        .selectcount-icon {
          position: relative;
          width: 16px;
          height: 20px;
          background: #FFFFFF;
          border: 2px solid #4B4B4B;
          display: inline-block;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          margin-right: 8px;
          &::after {
            content: " ";
            position: absolute;
            left: 5px;
            top: 3px;
            width: 2px;
            height: 6px;
            background: #4B4B4B;
          }
        }
        .total-icon {
          font-size: 16px;
          color: #202020;
          position: relative;
          right: 20px;
          &::before {
            content: "";
            width: 16px;
            height: 16px;
            position: absolute;
            top: 0;
            left: 0;
            background-image: url(~@/assets/icon-data.png);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
        }
        .list-no-result {
          color: #202020;
           padding-left: 20px;
        }
        .title-bar {
          padding-left: 14px;
          color: #313131;
          font-weight: bold;
          position: relative;
          font-size: 14px;
          &::before {
            content: "";
            display: inline-block;
            position: absolute;
            width: 4px;
            height: 14px;
            left: 0;
            top: 2px;
            background: #36a4ff;
          }
        }
      }
      .right {
        .tab-btns {
          width: 104px;
          border-radius: 2px 0px 0px 2px;
          border: 1px solid #e7e7e7;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #4b4b4b;
        }
        .click-tab-btn {
          font-family: PingFangSC-Regular, PingFang SC;
          width: 104px;
          border: 1px solid #36a4ff;
          color: #36a4ff;
        }
      }
    }
    .content {
      height: calc(100% - 50px);
    }
  }
}
</style>
