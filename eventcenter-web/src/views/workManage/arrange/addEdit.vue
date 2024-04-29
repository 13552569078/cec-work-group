<template>
  <div class="work-manage-addEdit">
    <template>
      <div class="result">
        <el-form
          ref="form"
          :model="form"
          class="result-form"
          label-position="top"
          popper-class="result-form"
          :rules="rules"
        >
          <div>
            <el-form-item label="值班表名称：" prop="name">
              <el-input
                v-model="form.name"
                type="text"
                maxlength="20"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="值班表描述：" prop="name">
              <el-input
                v-model="form.remark"
                maxlength="30"
                show-word-limit
                :rows="5"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </div>
          <span class="diy-table">自定义值班表</span>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="tableRules"
            class="demo-ruleForm"
          >
            <el-table
              class="table"
              :data="form.tcRotaShiftList"
              style="width: 100%"
              align="center"
            >
              <el-table-column type="index" width="50" />
              <el-table-column
                v-for="item in thead"
                :key="item.prop"
                align="left"
                :prop="item.prop"
                :label="item.label"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="`form${scope.$index + 1}.${item.prop}`">
                    <el-input
                      v-model="ruleForm[`form${scope.$index + 1}`][item.prop]"
                      :placeholder="placeholderValue(item.prop)"
                    />
                    <!-- <span v-else>{{ scope.row[item.prop] }}</span> -->
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <el-form-item size="large" class="footer">
            <el-button
              class="comfirm-btn"
              type="primary"
              @click="onSubmit"
            >提交</el-button>
            <el-button class="cancel-btn" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  data() {
    return {
      ruleForm: {
        form1: {},
        form2: {},
        form3: {},
        form4: {},
        form5: {}
      },
      form: {
        tcRotaShiftList: [{}, {}, {}, {}, {}]
      },
      rules: {
        name: [{ required: true, message: '请输入值班表内容', trigger: 'blur' }],
        remark: {
          required: true,
          message: '请输入值班描述',
          trigger: 'blur'
        }
      },
      tableRules: {},
      thead: [
        {
          prop: 'name',
          label: '班次名'
        },
        {
          prop: 'time',
          label: '班次时间'
        },
        {
          prop: 'nameMon',
          label: '周一'
        },
        {
          prop: 'nameTue',
          label: '周二'
        },
        {
          prop: 'nameWed',
          label: '周三'
        },
        {
          prop: 'nameThu',
          label: '周四'
        },
        {
          prop: 'nameFri',
          label: '周五'
        },
        {
          prop: 'nameSat',
          label: '周六'
        },
        {
          prop: 'nameSun',
          label: '周日'
        }
      ]
    }
  },
  computed: {
    type() {
      return this.$route.query?.type || 'add'
    },
    rotaObj() {
      return this.$route.query?.rotaObj || ''
    }
  },
  watch: {
    rotaObj: {
      handler(nVal) {
        if (!nVal) return
        moduleSrv.getRotaInfo({ rotaId: nVal.id }).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.form = {
              name: nVal.name,
              remark: nVal.remark,
              tcRotaShiftList: res.data || []
            }
            this.form.tcRotaShiftList.forEach((item, index) => {
              this.ruleForm[`form${index + 1}`] = item
            })
          }
          const tempArr = this.form.tcRotaShiftList
          const maxIndex = 5 - tempArr.length
          for (let i = 0; i < maxIndex; i++) {
            this.form.tcRotaShiftList.push({})
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    const ruleName = this.thead.map((item) => item.prop)
    const num = [{}, {}, {}, {}, {}]
    ruleName.forEach((item) => {
      num.forEach((numItem, index) => {
        this.tableRules[`form${index + 1}.${item}`] = [
          { validator: this.titleValidate, trigger: 'blur' }
        ]
      })
    })
  },
  methods: {
    // 验证方法
    titleValidate(rule, value, callback) {
      const valueField = rule.field.split('.')[1]
      if (!value) {
        if (valueField === 'time') {
          callback(new Error('请输入班次时间'))
        } else if (valueField === 'name') {
          callback(new Error('请输入班次名称'))
        }
      } else {
        if (valueField === 'time' && value.length > 20) {
          callback(new Error('最长20个字符'))
        } else if (valueField === 'name' && value.length > 10) {
          callback(new Error('最长10个字符'))
        } else if (valueField !== 'name' && valueField !== 'time' && value.length > 50) {
          callback(new Error('最长50个字符'))
        }
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        } else {
          // 对象转成数组
          const settingArr = Object.keys(this.ruleForm).map(key => {
            return this.ruleForm[key] // 把每个对象返回出去生成一个新的数组中相当于0:{id:1}
          })
          const form = this.form
          const rotaVo = {
            name: form.name,
            remark: form.remark,
            // 过滤数组中一个字段都没填的行对象
            tcRotaShiftList: settingArr.filter(
              (item) =>
                !(
                  !item.name &&
                  !item.time &&
                  !item.nameMon &&
                  !item.nameFri &&
                  !item.nameSat &&
                  !item.nameSun &&
                  !item.nameThu &&
                  !item.nameTue &&
                  !item.nameWed
                )
            )
          }
          const verifyRes = rotaVo.tcRotaShiftList.some(
            (item) => !item.name || !item.time
          )
          if (verifyRes) {
            this.$message({
              type: 'error',
              message: '请至少填写一条班次名称和班次时间'
            })
            return false
          }
          let temp
          if (this.type === 'add') {
            temp = moduleSrv.saveRota(rotaVo)
          } else {
            rotaVo.id = this.rotaObj.id
            temp = moduleSrv.updateRota(rotaVo)
          }
          temp
            .then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  type: 'success',
                  message: res.message || '操作成功'
                })
                this.$router.push({ path: '/workManage/arrange' })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message || '操作失败'
                })
              }
            })
            .catch((e) => {
              this.$message({
                type: 'error',
                message: '班次名称和时间为必填'
              })
            })
        }
      })
    },
    reset() {
      this.form = {
        tcRotaShiftList: [{}, {}, {}, {}, {}]
      }
      this.ruleForm = {
        form1: {},
        form2: {},
        form3: {},
        form4: {},
        form5: {}
      }
    },
    // 输入框按提示
    placeholderValue(prop) {
      if (prop === 'name' || prop === 'time') {
        return '请输入'
      } else {
        return '人员姓名'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.work-manage {
  &-addEdit {
    height: 98%;
    display: flex;
    flex-direction: column;
    .result {
      position: relative;
      height: 100%;
      ::v-deep .result-form {
        height: 100%;
        .el-input {
          width: 50%;
          .el-input__suffix {
            background: none;
            border: none;
            .el-input__suffix-inner {
              background: none;
              padding-right: 10px;
            }
          }
        }
        .el-textarea {
          width: 50%;
          .el-textarea__inner {
            height: 150px;
          }
        }
        .footer {
          position: absolute;
          bottom: 0;
          .el-button {
            width: 80px;
            height: 32px;
            border-radius: 2px;
            line-height: 8px;
          }
        }
      }
      .diy-table {
        width: 84px;
        height: 20px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4b4b4b;
        font-weight: 400;
        display: inline-block;
        margin-bottom: 10px;
      }
      .table {
        ::v-deep {
          .el-table__body {
            .el-table__row {
              td:first-child {
                .cell {
                  color: #bdbdbd;
                }
              }
            }
            td {
              background: #f9fafe;
              .el-input__inner {
                width: 144px;
                height: 32px;
              }
            }
            &:hover {
              td {
                background: #f9fafe;
              }
            }
          }
        }
      }
    }
  }
}
</style>
