<template>
  <div v-loading="loading" class="et-list">
    <search ref="todoSearch" @search="_search" />
    <div class="et-list-tb">
      <div v-for="item in etList" :key="item.id" class="et-box" @click.stop="_showInfo(item)">
        <div :class="`et-urgent et-urgent-${item.eventUrgent}`">{{ item.eventUrgentText || '-' }}</div>
        <div class="et-title ellipsis">{{ item.title || '-' }}</div>
        <div class="et-type ellipsis">{{ item.eventTypeText }}</div>
        <div class="et-desc ellipsis2">{{ item.eventDesc || '-' }}</div>
        <div class="et-time">
          <span v-if="item.eventStateName" :class="`et-state ${_tranfromState(item)}-wrapper`">
            <svg-icon :icon-class="_tranfromState(item)" />
            {{ item.eventStateName }}
          </span>
          {{ item.happenTime || '-' }}
        </div>
        <div class="sep-line" />
        <div class="et-btns">
          <span class="et-btn et-btn-loc" @click.stop="centerEvent(item)">
            <img src="@/assets/workbench/定位.svg" alt>定位
          </span>
          <span class="et-btn et-btn-near" @click.stop="eventNearFn(item)">
            <img src="@/assets/workbench/查看周边.svg" alt>查看周边
          </span>
        </div>
      </div>
      <div v-if="!loading && !etList.length" class="tb-nodata">
        <img src="@/assets/workbench/nodata.png"><br>
        <span>暂无数据</span>
      </div>
    </div>
    <div class="et-page">
      <cestc-pagination
        class="et-pagination"
        background
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
        :pager-count="pageCount"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import service from '@/api/dispatch'
import search from './search.vue'

export default {
  name: 'EventcenterWebList',
  components: { search },
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      etList: [],
      pageCount: 5,
      lastMarkersParams: {},
      statisticParam: {},
      speTypeParams: null
    }
  },
  computed: {
    eventUrgentOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    speType() {
      return this.$route.query.speType || ''
    }
  },
  watch: {
    speTypeParams(val) {
      this.$emit('queryStatistic', val)
    }
  },
  created() {
    window.$wujie?.bus.$on('wujieReload', (url) => {
      // 自行根据url链接判断当前的页面是否要调接口刷新---下面的是vue2的一个判断
      if (url && url.indexOf(this.$route.path) > -1) {
        console.log('======wujieReload====', url)
        this.getEventTodoLis()
      }
    })
  },
  async activated() { // 因为设置了缓存，所以每次激活当前页面都会执行，需要按情况注释一个 create 周期里执行方法
    await this.$nextTick() // 确保重绘完成
    console.log('activated')
    try {
      setTimeout(() => {
        this.getEventTodoLis(this.$refs.todoSearch.getParams())
      }, 10)
    } catch (error) {
      console.log('activated error', error)
    }
  },
  methods: {
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
      const state = row.eventState || '0'
      if (['0', '1', '2', '4', '8'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['5'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['7'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else if (['6'].includes(state)) {
        // 作废
        return 'svg-grey'
      } else {
        return 'svg-grey'
      }
    },
    _search(params, resetForm) {
      // 代表是统计的搜索
      if (resetForm) {
        this.statisticParam = params
        this.$refs.todoSearch._reset(true)
      }
      // 代表是搜索组件的搜索
      if (resetForm === undefined) {
        this.statisticParam = {}
        this.$emit('clearStatisticState')
      }
      this.pageNum = 1
      this.getEventTodoLis(params)
    },
    getEventTodoLis(formParams) {
      const params = {
        ...formParams,
        ...this.statisticParam,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.speType && this.speType !== 'all') {
        params.speType = this.$refs.todoSearch.getSpeParam(this.speType)
        this.speTypeParams = params.speType
      } else {
        this.speTypeParams = ''
      }
      if (this.pageNum === 1) {
        const markerParams = { ...formParams, pageNum: 1, pageSize: 999 }
        if (this.speType && this.speType !== 'all') markerParams.speType = this.$refs.todoSearch.getSpeParam(this.speType)
        this.getEventMarkers(markerParams)
      }
      this.loading = true
      service.getTodoList(params).then(res => {
        const arr = res?.data?.list || []
        arr.forEach(item => {
          item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
          const str = this.eventUrgentOptionsMap.get(item.eventUrgent)
          item.eventUrgentText = str ? `${str}事件` : ''
        })
        this.etList = arr
        this.total = res?.data?.total || 0
        // const pageCount = Math.ceil(this.total / this.pageSize)
        // this.pageCount = pageCount > 8 ? 3 : 5
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.getEventTodoLis(this.$refs.todoSearch.getParams())
    },
    centerEvent(row) {
      this.$emit('centerEvent', row)
    },
    eventNearFn(row) {
      this.$emit('eventNearFn', row)
    },
    // 查看详情
    _showInfo(row) {
      // 跳转详情页面, 详情页面，请求操作按钮的时候需要用到 taskId
      const query = {
        taskId: row.taskId,
        id: row.id
      }
      if (this.$route.query.speType) query.speType = this.$route.query.speType
      this.$router.push({
        path: '/workbench/todo/info',
        query
      })
    },
    async getEventMarkers(params) {
      if (JSON.stringify(this.lastMarkersParams) !== JSON.stringify(params)) {
        this.lastMarkersParams = params
        const res = await service.getTodoList(params)
        const arr = res?.data?.list || []
        this.$emit('renderEventMarkers', arr)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.et-list {
    position: absolute;
    z-index: 2;
    left: 20px;
    top: 20px;
    width: 320px;
    height: calc(100% - 40px);
    background: rgba(255,255,255,0.9);
    box-shadow: 0px 3px 10px 0px rgba(121,126,137,0.3);
    border-radius: 4px;
    padding: 20px 0px 18px 20px;
    display: flex;
    flex-direction: column;
    ::v-deep .et-search{
      flex-shrink: 0;
    }
    ::v-deep{
      .et-search {
        padding-right: 20px;//为了滚动条在最右侧
      }
    }
    .et-list-tb {
      flex: 1;
      overflow-y: auto;
      .tb-nodata {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .et-box {
        width: 280px;
        max-height: 189px;
        background: #F9FAFE;
        border-radius: 2px;
        margin-bottom: 8px;
        padding: 16px 12px 0;
        position: relative;
        cursor: pointer;
        &:hover{
          border: 1px solid #36A4FF;
        }
        .et-urgent {
          position: absolute;
          top: 0;
          right: 0;
          height: 20px;
          background: rgba(254,204,85,0.15);
          border-radius: 0px 2px 0px 2px;
          padding: 4px;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #FECC55;
          &-2{
            background: rgba(250,139,22,0.15);
            color: #FA8B16;
          }
          &-3{
            background: rgba(255,77,79,0.15);
            color: #FF4D4F;
          }
        }
        .et-title {
          font-size: 18px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          line-height: 24px;
        }
        .et-type {
          color: #8A8A8A;
          line-height: 20px;
        }
        .et-desc {
          margin-top: 8px;
        }
        .et-time {
          color: #8A8A8A;
          margin-top: 8px;
          text-align: right;
          position: relative;
          .et-state {
            position: absolute;
            left: 0;
            top: 0;
          }
          .svg-success-wrapper {
            color: $success;
          }

          .svg-handle-wrapper {
            color: $primaryColor;
          }

          .svg-warn-wrapper {
            color: $warn;
          }

          .svg-error-wrapper {
            color: $error;
          }

          .svg-grey-wrapper {
            color: $defaultGrey;
          }
        }
        .et-btns {
          margin-top: 8px;
          border-top: 1px solid #EDEDED;
          text-align: right;
          padding: 10px 0;
          color: #36A4FF;
          .et-btn {
            margin-left: 25px;
            cursor: pointer;
            img {
              width: 15px;
              height: 15px;
              margin-right: 3px;
              position: relative;
              top: 2px;
            }
          }
        }
      }
    }
    .et-page {
      flex-shrink: 0;
      margin-left: -20px;
      height: 64px;
      background: rgba(255,255,255,0.9);
      box-shadow: 0px 3px 10px 0px rgba(121,126,137,0.28);
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: -20px;
      .cestc-paginaton-wrapper.et-pagination{
        width: 100%;
        ::v-deep{
          .el-pagination  {
            margin-right: 20px;
            padding: 0;
            .btn-prev,.btn-next{
                min-width: 20px;
                width: 28px;
                height: 28px;
                padding: 0;
                background: #FFFFFF;
                border-radius: 2px;
                border: 1px solid #E7E7E7;
                line-height: 28px;
                margin: 0;
                box-sizing: border-box;
            }
            .el-pager {
              .number, li.more {
                box-sizing: border-box;
                margin: 0 4px;
                min-width: 20px;
                border-radius: 2px;
                border: 1px solid #E7E7E7;
                width: 28px;
                height: 28px;
                line-height: 28px;
                padding: 0;
              }
            }
          }
        }
      }
    }
}
</style>
