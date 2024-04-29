<!--
 * @description 新增、编辑职能部门
 * @date 2023-12-02
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="640px"
    top="10vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item v-if="form.pidName" label="上级职能部门" prop="pidName">
        <el-input
          v-model="form.pidName"
          placeholder="请输入内容"
          disabled
        />
      </el-form-item>
      <el-form-item label="职能部门名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入内容"
          maxlength="20"
        />
      </el-form-item>
      <!-- 不可以跨级，编辑的时候要禁用 -->
      <el-form-item label="部门级别" prop="deptLevel">
        <el-select
          v-model="form.deptLevel"
          placeholder="请选择"
          :disabled="mode === 'edit' || !deptLevelEditFlag"
        >
          <el-option
            v-for="(item, index) in eventLevelOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="立即启用" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
/* eslint-disable */
import moduleSrv from '@/api/dispatch';
import { SUCCESS_CODE } from '@/constants';

export default {
  name: 'Dialog',
  props: {
    echoForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        state: 1
      },
      loading: false, // 按钮是否可点击
      deptLevelEditFlag: true, 
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        deptLevel: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    orgTypeOptions() {
      return this.$store.getters.getBsDictsByType('org_type')
    },
    eventLevelOptions() {
      return this.orgTypeOptions.filter((item) => item.parentValue === '0')
    },
    mode() {
      return this.$attrs.mode || 'add';
    },
    matchTitle() {
      const obj = {
        add0: '新增一级部门',
        edit0: '编辑一级部门',
        add: '新增',
        edit: '编辑',
      };
      return obj[this.mode];
    },

  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': {
      // immediate: true,
      async handler(val) {
        await this.$nextTick()
        if (!val) {
          // 关闭
          this.$refs?.formRef.resetFields();
          this.form = {};
        } else {
          this.echo()
        }
      },
    },
  },
  methods: {
    _confirm() {
      // 区分是保存、还是提交
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          if (this.loading) return
          this.loading = true
          const params = { ...this.form };
          if (!params.pid) {
            params.pid = 0
          }
          let _handle;
          if (['add0', 'add'].includes(this.mode)) {
            _handle = moduleSrv.addDutyDept;
          } else {
            _handle = moduleSrv.updateDutyDept;
          }
          _handle(params).then((res) => {
            if (res.code === SUCCESS_CODE) {
              this.$message({
                message: '操作成功！',
                type: 'success',
              });
              this._cancle();
            } else {
              this.$message({
                message: res.message || '操作失败！',
                type: 'error',
              });
            }
          }).finally(() => {
            this.loading = false
          });
        }
      });
    },

    // 表单回填赋值
    echo() {
      Object.keys(this.echoForm).forEach(key => {
        this.$set(this.form, key, this.echoForm[key])
      })
      if (!this.form?.hasOwnProperty('state')) {
        this.$set(this.form, 'state', 1)
      }
      this.deptLevelEditFlag = true
      // 如果一级部门、且编辑模式、且有子级不可以编辑
      if (this.mode === 'edit0' && this.echoForm.pid === 0 && this.echoForm.haveChild) {
        this.deptLevelEditFlag = false
      }
      // 新增的子部门的部门等级只能为下一级，不可以跨级
      if (this.echoForm.pidDeptLevel && this.mode === 'add') {
        switch (this.echoForm.pidDeptLevel) {
          case '03':
            this.$set(this.form, 'deptLevel', '04')
            this.deptLevelEditFlag = false
            break;
          case '04':
            this.$set(this.form, 'deptLevel', '05')
            this.deptLevelEditFlag = false
            break;
          case '05':
            this.$set(this.form, 'deptLevel', '06')
            this.deptLevelEditFlag = false
            break;
          case '06':
            this.$set(this.form, 'deptLevel', '07')
            this.deptLevelEditFlag = false
            break;
        
          default:
            this.deptLevelEditFlag = true
            break;
        }
      }
    },

    // 取消、关闭弹窗
    _cancle() {
      this.$emit('reflash')
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form {
  .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }
}
.content-wrapper {
  display: flex;
  .map-wrapper {
    flex: 0 0 800px;
    border-left: 1px solid #bdbdbd;
    margin: 20px;
    position: relative;
    .map-action {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 2000;
      .el-input {
        width: 200px;
      }
      ::v-deep .el-input-group__append {
        width: 32px;
        height: 32px;
        background: #f9fafe;
        border-radius: 0px 2px 2px 0px;
        border: 1px solid #e7e7e7;
        border-left: none;
        padding: 0;
        text-align: center;
        cursor: pointer;
        .img {
          width: 16px;
          height: 16px;
        }
      }
    }
    #panel {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 2000;
      max-width: 50%;
      ::v-deep {
        .amap_lib_placeSearch .amap_lib_placeSearch_list {
          padding-right: 15px;
        }
      }
    }
    .el-icon-close {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 2100;
      font-size: 20px;
      cursor: pointer;
    }
    #map-address {
      width: 100%;
      height: 100%;
    }
  }
}
.type-in-class {
  &.view-map {
    width: calc(100% - 800px);
  }
  .cestc-upload {
    max-width: 600px;
  }
  .el-form-item {
    width: calc(50% - 5px);
    margin-right: 10px;
    .el-cascader,
    .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }
    &:nth-child(2n) {
      width: calc(50% - 5px);
      margin-right: 0;
    }
    &.item-row {
      width: 100%;
    }
    & .eventAddress {
      display: flex;
      align-items: center;
      .el-icon-map-location {
        font-size: 20px;
        margin-left: 16px;
        cursor: pointer;
      }
    }
    .upload-trigger {
      display: flex;
    }
    .upload_tips {
      cursor: initial;
      color: #bdbdbd;
    }
    .el-upload-list {
      display: flex;
    }
  }
}
</style>
