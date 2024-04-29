<!--
 * @description 策略配置弹窗
 * @date 2020-08-18
 * @author lism
-->
<template>
  <cestc-dialog
    v-loading="loading"
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
      class="scope-config-form-class"
    >
      <el-form-item class="width50" label="选择角色" prop="subjectValue">
        <cestc-cascader
          v-model="form.subjectValue"
          class="width100"
          filterable
          separator="-"
          :props="{ checkStrictly: false, emitPath: false, children: 'roleVOList', label: 'name', value: 'id', multiple: false }"
          :options="groupRoleTreeList"
          placeholder=""
          :disabled="mode==='edit'"
        />
      </el-form-item>
      <el-form-item label="范围类型" prop="scopeType">
        <el-radio-group v-model="form.scopeType" :disabled="mode==='edit'">
          <el-radio :label="0">组织</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="width50" label="范围值" prop="scopeValue">
        <cestc-cascader
          :key="cascaderKey"
          ref="cascader"
          v-model="form.scopeValue"
          class="width100"
          filterable
          separator="-"
          :props="{
            checkStrictly: true,
            multiple: true,
            emitPath: true,
            children: 'children',
            label: 'name',
            value: 'id',
          }"
          :options="cascaderOptions"
          placeholder="请选择"
        >
          <template slot-scope="{ node, data }">
            <div @click="() =>_handleClick(node, data)">
              <span>{{ data.name }}</span>
              <span v-if="!data.leaf" style="position: absolute; right: 6px; top:0">
                <i v-if="data.isLoading" class="el-icon-loading" />
                <i v-else class="el-icon-arrow-right" />
              </span>
            </div>
          </template>
        </cestc-cascader>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { flattenArray } from '@/utils'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'DisScopeConfigDialog',
  data() {
    return {
      form: {},
      groupRoleTreeList: [],
      rules: {
        subjectValue: [
          {
            required: true,
            message: '角色不能为空',
            trigger: 'blur'
          }
        ],
        range: [
          {
            required: true,
            message: '范围类型不能为空',
            trigger: 'blur'
          }
        ],
        scopeValue: [
          {
            required: true,
            message: '范围值不能为空',
            trigger: 'blur'
          }
        ]
      },
      cascaderOptions: [],
      loading: false,
      cascaderKey: 0
    }
  },
  computed: {
    // 弹窗类型
    mode() {
      return this.$attrs.mode
    },
    matchTitle() {
      const key = this.mode || 'add'
      const obj = {
        add: '新增配置',
        edit: '编辑配置'
      }
      return obj[key]
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (val) {
        this.getGroupRoleList()
        this.updateForm()
      } else {
        this.reset()
      }
    }
  },
  methods: {
    /**
     * 加载当前节点的子节点
     * @param node
     * @private
     */
    _handleClick(node) {
      const { data: { leaf = true, id, children = [] }} = node
      if (!leaf && !children.length) {
        const params = { id }
        node.data.isLoading = true
        moduleSrv.getChildrenOrgList(params)
          .then((res) => {
            if (res.code === 0) {
              const result = res?.data.map((item) => {
                const res = {
                  id: item.id,
                  pid: item.pid,
                  name: item.name,
                  leaf: !item.haveChild,
                  isLoading: false
                }
                if (!res.leaf) res.children = []
                return res
              })
              node.data.children = result
            }
          })
          .catch((e) => {
            console.log(e)
          }).finally(() => {
            node.data.isLoading = false
          })
      }
    },
    getChildren(data, result, pid) {
      for (const item of data) {
        if (item.pid === pid) {
          const newItem = { ...item }
          if (!item.leaf) newItem.children = []
          result.push(newItem)
          this.getChildren(data, newItem.children, item.id)
        }
      }
    },
    arrayToTree(data, pid = 0) {
      const result = []
      this.getChildren(data, result, pid)
      return result
    },
    getCascaderOptions(scopeValue = []) {
      const tempData = []
      // 根节点的id=0，按顺序由小到大请求
      const flatId = [0, ...new Set(flattenArray(scopeValue))].sort((a, b) => a - b)
      let index = 0
      return new Promise((resolve) => {
        flatId.forEach((id) => {
          const params = { id }
          moduleSrv.getChildrenOrgList(params)
            .then((res) => {
              if (res.code === 0) {
                const result = res?.data.map((item) => {
                  const res = {
                    id: item.id,
                    pid: item.pid,
                    name: item.name,
                    leaf: !item.haveChild,
                    isLoading: false
                  }
                  if (!res.leaf) res.children = []
                  return res
                })
                result.length && tempData.push(...result)
                // 请求完成顺序不一定按照发送顺序，按照index计算是否完成
                if (++index === flatId.length) {
                  const data = this.arrayToTree(tempData, 0)
                  resolve(data)
                }
              }
            })
            .catch((e) => {
              console.log(e)
            })
        })
      })
    },
    reset() {
      this.form = {
        scopeType: 0,
        subjectType: 0
      }
    },
    // 根据机构查询角色
    getGroupRoleList() {
      const params = {
        orgId: this.$store.getters?.profile?.currentOrgRole?.org?.scopeValue || '',
        pageNum: 1,
        pageSize: 10000
      }
      moduleSrv.getGroupRoleList(params).then(res => {
        this.groupRoleTreeList = res.data || []
      })
    },
    // 确认按钮触发
    _confirm() {
      let scopeValueName = ''
      const _el = this.$refs.cascader?.$refs.cascaderRef
      if (_el) {
        const nodes = _el.getCheckedNodes()
        scopeValueName = nodes.map(({ pathLabels }) => {
          return pathLabels.pop()
        }).join(',')
      }
      this.$refs['form'].validate((valid) => {
        const mode = this.mode
        const scopeValue = this.form.scopeValue
        const params = { ...this.form, scopeValue, scopeValueName }
        if (valid) {
          // 校验成功, 区分是新增还是编辑
          const api = mode === 'edit' ? moduleSrv.updateDisScopeConfig : moduleSrv.addDisScopeConfig
          api(params).then((res) => {
            if (res.code === SUCCESS_CODE) {
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
      })
    },
    // 更新级联选择数据，修复回显问题
    async updateForm() {
      const mode = this.mode
      let ids = []
      let data = { scopeType: 0, subjectType: 0 }
      this.loading = true
      try {
        // 编辑，拼接scopeValue生成级联组件的options
        if (mode === 'edit') {
          const res = await moduleSrv.getDisScopeConfigDetail({ id: this.$attrs.editingdata.id }) || {}
          if (res.code === SUCCESS_CODE) {
            ids = res.data.scopeValue
            data = res.data
          }
        }
        const options = await this.getCascaderOptions(ids)
        this.form = { ...data }
        this.cascaderOptions = options
        this.cascaderKey++
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.scope-config-form-class {
    .el-cascader {
        width: 100%;
    }
}
::v-deep .el-checkbox__label {
    font-size: 14px;
    padding-left: 4px;
    vertical-align: middle;
    color: #4b4b4b;
    font-family: PingFangSC-Regular, PingFang SC;
    line-height: 20px;
}
::v-deep .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4B4B4B;
}
::v-deep .el-dialog__title {
    font-size: 14px;
    color: #202020;
}
</style>

