<!--/*
* @Author: dingli
* @Desc: 运营规则 新增、编辑
* @Date:
*/-->
<template>
  <c-dialog
    :title="title"
    width="692px"
    class="dialog-center"
    :visible.sync="dialogVisible"
    @close="beforeClose"
  >
    <c-form ref="refFrom" :model="formData" :rules="rules" label-position="top">
      <c-row :gutter="24">
        <c-col :span="12">
          <c-form-item label="配置类型" prop="ruleType">
            <c-input value="封面标签" size="small" disabled />
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="展示内容" prop="showContent">
            <c-input v-model="formData.showContent" :maxlength="3" size="small" placeholder="请输入" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="12">
          <c-form-item ref="refShowColor" label="展示颜色" prop="showColor">
            <div class="cls-showcolor">
              <span v-for="(c, k) in SHOW_COLOR" :key="`color-${k}`" :class="{active:formData.showColor==k}" @click="clickChangeColor(k)"><i :style="`background:${c};`" /></span>
            </div>
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="" prop="ruleOrder">
            <span slot="label" class="label-has-icon">
              规则优先级
              <c-tooltip content="从0到9优先级依次降低" placement="top-start">
                <i class="icon-info" />
              </c-tooltip>
            </span>
            <c-select v-model="formData.ruleOrder" size="small" specific-suffix placeholder="请选择" style="width:100%">
              <c-option
                v-for="i in 10"
                :key="`order-${i}`"
                :label="i-1"
                :value="i-1">
              </c-option>
            </c-select>
          </c-form-item>
        </c-col>
      </c-row>
      <h3 class="cls-label c-form-item__label">选择生效目标</h3>
      <c-row :gutter="24">
        <c-col :span="12">
          <c-form-item label="生效类型" prop="">
            <c-cascader
              ref="refAssetType"
              v-model="searchItems.assetType"
              :options="ASSET_TYPE_TREE"
              specific-suffix
              size="small"
              style="width:100%"
              clearable
              :props="{children: 'childList'}"
              :show-all-levels="false"
            />
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="资源名称" prop="">
            <c-input v-model="searchItems.packName" size="small" placeholder="请输入" clearable />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="12">
          <c-form-item label="资源编码" prop="">
            <c-input v-model="searchItems.shopCode" size="small" placeholder="请输入" clearable />
          </c-form-item>
        </c-col>
        <c-col :span="12" style="padding-top: 30px; text-align: right;">
          <c-button type="ordinary" size="small" @click="clickReset">重置</c-button>
          <c-button type="gradual" size="small" @click="clickSearch">查询</c-button>
        </c-col>
      </c-row>
      <div style="padding-left:10px;">
        <c-table :data="tableData" :height="200">
          <c-table-column
            prop="_checked"
            label=""
            width="60"
          >
            <template slot-scope="scope">
              <c-checkbox v-model="scope.row._checked" @change="checkboxChange(scope.row)" />
            </template>
          </c-table-column>
          <c-table-column label="#" type="index" width="60">
            <template slot-scope="scope">
              <span class="table-index">{{
                (page.pageNum - 1) * page.pageSize + scope.$index + 1
              }}</span>
            </template>
          </c-table-column>

          <c-table-column
            prop="packName"
            label="资源名称"
            show-overflow-tooltip
          />
          <c-table-column
            prop="shopCode"
            label="资源编码"
            show-overflow-tooltip
          />
          <c-table-column
            prop="packVersion"
            label="版本号"
            show-overflow-tooltip
          />
          <c-table-column
            prop="assetType"
            label="生效类型"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ assetTypeFilter(scope.row)||'--' }}
            </template>
          </c-table-column>
        </c-table>
      </div>

      <div class="page-footer">
        <c-pagination
          background
          :current-page="page.pageNum"
          :pager-count="5"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </c-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <c-button
        size="small"
        type="ordinary"
        @click="clickClose"
      >取消</c-button>
      <c-button
        type="gradual"
        size="small"
        :disabled="loading"
        @click="clickSave"
      >保存</c-button>
      <c-button
        type="gradual"
        size="small"
        :disabled="loading"
        @click="clickSaveAndUse"
      >保存并启用</c-button>
    </div>
  </c-dialog>
</template>
<script>
import { referAssetTypeObj, ASSET_SUBTYPE } from '@/utils/enumerate'
import { shopPublicList, validatorRepeat, operationRuleDetail, operationRuleCreate } from '@/api/operate-rule'
export default {
  name: 'AddDialog',
  components: {},
  props: {
    visible: Boolean,
    type: String,
    data: Object
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      formData: {
        ruleType: 1,
        showContent: '',
        showColor: '1',
        ruleOrder: '',
        ruleObjects: null
      },
      searchItems: {
        assetType: '',
        packName: '',
        shopCode: '',
        assetSubtype: ''
      },
      tableData: [],
      rules: {
        ruleType: { required: true, message: '请选择配置类型', trigger: 'blur' },
        showContent: [
          { required: true, message: '请输入展示内容', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              const reg = /^[\u4E00-\u9FA5]+$/
              if (!reg.test(val)) {
                return cb('只能输入中文，最多3个字符')
              }
              this.validatorRepeat('showContent', val, cb)
            },
            trigger: 'blur'
          }
        ],
        showColor: { required: true, message: '请选择展示颜色', trigger: 'change' },
        ruleOrder: [
          { required: true, message: '请选择规则优先级', trigger: 'change' },
          {
            validator: (rule, val, cb) => {
              this.validatorRepeat('ruleOrder', val, cb)
            },
            trigger: 'change'
          }
        ]
      },
      ASSET_TYPE_TREE: window.ENUMS.ASSET_TYPE_TREE,
      SHOW_COLOR: {
        1: 'rgba(54, 164, 255, 0.7)',
        2: 'rgba(76, 192, 158, 0.7)',
        3: 'rgba(246, 187, 6, 0.7)',
        4: 'rgba(255, 77, 79, 0.7)'
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      checkedData: {}
    }
  },
  computed: {
    title() {
      if (this.type === 'edit') {
        return '编辑自定义规则'
      }
      return '新增自定义规则'
    }
  },
  watch: {
    visible: {
      handler(nv) {
        this.dialogVisible = nv
        if (nv) {
          this.init()
        }
      }
    }
  },
  created() {},
  methods: {
    init() {
      if (this.$refs.refFrom) {
        this.$refs.refFrom.clearValidate()
      }
      if (this.type === 'edit') {
        this.getDetails()
      } else {
        this.getTableList(1)
      }
    },
    clickChangeColor(v) {
      console.log(v, '----')
      this.formData.showColor = v
      this.$refs.refShowColor.clearValidate()
    },
    validatorRepeat(key, val, cb) {
      const params = {
        [key]: val
      }
      if (this.type === 'edit') {
        params.id = this.data.id
      }
      validatorRepeat(params).then(res => {
        if (res.data && +res.data.result === 1) {
          const str = key === 'showContent' ? '展示内容已存在' : '规则优先级已存在'
          cb(str)
        } else {
          cb()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    assetTypeFilter(row) {
      const assetSubtype = row.assetSubtype ? row.assetSubtype.split(',') : []
      const str = []
      if (referAssetTypeObj[row.assetType]) {
        str.push(referAssetTypeObj[row.assetType])
      }
      const assetSubtypeStr = (assetSubtype.map(d => ASSET_SUBTYPE[d])).join(',')
      if (assetSubtypeStr) {
        str.push(assetSubtypeStr)
      }
      return str.join('-')
    },
    checkboxChange(row) {
      const key = `${row.shopCode}-${row.packVersion}`
      if (row._checked) {
        this.checkedData[key] = row
      } else {
        delete this.checkedData[key]
      }
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getTableList(1)
    },
    handleCurrentChange(pageNum) {
      this.getTableList(pageNum)
    },
    clickReset() {
      this.searchItems.assetType = ''
      this.searchItems.assetSubtype = ''
      this.searchItems.packName = ''
      this.searchItems.shopCode = ''
    },
    clickSearch() {
      this.getTableList(1)
    },
    async getTableList(pageNum = 1) {
      try {
        const params = {
          ...this.searchItems,
          pageNum,
          pageSize: this.page.pageSize
        }
        console.log(this.searchForm, '=======')
        if (this.searchItems.assetType) {
          const [assetType, assetSubtype] = this.searchItems.assetType
          params.assetType = assetType
          params.assetSubtype = assetSubtype
        }
        const res = await shopPublicList(params)
        this.tableData = res.data.list.map(d => ({
          ...d,
          _checked: !!this.checkedData[`${d.shopCode}-${d.packVersion}`]
        }))
        this.page.pageNum = res.data.currPage
        this.page.pageSize = res.data.pageSize
        this.page.total = res.data.total
      } catch (e) {
        console.log(e)
      }
    },
    resetForm() {
      this.loading = false
      if (this.$refs.refFrom) {
        this.$refs.refFrom.resetFields()
      } else {
        this.formData.showContent = ''
        this.formData.showColor = '1'
        this.formData.ruleOrder = ''
        this.formData.ruleObjects = null
      }
      this.checkedData = {}
      this.tableData = []
      this.page = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      this.clickReset()
    },
    clickClose() {
      this.dialogVisible = false
      this.resetForm()
    },
    clickSave() {
      this.validateForm(1)
    },
    clickSaveAndUse() {
      this.validateForm(2)
    },
    validateForm(saveType) {
      this.$refs.refFrom.validate(valid => {
        if (!valid) {
          return
        }
        const params = { ...this.formData, saveType }
        const checkedData = Object.values(this.checkedData)
        if (!checkedData.length) {
          return this.$message.warning('请选择生效目标')
        }
        params.ruleObjects = checkedData.map(d => ({
          shopCode: d.shopCode,
          packName: d.packName,
          packVersion: d.packVersion,
          assetType: d.assetType,
          assetSubtype: d.assetSubtype
        }))
        if (this.type === 'edit') {
          params.id = this.data.id
        }
        this.sendData(params)
      })
    },
    async sendData(params) {
      this.loading = true
      try {
        await operationRuleCreate(params)
        this.$message.success('操作成功')
        this.$emit('ok')
        this.clickClose()
      } catch (e) {
        this.loading = false
        // e
      }
    },
    async getDetails() {
      try {
        let res = await operationRuleDetail(this.data.id)
        res = res.data
        this.formData.showContent = res.showContent
        this.formData.showColor = res.showColor
        this.formData.ruleOrder = res.ruleOrder
        res.ruleObjects.forEach(d => {
          this.checkedData[`${d.shopCode}-${d.packVersion}`] = d
        })
        this.getTableList()
      } catch (e) {
        this.loading = false
        // e
      }
    },
    beforeClose() {
      this.$emit('close')
      this.resetForm()
    }
  }
}
</script>
<style scoped lang="scss">
.cls-label {
  padding-left: 10px;
  &::before {
    content: '*';
    color: #FF4D4F;
    display: inline-block;
    width: 10px;
    margin-left: -10px;
    margin-right: 0px;
  }
}
.cls-showcolor {
  display: flex;
  span {
    margin-left: 16px;
    width: 62px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid #E7E7E7;
    cursor: pointer;
    &:first-child {
      margin-left: 0;
    }
    i {
      display: inline-block;
      width: 100%;
      height: 100%;
      border: 2px solid white;
    }
  }
  span.active {
    border: 1px solid #36A4FF;
  }
}
.page-footer {
  padding-top: 24px;
  width: 100%;
  text-align: right;
}
.label-has-icon {
  position: relative;
}
.icon-info {
  position: absolute;
  top: 2px;
  right: -20px;
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(~@/assets/img/icon-info.png) no-repeat center;
  background-size: 100%;
}
</style>
