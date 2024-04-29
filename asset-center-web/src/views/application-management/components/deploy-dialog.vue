<!--/*
* @Author:
* @Desc: 应用部署弹框
* @Date:
*/-->
<template>
  <c-dialog class="dialog-center asset-post" width="800px" title="应用部署" :visible.sync="dialogVisible"
            :before-close="close">
    <div class="tip-info">温馨提示：一个应用只能有一个本版处于部署状态，当前应用已部署版本为{{ lastVersion }}将会在新版本部署后自动取消部署.</div>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close">取消</c-button>
      <c-button type="gradual" size="small" @click="handleOk">确定</c-button>
    </div>
    <div class="content">
      <div>
        <p class="label">流程部署
          <c-tooltip placement="top" popper-class="cls-form-label-tip">
            <span slot="content" class="hahah" v-html="tipFlow">
            </span>
            <i class="cls-icon-info" style="margin-left:4px"></i>
          </c-tooltip>
        </p>
        <c-table :data="processList">
          <c-table-column label="流程名称" prop="assetName" />
          <c-table-column label="旧版本号" prop="oldVersion" />
          <c-table-column label="新版本号" prop="newVersion" />
          <c-table-column label="部署方式" prop="" width="180px">
            <template slot-scope="scope">
              <c-radio-group v-model="scope.row.handleType">
                <c-radio label="0">覆盖</c-radio>
                <c-radio label="1">新增</c-radio>
              </c-radio-group>
            </template>
          </c-table-column>
        </c-table>
      </div>
      <div>
        <p class="label">对象部署
          <c-tooltip placement="top" popper-class="cls-form-label-tip">
            <span slot="content" class="hahah" v-html="tipObj">
            </span>
            <i class="cls-icon-info" style="margin-left:4px"></i>
          </c-tooltip>
        </p>
        <c-table :data="objectList">
          <c-table-column label="对象名称" prop="assetName" />
          <c-table-column label="旧版本号" prop="oldVersion" />
          <c-table-column label="新版本号" prop="newVersion" />
          <c-table-column label="部署方式" prop="" width="180px">
            <template slot-scope="scope">
              <c-radio-group v-model="scope.row.handleType" @change="deployTypeChange(scope.$index, scope.row.handleType)">
                <c-radio label="0">覆盖</c-radio>
                <c-radio label="1">新增</c-radio>
              </c-radio-group>
            </template>
          </c-table-column>
          <c-table-column label="操作" prop="" width="90px">
            <template slot-scope="scope">
              <c-button type="text" :disabled="scope.row.handleType=='1'" @click="clcikMapping(scope.row, scope.$index)">设置映射</c-button>
            </template>
          </c-table-column>
        </c-table>
      </div>
    </div>
    <DeployMappingDialog
      :visible="!!mappingsData"
      :data="mappingsData"
      @ok="deployMappingDialogOk"
      @close="mappingsData=null" />
  </c-dialog>
</template>
<script>
import { appDeploy, appDeployCompare } from '@/api/index'
import DeployMappingDialog from './deploy-mapping-dialog.vue'
export default {
  name: 'DeployDialog',
  components: { DeployMappingDialog },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      dialogVisible: false,
      mappingsData: null,
      currentIndex: 0,
      processList: [],
      objectList: [],
      lastVersion: '',
      tipFlow: `<div>温馨提示：
        <br>· 如果已有流程版本发生变化，则会重新部署。部署类型分为覆盖和新增两种：覆盖部署会将部署前和部署后提交的表单均按照新流程执行审批。而新增部署则会将部署前提交表单按照上一版本执行，部署后提交表单按照新流程执行审批。
        <br>· 注意新版中新增流程不会显示在此处，系统自动做新增部署</div>`,
      tipObj: `<div>温馨提示：
        <br>· 如果已有对象版本发生变化，则会重新部署。对象覆盖部署会将原有对象的表结构按照新版本进行修改，对象新增部署则会新建一张数据表，不会影响现有已部署数据表。
        <br>· 注意新版本中新增对象不会显示在此处，系统自动做新增部署</div>`
    };
  },
  watch: {
    visible(nv) {
      if (nv) {
        this.clickDeploy()
      } else {
        this.dialogVisible = false
        this.processList = []
        this.objectList = []
      }
    }
  },
  methods: {
    clcikMapping(row, index) {
      this.currentIndex = index
      this.mappingsData = row
    },
    async clickDeploy() {
      const data = this.data
      console.log(data, '-----data')
      try {
        await this.$confirm('请确认是否部署应用？', '应用部署', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        });
        const compareRes = await appDeployCompare({ appId: data.id })
        this.lastVersion = compareRes.data.lastVersion || ''
        const processList = compareRes.data.processList || []
        const objectList = compareRes.data.objectList || []
        if (processList.length || objectList.length) {
          this.dialogVisible = this.visible
          this.init(compareRes.data)
        } else {
          // 没有对比数据直接进行部署，不需要设置，不需要弹框
          this.sendData()
        }
      } catch (e) {
        this.close()
        console.error(e)
      }
    },
    init(appDeployCompareData) {
      this.processList = appDeployCompareData.processList.map(d => ({ ...d, handleType: '1' }))
      this.objectList = appDeployCompareData.objectList.map(d => ({ ...d, handleType: '1' }))
    },
    deployTypeChange(index, handleType) {
      if (handleType === '1') {
        this.objectList[index].fieldMappings = null
      }
    },
    deployMappingDialogOk(data) {
      this.objectList[this.currentIndex].fieldMappings = data
      this.mappingsData = null
    },
    handleOk() {
      let noCustomMappings = this.objectList.filter(d => +d.handleType === 0 && !d.fieldMappings)
      if (noCustomMappings && noCustomMappings.length) {
        noCustomMappings = noCustomMappings.map(d => d.assetName)
        this.$message.warning(`${noCustomMappings.join('、')} 没有设置映射`)
        return
      }
      const customMappings = [...this.processList, ...this.objectList]
      this.sendData(customMappings)
    },
    async sendData(customMappings) {
      try {
        const params = {
          appCode: this.data.appCode,
          version: this.data.version,
          customMappings
        }
        console.log(params, '------appDeploy')
        await appDeploy(params)
        this.$emit('ok')
      } catch (e) {
        if (!this.dialogVisible) {
          this.close()
        }
        // e
      }
    },
    close() {
      this.$emit('close')
    }
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables.scss';
.content {
  max-height: 500px;
  overflow: auto;
}
.tip-info {
  position: relative;
  padding-left: 20px;
  height: 54px;
  line-height: 54px;
  background: #EBF9FF;
  border: 1px dashed $primaryColor;
}
.label {
  margin: 20px 0 10px 0;
  display: flex;
  align-items: center;
}
</style>
