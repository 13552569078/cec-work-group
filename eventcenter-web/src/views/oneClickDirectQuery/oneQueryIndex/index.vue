<template>
  <div class="ocdq_wrapper">
    <!-- 左侧事件列表 -->
    <list
      v-show="showSearch"
      ref="oneQueryListRef"
      :style="{
        'opacity': showDetail ? 0 : 1
      }"
      :map-params="mapParams"
      :show-result="showResult"
      @changeShowResult="showResult = true"
      @renderEventMarkers="_renderEventMarkers"
      @showEventDetail="showEventDetail"
    />
    <!-- 地图 -->
    <div class="mapboxwrapper">
      <div
        id="mapboxid"
        class="mapbox"
      />
      <div v-show="showMapHandle" class="map-handle">
        <div
          class="tabit"
        >
          <div
            v-show="!isKuangxuanMode"
            class="area-select"
          >
            <div class="area-front">
              <img
                src="@/assets/oneQuery/select_grid.png"
                alt=""
              >
              <span>选择网格</span>
            </div>
            <event-address-map
              ref="eventAddressRef"
              :style="{width: '296px'}"
              :show-all-levels="true"
              :check-strictly="true"
              :expand-trigger="'hover'"
              @changeActiveId="handleGridChange"
            />
          </div>
          <div
            class="
            etb
            "
            :class="{'selected': isClickKuangxuan}"
            @click="changeKuangXuanStatus(!isKuangxuanMode)"
          >
            <img
              v-if="isClickKuangxuan"
              src="@/assets/oneQuery/map_frame_hover.png"
              alt=""
            >
            <img
              v-else
              src="@/assets/oneQuery/map_frame.png"
              alt=""
            >
            <span>{{ isKuangxuanMode ? '退出' : '地图' }}框查</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 事件详情 -->
    <eventDetailModel
      v-show="showDetail"
      :click-event-id="clickEventId"
      @changeSearchType="changeSearchType"
      @backToList="backToList"
    />
    <!-- 网格弹窗 -->
    <grid-dialog
      v-if="gridDialogVisible"
      :visible.sync="gridDialogVisible"
      :grid-obj="gridObj"
      @showGuiji="_showGuiji"
    />
    <!-- 音视频通话 -->
    <realTime-communication />
    <!-- 轨迹 -->
    <div v-if="showGjStop" class="stopGuiji" @click.stop="stopGuiji">
      <img src="@/assets/workbench/stop.png" alt>
      <br>
      <span>退出轨迹</span>
    </div>
  </div>
</template>

<script>
import eventAddressMap from '@/views/event/components/EventAddressMap.vue'
import realTimeCommunication from '@/components/realTimeCommunication'

import list from './list/index.vue'
import eventDetailModel from './eventDetailModel.vue'
import gridDialog from './gridDialog.vue'
// import moduleSrvWhh from '@/api/dispatchWhh'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

import { isNumber } from 'lodash'
import leafletMapMixin from '@/mixin/leafletMapMixin'
import mapFnMixin from './mapFnMixin'

export default {
  name: 'Ocdq',
  components: {
    list,
    eventDetailModel,
    gridDialog,
    realTimeCommunication,
    eventAddressMap
  },
  mixins: [leafletMapMixin, mapFnMixin],
  data() {
    return {
      showResult: false,
      clickEventId: '',
      gridObj: null,
      gridId: '',
      showSearch: true,
      showMapHandle: true,
      showDetail: false,
      isClickKuangxuan: false,
      isKuangxuanMode: false,
      gridDialogVisible: false,
      defaultGridId: 1,
      curKuangxuanLayer: null,
      curZoom: 8,
      lastMapParams: {},
      mapParams: {},
      showGjStop: false

    }
  },
  computed: {
    areaDataTree() {
      return this.$refs.eventAddressRef.deptTree
    }
  },
  mounted() {
    this.initTwoDMap('mapboxid', 1)
    this.setDefaultArea()
    this.handleKuangXuan()
    this.$nextTick(() => {
      this.setClickMap()
    })
  },
  methods: {
    oneQuerySearch() {
      this.disableKuangxuan()
      this.$refs.oneQueryListRef._search()
    },
    showEventDetail(row) {
      this.clickEventId = row.id
      this.showMapHandle = false
      this.showDetail = true
      this.curZoom = this.getMapZoom()
      this.disableKuangxuan()
      this._centerEvent(row)
    },
    changeSearchType(params) {
      this.$refs.oneQueryListRef.$refs.querySearchRef.form.keyWord = params.keyWord
      this.$refs.oneQueryListRef.$refs.querySearchRef.form.searchType = params.searchType
      this.backToList()
    },
    backToList() {
      this.showDetail = false
      this.showMapHandle = true
      // 如果框查，展示框查信息
      if (this.isKuangxuanMode) {
        this.clearCenterEvent()
        this.clearGrids()
        this.renderKuangxuan(this.curKuangxuanLayer, this.curZoom)
        this.oneQuerySearch()
      } else {
      // 如果选择地区，展示地区选择的信息
        this.getSelectedAreaGrid(this.gridId)
      }
    },
    async setDefaultArea() {
      const res = await moduleSrv.getGridRootList()
      if (res.code === SUCCESS_CODE) {
        this.defaultGridId = res.data[0].id
      }
      await this.setGridArea(this.defaultGridId)
    },
    setGridArea(gridId) {
      this.$refs.eventAddressRef.activeId = gridId
      this.$refs.eventAddressRef._handleChange()
    },
    handleGridChange(data) {
      this.isKuangxuanMode = false
      if (Array.isArray(data) && data?.length) {
        this.gridId = data[data.length - 1]
        this.getSelectedAreaGrid(this.gridId)
      } else if (isNumber(data)) {
        this.gridId = data
        this.getSelectedAreaGrid(this.gridId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ocdq_wrapper {
  width: 100%;
  height: 100%;
  background: url("~@/assets/oneQuery/bg@2x.png") no-repeat;
  background-size: 100% 100%;
  overflow-y: auto;
  .listMbox {
    width: 1080px;
    margin: 0 auto;
    .initbox {
      padding-top: 40px;
      .oqlogo {
        width: 409px;
        height: 110px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .oqsearchbox {
        width: 1080px;
        height: 60px;
        margin-top: 33px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #bdbdbd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ipt {
          flex-grow: 1;
          ::v-deep {
            .el-input {
              border: 0px;
            }
            .el-input__inner {
              border: 0px;
              padding: 0 20px;
            }
          }
        }
        .btn {
          width: 172px;
          height: 60px;
          background: linear-gradient(90deg, #78c2ff 0%, #36a4ff 100%);
          border-radius: 0px 8px 8px 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
        }
      }
      .quickActs {
        display: flex;
        justify-items: flex-start;
        align-items: flex-start;
        margin-top: 22px;
        .e {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4b4b4b;
          margin: 0 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          &.selected,
          &:hover {
            color: #36a4ff;
            border-bottom: 2px solid #36a4ff;
          }
        }
      }
    }
    .initbox_mtop {
      padding-top: 20%;
    }

    .lsmwp {
      margin-top: 20px;
    }
  }
  .mapboxwrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .fangdasuoxiao {
      width: 30px;
      height: 66px;
      background: url("~@/assets/oneQuery/搜索框@2x.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 740px;
      top: 20px;
      z-index: 1002;
      cursor: pointer;
      &.fangdasuoxiao_sp {
        left: 20px;
        transform: rotate(180deg);
      }
    }
     ::v-deep {
      .polygon-label-icon  {
        font-weight: 500;
        color: #1D6FFF;
        line-height: 22px;
        border: 0 none;
        background: transparent;
        text-align: center;
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
        &-true{
          color: #298A6E;
        }
      }
      .leaflet-div-icon {
        border: none;
        background: none;
      }
      .marker-icon {
        width: 14px !important;
        height: 14px !important;
        background: #FFFFFF;
        border: 3px solid #FF4D4F;
      }
      .polygon-close-label {
        width: 60px;
        height: 28px;
        background: rgba(255,255,255,0.9);
        border-radius: 4px;
        border: 1px solid #AEAEAE;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #4B4B4B;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
     }

    .map-handle {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 402;
      .tabit {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .area-select {
          width: 432px;
          height: 56px;
          padding: 0 16px;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.3);
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #36a4ff;
          .area-front {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          img {
            width: 24px;
            height: 24px;
            border-radius: 2px;
            margin-right: 8px;
          }
        }
        .etb {
          margin-left: 20px;
          width: 120px;
          height: 56px;
          padding-left: 16px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.3);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #4b4b4b;
          img {
            width: 24px;
            height: 24px;
            border-radius: 2px;
            margin-right: 8px;
          }
          &.selected {
            color: #36a4ff;
          }
        }
      }
    }
  }
  .mapbox {
    width: 100%;
    height: 100%;
    background: #f7f7f7;
  }
   .stopGuiji {
    z-index: 2;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 88px;
    height: 107px;
    background: #FFFFFF;
    box-shadow: 0px 16px 32px 0px rgba(41,48,64,0.06), 0px 4px 24px 0px rgba(41,48,64,0.12);
    text-align: center;
    padding-top: 16px;
    cursor: pointer;
    img{
      width: 48px;
      height: 48px;
      margin-bottom: 7px;
    }
  }
}
.width100 {
  width: 100%;
}
</style>
