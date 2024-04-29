<!--/*
* @Author: dingli
* @Desc: 详情-订阅资源
* @Date:
*/-->
<template>
  <div class="appd-table-list minHeight">
    <div class="asset-radio">
      <div v-for="(item, k) in assetTypeMap" :key="k" class="radio-item"
           :class="{'active':radioAssetType==item.type}" @click="clickRadio(item.type)">
        <div class="label">{{ item.name }}</div>
        <div class="value">{{ item.count }}</div>
      </div>
    </div>
    <div v-if="radioAssetType==22||radioAssetType==72||radioAssetType==14" class="list-box">
      <div v-if="showList && (showList || []).length" class="assets-list">
        <assetsCard
          v-for="_item in showList || []" :key="_item.assetId"
          :page-key="'applicationManagement'" class="assets-item"
          :is-list="true" :show-status="false"
          :data="_item" :btn-list="getbtns(_item)" @handleClick="handleOperateClick" />
        <!-- <assetsCard v-for="_item in showList || []" :key="_item.assetId" :download-flag="true"
                    :show-log="true" :page-key="'applicationManagement'" :data="_item"
                    class="assets-item" :show-link="true" @openLink="openLink"
                    @downloadOpen="showDialog" @openLog="openLog" /> -->
      </div>
      <div v-else class="assets-list assets-nodata">
        <div class="no-list-show-wrap">
          <img src="../../../assets/application/no-data.png" class="img-no-list-show"
               alt="暂无内容" />
          <span class="nodata-text">暂无内容</span>
        </div>
      </div>
    </div>
    <div v-if="radioAssetType ==27" class="list-box">
      <c-collapse v-if="showList && (showList || []).length" v-model="interfaceActiveName" accordion class="interface-collapse">
        <c-collapse-item v-for="item,i in showList" :key="i" :name="i+''">
          <template slot="title">
            <div class="collapse-title-box">
              <div class="line"></div>
              <div class="path">
                <p class="version">{{ item.version }}</p>
                <p class="name">{{ item.assetName }}</p>
                <i v-if="(item.referVersionStatus===2)" class="algin-center">
                  <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                    <i class="alert-update" @click.stop="" />
                  </c-tooltip>
                </i>
                <i v-if="(item.referVersionStatus===3)" class="algin-center" @click.stop="">
                  <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                    <i class="alert-invalid" @click.stop="" />
                  </c-tooltip>
                </i>
              </div>
              <div class="method">
                <span class="btn" @click.stop="openAppLog(item)">升级日志</span>
                <span class="btn" @click.stop="showDialog(item)">查看详情</span>
              </div>
            </div>
          </template>
          <div class="collapse-content">
            <assetsCard
              v-for="_item,index in itemDataFormat(item.apiList, item)"
              :key="index+_item"
              :page-key="'assetSubscription'" class="assets-item"
              :is-list="true" :show-status="false" :show-type="false"
              :data="_item" :btn-list="appgetbtns(_item, item)" @handleClick="apphandleOperateClick" />
            <!-- <div v-for="_item,index in item.apiList" :key="index+_item" class="api-card"
                 @click="openApi(item.bizKey,item.version,_item.bizCode)">
              <div class="title">
                <span>{{ _item.bizKey }}</span>
                <i v-if="(item.referVersionStatus===2)" class="algin-center">
                  <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                    <i class="alert-update" @click.stop="" />
                  </c-tooltip>
                </i>
                <i v-if="(item.referVersionStatus===3)" class="algin-center" @click.stop="">
                  <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                    <i class="alert-invalid" @click.stop="" />
                  </c-tooltip>
                </i>
              </div>
              <p class="version">
                <span>{{ _item.version }}</span>
                <span v-if="item.authStatus==2" class="ac-icon-authorize">未授权</span>
              </p>
              <i class=" ac-icon-bottom" @click.stop="">
                <span class="icon-operat margin-right-left-24"
                      @click.stop="openLog(_item,item)"><span>升级日志</span></span>
                <span class="icon-operat margin-right-left-24"
                      @click.stop="openLink(_item,item)"><span>被引用关系</span></span>
              </i>

            </div> -->
          </div>
        </c-collapse-item>

      </c-collapse>
      <div v-else class="assets-list assets-nodata">
        <div class="no-list-show-wrap">
          <img src="../../../assets/application/no-data.png" class="img-no-list-show"
               alt="暂无内容" />
          <span class="nodata-text">暂无内容</span>
        </div>
      </div>
    </div>

    <referDialog v-if="dialogFlagLink" :flag="'view'" :dialog-flag="dialogFlagLink" :data="curr"
                 @close="close()" />
    <logDialog v-if="showLogFlag" :dialog-flag="showLogFlag" :log-list="logList" @close="close()"
               @downloadOpen="downloadOpen"></logDialog>
    <logAppDialog v-if="logAppDialogFlag" :dialog-flag="logAppDialogFlag" :log-list="logAppList"
                  @close="close()" @downloadOpen="downloadOpen" />
    <apiDetail v-if="apiDetailFlag" :key="clickInde" :visible="apiDetailFlag" :biz-code="curr.bizCode" :pack-version-id="curr.packVersionId" @close="close()" @downloadOpen="downloadOpen" />

  </div>
</template>
<script>
import { getUserPermissionByKey } from '@/utils'
import { subAssetList, getByBizCode, upgradeLog, apiUpgradeLog, getByBasicInfo } from '@/api/index'
import assetsCard from './assets-card.vue'
import logAppDialog from '@/views/subscription-management/components/log-app-dialog.vue'
import logDialog from '@/views/subscription-management/components/log-dialog.vue'
import apiDetail from '@/views/subscription-management/components/api-detail.vue'
import referDialog from '@/views/subscription-management/components/refer-dialog.vue'
export default {
  name: 'DetailAssetSubscription',
  components: { assetsCard, apiDetail, referDialog, logDialog, logAppDialog },
  props: {
    appId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      assetList: [],
      dialogFlagLink: false,
      apiDetailFlag: false,
      logAppDialogFlag: false,
      showLogFlag: false,
      logList: [],
      logAppList: [],
      curr: {},
      radioAssetType: 22,
      interfaceActiveName: '0',
      assetTypeMap: [{
        type: 22,
        name: '接口资源',
        count: 0
      }, {
        type: 14,
        name: '体征资源',
        count: 0
      }, {
        type: 72,
        name: '模型资源',
        count: 0
      }, {
        type: 27,
        name: '支撑应用',
        count: 0
      }]
    };
  },
  computed: {
    showList() {
      return this.assetList.filter(d => {
        return d.subtype + '' === this.radioAssetType + ''
      })
    }
  },
  created() { },
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
      }]
      return map.filter(d => !d.hide)
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.showDialog(msg.row)
          break
        case '升级日志':
          this.openLog(msg.row)
          break
        case '被引用关系':
          this.openLink(msg.row)
          break
      }
    },
    itemDataFormat(list, pData) {
      return list.map(d => ({ ...d, assetName: d.bizKey, referVersionStatus: pData.referVersionStatus }))
    },
    appgetbtns(row, pdata) {
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
    apphandleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.openApi(msg.pdata.bizKey, msg.pdata.version, msg.row.bizCode)
          break
        case '升级日志':
          this.openLog(msg.row, msg.pdata)
          break
        case '被引用关系':
          this.openLink(msg.row, msg.pdata)
          break
      }
    },
    clickRadio(type) {
      this.radioAssetType = type
    },
    resetAssetTypeMap() {
      this.assetTypeMap.forEach(item => {
        item.count = 0
      })
      // for (const key in this.assetTypeMap) {
      //   if (Object.hasOwnProperty.call(this.assetTypeMap, key)) {
      //     const element = this.assetTypeMap[key];
      //     element.count = 0
      //   }
      // }
    },
    openApi(bizKey, version, bizCode) {
      getByBasicInfo({ shopCode: bizKey,
        packVersion: version }).then(res => {
        if (+res.code === 1404) {
          this.$message.error('订阅资源不存在！')
        } else if (res.data) {
          this.curr = {
            packVersionId: res.data.packVersionId, bizCode
          }
          this.apiDetailFlag = true
          this.clickInde++
          // if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
          //   const params = {
          //     shopCode: res.data.shopCode,
          //     packVersion: res.data.packVersion,
          //     packVersionId: res.data.packVersionId,
          //     assetType: res.data.subtype || res.data.assetSubtype
          //   }
          //   window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
          // } else {
          //   this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
          // }
        }
      })
    },
    openAppLog(data) {
      this.clickInde++
      upgradeLog(data.bizKey).then(res => {
        this.logAppList = res.data
        this.logAppDialogFlag = true
        // this.logList = [{"packTime": "2022-02-02 22:22:22", "packVersion": "v1", "packDesc": "dddd"}]
      })
    },
    openLog(data, root) {
      if (data.subtype + '' !== '27') { // 接口
        apiUpgradeLog({ bizKey: data.bizKey }).then(res => {
          this.logList = res.data
          this.showLogFlag = true
          // this.logList = [{"packTime": "2022-02-02 22:22:22", "packVersion": "v1", "packDesc": "dddd"}]
        })
        return
      }
      // 支撑应用
      apiUpgradeLog({ bizKey: data.bizKey }).then(res => {
        this.logList = res.data
        this.curr = { ...root, packVersion: root.newestPackVersion || root.packVersion }
        this.showLogFlag = true
        // this.logList = [{"packTime": "2022-02-02 22:22:22", "packVersion": "v1", "packDesc": "dddd"}]
      })
      console.log(data, 'data')
    },
    downloadOpen(row) {
      console.log(row)
      if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
        const params = {
          shopCode: row.shopCode || row.bizKey,
          packVersion: row.packVersion,
          packVersionId: row.packVersionId || row.bizCode,
          assetType: 27
        }
        window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
      } else {
        this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
      }
    },
    openLink(data, root) {
      if (root) {
        this.curr = { ...data, shopCode: root.shopCode, packVersion: root.newestPackVersion || root.packVersion }
      } else {
        this.curr = data;
      }

      this.dialogFlagLink = true
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
      this.logAppList = []
    },
    showDialog(data) {
      console.log(data, '[[[[')
      if (data.subtype + '' === '27') {
        getByBasicInfo({
          shopCode: data.bizKey,
          packVersion: data.version
        }).then(res => {
          if (res.code === 1404) {
            this.$message.error('订阅资源不存在！')
          } else {
            if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
              const params = {
                shopCode: res.data.shopCode,
                packVersion: res.data.packVersion,
                packVersionId: res.data.packVersionId,
                assetType: res.data.subtype || res.data.assetSubtype
              }
              window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
            } else {
              this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
            }
          }
        })
        return
      }
      getByBizCode({ bizCode: data.bizCode }).then(res => {
        if (+res.code === 1404) {
          this.$message.error('订阅资源不存在！')
        } else if (res.data) {
          if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
            const params = {
              shopCode: res.data.shopCode,
              packVersion: res.data.packVersion,
              packVersionId: res.data.packVersionId,
              assetType: res.data.subtype || res.data.assetSubtype
            }
            window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
          } else {
            this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
          }
        }
      })
    },
    deleteAsset() { },
    async getData(params) {
      try {
        this.resetAssetTypeMap()
        const res = await subAssetList(params)
        console.log(res)
        this.assetList = res.data.map(d => ({ ...d, assetSource: d.createSrc, appId: this.appId }))
        this.assetList.forEach(d => {
          this.assetTypeMap.find(item => item.type === d.subtype).count++
        })
      } catch (e) {
        // e
      }
    }
  }
};
</script>
<style scoped lang="scss">
.minHeight {
  height: calc(100% - 64px);
}
.list-box {
  margin-left: 20px;
  overflow: hidden;
}
.appd-table-list {
  position: relative;
  .assets-list {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    width: 1342px;
    margin: 0 auto;
    .assets-item {
      margin-right: 18px;
      margin-bottom: 20px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
    }
  }
  .appd-table-top {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .appd-table-title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4b4b4b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &::before {
        width: 4px;
        height: 14px;
        background: #36a4ff;
        content: '';
        display: inline-block;
        margin-right: 8px;
      }
    }
  }
  .appd-table-content {
    .group-name-box:hover {
      .show-hidden {
        display: block !important;
      }
    }
    .group-name-box {
      display: flex;
      align-items: center;
      width: 400px;
      margin-top: 32px;
      .group-name {
        width: 216px;
        height: 28px;
        background: linear-gradient(
          270deg,
          rgba(54, 164, 255, 0.4) 0%,
          #36a4ff 100%
        );
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        &::before {
          content: '';
          width: 1px;
          height: 100%;
          background: #fff;
          display: block;
          margin-left: 3px;
          margin-right: 8px;
        }
      }

      .show-hidden {
        display: none;
      }
      .delete-edit {
        display: flex;
        .group-edit {
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/application/icon-edit.png);
          margin-left: 25px;
          cursor: pointer;
        }
        .group-delete {
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/application/icon-delete-dark.png);
          cursor: pointer;
          margin-left: 10px;
        }
      }
    }
  }
}
.assets-nodata {
  min-height: 300px;
}
.no-list-show-wrap {
  // padding-top: 50px;
  width: 100%;
  height: 50%;
  position: relative;
  text-align: center;
  .img-no-list-show {
    height: 100%;
    display: block;
    margin: 0 auto 20px;
  }
  .nodata-text {
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #9dacce;
    position: absolute;
    top: 350px;
    left: 50%;
    transform: translateX(-50%);
  }
}
.asset-radio {
  background: #fff;
  padding: 20px;
  height: 448px;
  font-size: 14px;
  .active {
    background: #f9fafe;
    color: #36a4ff !important;
  }
  .radio-item {
    width: 220px;
    height: 44px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    color: #4b4b4b;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    &:hover {
      /* 背景色/bg-hover */
      background: #f9fafe;
      color: #36a4ff;
    }
  }
}
.list-box{
  width: 1344px;
}
.interface-collapse {
  &::v-deep {
    .c-icon-caret-bottom:before {
      content: '\e6df';
    }
    .c-collapse-item__header {
      height: 72px;
      &:first-child {
        border-top: 1px solid #ededed;
      }
    }
    .c-collapse-item__content {
      padding-bottom: 0px;
    }
    .is-active {
      .c-icon-caret-bottom {
        color: #36a4ff !important ;
      }
      .line {
        background: #36a4ff !important;
      }
    }
    .c-collapse-item__arrow {
      margin-right: 24px;
    }
  }
  .collapse-title-box {
    display: flex;
    justify-content: space-between;
    .line {
      width: 4px;
      height: 72px;
      background: rgba(30, 111, 255, 0.2);
    }

    .path {
      width: 1008px;
      display: flex;
      align-items: center;
      margin-left: 28px;
      .version {
        display: flex;
        align-items: center;
        font-weight: 400;
        color: #8a8a8a;
        line-height: 20px;
        margin-right: 24px;
        &::before {
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/imgs/version.svg) no-repeat;
          background-size: 100%;
          margin-right: 8px;
        }
      }
      .name {
        width: 192px;
        font-weight: 500;
        color: #4b4b4b;
        line-height: 20px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap;
      }
    }
    .method {
      display: flex;
      align-items: center;

      .btn {
        color: #8a8a8a;
        font-weight: normal;

        margin-left: 56px;
      }
      .btn:hover {
        color: #36a4ff;
      }
    }
  }
  .collapse-content{
    background: #F3F4FB;
    padding: 20px 0px 0px 0px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .assets-item {
      margin-right: 18px;
      margin-bottom: 20px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
    }
    .api-card{
      margin-bottom: 20px;
      width:321px;
      height: 170px;
      margin-right: 18px;
      background: #fff;
      box-shadow: 4px 6px 20px 0px #E8EDF5;
      border: 2px solid #FFFFFF;
      position: relative;
      padding: 24px 0 0 32px;
      cursor: pointer;
      &:nth-child(4n){

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
        align-items: center;
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
    background: linear-gradient(180deg, #f3f5f8 0%, #fdfdfe 100%);
    box-shadow: 2px 3px 8px 0px rgba(232, 237, 245, 0.6);
    border-radius: 16px 0px 0px 16px;
    border: 1px solid #ffffff;
    position: absolute;
    bottom: 8px;
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
.ac-icon-authorize {
  padding: 0 4px;
  background: #9DC1FC;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fff !important;
  text-align: center;
  margin-left: 8px;
}
</style>
