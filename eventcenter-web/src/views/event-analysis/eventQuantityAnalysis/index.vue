<template>
  <div class="event-quantity-container">
    <fixed-page padding="0" :footer-height="0" :footer-margin="0" :nofooter="true">
      <template v-slot:header>
        <!-- 事件量统计 -->
        <div class="top-quantityAnalysis">
          <event-search
            :show-event-type="true"
            :search-form.sync="searchForm"
            @search="search"
            @reset="reset"
          />
        </div>
      </template>
      <template>
        <div class="search-content">
          <div ref="switchType" class="switch-type">
            <!-- 结果统计 -->
            <div class="left">
              <div v-show="type === '列表展示'">
                <div v-if="chartData.length !== 0" class="list-result">
                  <span><i class="selectcount-icon" /></span>
                  <span class="fs16">
                    <span>查询结果</span>
                    <span class="list-count">{{ chartData.length }}</span>
                    <span>条数据</span>
                  </span>
                </div>
                <div v-else class="list-no-result fs16">
                  <i class="selectcount-icon" />
                  暂无查询结果
                </div>
              </div>
              <div v-show="type === '图表展示'" class="title-bar">统计图</div>
            </div>
            <!-- tab切换 -->
            <div class="right">
              <el-button-group>
                <el-button
                  v-for="(val, key) in typeOption"
                  :key="key"
                  :class="type === val ? 'click-tab-btn' : 'tab-btns'"
                  @click.stop="_changeTab(val)"
                >{{ val }}</el-button>
              </el-button-group>
            </div>
          </div>
          <div class="content">
            <!-- 列表组件 -->
            <list-result
              v-if="type === '列表展示'"
              v-model="listData"
              :table-content-height="tableContentHeight"
            />
            <!-- 图表组件 -->
            <chart-result v-if="type === '图表展示'" v-model="chartData" />
          </div>
        </div>
      </template>
    </fixed-page>
  </div>
</template>

<script>
import service from '@/api/dispatch'
import eventSearch from '../components/eventSearch.vue'
import chartResult from './chartResult.vue'
import listResult from './listResult.vue'
import { SUCCESS_CODE } from '@/constants'

export default {
  components: {
    eventSearch,
    chartResult,
    listResult
  },
  data() {
    return {
      typeOption: ['列表展示', '图表展示'],
      type: '列表展示',
      searchForm: {},
      // 获取数据
      listData: [],
      chartData: [],
      searchTipsHeight: 0
    }
  },
  computed: {
    tableContentHeight() {
      return this.searchTipsHeight ? `calc(100% - ${this.searchTipsHeight}px - 20px)` : `calc(100% - 20px)`
    }
  },
  created() {
    this.search()
  },
  mounted() {
    this.$nextTick(() => {
      this.searchTipsHeight = this.$refs?.switchType?.$el?.clientHeight
    })
  },
  methods: {
    _changeTab(name) {
      this.type = name
    },
    // 获取列表数据
    search() {
      service.getEventCountList(this.searchForm).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.chartData = res.data.data || []
          this.listData = res.data.data || []
          // 如果返回了当前机构，则进行回填
          if (res.data.deptId) {
            this.$bus.$emit('setDefautRoot', res.data.deptId)
          }
          this.listData.forEach((item) => {
            item.endRate = `${item.endRate}%`
            item.checkRate = `${item.checkRate}%`
            item.overTimeRate = `${item.overTimeRate}%`
          })
        }
      })
    },
    // 重置
    reset() {
      this.search()
    }
  }
}
</script>

<style scoped lang="scss">
.event-quantity-container {
  height: 100%;
  .top-quantityAnalysis {
    height: 70px;
    margin-bottom: 20px;
  }
  .search-content {
    height: 100%;
    background-color: #fff;
    padding: 10px 10px 10px 20px;

    .switch-type {
      height: 40px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        .list-result {
          color: #202020;
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
          font-size: 14px;
          color: #313131;
          font-weight: bold;
          position: relative;
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
