<template>
  <div class="page-wrapper">
    <common-page-list has-footer>
      <search slot="search" ref="searchRef" @searchList="dealwithFilter" @reset="clearFilters" />
      <div slot="content" class="result-content">
        <search-tips
          ref="searchTips"
          :total="page.total"
          show-search-items
          :show-actions="false"
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
          @refresh="_search"
        />
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            ref="tableRef"
            class="expanded-table"
            :data="tranformData"
            style="width: 100%"
            max-height="480"
            tooltip-effect="light"
          >
            <el-table-column type="index" width="55" :index="indexMethod" class-name="table-column-index" />
            <el-table-column type="expand" width="30">
              <template v-slot="{ row }">
                <div class="expandcolumnbox">
                  <div
                    v-if="row.duplicateTcEventViewVOList && row.duplicateTcEventViewVOList.length > 0"
                    class="epdcblinebox"
                  >
                    <div v-for="(item, index) in row.duplicateTcEventViewVOList" :key="index">
                      <div class="epdcbline">
                        <div class="txt title">相似事件</div>
                        <div class="txt wid1 w200">
                          <span style="margin-right: 5px">{{ item.eventCode }}</span>
                          <el-popover v-if="item.uuid" placement="top" popper-class="table-popper" trigger="hover">
                            <div>第三方事件编码：{{ item.uuid }} <el-button type="text" class="primary-text" @click="handleCopy(item.uuid)">复制</el-button></div>
                            <img slot="reference" class="icon-info" :src="IconInfo">
                          </el-popover>
                        </div>
                        <div class="txt wid3 w200">
                          <el-tooltip class="item" effect="light" :content="item.title" placement="top">
                            <span>{{ item.title || '-' }}</span>
                          </el-tooltip>
                        </div>
                        <div class="txt wid6" style="width: 350px;">
                          <el-tooltip class="item" effect="light" :content="item.eventTypeText" placement="top">
                            <span style="margin-right: 5px">{{ item.eventTypeText || '-' }}</span>
                            <el-popover v-if="item.thirdEventTypeName" placement="top" popper-class="table-popper" trigger="hover">
                              <div>第三方事件类型：{{ item.thirdEventTypeName }} <el-button type="text" class="primary-text" @click="handleCopy(item.thirdEventTypeName)">复制</el-button></div>
                              <img slot="reference" class="icon-info" :src="IconInfo">
                            </el-popover>
                          </el-tooltip>
                        </div>
                        <div class="txt wid4 w150">
                          <el-tooltip class="item" effect="light" :content="item.platformSrcName" placement="top">
                            <span>{{ item.platformSrcName || '-' }}</span>
                          </el-tooltip>
                        </div>
                        <div class="txt wid5 w150">
                          <el-tooltip class="item" effect="light" :content="item.sourceText" placement="top">
                            <span>{{ item.sourceText || '-' }}</span>
                          </el-tooltip>
                        </div>
                        <div class="txt wid6 w150">
                          <el-tooltip class="item" effect="light" :content="item.urgentText" placement="top">
                            <span>{{ item.urgentText || '-' }}</span>
                          </el-tooltip>
                        </div>
                        <div class="txt" style="width:292px">
                          <cestc-progress :precent="(item.similarity * 100).toFixed(2)" style="width:200px" />
                        </div>
                        <div v-if="row.duplicateEventCode === item.eventCode" class="txt" style="width:150px">
                          <span class="svg-success-wrapper">
                            <svg-icon icon-class="svg-success" />已选择
                          </span>
                        </div>
                        <div v-else style="width:150px" />
                        <div class="txt wid7" />
                        <div class="txt info">
                          <span class="action-btn" @click="_action('to-info', item)">详情</span>
                          <span class="action-divider">|</span>
                          <span :class="['action-btn', { 'is-disabled': !!row.duplicateEventCode }]" @click="_action('de-weight', row, item)">去重</span>
                          <span class="action-divider">|</span>
                          <span :class="['action-btn', { 'is-disabled': !(row.duplicateEventCode === item.eventCode) }]" @click="_action('cancle-de-weight', row)">撤销去重</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="nodata">暂无任务</div>
                </div>
              </template>
            </el-table-column>
            <template v-for="(item, index) in tableColumn">
              <el-table-column
                v-if="!item.slotName"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
                :formatter="_formatter"
              />
              <el-table-column v-else-if="item.slotName === 'eventCode'" :key="'c' + index" :label="item.label" :min-width="item.minWidth">
                <template slot-scope="scope">
                  <div class="flex items-center">
                    <span style="margin-right: 5px">{{ scope.row.eventCode }}</span>
                    <el-popover v-if="scope.row.uuid" placement="top" popper-class="table-popper" trigger="hover">
                      <div>第三方事件编码：{{ scope.row.uuid }} <el-button type="text" class="primary-text" @click="handleCopy(scope.row.uuid)">复制</el-button></div>
                      <img slot="reference" class="icon-info" :src="IconInfo">
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.slotName === 'eventType'" :key="'e' + index" :label="item.label" :min-width="item.minWidth">
                <template slot-scope="scope">
                  <div class="flex items-center">
                    <span style="margin-right: 5px">{{ scope.row.eventTypeText }}</span>
                    <el-popover v-if="scope.row.thirdEventTypeName" placement="top" popper-class="table-popper" trigger="hover">
                      <div>第三方事件类型：{{ scope.row.thirdEventTypeName }} <el-button type="text" class="primary-text" @click="handleCopy(scope.row.thirdEventTypeName)">复制</el-button></div>
                      <img slot="reference" class="icon-info" :src="IconInfo">
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </template>
            <el-table-column :width="200" fixed="right" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <!-- 1.已作废 2.已去重 3.已撤销 -->
                  <span class="action-btn" @click="_action('view', row)">查看</span>
                  <span class="action-divider">|</span>
                  <span
                    :class="['action-btn', { 'is-disabled': !(row.duplicateState === 0 || row.duplicateState === 1) }]"
                    @click="_action('cancellation', row)"
                  >作废</span>
                  <span class="action-divider">|</span>
                  <span
                    :class="['action-btn', { 'is-disabled': !(row.duplicateState === 0 || row.duplicateState === 1) }]"
                    @click="_action('submit', row)"
                  >提交事件</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <cestc-pagination
          background
          :current-page="page.pageNum"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </common-page-list>
    <cmDialog v-if="dialogVisible" :dialog-visible="dialogVisible" :dig-type="digType" :dig-data="digData" />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import searchMixin from '@/mixin/searchMixin'
import cmDialog from './cmDialog'
import search from './search'
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'
import IconInfo from '@/assets/table/icon_info.png'

export default {
  name: 'DeWeight',
  components: {
    search,
    cmDialog
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      IconInfo,
      dialogVisible: false,
      digType: '',
      digData: {},
      tableColumn: [
        {
          prop: 'eventCode',
          label: '事件编码',
          minWidth: 200,
          slotName: 'eventCode'
        },
        {
          prop: 'title',
          label: '事件标题',
          minWidth: 200
        },
        {
          prop: 'eventTypeText',
          label: '事件类型',
          minWidth: 350,
          slotName: 'eventType'
        },
        {
          prop: 'platformSrcName',
          label: '来源系统',
          minWidth: 150
        },
        {
          prop: 'sourceText',
          label: '事件来源',
          minWidth: 150
        },
        {
          prop: 'eventUrgentName',
          label: '严重程度',
          minWidth: 150
        },
        {
          prop: 'happenTime',
          label: '发生时间',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'strategyCode',
          label: '去重策略编码',
          minWidth: 150
        },
        {
          prop: 'strategyName',
          label: '去重策略名称',
          minWidth: 150
        },
        {
          prop: 'duplicateStateName',
          label: '去重状态',
          minWidth: 150
        },
        {
          prop: 'replyStateName',
          label: '反馈状态',
          minWidth: 150
        }
      ]
    }
  },
  computed: {
    eventSourceOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_origin')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    eventUrgentOptionsMap() {
      const platform = this.$store.getters.getBsDictsByType('event_urgent_level')
      const map = new Map()
      platform.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    tranformData() {
      return this.dataList.map((item) => {
        item.sourceText = this.eventSourceOptionsMap.get(`${item.eventSrcId}`)
        item.eventTypeText = `${item.eventTypeLName || '-'}/${item.eventTypeMNAME || '-'
        }/${item.eventTypeName || '-'}`
        if (item.eventTypeIdFourName) {
          item.eventTypeText += `/${item.eventTypeIdFourName}`
        }
        if (item.eventTypeIdFiveName) {
          item.eventTypeText += `/${item.eventTypeIdFiveName}`
        }
        // 处理duplicateTcEventViewVOList 转义
        if (item.duplicateTcEventViewVOList && item.duplicateTcEventViewVOList.length) {
          item.duplicateTcEventViewVOList = item.duplicateTcEventViewVOList.map((itm) => {
            itm.sourceText = this.eventSourceOptionsMap.get(`${itm.eventSrcId}`)
            itm.eventTypeText = `${itm.eventTypeLName || '-'}/${itm.eventTypeMNAME || '-'
            }/${itm.eventTypeName || '-'}`
            itm.urgentText = this.eventUrgentOptionsMap.get(`${itm.eventUrgent}`)
            if (itm.eventTypeIdFourName) {
              itm.eventTypeText += `/${itm.eventTypeIdFourName}`
            }
            if (itm.eventTypeIdFiveName) {
              itm.eventTypeText += `/${itm.eventTypeIdFiveName}`
            }
            return itm
          })
        }
        return item
      })
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        mergerFlag: '0',
        pageNum,
        pageSize,
        ...this.searchParams
      }
      this.loading = true
      moduleSrv.getEventRmvDupList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
          if (this.dataList.length > 0) {
            this.$nextTick(async() => {
              // 默认打开第一行
              this.$refs.tableRef.toggleRowExpansion(this.dataList[0], true)
            })
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    async viewInfo(row) {
      // this.dialogVisible = true
      // this.digType = 'view'
      // const params = {
      //   id: row.id
      // }
      // const res = await moduleSrv.getEventRmvDupDetail(params)
      // if (res.code === SUCCESS_CODE) {
      //   this.digData = res.data || {}
      // }
      this.$router.push({ path: '/event/de-weight/detail', query: { id: row.id }})
    },
    deWeight(row, repeatRow) {
      this.$confirm('<b>确定要去重该条事件吗？</b><div class="ctips">确认去重，将认为该事件和相似事件重复。相似事件未办结之前，可以撤销去重。相似事件办结归档之后，不可以撤销去重，该事件处理结果将以相似事件处理结果反馈给发起方</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: row.id,
          eventCode: repeatRow.eventCode
        }
        try {
          const res = await moduleSrv.postEventRmvDupRmvDup(params)
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '事件去重成功！',
              type: 'success'
            })
            // this._search()
            // eslint-disable-next-line require-atomic-updates
            row.duplicateEventCode = repeatRow.eventCode
            // eslint-disable-next-line require-atomic-updates
            row.duplicateState = 3
            // eslint-disable-next-line require-atomic-updates
            row.duplicateStateName = '已去重'
          } else {
            // this.$message({
            //   message: '事件去重失败！',
            //   type: 'error'
            // })
          }
        } catch (e) {
          // this.$message({
          //   message: '事件去重失败！',
          //   type: 'error'
          // })
        }
      })
    },
    cancleDeWeight(row, repeatRow) {
      this.$confirm('<b>确定要撤销去重该条事件吗？</b><div class="ctips">相似事件未办结之前，可以撤销去重。撤销去重之后，该事件将重新回到已研判状态，可以进行，去重、作废、提交事件操作</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: row.id
        }
        try {
          const res = await moduleSrv.postEventRmvDupRevokeRmvDup(params)
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '事件撤销去重成功！',
              type: 'success'
            })
            // this._search()
            // eslint-disable-next-line require-atomic-updates
            row.duplicateEventCode = ''
            // eslint-disable-next-line require-atomic-updates
            row.duplicateState = 1
            // eslint-disable-next-line require-atomic-updates
            row.duplicateStateName = '已研判'
          } else {
            // this.$message({
            //   message: '事件撤销去重失败！',
            //   type: 'error'
            // })
          }
        } catch (e) {
          // this.$message({
          //   message: '事件撤销去重失败！',
          //   type: 'error'
          // })
        }
      })
    },
    // 作废
    cancellation(row) {
      this.$confirm('<b>确定要作废该条事件吗？</b><div class="ctips">确认作废该事件之后，【事件服务总线平台】将通知发起方该事件已作废，之后该事件将不能再进行其他操作</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: row.id
        }
        try {
          const res = await moduleSrv.postEventRmvDupAbolish(params)
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '事件作废成功！',
              type: 'success'
            })
            this._search()
          } else {
            // this.$message({
            //   message: '事件作废失败！',
            //   type: 'error'
            // })
          }
        } catch (e) {
          // this.$message({
          //   message: '事件作废失败！',
          //   type: 'error'
          // })
        }
      })
    },
    submit(row) {
      this.$confirm('<b>确定要提交该条事件吗？</b><div class="ctips">确认提交该事件，将认为该事件并非和相似事件重复，事件将进入正常处理流程</div>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const params = {
          id: row.id
        }
        try {
          const res = await moduleSrv.postEventRmvDupRevoke(params)
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '事件提交成功！',
              type: 'success'
            })
            this._search()
          } else {
            // this.$message({
            //   message: '事件提交失败！',
            //   type: 'error'
            // })
          }
        } catch (e) {
          // this.$message({
          //   message: '事件提交失败！',
          //   type: 'error'
          // })
        }
      })
    },
    _action(action, row, repeatRow) {
      switch (action) {
        case 'view':
          this.viewInfo(row)
          break
        case 'de-weight':
          this.deWeight(row, repeatRow)
          break
        case 'cancle-de-weight':
          this.cancleDeWeight(row, repeatRow)
          break
        case 'cancellation':
          this.cancellation(row)
          break
        case 'submit':
          this.submit(row)
          break
        case 'to-info':
          this.$router.push({
            path: '/event/de-weight/info',
            query: {
              taskId: row.taskId,
              id: row.id
            }
          })
          break

        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  font-family: PingFangSC-Regular, PingFang SC;
  @include resultContent;

  .expandcolumnbox {
    margin-left: -35px;

    .epdcblinebox {
      .epdcbline {
        min-height: 48px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #ededed;

        &:last-child {
          border-bottom: 0px;
        }

        .txt {
          font-size: 14px;
          font-weight: 400;
          color: #4B4B4B;
          flex-shrink: 0;
          padding: 0 16px;
          min-width: 150px;
          display: flex;

          &.title {
            color: #ff0000;
            padding: 0;
            width: auto;
            min-width: 0;
            visibility: hidden;
            margin-left: 13px;
          }
        }

        .wid7 {
          flex-grow: 1;
        }

        .info {
          width: 300px;
          color: #36a4ff;
          cursor: pointer;
          text-align: left;
        }
      }
    }

    .nodata {
      min-height: 48px;
      line-height: 48px;
      text-align: center;
      color: #666666
    }
  }
  .w200 {
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.w150 {
  width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.progress-wrap {
  background: #ffffff;
  border-radius: 4px;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  }
  .txt{
    &.title{
      margin-right: 14px;
    }
    &.info{
      width: 200px !important;
      display: flex;
      gap: 7px;
    }
    .action-divider {
      color: #EDEDED;
    }
  }
}
.svg-success-wrapper {
      color: $success;
    }
</style>
