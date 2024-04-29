<template>
  <div class="gridman-card">
    <div class="c-head">
      <span>网格员</span>
      <i class="el-icon-close" @click.stop="closeCard" />
    </div>
    <div class="c-con">
      <div class="cc-item">
        <div class="cc-label">姓名</div>
        <div class="cc-val">{{ gobj.name || '-' }}</div>
      </div>
      <div class="cc-item">
        <div class="cc-label">所属网格</div>
        <div class="cc-val ellipsis2">{{ gridName || '-' }}</div>
      </div>
      <div class="cc-item">
        <div class="cc-label">联系方式</div>
        <div class="cc-val">{{ gobj.phone || '-' }}</div>
      </div>
      <div class="cc-item">
        <div class="cc-label">在线状态</div>
        <div class="cc-val">{{ gobj.isOnline == 1 ? '在线' : '离线' }}</div>
      </div>
    </div>
    <div class="c-foot">
      <div class="cc-btn" @click.stop="videoCall">
        <img src="@/assets/workbench/spth.png"><br>
        视频通话
      </div>
      <div class="cc-btn" @click.stop="voiceCall">
        <img src="@/assets/workbench/yyth.png"><br>
        音频通话
      </div>
      <div class="cc-btn" @click.stop="guiji">
        <img src="@/assets/workbench/gjbf.png"><br>
        轨迹
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventcenterWebGridmanCard',
  props: {
    gobj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

    }
  },
  computed: {
    gridName() {
      return this?.gobj?.belongGridNameList?.length ? this.gobj.belongGridNameList.join(',') : ''
    }
  },
  mounted() {

  },

  methods: {
    closeCard() {
      this.$emit('update:gobj', null)
    },
    videoCall() {
      this.$bus.$emit('rtCommunication', 2, this.gobj)
    },
    voiceCall() {
      this.$bus.$emit('rtCommunication', 1, this.gobj)
    },
    guiji() {
      this.$emit('showGuiji', this.gobj)
    }
  }
}
</script>

<style lang="scss" scoped>
.gridman-card {
    width: 320px;
    height: 288px;
    background: rgba(255,255,255,0.9);
    box-shadow: 0px 3px 10px 0px rgba(121,126,137,0.3);
    border-radius: 4px;
    position: absolute;
    right: 20px;
    top: 143px;
    z-index: 2;
    .c-head {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        height: 46px;
        border-bottom: 1px solid #DDDDDD;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        i {
            cursor: pointer;
        }
    }
    .c-con {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 20px 0;
        border-bottom: 1px solid #DDDDDD;
        .cc-item{
            height: 70px;
            width: calc(50% - 10px);
            &:nth-child(odd) {
                margin-right: 10px;
            }
            &:nth-child(even) {
                margin-left: 10px;
            }
            .cc-label {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #8A8A8A;
                margin-bottom: 10px;
            }
        }
    }
    .c-foot {
        display: flex;
        justify-content: space-between;
        padding: 20px 20px 0;
        .cc-btn {
            width: 63px;
            text-align: center;
            cursor: pointer;
            img{
                margin-bottom: 5px;
            }
            &:hover{
                color: #36A4FF;
            }
        }
    }
}
</style>
