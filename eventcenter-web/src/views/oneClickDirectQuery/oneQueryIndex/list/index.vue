<template>
  <div
    v-loading="loading"
    class="et-list"
    :style="{
      'height': showResult ? 'calc(100% - 40px)': '60px'
    }"
  >
    <search
      ref="querySearchRef"
      :show-result="showResult"
      @search="_search"
    />
    <div v-show="showResult" class="result-count">
      <div>查询结果<span class="total-num">{{ total }}</span>条数据</div>
    </div>
    <div v-show="showResult" class="et-list-tb">
      <div
        v-for="item in etList"
        :key="item.id"
        class="et-box"
        @click.stop="_showInfo(item)"
      >
        <div :class="`et-urgent et-urgent-${item.eventUrgent}`">{{ item.eventUrgentText || '-' }}</div>
        <div class="et-title ellipsis">{{ item.title || '-' }}</div>
        <div class="et-type ellipsis">{{ item.eventTypeText }}</div>
        <div class="et-desc ellipsis2">{{ item.eventDesc || '-' }}</div>
        <div class="et-time">
          <span
            v-if="item.eventStateName"
            :class="`et-state ${_tranfromState(item)}-wrapper`"
          >
            <svg-icon :icon-class="_tranfromState(item)" />
            {{ item.eventStateName }}
          </span>
          {{ item.happenTime || '-' }}
        </div>
      </div>
      <div
        v-if="!loading && !etList.length"
        class="tb-nodata"
      >
        <img src="@/assets/workbench/nodata.png"><br>
        <span>暂无数据</span>
      </div>
    </div>
    <div v-show="showResult" class="et-page">
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
import service from '@/api/dispatchWhh'
import search from './search.vue'

export default {
  name: 'EventcenterWebList',
  components: { search },
  props: {
    mapParams: {
      type: Object,
      default: () => ({})
    },
    showResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      etList: [],
      pageCount: 5,
      lastMarkersParams: {},
      isInit: false
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
    }
  },
  watch: {
  },
  created() {
    window.$wujie?.bus.$on('wujieReload', (url) => {
      // 自行根据url链接判断当前的页面是否要调接口刷新---下面的是vue2的一个判断
      if (url && url.indexOf(this.$route.path) > -1) {
        console.log('======wujieReload====', url)
        this.getOneQueryEventList()
      }
    })
  },
  async activated() { // 因为设置了缓存，所以每次激活当前页面都会执行，需要按情况注释一个 create 周期里执行方法
    await this.$nextTick() // 确保重绘完成
    console.log('activated')
    try {
      setTimeout(() => {
        // this.getOneQueryEventList(this.$refs.querySearchRef.getParams())
      }, 10)
    } catch (error) {
      console.log('activated error', error)
    }
  },
  methods: {
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromState(row) {
      const state = row.eventState || '0'
      if (['0', '1', '2', '4'].includes(state)) {
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
    _search(flag) {
      this.pageNum = 1
      this.getOneQueryEventList(flag)
    },
    getOneQueryEventList(flag) {
      const searchParams = this.$refs.querySearchRef.getParams()
      if (searchParams.keyWord.trim() === '') {
        if (flag) {
          this.$message.warning('请输入查询条件')
        }
        return
      }
      if (!this.showResult) {
        this.$emit('changeShowResult')
      }
      const params = {
        ...searchParams,
        ...this.mapParams,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.pageNum === 1) {
        const markerParams = { ...searchParams, ...this.mapParams, pageNum: 1, pageSize: 999 }
        this.getEventMarkers(markerParams)
      }
      this.loading = true
      service.getOneClickSearch(params).then(res => {
        const arr = res?.data?.list || []
        arr.forEach(item => {
          item.eventTypeText = `${item.eventTypeLName || '-'}/${item.eventTypeMNAME || '-'}/${item.eventTypeName || '-'}`
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
      this.getOneQueryEventList(this.$refs.querySearchRef.getParams())
    },
    // 查看详情
    _showInfo(row) {
      // 查看详情
      this.$emit('showEventDetail', row)
    },
    async getEventMarkers(params) {
      // if (JSON.stringify(this.lastMarkersParams) !== JSON.stringify(params)) {
      this.lastMarkersParams = params
      const res = await service.getOneClickSearch(params)
      const arr = res?.data?.list || []
      this.$emit('renderEventMarkers', arr)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.et-list {
  position: absolute;
  z-index: 402;
  left: 20px;
  top: 20px;
  width: 468px;
  height: calc(100% - 40px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.3);
  border-radius: 4px;
  padding: 14px 0px 18px 20px; //为了滚动条在最右侧
  display: flex;
  flex-direction: column;
  ::v-deep .et-search {
    flex-shrink: 0;
  }
  ::v-deep {
    .et-search {
      padding-right: 20px; //为了滚动条在最右侧
    }
  }
  .result-count {
    width: calc(100% - 20px);
    height: 32px;
    background: rgba(54, 164, 255, 0.1);
    border-radius: 2px;
    border: 1px solid #36a4ff;
    text-align: center;
    line-height: 32px;
    margin-bottom: 20px;
    .total-num {
      color: #36a4ff;
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
      width: calc(100% - 14px);
      max-height: 189px;
      background: #f9fafe;
      border-radius: 2px;
      margin-bottom: 8px;
      padding: 16px 12px;
      position: relative;
      cursor: pointer;
      &:hover {
        border: 1px solid #36a4ff;
      }
      .et-urgent {
        position: absolute;
        top: 0;
        right: 0;
        height: 20px;
        background: rgba(254, 204, 85, 0.15);
        border-radius: 0px 2px 0px 2px;
        padding: 4px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #fecc55;
        &-2 {
          background: rgba(250, 139, 22, 0.15);
          color: #fa8b16;
        }
        &-3 {
          background: rgba(255, 77, 79, 0.15);
          color: #ff4d4f;
        }
      }
      .et-title {
        font-size: 18px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        line-height: 24px;
      }
      .et-type {
        color: #8a8a8a;
        line-height: 20px;
      }
      .et-desc {
        margin-top: 8px;
      }
      .et-time {
        color: #8a8a8a;
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
    }
  }
  .et-page {
    flex-shrink: 0;
    margin-left: -20px;
    height: 64px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.28);
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: -20px;
    .cestc-paginaton-wrapper.et-pagination {
      width: 100%;
      ::v-deep {
        .el-pagination {
          margin-right: 20px;
          padding: 0;
          .btn-prev,
          .btn-next {
            min-width: 20px;
            width: 28px;
            height: 28px;
            padding: 0;
            background: #ffffff;
            border-radius: 2px;
            border: 1px solid #e7e7e7;
            line-height: 28px;
            margin: 0;
            box-sizing: border-box;
          }
          .el-pager {
            .number,
            li.more {
              box-sizing: border-box;
              margin: 0 4px;
              min-width: 20px;
              border-radius: 2px;
              border: 1px solid #e7e7e7;
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
