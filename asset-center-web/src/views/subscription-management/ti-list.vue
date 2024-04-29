<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-05-12
-->
<template>
  <div class="download-main">
    <div class="header">
      <div class="info-box lp-data-controls">
        <total-info :search="hasSearch" :total="page.total" />
        <c-input-search v-model="keyword" style="width:296px" placeholder="请输入关键字进行模糊查询"
                        @search="submit"></c-input-search>
      </div>
    </div>
    <div v-infinite-scroll="load" class="content" :infinite-scroll-distance="300"
         :infinite-scroll-delay="200" :infinite-scroll-disabled="noMore">
      <ul class="list">
        <assetsCard
          v-for="item in assetsList"
          :key="item.assetId"
          :page-key="'assetSubscription'" class="assets-item"
          :is-list="true" :show-status="false"
          :data="item" :btn-list="getbtns(item)" @handleClick="handleOperateClick" />
        <!-- <assetsCard v-for="item in assetsList" :key="item.assetId" :show-auth-info="true"
                    :show-link="true" :data="item" class="assets-item" :download-flag="true"
                    :page-key="'assetSubscription'" @downloadOpen="downloadOpen" @openLog="openLog" @openAuthInfo="open"
                    @openLink="openLink">
        </assetsCard> -->
      </ul>
    </div>
    <authorizeDialog v-if="dialogFlagAuth" :key="clickInde" :flag="'view'" :dialog-flag="dialogFlagAuth" :data="curr"
                     @close="close()" />
    <referDialog v-if="dialogFlagLink" :key="clickInde" :flag="'view'" :dialog-flag="dialogFlagLink" :data="curr"
                 @close="close()" />
    <logDialog v-if="showLogFlag" :key="clickInde" :dialog-flag="showLogFlag" :log-list="logList" @close="close()" @downloadOpen="downloadOpen"></logDialog>

  </div>
</template>

<script>
import { getUserPermissionByKey } from '@/utils'
import { subcribeList, upgradeLog } from '@/api/index'
import assetsCard from '@/views/application-management/components/assets-card.vue'
import authorizeDialog from './components/authorize-dialog.vue'
import logDialog from './components/log-dialog.vue'
import referDialog from './components/refer-dialog.vue'
export default {
  components: {
    assetsCard,
    referDialog,
    authorizeDialog,
    logDialog
  },
  data() {
    return {
      activeIndex: '',
      typeTreeData: [
        // 1-PC、2-大屏、3-APP
        { groupId: 22, groupName: '接口' }
      ],
      clickInde: 0,
      hasSearch: false,
      noMore: false,
      dialogFlagAuth: false,
      dialogFlagLink: false,
      keyPath: [],
      keyword: '',
      assetsList: [],
      showLogFlag: false,
      logList: [],
      page: {
        total: 0,
        pageNum: 0,
        pageSize: 20
      }
    }
  },
  created() {
    // this.load()
  },
  methods: {
    getbtns(row) {
      const map = [{
        label: '查看',
        row: row
      }, {
        permissionKey: 'showLog',
        label: '升级日志',
        row: row,
        hide: !getUserPermissionByKey('assetSubscription', 'showLog')
      }, {
        permissionKey: 'showCited',
        label: '被引用关系',
        row: row,
        hide: !getUserPermissionByKey('assetSubscription', 'showCited')
      }, {
        permissionKey: 'showAuth',
        label: '查看授权',
        row: row,
        hide: !getUserPermissionByKey('assetSubscription', 'showAuth')
      }]
      return map.filter(d => !d.hide)
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.downloadOpen(msg.row)
          break
        case '升级日志':
          this.openLog(msg.row)
          break
        case '被引用关系':
          this.openLink(msg.row)
          break
        case '查看授权':
          this.open(msg.row)
          break
      }
    },
    openLog(data) {
      console.log(data, 'data')
      upgradeLog(data.shopCode).then(res => {
        this.logList = res.data
        this.showLogFlag = true
        // this.logList = [{"packTime": "2022-02-02 22:22:22", "packVersion": "v1", "packDesc": "dddd"}]
      })
    },
    handleClose() {
      this.logList = []
      this.clickInde++
      this.showLogFlag = false
    },
    close() {
      this.clickInde++
      this.dialogFlagAuth = false
      this.dialogFlagLink = false
      this.showLogFlag = false
    },
    open(data) {
      this.curr = data
      this.dialogFlagAuth = true
    },
    openLink(data) {
      this.curr = data
      this.dialogFlagLink = true
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.keyPath = keyPath
      this.page.pageNum = 0
      this.assetsList = []
      this.noMore = false
      this.load()
    },
    submit() {
      this.page.pageNum = 0
      this.assetsList = []
      this.noMore = false
      this.load()
    },
    load() {
      this.page.pageNum += 1
      subcribeList({
        packName: this.keyword,
        packType: 1,
        assetType: 1,
        assetSubtype: 14,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        newest: 1,
        optType: 2
      }).then(res => {
        this.page.total = res.data.total
        this.assetsList = [].concat(this.assetsList, res.data.list.map(item => {
          item.assetCode = item.shopCode
          item.status = 5
          item.assetName = item.packName
          if (item.downloadStatus === 5) {
            item.referVersionStatus = 3
          }

          item.appName = item.packName
          item.version = item.newestPackVersion || item.packVersion
          item.packVersionId = item.newestPackVersionId || item.packVersionId
          item.subtype = item.assetSubtype
          return item
        }))
        this.noMore = !res.data.hasNext
      })
    },
    downloadOpen(row) {
      console.log(row)
      if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
        const params = {
          shopCode: row.shopCode,
          packVersion: row.packVersion,
          packVersionId: row.packVersionId,
          assetType: 22
        }
        window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
      } else {
        this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.download-main {
  .header {
    display: block;
    border-radius: 4px;
    opacity: 1;
    background: rgba(255, 255, 255, 0.45);
    box-sizing: border-box;
    border: 1px solid #fff;
  }
  .info-box {
    padding: 22px 20px;
  }
  .search-box {
    border-bottom: 1px solid #ededed;
    padding: 20px 20px 0;
  }
  .content {
    overflow: auto;
    padding: 0px 0 0px;
    margin-top: 20px;
    height: calc(100vh - 320px);
    .list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      width: 1619px;
      margin: auto;
    }
    .assets-item {
      margin-bottom: 20px;
      margin-right: 18px;
      &:nth-child(5n) {
        margin-right: 0px;
      }
    }
  }
}
.c-menu-download {
  li {
    margin-bottom: -1px;
  }
  .c-menu-item {
    height: 40px;
    line-height: 1.2;
  }
  .c-menu-item:hover {
    color: $primaryColor !important;
  }
  .c-submenu {
    height: 40px;
    line-height: 1.2;
  }
  .c-submenu:hover {
    color: $primaryColor !important;
  }
  &::v-deep {
    .c-submenu__title {
      height: 40px;
      line-height: 1.2;
    }
    .c-submenu__title:hover {
      color: $primaryColor !important;
    }
  }
}

</style>
