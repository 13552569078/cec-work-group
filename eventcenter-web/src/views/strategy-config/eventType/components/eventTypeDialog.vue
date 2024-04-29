<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="666px"
    v-on="$listeners"
    @confirm="_confirm"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      class="event-type-class"
    >
      <el-form-item v-if="mode==='addSub'" label="父级类型" prop="parentIs">
        <el-input v-model="form.parentName" :disabled="true" />
      </el-form-item>
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入类型名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="类型编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入类型名称" :disabled="(mode==='edit' || mode==='editSub')" />
      </el-form-item>
      <el-form-item v-if="mode==='add' || mode==='edit'" label="是否联动指挥事项" prop="dispatchDeal">
        <el-radio-group v-model="form.dispatchDeal">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否叶子节点" prop="leafPoint">
        <el-radio-group v-model="form.leafPoint" :disabled="form.haveChild">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.leafPoint == 1" label="业务分类" prop="busiType">
        <el-select v-model="form.busiType" :disabled="form.dispatchDeal == 1">
          <el-option
            v-for="item in eventTypeBusiTypeOptions"
            :key="item.dictValue"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import eventTypeModuleSrv from '@/api/eventType'
import { pick } from 'lodash'

const apiMap = {
  'add': 'postAddLevelOne',
  'addSub': 'postAddChild',
  'edit': 'posteditEventType',
  'editSub': 'posteditEventType'
}

export default {
  name: 'EventTypeDialog',
  data() {
    const checkParentId = (rule, value, callback) => {
      if (!this.form.parentId) {
        return callback(new Error('上级事件类型不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        code: '',
        dispatchDeal: 0,
        leafPoint: 0, // 默认非叶子节点
        busiType: ''
      },
      rules: {
        parentId: [{ validator: checkParentId }],
        name: [
          { required: true, message: '类型名称可以由中文、数字以及字母组成，长度在2-20个字符，可修改', trigger: 'blur' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9-_]{2,20}$/, message: '类型名称可以由中文、数字以及字母组成，长度在2-20个字符，可修改', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入类型编码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, message: '数字和字母、特殊符号', trigger: 'blur' }
        ],
        dispatchDeal: [
          { required: true, message: '不允许为空', trigger: 'blur' }
        ],
        leafPoint: [
          { required: true, message: '不允许为空', trigger: 'blur' }
        ],
        busiType: [
          { required: true, message: '不允许为空', trigger: 'blur' }
        ]
      },
      businenssTypeOptions: []
    }
  },
  computed: {
    mode() {
      return this.$attrs.mode
    },
    matchTitle() {
      const key = this.mode
      const obj = {
        add: '新增一级分类',
        addSub: '新增子类',
        edit: '修改事件类型',
        editSub: '修改事件类型'
      }
      return obj[key]
    },
    eventTypeBusiTypeOptions() {
      return this.$store.getters.getBsDictsByType('event_type_busi_type')
    },
    speType() {
      return this.$route.query.speType || ''
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': async function(val) {
      if (!val) {
        this.$refs['form'].resetFields()
      } else {
        this.updateForm()
      }
    },
    // 联动指挥-叶子结点必须是监控事件
    'form.dispatchDeal'(val) {
      if (val === 1 && this.form.leafPoint === 1) this.form.busiType = '1'
    }
  },
  methods: {
    // 确认按钮触发
    async _confirm() {
      await this.$refs['form'].validate()
      const params = { ... this.form }
      // 非叶子结点不传busiType
      if (params.leafPoint === 0) params.busiType = ''
      const { data } = await eventTypeModuleSrv[apiMap[this.mode]](['add', 'addSub'].includes(this.mode) ? params : pick(params, 'id', 'leafPoint', 'name', 'dispatchDeal', 'busiType'))
      // 处理叶子节点配置跳转
      this.form.leafPoint ? this.$confirm('<div class="main-value">是否需要编辑事件类型？</div><div class="sub-value">稍后也可在“事件类型管理-编辑”中配置。</div>', '事件类型设置提醒', {
        confirmButtonText: '立即设置',
        cancelButtonText: '稍后设置',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$emit('cancle', true)
        // 编辑 叶子节点 也需要传递id
        this.$router.push({
          name: 'eventTypeLeaf',
          query: {
            speType: this.speType ? this.speType : '',
            id: ['edit', 'editSub'].includes(this.mode) ? this.form.id : data
          }
        })
      }).catch(() => {
        this.$emit('cancle', true)
      }) : this.$emit('cancle', true)
    },
    // 弹窗打开的操作
    async updateForm() {
      const editData = this.$attrs.editingdata
      if (this.mode === 'add') {
        // 生成事件类型
        const { data } = await eventTypeModuleSrv.postGenerateEventTypeCode()
        this.form = {
          name: '',
          dispatchDeal: 0,
          leafPoint: 0,
          code: data,
          busiType: this.speType ? '1' : '1' // 默认都是监管事件--后面可以根据条件修改
        }
      }
      if (this.mode === 'addSub') {
        // 生成事件类型
        const { data } = await eventTypeModuleSrv.postGenerateEventTypeCode()
        this.form = {
          name: '',
          dispatchDeal: 0,
          leafPoint: 0,
          code: data,
          busiType: editData.busiType || (this.speType ? '1' : '1') // 默认都是监管事件--后面可以根据条件修改
        }
        Object.assign(this.form, editData)
        if (this.form.dispatchDeal === 1) this.form.busiType = '1'
      }
      if (['edit', 'editSub'].includes(this.mode)) {
        Object.assign(this.form, editData)
        if (this.form.dispatchDeal === 1) this.form.busiType = '1'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.event-type-class {
  .el-select {
    width: 100%;
  }
  .el-form-item {
    .el-cascader {
      // 修复上级事件类型样式问题
      width: 100%;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
    &.item-row {
      width: 100%;
    }
  }
}
::v-deep {
  .el-input__suffix {
    width:40px;
  }
}
</style>
