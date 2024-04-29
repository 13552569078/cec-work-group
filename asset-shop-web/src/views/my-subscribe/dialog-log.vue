<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-dialog
    title="升级日志"
    :visible.sync="showLogFlag"
    width="666px"
    :class="'dialog-center'"
    :before-close="handleClose"
    class="timeline">
    <c-timeline>
      <c-timeline-item
        v-for="(item,index) in list"
        :key="item.packTime+index"
        :timestamp="item.packTime"
        placement="top">
        <div v-if="index==0" slot="dot" class="dot-ring first-dot">
        </div>
        <div v-else slot="dot" class="dot-ring">
        </div>
        <div class="card-wrap">
          <div class="card-content">
            <h4 style="margin-bottom:10px;">升级说明：{{ item.packDesc }}</h4>
            <p>版本号：{{ item.packVersion }}</p>
          </div>
        </div>
      </c-timeline-item>
    </c-timeline>
  </c-dialog>
</template>
<script>
import { subcribeUpgradeLog } from '@/api/index'
export default {
  name: '',
  components: {},
  props: {
    visible: Boolean,
    shopCode: String
  },
  data() {
    return {
      showLogFlag: false,
      list: []
    }
  },
  computed: {},
  watch: {
    visible: {
      handler(nv) {
        this.showLogFlag = !!nv
        if (nv) {
          this.getLogList()
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    handleClose() {
      this.$emit('close')
    },
    getLogList() {
      console.log(this.shopCode)
      subcribeUpgradeLog({ shopCode: this.shopCode }).then(res => {
        this.list = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .timeline {
    .c-timeline {
      padding: 0 8px;
      max-height: 500px;
      overflow: auto;
    }
    .dot-ring {
      width: 14px;
      height: 14px;
      border-radius: 100%;
      position: relative;
      border: 3px solid #8a8a8a;
      background: #fff;
      margin-left: -2px;
      &.first-dot {
        border: 3px solid #36a4ff;
      }
      .start-dot {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #fff;
        border: 2px solid #ededed;
        left: -1px;
        top: -35px;

        &::after {
          content: '';
          position: absolute;
          width: 0;
          height: 22px;
          top: 8px;
          border-left: 2px solid #ededed;
          left: 2px;
        }
      }
    }
    .card-wrap {
      margin-top: 12px;
      background: #f9fafe;
      border-radius: 2px;
      padding: 20px;
    }
  }
  </style>
