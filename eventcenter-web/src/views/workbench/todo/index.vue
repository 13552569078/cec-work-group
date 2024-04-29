<template>
  <div class="event-todo-container">
    <div id="etMap" class="et-map" />
    <!-- 自定义工具栏 -->
    <MapControl @zoomIn="_zoomIn" @zoomOut="_zoomOut" @reset="_reset" />
    <list ref="todoList" @queryStatistic="_queryStatistic" @renderEventMarkers="_renderEventMarkers" @eventNearFn="_eventNearFn" @centerEvent="_centerEvent" @clearStatisticState="_clearStatisticState" />
    <statistic ref="todoStatistic" @search="_staSearch" />
    <gridman-card v-if="gridManObj" :gobj.sync="gridManObj" @showGuiji="_showGuiji" />
    <camera-card v-if="videoPopObj" :vobj.sync="videoPopObj" />
    <realTime-communication />
    <div v-if="showGjStop" class="stopGuiji" @click.stop="stopGuiji">
      <img src="@/assets/workbench/stop.png" alt>
      <br>
      <span>退出轨迹</span>
    </div>
    <grid-dialog
      v-if="gridDialogVisible"
      :visible.sync="gridDialogVisible"
      :grid-obj="gridObj"
      @showGuiji="_showGuiji"
    />
  </div>
</template>

<script>
import leafletMapMixin from '@/mixin/leafletMapMixin'
import list from './list/index.vue'
import statistic from './statistic.vue'
import mapFnMixin from './mapFnMixin'
import gridmanCard from './gridmanCard.vue'
import cameraCard from './cameraCard.vue'
import realTimeCommunication from '@/components/realTimeCommunication'
import gridDialog from './gridDialog.vue'

export default {
  name: 'EventcenterWebIndex',
  components: {
    list,
    statistic,
    gridmanCard,
    cameraCard,
    realTimeCommunication,
    gridDialog
  },
  mixins: [leafletMapMixin, mapFnMixin],
  data() {
    return {
      showGjStop: false,
      gridObj: null,
      gridDialogVisible: false
    }
  },

  mounted() {
    this.initTwoDMap('etMap')
    this.twoD_map.map.on('click', e => {
      console.log(e)
    })
  },

  methods: {
    _staSearch(params) {
      this.$refs.todoList._search(params, true)
    },
    _clearStatisticState() {
      console.log(this.$refs.todoStatistic)
      this.$refs.todoStatistic.resetEventUrgent()
    },
    _queryStatistic(stype) {
      this.$refs.todoStatistic.getCount({ speType: stype || '' })
    }
  }
}
</script>

<style lang="scss" scoped>
.event-todo-container {
  position: relative;
  height: 100%;
  .et-map {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    ::v-deep {
      .radius-val {
        display: none;
        width: 60px;
        color: #1D6FFF;
        font-weight: bold;
        font-size: 12px;
        margin-top: 16px;
        margin-left: 6px;
        text-align: center;
      }
      .leaflet-div-icon {
        border: none;
        background: none;
      }
      .polygon-label-icon  {
        color: #FFA41E;
        font-weight: bold;
        &-true{
          color: #FF4333;
        }
      }
      .gridman-marker-bggm {
        width: 100%;
        height: 100%;
        background-image: url("~@/assets/workbench/网格员.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
        .gm-name {
          background: #FFFFFF;
          box-shadow: 0px -4px 8px 0px rgba(41,48,64,0.2);
          border-radius: 2px;
          position: absolute;
          top: -26px;
          padding: 4px 12px;
          display: none;
          width: max-content;
        }
        &:hover{
          .gm-name {
            display: block;
          }
        }
      }
    }
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
</style>
