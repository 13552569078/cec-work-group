<template>
  <div v-loading="loading" class="accrua-set">
    <div :class="`set-form set-form-${isDetail}`">
      <el-form
        ref="formRef"
        :model="form"
        :rules="isDetail ? {} : rules"
        label-position="top"
      >
        <common-title title="设置权责清单" />
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="事项类型" :required="!isDetail">
              <el-input v-if="!isDetail" v-model="eventClass" disabled />
              <span v-else class="detail-span">{{ eventClass || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <common-title title="任务表单配置" />
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-if="!isDetail" v-model="form.taskType" placeholder="请选择" @change="taskChange">
                <el-option
                  v-for="(item, index) in oneTaskTypeOptions"
                  :key="item.id || index"
                  :label="item.dictDesc"
                  :value="item.dictValue"
                />
              </el-select>
              <span v-else class="detail-span">{{ detailObj.taskTypeName || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="表单关联" prop="formId" class="form-preview-item">
              <span v-if="form.formId || detailObj.formId" class="form-preivew" @click.stop="preiviewForm">预览</span>
              <el-select v-if="!isDetail" v-model="form.formId" placeholder="请选择">
                <el-option
                  v-for="(item, index) in formConenectOptions"
                  :key="item.id || index"
                  :label="item.dictDesc"
                  :value="item.dictValue"
                />
              </el-select>
              <span v-else class="detail-span">{{ detailObj.formName || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <common-title title="任务对象配置" />
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="是否自动派发" prop="isAuto" class="form-preview-item">
              <span v-if="form.isAuto === 1" class="form-tip">提示:任务生成后会立即派发</span>
              <el-radio-group v-if="!isDetail" v-model="form.isAuto">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <span v-else class="detail-span">{{ detailObj.isAutoStr || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="是否需要审核" prop="isVerify">
              <el-radio-group v-if="!isDetail" v-model="form.isVerify">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <span v-else class="detail-span">{{ detailObj.isVerifyStr || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="主管方" prop="masterOrgRole" style="margin-top: 12px;">
            <org-role-select v-if="orgLoaded && !isDetail" key="zgorgrole" :options="orgOptions" :org-map="orgMap" is-single :default-val="deufaltOrgRole" @change="masterOrgRoleChange" />
            <span v-if="isDetail" class="detail-span">
              <span v-if="detailObj.masterOrgRole.id">{{ detailObj.masterOrgRole.name || '-' }} / {{ detailObj.masterOrgRole.roleName || '-' }}</span>
              <span v-else>--</span>
            </span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="处置方配置" prop="handleOrgRoleList" style="margin-top: 12px;">
            <org-role-select v-if="orgLoaded && !isDetail" key="czorgrole" :options="czOrgOptions" :org-map="czOrgMap" :default-val="deufaltczOrgRole" @change="handleOrgRoleListChange" />
            <div v-if="isDetail" class="detail-div">
              <span v-for="(item,index) in detailObj.handleOrgRoleList" :key="index" class="detail-span-bk">
                <span v-if="item.id">{{ item.name || '-' }} / {{ item.roleName || '-' }}</span>
                <span v-else>--</span>
              </span>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="form.isAuto === 0 || detailObj.isAuto === 0" style="margin-top: 12px;" label="协办方配置" prop="slaveOrgRoleList">
            <org-role-select v-if="orgLoaded && !isDetail" key="xborgrole" :default-val="deufaltxbOrgRole" :options="xbOrgOptions" :org-map="xbOrgMap" @change="slaveOrgRoleListChange" />
            <div v-if="isDetail" class="detail-div">
              <span v-for="(item,index) in detailObj.slaveOrgRoleList" :key="index" class="detail-span detail-span-bk">
                <span v-if="item.id">{{ item.name || '-' }} / {{ item.roleName || '-' }}</span>
                <span v-else>--</span>
              </span>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div v-if="!isDetail" class="foot-btns">
      <el-button type="primary" @click.stop="_confirm">确定</el-button>
      <el-button @click.stop="_cancle">取消</el-button>
    </div>
    <div v-if="isDetail" class="foot-btns">
      <el-button @click.stop="_cancle">返回</el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
import orgRoleSelect from './orgRoleSelect.vue'
export default {
  name: 'EventcenterWebAccruaSet',
  components: { orgRoleSelect },
  data() {
    return {
      orgOptions: [],
      orgMap: {},
      deufaltOrgRole: {},
      czOrgOptions: [],
      czOrgMap: {},
      deufaltczOrgRole: [],
      xbOrgOptions: [],
      xbOrgMap: {},
      deufaltxbOrgRole: [],
      orgLoaded: false,
      loading: false,
      form: {
        taskType: '',
        formId: '',
        isAuto: '',
        isVerify: '',
        masterOrgRole: {},
        handleOrgRoleList: [],
        slaveOrgRoleList: []
      },

      rules: {
        taskType: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        formId: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        isAuto: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        isVerify: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        masterOrgRole: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ],
        handleOrgRoleList: [
          { required: true, message: '不能为空', trigger: ['blur'] }
        ]
        // slaveOrgRoleList: [
        //   { required: true, message: '不能为空', trigger: ['blur'] }
        // ]
      },
      detailObj: {}
    }
  },
  computed: {
    taskTypeOptions() {
      return this.$store.getters.getBsDictsByType('duty_task_type')
    },
    oneTaskTypeOptions() {
      return this.taskTypeOptions.filter(item => item.parentValue === '0')
    },
    formConenectOptions() {
      if (this.form.taskType) {
        return this.taskTypeOptions.filter(item => item.parentValue === this.form.taskType)
      }
      return []
    },
    dutyDeptListMap() {
      const map = new Map()
      this.dutyDeptList.forEach((item) => {
        map.set(item.id, item)
      })
      return map
    },
    // 主处置部门可以不选角色，从处置部门必须有角色
    // 从处置部门，数据取自当前处置级别的children, 且已经选定的主不可以再次选中
    dutyRoleLoaded() {
      return this.dutyDeptListLoaded && this.rolesListLoaded
    },
    // 事件类型
    eventClass() {
      const { eventLarge, eventMiddle, eventTypeName } = this.$route.query || {}
      return `${eventLarge}/${eventMiddle}/${eventTypeName}`
    },
    isDetail() {
      return this.$route.query.mode === 'view'
    }
  },
  async created() {
    try {
      this.loading = true
      await this.getdutyDetail()
      if (!this.isDetail) this.getAllOrgTree()
    } finally {
      this.loading = false
    }
  },
  methods: {
    taskChange() {
      this.form.formId = ''
    },
    masterOrgRoleChange(orgRoles) {
      if (orgRoles.length) {
        this.form.masterOrgRole = {
          id: orgRoles[0].org.id,
          name: orgRoles[0].org.name,
          fxOrgId: orgRoles[0].org.fxOrgId,
          roleId: orgRoles[0].role.id,
          roleName: orgRoles[0].role.name,
          fxRoleId: orgRoles[0].role.fxRoleId
        }
      }
    },
    handleOrgRoleListChange(orgRoles) {
      this.form.handleOrgRoleList = orgRoles.map(({ org = {}, role = {}}) => {
        return {
          id: org.id,
          name: org.name,
          fxOrgId: org.fxOrgId,
          roleId: role.id,
          roleName: role.name,
          fxRoleId: role.fxRoleId
        }
      })
    },
    slaveOrgRoleListChange(orgRoles) {
      this.form.slaveOrgRoleList = orgRoles.map(({ org = {}, role = {}}) => {
        return {
          id: org.id,
          name: org.name,
          fxOrgId: org.fxOrgId,
          roleId: role.id,
          roleName: role.name,
          fxRoleId: role.fxRoleId
        }
      })
    },
    loopOrg(arr, orgMap) {
      arr.forEach(item => {
        item.check = false
        item.indeterminate = false
        item.disabled = false
        orgMap[item.id] = item
        if (item?.children?.length) this.loopOrg(item.children, orgMap)
      })
    },
    getAllOrgTree() {
      moduleSrv.getAllOrgTree({}).then(res => {
        const arr = res.data || []
        const orgMap = {}
        this.loopOrg(arr, orgMap)
        this.orgOptions = arr
        this.orgMap = orgMap

        const czArr = deepClone(arr)
        const czOrgMap = {}
        this.loopOrg(czArr, czOrgMap)
        this.czOrgOptions = czArr
        this.czOrgMap = czOrgMap

        const xbArr = deepClone(arr)
        const xbOrgMap = {}
        this.loopOrg(xbArr, xbOrgMap)
        this.xbOrgOptions = xbArr
        this.xbOrgMap = xbOrgMap
        this.orgLoaded = true
        this.loading = false
      }).catch(() => {
        this.orgLoaded = true
        this.loading = false
      })
    },
    // 详情数据
    async getdutyDetail() {
      await moduleSrv
        .getdutyDetail({ eventTypeId: this.$route.query.eventTypeId })
        .then((res) => {
          if (res.code === SUCCESS_CODE) {
            const obj = res.data || {}
            if (!this.isDetail) {
              this.form.taskType = obj.taskType || ''
              this.form.formId = obj.formId || ''
              this.form.isVerify = obj.isVerify || 0
              this.form.isAuto = obj.isAuto || 0
              this.form.masterOrgRole = obj.masterOrgRole || {}
              this.form.handleOrgRoleList = obj.handleOrgRoleList || []
              this.form.slaveOrgRoleList = obj.slaveOrgRoleList || []

              this.deufaltOrgRole = obj.masterOrgRole || {}
              this.deufaltczOrgRole = obj.handleOrgRoleList || []
              this.deufaltxbOrgRole = obj.slaveOrgRoleList || []
            } else {
              obj.isVerifyStr = obj.isVerify === 1 ? '是' : '否'
              obj.isAutoStr = obj.isAuto === 1 ? '是' : '否'
              obj.masterOrgRole = obj.masterOrgRole || {}
              obj.handleOrgRoleList = obj.handleOrgRoleList || []
              obj.slaveOrgRoleList = obj.slaveOrgRoleList || []
              this.detailObj = obj
            }
          }
        })
    },
    _confirm() {
      this.$refs.formRef.validate((valiadte) => {
        if (valiadte) {
          const params = { ...this.form, eventTypeId: this.$route.query.eventTypeId }
          if (params.isAuto === 1) {
            params.slaveOrgRoleList = []
          }
          moduleSrv.saveDuty(params).then(res => {
            if (res.code === SUCCESS_CODE) {
              this.$message.success('设置成功')
              this._cancle()
            }
          })
        }
      })
    },
    _cancle() {
      this.$router.go(-1)
    },
    preiviewForm() {
      const formId = this.isDetail ? this.detailObj.formId : this.form.formId
      window.open(`${window.origin}/one-form-pc/#/oneform/show/${formId}?${localStorage.getItem('token')}`, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.accrua-set {
  height: 100%;
  background: #fff;
  padding: 20px;
  overflow-y: hidden;
  position: relative;
  .set-form {
    height: calc(100% - 64px);
    overflow-y: auto;
    overflow-x: hidden;

    ::v-deep{
      .event-title {
        margin-bottom:20px;
        margin-top: 20px;
        &:first-child{
          margin-top: 0px;
        }
      }
      .form-preview-item  {
        position: relative;
        .form-preivew {
          position: absolute;
          color: #36a4ff;
          top: -37px;
          left: 76px;
          cursor: pointer;
        }
        .form-tip {
          position: absolute;
          top: -37px;
          left: 106px;
          color: #8A8A8A;
          background:#f2f6ff;
          padding: 0 6px;
          border-radius: 4px;
        }
      }

      .detail-span {
        color: #4b4b4b;
        line-height: 20px;
        &-bk{
          display: inline-block;
          word-break: none;
          margin-right: 16px;
          border-radius: 2px;
          padding: 4px 6px;
          ::after {
            content: ";";
          }
        }
      }
    }
    &-true{
        ::v-deep {
          .el-col-9 {
            width: 600px;
          }
          .event-title:not(:nth-of-type(1)) {
            margin-top: 4px;
          }
          .el-form-item {
            .el-form-item__label {
              color: #8A8A8A;
            }
            margin-bottom: 20px;
          }
        }
        ::v-deep .el-form-item__content{
          line-height: 24px;
          position: relative;
        }
        .form-preview-item .form-preivew {
          position: absolute;
          color: #36a4ff;
          top: -33px;
          left: 76px;
          cursor: pointer;
        }
      }
  }
  .el-select,.el-cascader{
    width: 100%;
  }
  .foot-btns {
    position: absolute;
    height: 64px;
    width: 100%;
    bottom: 0;
    left: 0;
    box-shadow: 0px -2px 7px 0px rgba(0,0,0,0.06);
    background: #fff;
    z-index: 9;
    padding: 16px 20px;
  }
}
</style>
