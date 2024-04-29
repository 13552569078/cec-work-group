<!--/*
* @Author: dingli
* @Desc: 部署记录
* @Date: 2022-3-16
*/-->
<template>
  <div v-infinite-scroll="loader" :infinite-scroll-distance="250" class="deploy-record-list">
    <div v-for="item in list" :key="item.deployCode" class="deploy-record-item">
      <div class="title-wrap">
        <!--  :class="item.deployStatus==1?'success':'error'" -->
        <span class="title">部署记录</span>
        <div>
          <!-- <span class="setting" @click="handleCancel">取消部署</span> -->
          <span class="setting" @click="handleSet(item)">应用设置</span>
        </div>
      </div>
      <div class="content">
        <p label="部署策略" class="item">{{ item.deployPolicy || '--' }}</p>
        <p label="部署环境" class="item">{{ item | formatEnv }}</p>
        <p label="部署人" class="item">{{ item.user || '--' }}</p>
        <p label="部署时间" class="item">{{ item.deployTime || '--' }}</p>
        <p label="应用实例编码" class="item">{{ item.appInstanceCode || '--' }}</p>
        <p label="应用运行状态" class="item">
          <span v-if="item.status" class="status"><i class="c-icon-success" />{{ item.status }}</span>
          <span v-else>--</span>
        </p>
      </div>
      <div class="content">
        <p label="部署说明" class="item half">{{ item.deployDesc || '--' }}</p>
        <p label="应用访问地址" class="item half">
          <i v-show="!!item.url" v-copy="item.url" class="copy" @click="clickCopy" />
          <span v-if="item.url" class="url" @click="clickUrl(item)">{{ item.url }}</span>
          <span v-else>--</span>
        </p>
      </div>
    </div>
    <empty v-if="list.length === 0" />
    <asset-settings-dialog :visible="!!settingFlag" :data="settingFlag" @close="settingFlag = null" @ok="settingsOk" />
  </div>
</template>
<script>
import { debounce } from '@l/utils'
import AssetSettingsDialog from './asset-settings-dialog.vue'
import { assetDeployList } from '@/api/index'
import { ENV_TYPE, ENV_SOURCE } from './config.js'
import empty from '@/components/empty'
export default {
  name: 'DeployRecord',
  components: { AssetSettingsDialog, empty },
  filters: {
    formatEnv(item) {
      return `${ENV_TYPE[item.envType] || item.envType} | ${ENV_SOURCE[item.envSource] || item.envSource} | ${item.envName}`
    }
  },
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      settingFlag: null,
      list: [],
      pageInfo: {
        hasNext: true,
        pageNum: 1,
        pageSize: 10
      },
      ENV_TYPE, ENV_SOURCE
    };
  },
  created() {
    this.loader = debounce(this.queryData, 500)
  },
  methods: {
    // 取消部署
    handleCancel() { },
    // 应用设置
    handleSet(item) {
      this.settingFlag = {
        deployCode: item.deployCode,
        accessUrl: item.url
      }
    },
    // 应用设置成功
    settingsOk() {
      this.settingFlag = null
      this.$message.success('应用设置成功')
      this.queryData(1)
    },
    // 复制 应用访问地址
    clickCopy() {
      this.$message.success('应用访问地址已复制')
    },
    clickUrl(item) {
      if (!item.url) return
      window.open(item.url)
    },
    async queryData(pageNum) {
      this.pageInfo.pageNum = pageNum === 1 ? pageNum : this.pageInfo.pageNum
      if (this.pageInfo.pageNum === 1) {
        this.pageInfo.hasNext = true
      }

      if (!this.pageInfo.hasNext) return
      try {
        const params = {
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          appCode: this.data.appCode,
          version: this.data.version
        }
        const res = await assetDeployList(params)
        this.pageInfo.pageNum = res.data.currPage + 1
        this.pageInfo.hasNext = res.data.hasNext
        this.pageInfo.pageSize = res.data.pageSize
        const list = res.data.currPage === 1 ? [] : this.list
        this.list = [].concat(list, res.data.list.map(d => ({ ...d, url: d.customAccessUrl || d.defaultAccessUrl })))
      } catch (e) {
        // e
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.deploy-record-list {
  height: calc(100% - 64px);
  overflow-y: auto;
}

.deploy-record-item {
  min-height: 220px;
  background: #FFFFFF;
  font-size: 14px;
  margin-top: 16px;
  color: #4B4B4B;

  .title-wrap {
    margin-bottom: 20px;
    height: 47px;
    line-height: 47px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #EDEDED;

    .title {
      position: relative;
      font-weight: 500;
      color: #202020;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -94px;
        width: 86px;
        height: 24px;
      }

      &.error::after {
        background: url(~@/assets/logo/deploy-error.png) no-repeat center;
        background-size: 100%;
      }

      &.success::after {
        background: url(~@/assets/logo/deploy-success.png) no-repeat center;
        background-size: 100%;
      }
    }

    .setting {
      margin-left: 16px;
      font-weight: 400;
      color: $primaryColor;
      cursor: pointer;
    }
  }

  .content {
    display: flex;
    padding: 0 20px 20px 20px;

    .item {
      position: relative;
      flex: 1;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 20px;

      &::before {
        margin-bottom: 6px;
        content: attr(label);
        display: block;
        font-weight: 400;
        color: #8A8A8A;
      }
    }

    .half {
      flex-basis: auto;
      width: 15%;

      &:first-child {
        padding-right: 56px;
      }
    }

    .url {
      cursor: pointer;

      &:hover {
        color: $primaryColor;
      }
    }

    .copy {
      position: absolute;
      top: 2px;
      left: 92px;
      width: 16px;
      height: 16px;
      background: url(~@/assets/logo/copy.png) no-repeat center;
      background-size: 100%;
      cursor: pointer;

      &:hover {
        background-image: url(~@/assets/logo/copy-hover.png);
      }
    }

    .status {
      color: #4CC09E;

      .c-icon-success {
        margin-right: 5px;
        font-size: 10px;
      }
    }
  }
}
</style>
