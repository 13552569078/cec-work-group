<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="666px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :append-to-body="false"
    :class="digType==='view'?'evaluate-dialog':''"
  >
    <div class="digwwrapper">
      <div class="pingjialist">
        <div v-if="digType === 'view'" class="evt">评价得分：{{ digData.evaluateList.score }}</div>
        <el-table
          v-if="digType === 'edit'"
          :data="ruleForm"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="indexName"
            label="评价指标"
            width="180"
            align="left"
          />
          <el-table-column
            prop="indexName"
            label="评分"
            width="180"
            align="left"
          >
            <template slot-scope="scope">
              <el-rate v-model="scope.row.indexScore" allow-half :colors="['#FA8B16', '#FA8B16', '#FA8B16']" />
            </template>
          </el-table-column>
          <el-table-column
            prop="evaluateShow"
            label="指标说明"
            align="left"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.evaluateShow.length>14">
                <!-- <div :id="'evaluate-show-' +scope.$index" :data-title="scope.row.evaluateShow" class="tip">{{ scope.row.evaluateShow.substring(0, 12) + '...' }}</div> -->
                <div :id="'evaluate-show-' +scope.$index" :title="scope.row.evaluateShow">{{ scope.row.evaluateShow.substring(0, 14) + '...' }}</div>
                <!-- <el-tooltip
                  :content="scope.row.evaluateShow"
                  placement="top"
                  :append-to-body="false"
                >
                  <div :id="'evaluate-show-' +scope.$index" class="custom-evaluate-content">{{ scope.row.evaluateShow.substring(0, 12) + '...' }}</div>
                </el-tooltip> -->
              </template>
              <div v-else>{{ scope.row.evaluateShow }}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="digType === 'view'"
          :data="ruleForm"
          style="width: 100%; margin-bottom: 4px;"
          border
          tooltip-effect="light"
        >
          <el-table-column
            prop="indexName"
            label="评价指标"
            width="180"
            align="left"
          />
          <el-table-column
            prop="indexName"
            label="评分"
            width="210"
            align="left"
          >
            <template slot-scope="scope">
              <el-rate v-model="scope.row.indexScore" allow-half	disabled :colors="['#FA8B16', '#FA8B16', '#FA8B16']" />
            </template>
          </el-table-column>
          <el-table-column
            prop="weight"
            label="指标权重"
            align="left"
            show-overflow-tooltip
          >
            <template v-slot="{ row }">
              {{ row.weight }}&emsp;%
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span v-if="digType !== 'view'" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="digType === 'add' || digType === 'edit'" type="primary" :loading="loading" @click="_confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'CmDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    digType: {
      type: String,
      default: ''
    },
    digData: {
      type: Object,
      default: () => {
        return {
          eventInfo: {},
          evaluateList: []
        }
      }
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      ruleForm: [],
      value: 0,
      loading: false
    }
  },
  watch: {
    dialogVisible: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.$nextTick(() => {
          this.isShowDig = nval
        })
      }
    },
    digType: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (nval === 'add') {
          this.title = '新增事件评价'
        } else if (nval === 'view') {
          this.title = '查看事件评价'
        } else {
          this.title = '编辑事件评价'
        }
      }
    },
    digData: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (this.digType === 'edit') {
          const _nval = JSON.parse(JSON.stringify(nval))
          this.ruleForm = _nval.evaluateList.map(item => { item.indexScore = 0; return item })
        } else {
          const _nval = JSON.parse(JSON.stringify(nval))
          this.ruleForm = _nval.evaluateList.indexScores.map(item => { item.indexScore = Number(item.indexScore) / 20; return item })
        }
      }
    }
  },
  methods: {
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    // 提交
    async _confirm() {
      // 验证是否所有的都已评价
      let flag = false
      this.ruleForm.forEach(item => {
        if (Number(item.indexScore) === 0) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('还有指标项未评价！')
        return
      }
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'add') {
        serverUrl = moduleSrv.postEventEvaluateAdd
        tipsuccess = '评价成功'
        tiperror = '评价失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.postEventEvaluateAdd
        tipsuccess = '评价成功'
        tiperror = '评价失败'
      }
      const params = {
        'eventId': this.digData.eventInfo.id,
        indexScores: this.ruleForm.map(item => {
          return {
            indexId: item.id,
            indexScore: Number(item.indexScore) * 20
          }
        }),
        'uuid': this.digData.eventInfo.uuid
      }
      this.loading = true
      const res = await serverUrl(params)
      if (res.code === SUCCESS_CODE) {
        this.loading = false
        this.$parent._search()
        this.$message.success(tipsuccess)
        this.isShowDig = false
        this.$parent.dialogVisible = false
      } else {
        this.$message.error(tiperror)
        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-dialog__header {
  padding: 20px 28px 20px 28px;
  line-height: 24px !important;
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
.digwwrapper {
  .pingjialist {
    .evt {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #8A8A8A;
      line-height: 14px;
      margin-bottom: 15px;
    }
  }
}
::v-deep {
  .el-table thead tr {
    line-height: 0;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #D9DBE0;
  }
  .el-dialog .el-dialog__footer {
    line-height: 0;
  }
}
// ::v-deep {
//   // .el-table__row {
//   //   td {
//   //     position: relative;
//   //   }
//   .el-dialog {
//     position: relative;
//   }
// }
.tip:hover:before {
  z-index: 99;
    width: 200px;
    position:absolute;
    // top: -30px;
    right:248px;
    content:attr(data-title);
    //在这里设内置好title出现的位容置就好了
    color: #4b4b4b;;
    border:1px solid #4b4b4b;
    border-radius:2px ;
    background-color:#ffffff;
}
.custom-evaluate-content{
  width: auto !important;
}
</style>
<style lang="scss">
.evaluate-dialog {
  .el-dialog__body {
    padding: 0 28px 28px !important;
  }
}
</style>
