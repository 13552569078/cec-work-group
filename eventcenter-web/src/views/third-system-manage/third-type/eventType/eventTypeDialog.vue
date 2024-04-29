<template>
  <cestc-dialog v-bind="$attrs" :title="matchTitle" width="666px" v-on="$listeners" @confirm="_confirm">
    <el-form ref="form" :model="form" :rules="rules" label-position="top" class="event-type-class w-full">
      <el-row :gutter="10">
        <el-col :span="$attrs.editingdata && form.parentId!=='-1'?12:24">
          <el-form-item label="系统名称" prop="sourceSystemCode">
            <el-select v-model="form.sourceSystemCode" placeholder="请选择" :disabled="mode !== 'add'" class="w-full">
              <el-option
                v-for="(item, index) in getThirdSystemList.filter(item => item.platformStatus)"
                :key="item.id || index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="$attrs.editingdata && form.parentId!=='-1'" :span="12">
          <el-form-item :label="($attrs.editingdata && form.parentId!=='-1')?'上级事件类型':''">
            <el-input v-model="form.parentName" disabled class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事件类型名称" prop="name">
            <el-input v-model="form.name" maxlength="20" placeholder="请输入类型名称" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事件类型编码" prop="code">
            <el-input v-model="form.code" maxlength="15" placeholder="请输入类型编码" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事件类型描述" prop="detail" class="item-row">
            <el-input
              v-model="form.detail"
              type="textarea"
              maxlength="1000"
              :rows="5"
              placeholder="请输入类型描述"
              show-word-limit
              class="w-full"
            />
          </el-form-item></el-col>
      </el-row>
    </el-form>
  </cestc-dialog>
</template>
<script>
// import { validNumber } from '@/utils/validate'
import moduleSrv from '@/api/dispatchWhh'
import { mapGetters } from 'vuex'

/* const valiSortBy = (rule, value, callback) => {
  if (validNumber(value)) {
    // 数字，且在 1~999 之间
    if (/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(value)) {
      callback()
    } else {
      callback(new Error('排序需要的数字在 1~999'))
    }
  } else {
    callback(new Error('排序需要是数字'))
  }
} */

export default {
  name: 'EventTypeDialog',
  props: {
    selectedThirdSystem: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      form: {
        status: 0 // 默认显示
      },
      cascaderId: '-1', // 级联选择器选择的值, 默认值为无
      cascaderOptions: [],
      rules: {
        sourceSystemCode: [
          { required: true, message: '平台系统不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '事件类型名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '事件类型编码不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '事件类型状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['getThirdSystemList']),
    mode() {
      return this.$attrs.mode
    },
    matchTitle() {
      const key = this.mode
      const obj = {
        add: '新增事件类型',
        addSub: '新增子类',
        edit: '编辑事件类型'
      }
      return obj[key]
    }
  },

  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) { // 关闭
        this.$refs['form'].resetFields()
        this.form = {
          status: 0 // 默认显示
        }
      } else {
        // 开启
        this.updateForm()
      }
    }
  },
  methods: {
    // 确认按钮触发
    _confirm() {
      this.$refs['form'].validate((valid) => {
        const mode = this.mode
        if (valid) {
          // 校验成功, 区分是新增还是编辑
          // 提交的时候如果发现 parentId = -1 , 需要对齐清空
          const form = JSON.parse(JSON.stringify(this.form))
          if (form.parentId === '-1') {
            form.parentId = ''
          }
          if (mode === 'edit') {
            // 编辑
            moduleSrv.updateThirdType(form).then((res) => {
              if (res.code === 0) {
                this.$emit('cancle')
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          } else {
            moduleSrv[form.parentId ? 'addThirdTypeChild' : 'addThirdTypeLevelOne'](form).then((res) => {
              if (res.code === 0) {
                this.$emit('cancle')
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    // 弹窗打开的操作
    async updateForm() {
      const editData = this.$attrs.editingdata
      // 判断是新增，还是新增子类，还是编辑 子级
      if (this.mode === 'addSub') {
        // 把上级事件类型固定
        this.$set(this.form, 'parentId', editData.id)
        this.$set(this.form, 'parentName', editData.name)
        this.$set(this.form, 'sourceSystemCode', editData.sourceSystemCode)
      } else if (this.mode === 'add') { // 父级
        // 新增的时候，给级联添加一个根节点，id:'', eventTypeName: '无'
        this.$set(this.form, 'parentId', '-1')
        this.$set(this.form, 'sourceSystemCode', this.selectedThirdSystem.platformCode || editData.platformSrc)
      } else {
        // Object.assign(this.form, editData, { parentId: editData.parentId ? editData.parentId : '-1' })
        const { data } = await moduleSrv.getThirdTypeById({ id: editData.id })
        this.form = { ...data, parentId: data.parentId ? editData.parentId : '-1' }
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
</style>
