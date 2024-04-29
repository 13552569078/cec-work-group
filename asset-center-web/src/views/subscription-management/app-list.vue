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
        <c-collapse v-model="interfaceActiveName" accordion class="interface-collapse">
          <c-collapse-item v-for="item,i in assetsList" :key="i" :name="i+''">
            <template slot="title">
              <div class="collapse-title-box">
                <div class="line"></div>
                <div class="path">
                  <p class="version">{{ item.version }}</p>
                  <p class="name">{{ item.packName }}</p>
                  <i v-if="(item.referVersionStatus===2)"
                     class="algin-center">
                    <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                      <i class="alert-update"
                         @click.stop="" />
                    </c-tooltip>
                  </i>
                  <i v-if="(item.referVersionStatus===3)"
                     class="algin-center" @click.stop="">
                    <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                      <i class="alert-invalid"
                         @click.stop="" />
                    </c-tooltip>
                  </i>
                </div>
                <div class="method">
                  <span v-if="getUserPermissionByKey('assetSubscription', 'showLog')" class="btn" @click.stop="openAppLog(item)">升级日志</span>
                  <span v-if="getUserPermissionByKey('assetSubscription', 'showAuth')" class="btn" @click.stop="open(item)">查看授权</span>
                  <span v-if="getUserPermissionByKey('assetSubscription', 'view')" class="btn" @click.stop="downloadOpen(item)">查看详情</span>
                </div>
              </div>
            </template>
            <div class="collapse-content">
              <assetsCard
                v-for="_item,index in itemDataFormat(item.apiList, item)"
                :key="index+_item"
                :page-key="'assetSubscription'" class="assets-item"
                :is-list="true" :show-status="false" :show-type="false"
                :data="_item" :btn-list="getbtns(_item, item)" @handleClick="handleOperateClick" />
              <!-- <div v-for="_item,index in item.apiList" :key="index+_item" class="api-card" @click="openApi(item.packVersionId,_item.bizCode)">
                <div class="title">
                  <span>{{ _item.name }}</span>
                  <i v-if="(item.referVersionStatus===2)"
                     class="algin-center">
                    <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                      <i class="alert-update"
                         @click.stop="" />
                    </c-tooltip>
                  </i>
                  <i v-if="(item.referVersionStatus===3)"
                     class="algin-center" @click.stop="">
                    <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                      <i class="alert-invalid"
                         @click.stop="" />
                    </c-tooltip>
                  </i>
                </div>
                <p class="version">{{ _item.version }}</p>
                <i class=" ac-icon-bottom" @click.stop="">
                  <span v-if="getUserPermissionByKey('assetSubscription', 'showLog')" class="icon-operat margin-right-left-24" @click.stop="openLog(_item,item)"><span>升级日志</span></span>
                  <span v-if="getUserPermissionByKey('assetSubscription', 'showCited')" class="icon-operat margin-right-left-24" @click.stop="openLink(_item,item)"><span>被引用关系</span></span>
                </i>

              </div> -->
            </div>
          </c-collapse-item>

        </c-collapse>
      </ul>
    </div>
    <authorizeDialog v-if="dialogFlagAuth" :flag="'view'" :dialog-flag="dialogFlagAuth" :data="curr"
                     @close="close()" />
    <referDialog v-if="dialogFlagLink" :flag="'view'" :is-interface-a-p-i="true" :dialog-flag="dialogFlagLink" :data="curr"
                 @close="close()" />
    <logDialog v-if="showLogFlag" :key="clickInde" :is-interface-a-p-i="true" :dialog-flag="showLogFlag" :log-list="logList" :data="curr" @close="close()" @downloadOpen="downloadOpen" />
    <logAppDialog v-if="logAppDialogFlag" :key="clickInde" :dialog-flag="logAppDialogFlag" :log-list="logRootList" @close="close()" @downloadOpen="downloadOpen" />
    <apiDetail v-if="apiDetailFlag" :key="clickInde" :visible="apiDetailFlag" :biz-code="curr.bizCode" :pack-version-id="curr.packVersionId" @close="close()" @downloadOpen="downloadOpen" />

  </div>
</template>

<script>
import assetsCard from '@/views/application-management/components/assets-card.vue'
import { subcribeList, upgradeLog, apiUpgradeLog } from '@/api/index'
import authorizeDialog from './components/authorize-dialog.vue'
import logAppDialog from './components/log-app-dialog.vue'
import apiDetail from './components/api-detail.vue'
import logDialog from './components/log-dialog.vue'
import referDialog from './components/refer-dialog.vue'
import { getUserPermissionByKey } from '@/utils'
export default {
  components: {
    referDialog,
    authorizeDialog,
    logDialog,
    apiDetail,
    logAppDialog,
    assetsCard
  },
  data() {
    return {
      interfaceActiveName: '0',
      activeIndex: '',
      clickInde: 0,
      apiDetailFlag: false,
      hasSearch: false,
      noMore: false,
      dialogFlagAuth: false,
      dialogFlagLink: false,
      keyPath: [],
      keyword: '',
      assetsList: [],
      showLogFlag: false,
      logAppDialogFlag: false,
      logList: [],
      logRootList: [],
      curr: {},
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
    itemDataFormat(list, pData) {
      return list.map(d => ({ ...d, assetName: d.name, referVersionStatus: pData.referVersionStatus }))
    },
    getbtns(row, pdata) {
      const map = [{
        pdata,
        label: '查看',
        row: row
      }, {
        pdata,
        permissionKey: 'showLog',
        label: '升级日志',
        row: row,
        hide: !getUserPermissionByKey('assetSubscription', 'showLog')
      }, {
        pdata,
        permissionKey: 'showCited',
        label: '被引用关系',
        row: row,
        hide: !getUserPermissionByKey('assetSubscription', 'showCited')
      }]
      return map.filter(d => !d.hide)
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.openApi(msg.pdata.packVersionId, msg.row.bizCode)
          break
        case '升级日志':
          this.openLog(msg.row, msg.pdata)
          break
        case '被引用关系':
          this.openLink(msg.row, msg.pdata)
          break
      }
    },
    getUserPermissionByKey(a, b) {
      return getUserPermissionByKey(a, b)
    },
    openApi(packVersionId, bizCode) {
      if (!getUserPermissionByKey('assetSubscription', 'view')) return
      this.curr = {
        packVersionId, bizCode
      }
      this.apiDetailFlag = true
      this.clickInde++
    },
    openAppLog(data) {
      this.clickInde++
      upgradeLog(data.shopCode).then(res => {
        this.logRootList = res.data
        this.logAppDialogFlag = true
        // this.logList = [{"packTime": "2022-02-02 22:22:22", "packVersion": "v1", "packDesc": "dddd"}]
      })
    },
    openLog(data, root) {
      this.clickInde++
      console.log(data, 'openLogdata')
      apiUpgradeLog({ bizKey: data.name }).then(res => {
        this.logList = res.data
        this.curr = { ...root, packVersion: root.newestPackVersion || root.packVersion }
        this.showLogFlag = true
        // this.logList = [{"packTime": "2022-02-02 22:22:22", "packVersion": "v1", "packDesc": "dddd"}]
      })
    },
    handleClose() {
      this.logList = []
      this.showLogFlag = false
    },
    close() {
      this.clickInde++
      this.dialogFlagAuth = false
      this.dialogFlagLink = false
      this.showLogFlag = false
      this.logAppDialogFlag = false
      this.apiDetailFlag = false
      this.curr = {}
      this.logList = []
      this.logRootList = []
    },
    open(data) {
      this.curr = data
      this.dialogFlagAuth = true
    },
    openLink(data, root) {
      this.curr = { ...data, shopCode: root.shopCode, packVersion: root.newestPackVersion || root.packVersion }
      console.log(this.curr, 'this.curr ')
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
        assetType: 2,
        assetSubtype: 27,
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
          assetType: 27
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
    height: calc(100vh - 320px);
    margin-top: 20px;
    .list {
      width: 1619px;
      margin: auto;
    }
    .assets-item {
      margin-bottom: 26px;
      margin-right: 22px;
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

.interface-collapse{
  &::v-deep{
    .c-icon-caret-bottom:before{
      content: "\e6df";
    }
    .c-collapse-item__header{
      height: 72px;
      &:first-child{
        border-top: 1px solid #EDEDED;
      }
    }
    .c-collapse-item__content{
      padding-bottom:0px;
    }
    .is-active{
      .c-icon-caret-bottom{
        color:#36A4FF !important ;
      }
      .line{
        background: #36A4FF !important;
      }
    }
    .c-collapse-item__arrow{
      margin-right: 24px;
    }
  }
  .collapse-title-box{
    display: flex;
    justify-content:space-between;
    .line{
      width: 4px;
      height: 72px;
      background: rgba(30, 111, 255, 0.2);
    }

    .path{
      width: 1187px;
      display: flex;
      align-items: center;
      margin-left: 28px;
      .version{
        display: flex;
        align-items: flex-end;
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
        margin-right: 24px;
        &::before{
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/imgs/version.svg) no-repeat;
          background-size: 100%;
        margin-right: 8px;
        }
      }
      .name{
        width:192px;
        font-weight: 500;
        color: #4B4B4B;
        line-height: 20px;
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap;
      }
    }
    .method{
      display: flex;
      align-items: center;

      .btn{
        color: #8A8A8A;
        font-weight: normal;

        margin-left: 56px;
      }
      .btn:hover{
        color:#36A4FF
      }
    }
  }
  .collapse-content{
    background: #F3F4FB;
    padding: 20px 0px 0px 0px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .api-card{
      margin-bottom: 20px;
      width:309px;
      height: 170px;
      margin-right: 18px;
      background: #fff;
      box-shadow: 4px 6px 20px 0px #E8EDF5;
      border: 2px solid #FFFFFF;
      position: relative;
      padding: 24px 0 0 32px;
      cursor: pointer;
      &:nth-child(5n){

      margin-right: 0px;
      }
      .title{
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        width: 240px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span{
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          display: inline-block;
          width: 176px;
          margin-right: 16px;
          margin-bottom:8px;
        }
      }
      .version{
        display: flex;
        align-items: flex-end;
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
        margin-right: 24px;
        font-size: 14px;
        &::before{
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/imgs/version.svg) no-repeat;
          background-size: 100%;
          margin-right: 8px;
        }
      }
    }
  }
}

.ac-icon-bottom {
  display: flex;
  align-items: center;
  min-width: 72px;
  height: 32px;
  border-radius: 16px 0px 0px 16px;
  position: absolute;
  bottom: 14px;
  right: 0px;
  z-index: 1001;
  text-align: right;
  padding-right: 24px;
  padding-left: 16px;

    .icon-operat {
      min-width: 48px;
      height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8a8a8a;
      line-height: 26px;
      cursor: pointer;
      margin-right: 12px;
      line-height: 32px;
      display: flex;
      align-items: center;

      &:last-child {
        margin: 0 0px;
      }

      &:hover {
        color: #36a4ff;
      }

      &::v-deep {
        .c-checkbox {
          color: #8a8a8a;

          &:hover {
            color: #36a4ff;

            .c-checkbox__inner {
              border-color: #36A4FF;
            }
          }
        }

        .is-checked {
          .c-checkbox__label {
            color: #36a4ff;
          }
        }

        // .is-focus{
        //   .c-checkbox__inner{
        //     border: 1px solid #E7E7E7;
        //   }
        // }
      }
    }

  }
</style>
