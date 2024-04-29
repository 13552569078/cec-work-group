<!--
 * @Description: 应用列表页
 * @Author: lianpeng
 * @Date: 2021-09-10
-->

<template>
  <router-page-layout :path="myPath">
    <div class="select-asset-main">
      <div class="sa-nav">
        <div class="nav-top">
          <!-- <firstLevelNav
            :first-level-data="firstLevelData"
            :operatable="false"
            :second-empty-show="true"
            @selectGroups="selectGroups"
            @addTree="saveNode"
            @updateTree="saveNode"
            @deleteTree="deleteTree"
          /> -->
          <div class="search-box flex-between-center">
            <div class="flex-left flex-start-center">
              <div class="select-info flex-start-center">
                <div class="unselected flex-start-center">
                  <i
                    class="icon-margin"
                    :class="groupTag.groupId || keywordTag.groupName ? 'icon-search' : 'icon-data'"
                  />
                  <span class="select-text">
                    <!-- {{ groupTag.groupId || keywordTag.groupName ? "查询结果" : "全部结果" }} -->
                    共<span class="select-num">{{ page.total }}</span>条
                  </span>
                </div>
                <i class="icon-change change-group" :class="{'change-group-active':cType==='group'}" @click="changeType('group')"></i>
                <i class="icon-change change-list" :class="{'change-list-active':cType==='list'}" @click="changeType('list')"></i>

                <div class="tag-list flex-start-center">
                  <tagA
                    v-if="groupTag.groupId"
                    :key="groupTag.groupId"
                    :editable="false"
                    :tag="groupTag"
                    class="tag-margin"
                    @deleteTag="deleteGroupTag"
                  />
                  <tagA
                    v-if="keywordTag.groupName"
                    :key="keywordTag.groupName"
                    :editable="false"
                    :tag="keywordTag"
                    class="tag-margin"
                    @deleteTag="deleteKeywordTag"
                  />
                </div>
              </div>
            </div>
            <div class="flex-right">

              <div class="flex-start-center">
                <c-select
                  v-if="cType=='list'"
                  v-model="appStatus"
                  specific-suffix
                  clearable
                  style="width:120px;margin-right:8px"
                  placeholder="请选择"
                >
                  <c-option label="全部" value="" />
                  <c-option
                    v-for="(item, k) in APP_STATE"
                    :key="k"
                    :label="item"
                    :value="k" />
                </c-select>
                <c-input-search
                  v-model="keyword"
                  style="width: 296px"
                  placeholder="请输入关键词进行模糊查询"
                  @search="search"
                />
                <button-dropdown v-show="getUserPermissionByKey('applicationManagement', 'import')" class="btn-operate mrg-left" :btn-type="'operate'" :options="btnList" :text="'复制应用'" @command="addNewApp" />
                <c-button
                  v-show="getUserPermissionByKey('applicationManagement', 'add')"
                  type="gradual"
                  style="margin-left: 32px;width:104px;font-size: 14px;font-weight: 400;"
                  @click="addNewApp('add')"
                >新建应用</c-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="cType ==='list'" class="sa-list">
        <div
          class="assets-content-list"
          :style="'height:calc(100vh - 246px)'"
          :class="appList.length > 0 ? '' : 'bgwhite'"
        >
          <ul
            v-if="appList.length > 0"
            v-infinite-scroll="load"
            class="list"
            :infinite-scroll-disabled="noMore"
          >
            <assetsCard
              v-for="item in appList"
              :key="item.assetId"
              :data="item"
              :page-key="'applicationManagement'"
              class="assets-item"
              @operteItem="operteItem"
            />
          </ul>
        </div>
      </div>
      <div v-if="cType ==='group'" class="sa-list">
        <div
          class="assets-content-list"
          :style="'height:calc(100vh - 246px)'"
          :class="appList.length > 0 ? '' : 'bgwhite'"
        >
          <ul
            v-if="appList.length > 0"
            v-infinite-scroll="load"
            class="list"
            :infinite-scroll-disabled="noMore"
          >
            <assetsCardGroup
              v-for="item in appList"
              :key="item.assetId"
              :data="item"
              :page-key="'applicationManagement'"
              class="assets-item-group"
              @operteItem="operteItem"
            />
          </ul>
        </div>
      </div>
      <c-dialog
        :class="'dialog-center'"
        :title="title"
        width="996px"
        class="details-dialog"
        top="32px"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
        <addEditApp
          v-if="dialogVisible"
          :flag="addFlag"
          :selectdata="selectdata"
          :group-id="groupTag.groupId"
          :group-name="groupTag.groupName"
          @close="closeDialog"
        />
      </c-dialog>
      <dialog-public :visible="postDailogFlag" :data="currData" @close="_resetPostDailog" @ok="search" />
      <dialog-add-form-download :visible="dialogAddFormDownloadVisible" :group-tag="groupTag" @close="closeDialog" />
      <deploy-dialog
        :visible="!!deployDialogVisible"
        :data="deployDialogVisible"
        @close="deployDialogVisible = null"
        @ok="deployDialogOk"
      />
      <asset-settings-dialog
        :visible="!!settingFlag"
        :data="settingFlag"
        @close="settingFlag = null"
        @ok="settingsOk"
      />
      <!-- 文件下载 -->
      <a ref="refDownloadFile" :href="download.url" :download="download.name" />
    </div>
  </router-page-layout>
</template>

<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js';
import tagA from '@/components/tag-app';
import assetsCard from './components/assets-show-card.vue';
import assetsCardGroup from './components/assets-show-card-group.vue';
import addEditApp from './components/add-edit-app.vue';
import { checkVersion } from '@/utils/validate';
// import { getToken } from '@/utils/auth'
import { debounce } from '@/utils/helper/tool';
import { getUserPermissionByKey } from '@/utils';
import {
  appListPage,
  delAppItem,
  packAppItem,
  appUndeploy,
  appReleaseCheck,
  checkUnAuthAsset,
  appGroupList
} from '@/api/index';
import DeployDialog from './components/deploy-dialog.vue';
import AssetSettingsDialog from './components/asset-settings-dialog.vue';
import { downloadFile, getUrlRelativePath } from '@/utils/downLoad';
import { APP_STATE } from './components/config.js'
import DialogPublic from './components/dialog-public.vue'
import { openNav, addParamToUrl } from '@/utils'
import DialogAddFormDownload from './components/dialog-add-form-download.vue'
import ButtonDropdown from '@/components/button-dropdown'
export default {
  components: {
    assetsCard,
    tagA,
    ButtonDropdown,
    addEditApp,
    DeployDialog,
    AssetSettingsDialog,
    DialogPublic,
    assetsCardGroup,
    DialogAddFormDownload
  },
  data() {
    const btnList = [{ label: '复制下载应用', code: 'download' }, { label: '导入本地应用', code: 'import' }]
    // deployType=1仅部署开发中心不显示【复制下载应用】
    if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
      btnList.shift()
    }
    return {
      btnList: btnList,
      myPath: '/application-management',
      isLeaf: false,
      postDailogFlag: false,
      deployDialogVisible: null,
      settingFlag: null,
      title: '新建应用',
      addFlag: 'add',
      dialogVisible: false,
      dialogAddFormDownloadVisible: false,
      firstLevelData: [],
      count: 9,
      keyword: '',
      loading: false,
      noMore: false,
      contentHeight: 0,
      appCode: this.$route.query.appCode,
      currData: {},
      postFormData: {
        id: '',
        version: '',
        versionDesc: ''
      },
      rules: {
        accessUrl: [
          {
            required: false,
            validator: (rule, val, cb) => {
              const reg = /(https?):\/\/[-A-Za-z0-9+\&\@\#\/\%?=~_|!:,.;]+[-A-Za-z0-9+\&\@\#\/\%=~_|]/
              if (!val) return cb();
              if (val.length > 150) {
                cb('最多输入150个字符');
              } else if (!val) {
                cb('请输入访问地址');
              } else if (!reg.test(val)) {
                cb('只支持http(https)开头的绝对地址');
              } else {
                cb();
              }
            },
            trigger: 'blur'
          }
        ],
        versionDesc: [
          { required: true, message: '请输入版本说明', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              if (!checkVersion(val, cb)) {
                return;
              }
              cb();
            },
            trigger: 'blur'
          }
        ]
      },
      cType: localStorage.getItem('application-management-ctype') || 'list',
      groupTag: {
        groupId: '',
        groupName: '',
        status: 0
      },
      keywordTag: {
        groupId: 'key-2',
        groupName: '',
        status: 0
      },
      page: {
        pageNum: 0,
        pageSize: 15,
        total: 0
      },
      appList: [],
      checkedAssetsIds: [],
      selectdata: null,
      download: {
        name: '',
        url: ''
      },
      isShowdropdown: false,
      APP_STATE,
      appStatus: '',
      getUserPermissionByKey
    };
  },
  watch: {
    appStatus() {
      this.search();
    }
  },
  created() {
    this.div = document.createElement('div')
    this.div.className = 'list-tabs-bg'
    this.div.id = 'list-tabs-bg-flow-index'
    this.$nextTick(() => {
      if (this.$route.path === this.myPath) { document.getElementsByClassName('page-content-wrapper')[0].append(this.div) }
    })
    this.load = debounce(this.loader, 200);
    // this.getTreeList();
    this.load();
    this.div = document.createElement('div')
    this.div.className = 'list-tabs-bg'
    this.div.id = 'list-tabs-bg-flow-index'
    this.$nextTick(() => {
      if (this.$route.path === this.myPath) { document.getElementsByClassName('page-content-wrapper')[0].append(this.div) }
    })
  },
  destroyed() {
    try {
      document.getElementsByClassName('page-content-wrapper')[0].removeChild(this.div)
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    changeType(type) {
      if (this.cType === type) return
      this.appStatus = ''
      this.cType = type
      localStorage.setItem('application-management-ctype', this.cType)
      this.search()
    },
    clickImport() {
      // 导入应用
      // if (!this.groupTag.groupId) {
      //   this.$message.error('请选中场景树节点后导入应用！');
      //   return;
      // }
      this.addFlag = 'import';
      this.title = '导入应用';
      this.dialogVisible = true;
    },
    _resetPostDailog() {
      this.postDailogFlag = false;
      this.currData = {};
    },
    closeDialog({ id, appCode }) {
      this.dialogVisible = false;
      this.dialogAddFormDownloadVisible = false;
      if (id === true) {
        return this.search()
      }
      console.log(id)
      if (id) {
        this.search();
        this.$router.push({
          path: '/application-detail',
          query: {
            id, code: appCode
          }
        });
      }
    },
    settingsOk() {
      this.settingFlag = null;
      this.$message.success('应用设置成功');
      this.search();
    },
    operteItem(data) {
      console.log(data, '----');
      switch (data.operteType) {
        case 'setting':
          this.settingFlag = data;
          break;
        case 'cexiaodeploy':
          this.$confirm('请确认是否取消部署应用？', '应用取消部署', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            appUndeploy({
              appCode: data.appCode,
              version: data.version
            }).then((res) => {
              if (res.code * 1 === 0) {
                this.$message.success('应用取消部署成功');
                this.search();
              }
            });
          });

          break;
        case 'delete':
          this.$confirm('请确认是否删除应用？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            delAppItem(data.id).then((res) => {
              if (res.code * 1 === 0) {
                this.$message.success('应用删除成功');
                this.search();
              }
            });
          });

          break;
        case 'post': // 发布

          appReleaseCheck(data.id).then(res => {
            this.showPostDailog(data);
          })

          break;
        case 'deploy':
          this.deployDialogVisible = data
          break;
        case 'copy':
          this.addFlag = 'copy';
          this.title = '复制应用';
          this.selectdata = data;
          this.dialogVisible = true;
          break;
        case 'nav': // 导航
          console.log('nav')
          openNav(data, this.$message)
          break;
        case 'pack':
          this.sendAndPackAppItem({ appCode: data.appCode, version: data.version })
          break;
        case 'download':
          if (data.packFilePath) {
            this.downLoadFn(data.packFilePath, data)
          } else {
            this.$message.error('文件地址错误')
          }
          break;
        case 'open': // 访问应用
          if (data.accessUrl) { window.open(addParamToUrl(data.accessUrl)) }
          break;
        case 'preview': // 预览
          if (window.__systemConfig && window.__systemConfig.platformUrl) {
            const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/app/index?appVersion=${data.version}&appCode=${data.appCode}&appName=${data.appName}`
            window.open(openUrl)
          } else {
            this.$message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
          }
          break;
        default:
          break;
      }
    },
    downLoadFn(url, data) {
      if (/http/.test(url)) {
        url = getUrlRelativePath(url);
      }
      url = `${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${url.replace('?', '&')}`
      console.log(url);
      downloadFile(url, data.appCode + '_' + data.version + '.zip');
    },
    sendAndPackAppItem(data) {
      const h = this.$createElement;
      this.$confirm(
        h('p', null, [
          h('p', null, '请确认是否将该应用打包？'),
          h(
            'p',
            { style: 'font-size:12px;line-height:16px;margin-top:10px;' },
            '打包预计时间约为1分钟，请稍后刷新页面查看'
          )
        ]),
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          confirmButtonIsLeft: false,
          iconClass: 'c-ioc-icon-warning',
          type: 'warning'
        }
      )
        .then(() => {
          packAppItem(data).then((res) => {
            if (res.code * 1 !== 0) return;
            this.$message.success('操作成功！');
            this.search();
          });
        })
        .catch(() => {});
    },
    deployDialogOk() {
      this.deployDialogVisible = null;
      this.$message.success('应用部署成功');
      this.search();
    },
    showPostDailog(data) {
      const loading = this.$loading({
        lock: true,
        text: '正在校验订阅资源...',
        fullscreen: false,
        background: 'rgba(0, 0, 0, 0)'
      });
      checkUnAuthAsset({ appCode: data.appCode }).then(res => {
        loading.close()
        if (res.data && +res.data.result === 1) {
          this.$message.error('存在未授权的订阅资源，不能进行应用发布！')
        } else if (res.data && +res.data.result === 0) {
          this.currData = data;
          this.postDailogFlag = true;
        }
      }).catch(() => {
        loading.close()
      })
    },
    addNewApp(key) {
      // if (!this.groupTag.groupId) {
      //   this.$message.error('请选中场景树节点后新建应用！');
      //   return;
      // }
      this.addFlag = 'add';
      this.title = '新建应用';
      if (key === 'download') {
        console.log(key, 'key')
        this.dialogAddFormDownloadVisible = true
      } else if (key === 'import') {
        this.clickImport()
      } else if (key === 'add') {
        this.dialogVisible = true;
      }
    },

    deleteKeywordTag() {
      this.keywordTag.groupName = '';
      this.keyword = '';
      this.search();
    },
    deleteGroupTag() {
      this.groupTag.groupId = '';
      this.search();
    },
    search() {
      this.$nextTick(() => {
        this.page.pageNum = 0;

        this.keywordTag.groupName = this.keyword;
        this.noMore = false;
        this.load(true);
      })
    },
    loader(initFlag) {
      this.page.pageNum += 1;
      this.loading = true;
      if (this.noMore) return;
      if (this.cType === 'list') {
        appListPage({
          keyword: this.keywordTag.groupName,
          // sceneId: this.groupTag.groupId,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          appStatus: this.appStatus
        }).then((res) => {
          this.page.total = res.data.total;
          this.loading = false;
          this.noMore = !res.data.hasNext;
          if (initFlag) {
            this.appList = [].concat(res.data.list);
          } else {
            this.appList = [].concat(this.appList, res.data.list);
          }
        });
      } else if (this.cType === 'group') {
        appGroupList({
          keyword: this.keywordTag.groupName,
          // sceneId: this.groupTag.groupId,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          appStatus: this.appStatus
        }).then((res) => {
          this.page.total = res.data.total;
          this.loading = false;
          this.noMore = !res.data.hasNext;
          if (initFlag) {
            this.appList = [].concat(res.data.list);
          } else {
            this.appList = [].concat(this.appList, res.data.list);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-margin {
  margin-right: 8px;
}
.no-list-show-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: calc(50% + 48px);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .img-no-list-show {
    height: calc(100% - 80px);
    display: block;
  }
}

.assets-content-list {
  overflow: auto;
  // background: #f3f4fb;
  // border-radius: 8px;
  padding: 0px 0 0 0;
  position: relative;
  // &.bgwhite {
  //   background-color: #fff !important;
  // }
  .list {
    width: 1612px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    margin: 0 auto;
    padding-top: 10px;
    .add-wrap {
      margin-bottom: 20px;
      margin-right: 24px;
      width: 304px;
      height: 304px;
      background: #ffffff;
      border-radius: 4px 4px 0px 0px;
      border: 1px solid #e7e7e7;
      position: relative;
      box-sizing: border-box;
      cursor: pointer;
      .add-btn {
        position: absolute;
        display: block;
        top: 80px;
        width: 64px;
        height: 64px;
        left: 50%;
        margin-left: -32px;
      }
      .add-text {
        position: absolute;
        top: 183px;
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #36a4ff;
      }
    }

  }
  .assets-item {
    margin-bottom: 24px;
    margin-right: 23px;
    &:nth-child(5n) {
      margin-right: 0 !important;
    }
  }
  .assets-item-group {
    margin-bottom: 40px;
    margin-right: 36px;
    &:nth-child(4n) {
      margin-right: 0 !important;
    }
  }
}
.sa-nav {
  margin-bottom: 10px;
}
// .nav-top {
//   background-image: url("../../assets/logo/first-level-bg.png");
//   background-size: cover;
//   background-repeat: no-repeat;
//   background-position: center;
//   padding: 0 8px;
//   border-radius: 0px 0px 8px 8px;
//   position: relative;
//   height: 144px;
// }
.search-box {
  position: relative;
  padding: 0 20px;
  height: 72px;
  background: rgba(255,255,255,0.45);
  border-radius: 4px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.55)) 1 1;
  .icon-search {
    margin-right: 8px;
  }
  .tag-list {
    margin-left: 24px;
    .tag-margin {
      margin-left: 16px;
    }
  }
  .input-search:focus {
  }
  .select-text {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #202020;
  }
  .select-num {
    color: rgba(54, 164, 255, 1);
    margin: 0 4px;
  }
}
.sa-list {
  width: 100%;
  // padding: 0 8px;
}
.sa-checkbox {
  position: absolute;
  bottom: 23px;
  right: 27px;
  &::v-deep {
    .c-checkbox__label {
      display: none;
    }
  }
}
.flex-start-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.flex-between-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer {
  position: relative;
}
.cls-btn-add {
  position: relative;
  padding-right: 34px;
  margin-left: 16px;
}
.dropdown-common-arrow{
  position: absolute;
  margin-left: 8px;
  width: 16px;
  height: 16px;
  background-image: url('~@/assets/imgs/icon-arrow.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transform:rotate(180deg) ;
  transition:transform 0.2s linear;
  &.dropdown-active-arrow{
    transform:rotate(0deg);
    transition:transform 0.2s linear;
  }
}
.icon-change{
  width: 32px;
  height: 32px;
  border-radius: 3px;
  margin-left: 12px;
  cursor: pointer;
}
.change-group{
  margin-left: 32px;
  background: url(~@/assets/imgs/hl-icon-group.svg);
}
.change-list{
  background: url(~@/assets/imgs/hl-icon-list.svg);

}
.change-group-active{
  background: url(~@/assets/imgs/hl-icon-group-active.svg);
}
.change-list-active{
  background: url(~@/assets/imgs/hl-icon-list-active.svg);

}
.mrg-left{
  margin-left: 40px;
}
</style>
<style>
.app-dropdown-add-menu .c-dropdown-menu__item {
  padding: 0 10px;
}
</style>
