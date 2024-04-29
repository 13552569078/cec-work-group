<template>
  <el-dialog
    title="参会人员"
    width="812px"
    class="member-container"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <div class="project-left">
      <div class="project-name">选择类目</div>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="top"
        label-width="100px"
        class="form-in-dialog next-container"
        :class="{'info-form' : formDisabled}"
        top="10vh"
      >
        <el-form-item label="" prop="taskComments">
          <tree-with-search
            ref="treeSearchRef"
            v-model="formData.checkedResIdList"
            multiple
            :disabled="formDisabled"
            :options="tagOptionList"
            :props="{
              value: 'unitId',
              label: 'unitName',
              children: 'childList',
              disabled: 'leafNodeFlag'
            }"
            :search="true"
            :rootinvalue="false"
            placeholder="请选择"
            @getValue="getClickedValue"
            @getMoreValue="treeChange"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="project-right">
      <div>
        <div class="project-name">
          <div>已选参会人员</div>
          <div class="project-dele" @click="clearCheckedNodes">删除</div>
        </div>
        <div class="next-container">
          <div
            v-for="(item, index) in checkedList"
            :key="index"
            class="clicked-list"
          >
            <div class="clicked-item">
              {{ item.name }}
              <span class="cancel-btn" @click="()=> handleCancle(item)">x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <template v-if="!formDisabled">
        <el-button @click="removeCheckedList">取消</el-button>
        <el-button type="primary" @click="confirm">提交</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatch'
// import dfMixin from '@/mixin/dialog-form-mixin'
import treeWithSearch from '@/components/tree-with-search.vue'

export default {
  components: {
    treeWithSearch
  },
  // mixins: [dfMixin],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    },
    similarObj: {
      type: Object,
      default: () => {}
    },
    groupId: {
      required: true,
      type: [Number, String]
    },
    dialogMode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tagOptionList: [],
      resMoreIdList: [],
      checkedList: [],
      rules: {
        name: [
          { required: true, message: '角色名称可以由中文、数字以及字母组成，长度在2-20个字符，可修改', trigger: 'blur' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9-_]{2,20}$/, message: '角色名称可以由中文、数字以及字母组成，长度在2-20个字符，可修改', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formTitle() {
      return this.dialogMode === 'add' ? '添加角色' : this.dialogMode === 'edit' ? '编辑角色' : '角色详情'
    },
    formDisabled() {
      return this.dialogMode === 'info'
    }
  },
  created() {
    this.getResTreeList()
  },
  methods: {
    confirm() {
      const { meetingAttendUserList = [] } = this.formData
      if (meetingAttendUserList.length > 50) {
        this.$message.error('参会人员最多可选50人')
      } else {
        this.$emit('update:dialogVisible', false)
      }
    },
    async getResTreeList() {
      const result = await moduleSrv.getAllInfos({
        type: 1
      })
      const newList = this.filterTreeList(result.data)
      console.log(newList)

      this.tagOptionList = newList
    },
    filterTreeList(arr) {
      arr.forEach(item => {
        const { userList = [], childList = [] } = item
        userList.forEach(item => {
          item.unitName = item.userName
          item.unitId = item.deptUserId
          item.level = 'person'
          item.parentUnitId = item.orgId
          item.childList = []
        })
        item.childList = [...childList, ...userList]
        if (childList.length > 0) {
          this.filterTreeList(item.childList)
        }
      })
      return arr
    },
    treeChange(data) {
      this.resMoreIdList = data
    },
    clearCheckedNodes() {
      this.$refs.treeSearchRef.clearNodes()
    },
    getClickedValue(data) {
      const nameList = []
      const personList = data.reduce((prev, item) => {
        if (item.level && item.level === 'person') {
          prev.push({
            id: item.userId,
            deptUserId: item.deptUserId,
            name: item.unitName,
            orgId: item.orgId,
            zzdAccountId: item.zzdAccountId
          })
          nameList.push(item.unitName)
        }
        return prev
      }, [])
      this.checkedList = personList
      this.formData.meetingAttendUserList = personList
      this.formData.meetingAttendOrg = nameList.join(',')
    },
    removeCheckedList() {
      this.clearCheckedNodes()
      this.$emit('update:dialogVisible', false)
    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    handleCancle(item) {
      console.log('item,,,,item', item)
      this.checkedList.map((obj, index) => {
        if (obj === item) {
          this.checkedList.splice(index, 1)
        }
      })
      this.$refs.treeSearchRef.cancelSingle(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-in-dialog {
  padding-right: 15px;
  max-height: 55vh;
  overflow-y: auto;
  ::v-deep .c-radio__label{
  font-weight: normal;
  }
  &.info-form {
    ::v-deep .c-form-item__label {
      color: #8A8A8A;
    }
    ::v-deep .c-form-item__content {
      div {
        min-height: 40px;
      }
    }
  }
}
.entire_item{
    width: 100%;
    .c-select {
      width: 100%;
    }
  }
.member-container{

  ::v-deep{
    .el-dialog__body{
      display: flex;
    }
    .el-dialog__body{
      height: 600px;
    }
  }
  .project-left{
    width: 50%;
    border: 1px solid rgba(237,237,237,1);
    border-right: 0;
  }
  .project-right{
    width: 50%;
    border: 1px solid rgba(237,237,237,1);
  }
  .project-name{
    height: 39px;
    padding: 0 20px;
    line-height: 39px;
    font-size: 14px;
    color: #4B4B4B;
    background: #F9FAFE;
    display: flex;
    justify-content: space-between;
  }
  .project-dele{
    font-size: 14px;
    color: #36A4FF;
  }
  .next-container{
    max-height: 500px;
    overflow-y: auto;
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    .clicked-list{
      width: 45%;
      background: #F9FAFE;
      border-radius: 2px;
      margin-top: 15px;
      padding: 8px 0;
      text-align: center;
       margin-right: 16px;
    }
    .clicked-item{
      position: relative;
      .cancel-btn{
        position: absolute;
        right: 10px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
    ::v-deep{
      .el-form-item--small{
        width: 100%;
      }
    }
  }
}
</style>
