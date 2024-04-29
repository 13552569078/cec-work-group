<!--
 * @description 全局事件详情--节点过程
 * @date 2020-08-23
 * @author lism
-->
<template>
  <div class="event-process">
    <common-title :title="`[编号] ${eventInfo.eventCode || '-'}`" />
    <div class="content mb24 mt22">
      <div
        v-for="(item, index) in avaiableAllProcess"
        :key="item.key"
        :class="[
          'list-wrapper',
          {
            'current-node':
              avaiableMatchProcess[avaiableMatchProcess.length - 1] ===
              item.key,
            'is-cancellation': item.key === 'cancellation',
          },
        ]"
      >
        <!-- 一个图片，一个虚线 -->
        <div class="process-item">
          <img :src="_matchImage(item)" alt="" class="process-icon">
          <div class="mt12">{{ item.text }}</div>
        </div>
        <!-- 最后一个节点后面没有线 -->
        <div
          v-if="
            item.key !== 'approve' &&
              item.key !== 'cancellation' &&
              index < avaiableAllProcess.length - 1
          "
          class="line"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'EventProcess',
  props: {
    process: {
      type: Array,
      default: () => []
    },
    processFromInterface: {
      type: Array,
      default: () => []
    },
    eventInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      allProcess: [
        {
          key: 'report',
          text: '上报'
        },
        {
          key: 'verify',
          text: '审核'
        },
        {
          key: 'dispatch',
          text: '调度'
        },
        {
          key: 'handle',
          text: '处理'
        },
        {
          key: 'approve',
          text: '结案'
        }
      ]
    }
  },
  computed: {
    // 判断是否作废单子
    isCancellation() {
      return this.eventInfo.eventState === '6'
    },
    // 匹配当前节点
    avaiableMatchProcess() {
      let arr = []
      const avaiableProcess = this.allProcess.map((item) => item.key)
      let currentProcess = ''
      if (this.process.length) {
        currentProcess =
          this.process[0] && this.process[0].activityId.toLocaleLowerCase()
      }
      // 因为作废的动作有可能是任意节点，如果发现作废节点，则后续的节点隐藏
      const _index = avaiableProcess.findIndex(
        (item) =>
          currentProcess.indexOf(item) > -1 && currentProcess.action !== '作废'
      )
      // 如果找不到，则无流程
      if (_index < 0) {
        arr = []
      } else {
        arr = avaiableProcess.slice(0, _index + 1)
      }
      if (this.isCancellation) {
        arr.push('cancellation')
      }
      return arr
    },
    avaiableAllProcess() {
      // 因为事件的节点现在为不确定性，先通过allProcess 匹配到该事件的总的节点
      const avaiableProcess = this.allProcess.filter((item) =>
        this.processFromInterface.some((sub) => sub.id === item.key)
      )
      if (this.isCancellation) {
        const matchArr = avaiableProcess.filter((item) => {
          return this.avaiableMatchProcess.includes(item.key)
        })
        matchArr.push({ key: 'cancellation', text: '作废' })
        return matchArr
      } else {
        return avaiableProcess
      }
    }
  },

  methods: {
    // 匹配不同节点图标
    _matchImage(item) {
      try {
        // 作废图标固定
        if (item.key === 'cancellation') {
          return require(`../../assets/eventInfo/${item.key}-active.png`)
        }
        if (this.avaiableMatchProcess.includes(item.key)) {
          return require(`../../assets/eventInfo/${item.key}-active.png`)
        } else {
          return require(`../../assets/eventInfo/${item.key}.png`)
        }
      } catch (error) {
        return require(`../../assets/eventInfo/${item.key}.png`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-process {
  .content {
    display: flex;
    color: #4b4b4b;
    .list-wrapper {
      display: flex;
      align-items: center;
    }
    .process-item {
      .process-icon {
        width: 29px;
        height: 28px;
        vertical-align: middle;
      }
    }
    .current-node,
    .is-cancellation {
      color: #36a4ff;
    }
    .line {
      width: 103px;
      height: 1px;
      border: 1px solid #e7e7e7;
      margin-bottom: 25px;
    }
  }
}
</style>
