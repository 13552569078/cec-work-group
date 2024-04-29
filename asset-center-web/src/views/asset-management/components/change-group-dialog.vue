<template>
  <c-dialog
    :class="'dialog-center'"
    :title="'场景切换'"
    width="693px"
    :visible.sync="dialogFlag"
    append-to-body
    :before-close="cancel"
  >

    <c-form
      ref="formData"
      :model="formData"
      class="cls-model-form"
      label-position="top"
      :class="isView?'disabled-new':''"
      :rules="isView?{}:rules"
      label-width="100px"
      @submit.native.prevent
    >
      <c-form-item
        label="当前场景"
        prop="assetName"
        class="half-form-item"
      >
        <c-input v-model="curr.groupName" size="small" disabled
                 type="text" maxlength="20"></c-input>
      </c-form-item>
      <c-form-item
        label="选择场景"
        prop="sceneId"
        class="half-form-item"
        style="margin-left:24px"
      >

        <c-cascader
          v-model="formData.sceneId"
          :disabled="isView"
          style="width:100%"
          size="small"
          :specific-suffix="true"
          :show-all-levels="false"
          :options="topicTreeData"
          :props="{
            multiple: false,
            value: 'groupId',
            label: 'groupName',
            children: 'childList',
            emitPath: false,
            checkStrictly: true
          }"
          :placeholder="isView ? '' : '请选择'"
          clearable
        />
      </c-form-item>

      <c-form-item label="其他版本（选择是否切换场景）" style="margin-bottom:0px;">
        <c-table
          ref="multipleTable"
          class="table"
          height="319px"
          :data="assetList"
          element-loading-text="Loading"
          @selection-change="selection"
          @selection-all="selection"
        >

          <c-table-column
            type="selection"
            width="70"
          >
          </c-table-column>
          <c-table-column
            label=""
            width="60"
          >
            <template slot-scope="scope">{{ scope.$index+1 }}</template>
          </c-table-column>
          <c-table-column label="资源名称" prop="assetName" show-overflow-tooltip min-width="200">
          </c-table-column>
          <c-table-column label="资源编码" prop="assetCode" show-overflow-tooltip min-width="200">
          </c-table-column>
          <c-table-column label="版本号" prop="version" show-overflow-tooltip min-width="90">
          </c-table-column>
        </c-table>
      </c-form-item>

    </c-form>
    <div
      slot="footer"
      class="dialog-footer"
    >

      <c-button
        size="small"
        type="ordinary"
        @click="cancel"
      >取消</c-button>

      <c-button
        type="gradual"
        size="small"
        @click="confirmBtnClick"
      >确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import {
  getTree,
  getProcessList,
  statsListPage,
  assetChangeScene
} from '@/api/index';
export default {
  name: 'AssetCopy',
  props: {
    curr: {
      type: Object,
      default: () => {
        return {
          assetId: '',
          groupName: ''
        }
      }
    },
    dialogFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        assetName: '',
        version: '',
        assetCode: '',
        assetCodePrefix: '',
        assetDesc: '',
        assetAliasName: '',
        tagList: [],
        assetType: 3,
        attributeList: [],
        id: ''
      },
      span: 24,
      assetIds: [],
      rules: {
        sceneId: [
          {
            required: true,
            message: '请选择场景',
            trigger: 'change'
          }
        ]
      },
      topicTreeData: [],
      assetList: []
    };
  },
  computed: {
    isView() {
      if (this.flag === 'view') {
        return true;
      }
      return false;
    },
    isEidt() {
      if (this.flag === 'edit') {
        return true;
      }
      return false;
    }
  },
  created() {
    this.getAssetLabels();
  },
  mounted() {
    this.getList();
  },
  methods: {
    selection(data) {
      this.assetIds = data.map(item => item.assetId)
    },
    cancel() {
      this.close()
    },

    confirmBtnClick() {
      this.onSave()
    },

    close(flag = false) {
      console.log('====', flag)
      this.$emit('close', flag)
    },
    onSave() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const addData = {
            assetIds: [].concat(this.assetIds, [this.curr.assetId]),
            sceneId: this.formData.sceneId
          }

          assetChangeScene(addData)
            .then((res) => {
              if (res.code === 0) {
                this.close(true)
              }
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          console.log('check invalid');
        }
      });
    },

    // 查看详情
    getList() {
      let fn
      if (this.curr.assetType === 5) { // 流程资源
        fn = getProcessList({
          fullAssetCode: this.curr.assetCode,
          pageSize: 100,
          pageNum: 1,
          dataRange: 1 // 用户权限范围
        })
      } else if (this.curr.assetType === 1) { // 数据资源 数据
        fn = statsListPage({
          fullAssetCode: this.curr.assetCode,
          pageSize: 100,
          pageNum: 1,
          dataRange: 1 // 用户权限范围
        })
      }
      if (!fn) return this.$message.warning('查询资源列表入参错误')
      fn.then(res => {
        this.assetList = res.data.list.filter(item => item.id !== this.curr.assetId)
      })
    },
    // 标签
    getAssetLabels() {
      getTree().then((res) => {
        this.topicTreeData = res.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
      });
    }

  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.cls-model-form {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-footer {
  text-align: right;
}
.half-form-item {
  width: 306px;
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
.no-margin {
  margin: 0;
}
.table{
  margin-top: 10px;
  &::v-deep{

    th{
      line-height: 20px;
    }
  }
}
</style>
