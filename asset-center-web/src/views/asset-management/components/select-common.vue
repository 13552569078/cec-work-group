<template>
  <c-dialog
    :class="'dialog-center'"
    :title="'选择公共资源'"
    width="1180px"
    :visible.sync="dialogFlag"
    append-to-body
    :before-close="closeHandle"
  >
    <div
      v-show="step ===1"
      class="select"
    >
      <div>
        <div class="header">
          <div class="border"></div>
          <div class="title">选择资源</div>
        </div>
        <fixed-page
          class="checkbox-notree"
          padding="0"
          :background-color="'#fff'"
          :header-height="65"
          :header-margin="0"
          :footer-margin="0"
          :footer-height="0"
        >
          <template v-slot:header>
            <div class="header-wrap">
              <div class="left-top">
                <div class="search-item">
                  <span>资源名称</span>
                  <c-input
                    v-model="requestData.assetName"
                    placeholder="请输入"
                    clearable
                    class="all-input"
                    size="small"
                  />
                </div>
                <div class="search-item">
                  <span>资源编码</span>
                  <c-input
                    v-model="requestData.assetCode"
                    placeholder="请输入"
                    clearable
                    class="all-input"
                    size="small"
                  />
                </div>
              </div>
              <div class="right-top">

                <c-button
                  size="small"
                  type="ordinary"
                  @click="reset"
                >重置</c-button>
                <c-button
                  type="gradual"
                  size="small"
                  @click="search"
                >
                  查询
                </c-button>
              </div>
            </div>
          </template>
          <div class="body-demo">
            <c-table
              ref="multipleTable"
              class="hidden-checkall-header"
              height="319px"
              :data="showList"
              element-loading-text="Loading"
              @selection-change="selectionKpi"
              @select="userClickSelect"
            >
              <c-table-column
                type="selection"
                width="70"
              >
              </c-table-column>
              <c-table-column
                label=""
                width="70"
              >
                <template slot-scope="scope">{{ pageData.pageSize*(pageData.pageNum-1)+scope.$index+1 }}</template>
              </c-table-column>
              <c-table-column
                v-for="(item,index) in tableCloumnData"
                :key="`checkedName-${item.checkedName}-${index}`"
                :label="`${item.lable}`"
                :prop="`${item.prop}`"
                :show-overflow-tooltip="true"
                :min-width="item.minWidth?item.minWidth:120"
              />
              <c-table-column
                label="操作"
                fixed="right"
                width="80"
              >
                <template slot-scope="scope">
                  <span
                    class=" icon-operate"
                    @click="goDetail(scope.row)"
                  >查看</span>
                </template>
              </c-table-column>
            </c-table>
            <c-pagination
              style="line-height:normal;padding-top:24px"
              background
              :current-page="pageData.pageNum"
              :page-size="pageData.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pageData.total"
              @current-change="handleCurrentChange"
            />
          </div>
        </fixed-page>
      </div>
    </div>
    <div
      v-if="step===2"
      class="base-info"
    >
      <div class="header">
        <div class="border"></div>
        <div class="title">补充基本信息</div>
      </div>
      <c-form
        ref="formData"
        :model="formData"
        class="cls-model-form"
        label-position="top"
        :class="''"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <c-form-item
          label="资源名称"
          prop="assetName"
          class="half-form-item"
        >
          <c-input
            v-model="formData.assetName"
            size="small"
            :placeholder=" '请输入资源名称'"
            type="text"
            maxlength="20"
          ></c-input>
        </c-form-item>
        <c-form-item
          label=""
          prop="assetCode"
          class="half-form-item"
          style="margin-left:14px;"
        >
          <template slot="label">
            <span>资源编码
              <c-tooltip
                placement="top"
                popper-class="cls-form-label-tip"
              >
                <div
                  slot="content"
                  v-html="AssetCodeToolTipText"
                >
                </div>
                <i class="cls-icon-info"></i>
              </c-tooltip>
            </span>
          </template>
          <c-input
            v-model="formData.assetCode"
            :placeholder="pageStatus === 'detail'?'':'请输入资源编码'"
            size="small"
            clearable
            class="form-input-item "
            :maxlength="17"
            @input="formData.assetCode = formData.assetCode.replace(/[^\w]/ig,'')"
          >
            <template slot="prepend">{{ formData.assetCodePrefix }}</template>
          </c-input>
        </c-form-item>

        <c-form-item
          v-if="formData.subtype+''==='13'"
          label="存储名称"
          prop="storeName"
          style="margin-right:14px"
          class="half-form-item"
        >
          <template slot="label">
            <span>存储名称
              <c-tooltip
                placement="top"
                popper-class="cls-form-label-tip"
              >
                <div
                  slot="content"
                  v-html="'实际表名为“存储名称_版本号”'"
                >

                </div>
                <i class="cls-icon-info"></i>
              </c-tooltip>
            </span>
          </template>
          <c-input
            v-model="formData.storeName"
            size="small"
            class="form-input-item"
            maxlength="20"
            placeholder="请输入存储名称"
          >
          </c-input>
        </c-form-item>

        <c-form-item
          v-if="formData.subtype+''==='51' ||formData.subtype+''==='13' "
          label="场景分类"
          prop="groupId"
          class="half-form-item"
        >

          <c-cascader
            v-model="formData.groupId"
            style="width:100%"
            size="small"
            :specific-suffix="true"
            :show-all-levels="false"
            :options="treeData"
            class="form-input-item"
            :props="{
              multiple: false,
              value: 'groupId',
              label: 'groupName',
              children: 'childList',
              emitPath: false,
              checkStrictly: true
            }"
            :placeholder="pageStatus === 'detail' ? '' : '请选择'"
            clearable
          />
        </c-form-item>

        <c-form-item label="资源标签" prop="tagNameList" class="half-form-item">
          <c-select
            v-model="formData.tagNameList"
            multiple
            filterable
            allow-create
            default-first-option
            :specific-suffix="true"
            style="width:100%"
            class="form-input-item"
            placeholder="请选择">
            <c-option
              v-for="item in topicTreeData"
              :key="item.groupName"
              :label="item.groupName"
              :value="item.groupName">
            </c-option>
          </c-select>
        </c-form-item>

        <c-form-item
          label="资源描述"
          prop="assetDesc"
          class="no-margin"
        >
          <c-input
            v-model="formData.assetDesc"
            type="textarea"
            :placeholder=" '请输入资源描述'"
            maxlength="200"
            :autosize="false"
            show-word-limit
          ></c-input>
        </c-form-item>

      </c-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >

      <c-button
        v-if="step ===2"
        type="ordinary"
        size="small"
        @click="pre"
      >上一步</c-button>
      <c-button
        size="small"
        type="ordinary"
        @click="closeHandle"
      >取消</c-button>
      <c-button
        v-if="step ===1"
        type="gradual"
        size="small"
        @click="next"
      >下一步</c-button>
      <c-button
        v-if="step ===2"
        type="gradual"
        size="small"
        @click="confirmBtnClick"
      >确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import { tagTree } from '@/api';
import {
  assetCodeExist,
  assetNameExist,
  apiAssetDataCheckStoreName,
  apiAssetListPage,
  getTree,
  commonAssetCopy
} from '@/api/index';
import { checkAssetCode, checkAssetName, checkVersion, checkStoreName } from '@/utils/validate'
import { DefaultValue, AssetCodeToolTipText } from '@/config/index'
import { getCodePrefix, getRandomCode, goDetail } from '@/utils'
export default {
  name: 'SelectDownload',
  props: {
    assetType: { // 资源大类
      type: [String, Number],
      default: ''
    },
    subtype: { // 资源小类
      type: [String, Number],
      default: ''
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    groupId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      subAssNameList: [], // 关联的资源
      subAssNameList2: [], // 关联的资源
      requestData: {
        assetName: '',
        assetCode: '',
        assetType: this.assetType,
        subtype: this.subtype
      },
      checkedName: 'id',
      tableCloumnData: [
        {
          lable: '资源名称',
          prop: 'assetName'
        },
        {
          lable: '资源编码',
          prop: 'assetCode'
        }, {
          lable: '版本号',
          prop: 'version'
        }, {
          lable: '所属租户',
          prop: 'tenantName'
        }, {
          lable: '资源描述',
          prop: 'assetDesc'
        }
      ],
      pageData: { // 需要的分页信息
        pageSize: 10,
        total: 0,
        pageNum: 1
      },
      showList: [], // 列表数据
      step: 1,
      defaultValue: DefaultValue,
      AssetCodeToolTipText,
      pageTopBtns: [
        {
          type: 'primary',
          disabled: false,
          label: '保存'
        }
      ],
      formData: {
        assetName: '',
        assetCode: '',
        assetCodePrefix: '',
        assetDesc: '',
        storeName: '',
        groupId: this.groupId,
        packFilePath: '',
        subtype: this.subtype,
        tagNameList: [],
        id: ''
      },
      span: 24,
      options: [
      ],
      selectTotalList: [], // 所有的数组数据
      selectTableList: [],

      rules: {
        assetName: [
          {
            required: true,
            message: '请输入资源名称',
            trigger: 'blur'
          },
          { max: 20, message: '最多20个字符', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorName(val, cb)
            },
            trigger: 'blur'
          }
        ],
        assetDesc: [
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        assetCode: [
          { required: true, message: '请输入资源编码', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorCode(val, cb)
            },
            trigger: 'blur'
          }
        ],

        groupId: [
          { required: true, message: '请选择场景分类', trigger: 'change' }

        ],
        storeName: [
          {
            required: true,
            message: '请输入存储名称',
            trigger: 'blur'
          },
          {
            validator: (rule, val, cb) => {
              this.validatorStoreName(val, cb)
            },
            trigger: 'blur'
          },
          { max: 20, message: '最多20个字符', trigger: 'blur' }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          },
          {
            validator: (rule, val, cb) => {
              checkVersion(val, cb)
            },
            trigger: 'blur'
          }
        ],
        tagNameList: [
          {
            validator: (rule, val, cb) => {
              if (val && val.length) {
                const flag = val.filter(d => d.length > 10)
                if (flag.length > 0) return cb('单个标签的最大长度为10')
              }
              cb()
            },
            trigger: ['blur', 'change']
          }
        ]
      },
      attributeTypedata: '请输入正整数',
      topicTreeData: [],
      processLog: '',
      pageStatus: ''
    };
  },
  computed: {
  },
  created() {
    this.getAssetLabels();
    this.getTreeList()
    this.$nextTick(() => {
      console.log(this.subtype, '----')
      this.formData.assetCode = getRandomCode(this.subtype)
      this.formData.assetCodePrefix = getCodePrefix(this.subtype)
    })
  },
  mounted() {
    this.getDownloadAssList()
  },
  methods: {
    // 获取专题树
    getTreeList() {
      getTree().then(rs => {
        this.treeData = rs.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
      })
    },
    codeFirstLetterUp() {
      if (this.formData.assetType + '' === '3') {
        this.formData.assetCode = this.formData.assetCode.replace(/[^\w]/ig, '').replace(/\b(\w)(\w*)/g, function ($0, $1, $2) { return $1.toUpperCase() + $2; })
      } else {
        this.formData.assetCode = this.formData.assetCode.replace(/[^\w]/ig, '')
      }
    },
    getDownloadAssList() {
      apiAssetListPage({
        assetCode: this.requestData.assetCode,
        assetName: this.requestData.assetName,
        assetType: this.assetType,
        subtype: this.subtype,
        pageNum: this.pageData.pageNum,
        groupType: 3,
        pageSize: this.pageData.pageSize
      }).then(res => {
        this.pageData.total = res.data.total
        this.loading = false
        this.showList = res.data.list.map(item => {
          item.id = item.assetId
          return item
        })
        this.renderTotalList()
      })
      // commonAssetList({
      //   assetName: this.requestData.assetName,
      //   assetType: this.requestData.assetType,
      //   assetSubtype: this.requestData.subtype,
      //   pageNum: this.pageData.pageNum,
      //   optType: 1,
      //   pageSize: this.pageData.pageSize
      // }).then(res => {
      //   this.pageData.total = res.data.total
      //   this.loading = false
      //   this.showList = res.data.list.map(item => {
      //     return item
      //   })
      //   this.renderTotalList()
      // })
    },
    handleCurrentChange(pageNum) {
      this.pageData.pageNum = pageNum
      this.getDownloadAssList()
    },
    goDetail(row) {
      console.log(row)
      goDetail(row)
    },
    selectionKpi(data) {
      this.newSelectList = data
      const newArr = []
      data.map((item) => newArr.push(item[`${this.checkedName}`]))
      this.newSelectListValue = newArr
    },
    userClickSelect(arrs, item) {
      console.log(arrs, item, 'arrs, item')
      if (!this.isClickSelect) this.isClickSelect = true
      if (item) {
        // 监听单个选中
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          // 取消
          this.selectTotalList = []
          this.selectTableList = []
        } else {
          // 选中
          this.selectTotalList = [item[`${this.checkedName}`]]
          this.selectTableList = [item]
        }
        this.renderTotalList()
      }
    },
    renderTotalList(isFirst = false) {
      this.showList.map((item, Index) => {
        if (this.selectTotalList.indexOf(item[`${this.checkedName}`]) > -1) {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, true)
          )
        } else {
          this.$nextTick(() =>
            this.$refs.multipleTable.toggleRowSelection(item, false)
          )
        }
      })
    },
    reset() {
      this.requestData.assetName = ''
      this.requestData.assetCode = ''
      this.pageData.pageNum = 1
      this.getDownloadAssList()
    },
    search() {
      this.pageData.pageNum = 1
      this.getDownloadAssList()
    },
    next() {
      if (!this.selectTableList.length) {
        return this.$message.warning('请选择资源')
      }
      console.log(this.selectTableList[0], 'this.selectTableList[0]')

      this.formData.assetName = this.selectTableList[0].assetName
      this.formData.assetType = this.selectTableList[0].assetType
      this.formData.assetId = this.selectTableList[0].id
      this.formData.id = this.selectTableList[0].id
      this.formData.tagNameList = this.selectTableList[0].tagList ? this.selectTableList[0].tagList.map(d => d.groupName) : []
      this.step = 2
    },
    pre() {
      this.step = 1
    },
    validatorStoreName(val, cb) {
      if (this.isEidt) {
        return cb()
      }
      if (!checkStoreName(val)) {
        return cb('字母开头，支持小写字母、数字和下划线，长度20')
      }
      apiAssetDataCheckStoreName({ storeName: val, id: this.$route.query.id }).then(res => {
        if (res.data) {
          cb('存储名称已经存在！')
        } else {
          cb()
        }
      })
    },
    validatorName(val, cb) {
      if (this.isView) {
        // 仅新增状态下可编辑资源编码
        return cb()
      }
      if (!checkAssetName(val)) {
        return cb('允许中英文、数字、下划线及中横线，最大长度20')
      }
      assetNameExist(val).then(res => {
        if (res.data && res.data.result * 1 === 1) {
          cb('资源名称已经存在！')
        } else {
          cb()
        }
      })
    },
    confirmBtnClick() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.onSave()
        } else {
          console.log('check invalid');
        }
      });
    },

    validatorCode(val, cb) {
      if (!checkAssetCode(val)) {
        return cb('允许字母、数字、下划线，最大长度20')
      }
      assetCodeExist(val).then(res => {
        if (res.data && res.data.result * 1 === 1) {
          cb('资源编码已经存在！')
        } else {
          cb()
        }
      })
    },
    closeHandle() {
      this.close()
    },
    close(flag = false) {
      console.log('====')
      this.$emit('close', flag)
    },
    onSave() {
      const addData = { ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }
      addData.assetId = addData.id
      const loading = this.$loading({
        lock: true,
        text: '资源复制中...',
        fullscreen: false,
        background: 'rgba(0, 0, 0, 0)'
      });
      commonAssetCopy(addData)
        .then((res) => {
          if (res.code === 0) {
            loading.close()
            this.close(true)
          }
        })
        .catch((e) => {
          loading.close()
          console.error(e);
        });
    },

    // 标签
    getAssetLabels() {
      tagTree().then((res) => {
        // res.data.forEach((element) => {
        //   if (element.childList.length) {
        //     element.childList.forEach((item) => {
        //       item.childList = null;
        //     });
        //   } else {
        //     element.childList = null
        //     element.disabled = true
        //   }
        // });
        this.topicTreeData = res.data
      });
    }

  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.icon-operate {
  color: $primaryColor;
  cursor: pointer;
}
.cls-model-form {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-footer {
  text-align: right;
}
.half-form-item {
  width: 49.34%;
  display: inline-block;
}
.header {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  .border {
    width: 4px;
    height: 14px;
    background: $primaryColor;
    margin: 0 8px 0 0px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: $textColor;
  }
}
.header-wrap {
  height: 38px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 26px;
  // border-bottom: 1px solid rgba(244, 244, 244, 1);
  // padding: 0 32px 0 12px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  .left-top {
    width: calc(100% - 220px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .search-item {
      font-size: 14px;
      width: 40%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 24px;
      &:last-child {
        margin-right: 0px;
      }
      span {
        width: 84px;
        text-align: right;
      }
      .all-input {
        width: calc(100% - 106px);
      }
    }
  }
  .right-top {
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }
}
.no-margin {
  margin: 0;
}
</style>
