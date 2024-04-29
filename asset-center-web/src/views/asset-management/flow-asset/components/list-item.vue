<!--
 * @Description:
 * @Author: liu lianpeng
 * @Date: 2021-05-13
-->
<template>
  <div class="item-main">
    <div class="item-top">
      <c-tooltip
        effect="dark"
        :disabled="data.assetName&&data.assetName.length<=9"
        :content="data.assetName"
        placement="top-start"
      >
        <div class="top-title text-overflow width200">{{ data.assetName }}</div>
      </c-tooltip>
      <div class="top-tags">
        <tags-popover
          v-if="tagListWidth"
          :div-width="tagListWidth"
          :tags="data.tagNameList||[]"
        />
      </div>
    </div>
    <div class="item-middle">
      <div class="middle-info">
        <div class="label-item">
          <span class="label">资源编码</span>
          <span class="value code">{{ data.assetCode }}</span>
        </div>
        <div class="label-item">
          <span class="label">版本号</span>
          <c-tooltip
            effect="dark"
            :disabled="data.version&&data.version.length<=3"
            :content="data.version"
            placement="top-start"
          >
            <span class="value version text-overflow">{{ data.version }}</span>
          </c-tooltip>
        </div>
        <div class="label-item">
          <span class="label">修改人</span>
          <c-tooltip
            effect="dark"
            :disabled="data.updateUserName&&data.updateUserName.length<=4"
            :content="data.updateUserName"
            placement="top-start"
          >
            <span class="value user-name text-overflow">{{ data.updateUserName }}</span>
          </c-tooltip>
        </div>
        <div class="label-item">
          <span class="label">最后修改时间</span>
          <span class="value update-time">{{ data.updateTime }}</span>
        </div>
      </div>
      <div class="middle-operate">
        <btn-group
          :btns="operateBtnsO"
          @handleClick="handleClick"
        />
      </div>
    </div>
    <div class="item-footer">
      <div
        class="footer-info"
        @click="clickDesign(data.bpmDesignUrl)"
      >
        <i class="icon icon-flow"></i>
        <span class="info-title">{{ data.assetName }}（设计）</span>
      </div>
    </div>
  </div>
</template>

<script>
import tagsPopover from '@/components/tags-popover'
import btnGroup from '@/components/btn-group'

export default {
  components: {
    tagsPopover,
    btnGroup
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * operateBtns=[{
        label: '' 显示文字
        icon: 'iconClassName' 图标的className 如：operate-icon-edit
      }]
     */
    operateBtns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      operateBtnsO: [],
      tagListWidth: 0
    }
  },
  created() {
    this.operateBtnsO = this.operateBtns.map(item => {
      item.hide = false// 隐藏显示
      item.row = this.data
      return item
    })
  },
  mounted() {
    this.getTagListWidth()
  },
  methods: {
    getTagListWidth() {
      this.tagListWidth = document.querySelector('.item-top').offsetWidth - 200
    },
    handleClick({ label, row }) {
      this.$emit('handleClick', { label, row })
    },
    clickDesign(url) {
      this.$emit('clickDesign', url)
    }
  }

}
</script>

<style lang="scss" scoped>
.item-main {
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  width: 100%;
  margin-bottom: 24px;
  .item-top {
    height: 48px;
    background: #fafafa;
    border-bottom: 1px solid #ededed;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item-middle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid #ededed;
    .middle-info {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 50px;
      .label-item {
        margin-right: 24px;
        display: flex;
        align-items: center;
        .label {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #9b9b9b;
          margin-right: 8px;
        }
        .value {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #404040;
          display: inline-block;
        }
        .code {
          width: 185px;
        }
        .version {
          width: 70px;
        }
        .user-name {
          width: 60px;
        }
        .update-time {
          width: 150px;
        }
      }
    }
  }
  .item-footer {
    height: 50px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    .footer-info {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #404040;
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon-flow {
        width: 16px;
        height: 16px;
        background: url(../../../../assets/asset-overview/icon-flow.png);
        background-size: 100%;
        display: block;
        margin-right: 2px;
      }
    }
  }
}
.top-title {
  line-height: 32px;
}
.text-overflow {
  // max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.width200 {
  width: 200px;
}
</style>
