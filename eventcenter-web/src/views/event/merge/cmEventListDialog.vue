<!--
 * @description 事件合并
 * @date 2020-09-08
 * @author lism
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="1060px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="">
      <el-form ref="ruleForm" :model="ruleForm" :disabled="digTypeEventList === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width50" label="平台系统" prop="platformSrc">
          <el-select v-model="ruleForm.platformSrc" class="width100" :disabled="true" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in selectEventPlatformOptions"
              :key="item.id || index"
              :label="item.dictDesc"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width50" label="事件类型" prop="apiName">
          <event-type-cascader
            ref="etcrTypeId"
            class="width100"
            check-strictly
            :parent-type.sync="ruleForm.eventTypeLId"
            :middle-type.sync="ruleForm.eventTypeMId"
            :child-type.sync="ruleForm.eventTypeId"
          />
        </el-form-item>
        <el-form-item class="width50" label="事件编号" prop="sysCode">
          <el-input v-model="ruleForm.eventCode" class="width100" clearable placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width50" label="事件标题" prop="url">
          <el-input v-model="ruleForm.title" class="width100" clearable placeholder="请输入内容" />
        </el-form-item>
      </el-form>
    </div>
    <div class="searchslistbtn"><el-button type="primary" @click="resultList()">查询</el-button></div>
    <div class="searchstable">
      <div class="sstips fs16">
        <span class="total-icon" />
        <span v-if="page.total">查询结果<span class="result-total">{{ page.total }}</span>条数据</span>
        <span v-else>暂无查询结果</span>
      </div>
      <div class="sstble">
        <el-table ref="" :data="tranformData" style="width: 100%" tooltip-effect="light">
          <el-table-column
            type="index"
            width="55"
            class-name="table-column-index"
          >
            <template slot-scope="{ row }">
              <el-radio v-model="selectEventRadio" :label="row.eventCode" />
            </template>
          </el-table-column>
          <template v-for="(item, index) in tableColumn">
            <el-table-column
              v-if="item.prop === 'eventStateText'"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
            >
              <!-- 对事件处理状态特殊处理，给不同的状态不同的标记 -->
              <template v-slot="{ row }">
                <span :class="`${_tranfromEventState(row)}-wrapper`">
                  <svg-icon :icon-class="_tranfromEventState(row)" />
                  {{ row.eventStateText }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
            />
          </template>
        </el-table>
      </div>
      <div class="ssfenye">
        <cestc-pagination
          :current-page.sync="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total,prev,pager,next,jumper,sizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="digTypeEventList === 'add' || digTypeEventList === 'edit'" type="primary" @click="_confirm">合 并</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import eventTypeCascader from '@/views/event/components/EventTypeCascader'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'CmDialog',
  components: {
    eventTypeCascader
  },
  props: {
    dialogVisibleEventList: {
      type: Boolean,
      default: false
    },
    digTypeEventList: {
      type: String,
      default: ''
    },
    digDataEventList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      selectEventRadio: '',
      ruleForm: {
        platformSrc: '',
        eventTypeLId: '',
        eventTypeMId: '',
        eventTypeId: '',
        eventCode: '',
        title: ''
      },
      selectEventList: [],
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编号',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'title',
          label: '事件标题',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'platText',
          label: '平台系统',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          visible: true,
          minWidth: 120
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          visible: true,
          minWidth: 250
        },
        {
          prop: 'eventStateText',
          label: '事件状态',
          visible: true,
          minWidth: 100
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    selectEventPlatformOptions() {
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    // 把字典转换为字典方式存储，方便获取对应中文
    eventPlatformOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_platform')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventSourceOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    replyStateMapOptions() {
      const platform = this.$store.getters.getBsDictsByType('reply_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventStateOptions() {
      const platform = this.$store.getters.getBsDictsByType('event_state')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.selectEventList.map((item) => {
        item.platText = this.eventPlatformOptions.get(`${item.platformSrc}`)
        item.sourceText = this.eventSourceOptions.get(`${item.eventSrcId}`)
        item.urgentText = this.eventUrgentOptions.get(`${item.eventUrgent}`)
        item.eventStateText = this.eventStateOptions.get(item.eventState)
        item.replyStateText = this.replyStateMapOptions.get(`${item.replyState}`)
        // 把事件大、中、小类组合
        item.eventTypeText = `${item.eventTypeLName}/${item.eventTypeMNAME}/${item.eventTypeName}`
        return item
      })
    }
  },
  watch: {
    dialogVisibleEventList: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.$nextTick(() => {
          this.isShowDig = nval
          if (this.isShowDig) {
            this.$nextTick(() => {
              this.$refs['ruleForm'].clearValidate()
            })
          }
        })
      }
    },
    digTypeEventList: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (nval === 'add') {
          this.title = '新增事件合并'
        } else if (nval === 'view') {
          this.title = '查看事件合并'
        } else {
          this.title = '编辑事件合并'
        }
      }
    },
    digDataEventList: {
      deep: true,
      immediate: true,
      async handler(nval) {
        // 遍历对象，将null 改成 ''
        for (const val in nval) {
          nval[val] = nval[val] === null ? '' : nval[val]
        }
        this.ruleForm.platformSrc = nval.platformSrc
      }
    }
  },

  methods: {
    resultList() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.ruleForm,
        pageNum,
        pageSize
      }
      moduleSrv.getEventRmvDupEventList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.selectEventList = list
          this.page.total = total
        }
      })
    },
    handleCurrentChange(current) {
      this.page.pageNum = current
      this.resultList()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.resultList()
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisibleEventList = false
    },
    // 批量事件状态，给予不同的状态不同的标记
    _tranfromEventState(row) {
      const state = row.eventState || '0'
      if (['0', '1', '2', '4'].includes(state)) {
        // 待XXX
        return 'svg-warn'
      } else if (['3'].includes(state)) {
        // 待处理，为处理中的颜色
        return 'svg-handle'
      } else if (['5'].includes(state)) {
        // 办结
        return 'svg-success'
      } else if (['7'].includes(state)) {
        // 驳回
        return 'svg-error'
      } else if (['6'].includes(state)) {
        // 作废
        return 'svg-grey'
      } else {
        return 'svg-grey'
      }
    },
    // 提交
    _confirm() {
      if (!this.selectEventRadio) {
        this.$message.warning('请先选择主事件！')
        return
      }
      this.$confirm('<div class="main-value">确定要合并该条事件吗？</div><div class="sub-value">确认合并，将把该事件和主事件合并。主事件未办结之前，可以拆分。主事件办结归档之后，不可以拆分，该事件处理结果将以主事件处理结果反馈给发起方</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: this.digDataEventList.id,
          eventCode: this.selectEventRadio
        }
        try {
          const res = await moduleSrv.postEventRmvDupEventMergeMerge(params)
          if (res.code === SUCCESS_CODE) {
            this.$parent.resultList()
            this.$message({
              message: '事件合并成功！',
              type: 'success'
            })
            this.isShowDig = false
            this.$parent.dialogVisibleEventList = false
          } else {
            this.$message({
              message: '事件合并失败！',
              type: 'error'
            })
            this.isShowDig = false
            this.$parent.dialogVisibleEventList = false
          }
        } catch (e) {
          this.$message({
            message: '事件合并失败！',
            type: 'error'
          })
          this.isShowDig = false
          this.$parent.dialogVisibleEventList = false
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.demo-ruleForm {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.width50 {
  width: 48%;
}
.width100 {
  width: 100%;
}
.width80 {
  width: 80%;
}
.width20 {
  width: 20%;
}
.searchslistbtn {
  text-align: right;
}
.searchstable {
  .sstips {
    margin-top: 20px;
    margin-left: 20px;
    .total-icon {
      font-size: 16px;
      color: #202020;
      position: relative;
      right: 20px;
      &::before {
        content: "";
        width: 16px;
        height: 16px;
        position: absolute;
        top: 0;
        left: 0;
        background-image: url(~@/assets/icon-data.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
    span {
      color: #202020;
    }
    .result-total {
      color: #36a4ff;
    }
  }
  .sstble {
    margin-top: 10px;
  }
  .ssfenye {
    margin-top: 10px;
  }
  .svg-success-wrapper {
    color: $success;
  }
  .svg-handle-wrapper {
    color: $tipsColor;
  }
  .svg-warn-wrapper {
    color: $warn;
  }
  .svg-error-wrapper {
    color: $error;
  }
  .svg-grey-wrapper {
    color: $defaultGrey;
  }
}
</style>
