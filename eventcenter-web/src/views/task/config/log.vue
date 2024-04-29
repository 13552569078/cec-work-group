<!--
 * @description 任务中心-待办任务
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="task-log">
    <fixed-page padding="0" :footer-height="76" :footer-margin="0">
      <template v-slot:header>
        <div class="header">
          <div class="left">
            <svg-icon class="biaodan" icon-class="biaodan" />
            <div class="left-word">
              <div class="title">{{ headerInfo.name || '--' }}</div>
              <!-- <div class="code">1231423452</div> -->
            </div>
          </div>
          <div class="right">
            <div class="right-item">
              <div class="label">计划周期</div>
              <div class="value">{{ headerInfo.limitTimeunit || '--' }}</div>
              <div class="label">计划制定人</div>
              <div class="value">{{ headerInfo.createBy || '--' }}</div>
            </div>
            <div class="right-item">
              <div class="label">状态</div>
              <div class="value">
                <span
                  v-if="headerInfo.planStatus === 0"
                  class="svg-success"
                ><svg-icon icon-class="svg-success" /> 启动中</span>
                <span
                  v-else
                  class="svg-grey"
                ><svg-icon icon-class="svg-grey" /> 停用中</span>
              </div>
              <div class="label">下次执行时间</div>
              <div class="value">{{ headerInfo.planNextTime || '--' }}</div>
            </div>
            <div class="right-item">
              <div class="label">开始时间</div>
              <div class="value">{{ headerInfo.planStartTime || '--' }}</div>
              <div class="label">结束时间</div>
              <div class="value">{{ headerInfo.planEndTime || '--' }}</div>
            </div>
          </div>
        </div>
      </template>
      <!-- 结果 -->
      <div ref="result" class="result mt16">
        <search-tips ref="searchTips" :total="page.total" :show-actions="false" />
        <el-table
          ref="tableHeight"
          :height="tableContentHeight"
          :data="tableData"
          style="width: 100%"
          tooltip-effect="light"
        >
          <el-table-column
            type="index"
            width="55"
            :index="indexMethod"
            class-name="table-column-index"
          />
          <template v-for="(item, index) in tableColumn">
            <el-table-column
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              show-overflow-tooltip
            />
          </template>
        </el-table>
      </div>
      <template v-slot:footer>
        <cestc-pagination
          :current-page.sync="page.pageNum"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total,prev,pager,next,jumper,sizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </template>
    </fixed-page>
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/table.mixin'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'Todo',
  components: {},
  mixins: [pageMixin, tableMixin],
  data() {
    return {
      form: {},
      dateRange: null, // 事件时间
      headerInfo: {},
      tableColumn: [
        {
          prop: 'createTime',
          label: '开始时间',
          visible: true
        },
        {
          prop: 'endTime',
          label: '结束时间',
          visible: true
        },
        {
          prop: 'jobMessage',
          label: '耗时',
          visible: true
        },
        {
          prop: 'statusName',
          label: '执行结果',
          visible: true
        },
        {
          prop: 'count',
          label: '生成任务数',
          visible: true
        }
      ]
    }
  },
  computed: {
    jobId() {
      return this.$route.query.jobId
    },
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getJobLogInfo()
  },

  methods: {
    // 详情
    getJobLogInfo() {
      moduleSrv.getFormulateInfoById(this.id).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.headerInfo = res.data
        }
      })
    },

    // 列表
    resultList() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.form,
        pageNum,
        pageSize,
        jobId: this.jobId
      }
      moduleSrv.getJobLog(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableData = list
          this.tableData.forEach(item => {
            item.statusName = item.status === 1 ? '失败' : '成功'
          })
          this.page.total = total
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.task-log {
  .header {
    margin: 20px;
    height: 150px;
    width: 100%;
    background: #f9fafe;
    display: flex;
    .left {
      display: flex;
      padding: 30px 0 0 26px;
      width: 421px;
      .biaodan {
        font-size: 40px;
        margin-right: 5px;
      }
      .left-word {
        .title {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #2b2b2b;
          padding-bottom: 5px;
          padding-top: 10px;
        }
        .code {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4b4b4b;
          line-height: 16px;
          display: block;
        }
      }
    }
    .right {
      display: flex;
      flex: 1;
      height: 130px;
      border-left: 1px solid #ededed;
      margin-top: 10px;
      padding-left: 60px;
      &-item {
        width: 368px;
        max-height: 150px;
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        .label {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8a8a8a;
          line-height: 20px;
        }
        .value {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4b4b4b;
          line-height: 20px;
          .svg-success {
            color: #4cc09e;
          }
          .svg-grey {
            color: #a9a9a9;
          }
        }
      }
    }
  }
}
</style>
