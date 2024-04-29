<!--
* @Author: 新增联系人
* @Change: 更改者
* @Date: 2021-12-22
* @Description: 功能描述
-->
<template>
  <el-dialog :close-on-click-modal="false" class="add-contact" title="新建联系人" :visible.sync="isShow" width="682px">
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <div class="row">
        <div class="col" :span="12">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="linkmanName">
            <el-input v-model="form.linkmanName" placeholder="请输入姓名" />
          </el-form-item>
        </div>
        <div class="col" :span="12">
          <el-form-item label="分组" :label-width="formLabelWidth" prop="groupId">
            <el-select v-model="form.groupId" placeholder="默认分组" class="select">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              />
              <!-- <el-option label="区域二" value="beijing" /> -->
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <el-form-item label="联系方式" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" placeholder="请输入手机号" />
          </el-form-item>
        </div>
        <div class="col">
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </div>
      </div>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input
          v-model="form.remark"
          type="textarea"
          maxlength="30"
          show-word-limit
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="isShow = false">取 消</el-button>
      <el-button class="comfirm-btn" type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'AddContact',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        email: '',
        groupId: '',
        id: '',
        linkmanName: '',
        mobile: '',
        remark: ''
      },
      formLabelWidth: '80px',
      rules: {
        linkmanName: [{ required: true, message: '请输入姓名', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        email: [{ max: 50, message: '最长50个字符', trigger: 'blur' }],
        mobile: [{ max: 20, message: '最长20个字符', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择分组', trigger: 'blur' }]
      },
      option: []
    }
  },
  computed: {
    isShow: {
      set(val) {
        this.$emit('update:visible', val)
      },
      get() {
        return this.visible
      }
    }
  },
  watch: {
    editObj: {
      handler(nVal) {
        if (!nVal?.id) return
        this.form = JSON.parse(JSON.stringify(nVal)) || {}
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.getAllGroup()
  },
  methods: {
    getAllGroup() {
      moduleSrv.getAllGroup({}).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.option = res.data
        }
      })
    },
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-contact {
  .el-dialog__title {
    color: #202020;
  }
  .el-form-item {
    .el-input {
      border-color: #e7e7e7;
    }
  }
}
.row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .col {
    width: 296px;
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
}
.dialog-footer {
  .el-button {
    width: 80px;
    height: 32px;
    border-radius: 2px;
  }
}
</style>
