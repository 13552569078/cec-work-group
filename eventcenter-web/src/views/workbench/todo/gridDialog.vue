<template>
  <cestc-dialog
    v-bind="$attrs"
    title="网格信息"
    width="960px"
    top="20vh"
    class="grm-dialog"
    v-on="$listeners"
  >
    <div class="grid-section">
      <div class="grid-info">
        <div class="i-item">
          <div class="i-item-label">网格名称</div>
          <div class="i-item-val">{{ gridObj.name || "-" }}</div>
        </div>
        <div class="i-item">
          <div class="i-item-label">网格编码</div>
          <div class="i-item-val">{{ gridObj.code || "-" }}</div>
        </div>
      </div>
      <div class="grid-mans">
        <div class="g-tabs">
          <div :class="`g-tab g-tab-${activeTab === 0}`" @click="_search(0)">全部<p v-if="totalData.pTotal" class="g-count">{{ totalData.pTotal }}</p></div>
          <div :class="`g-tab g-tab-${activeTab === 1}`" @click="_search(1)">网格领导<p v-if="totalData.gridLeaderNum" class="g-count">{{ totalData.gridLeaderNum }}</p></div>
          <div :class="`g-tab g-tab-${activeTab === 2}`" @click="_search(2)">网格员<p v-if="totalData.griderNum" class="g-count">{{ totalData.griderNum }}</p></div>
        </div>
        <div class="gm-tb">
          <el-table
            ref="tableHeight"
            :data="tableData"
            style="width: 100%"
            class="table"
            height="100%"
          >
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="name"
              label="角色"
            />
            <el-table-column
              prop="phone"
              label="手机号"
            />
            <el-table-column
              prop="onlineStatusStr"
              label="状态"
            >
              <template v-slot="{ row }">
                <span :class="`gridman-online-${row.isOnline}`">
                  {{ row.onlineStatusStr }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="220"
              fixed="right"
              label="操作"
              class-name="table-column-action"
            >
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="videoCall(row)">视频通话</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="voiceCall(row)">音频通话</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="guiji(row)">轨迹</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="gm-page">
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
      </div>
    </div>
    <div slot="footer" class="gm-page-footer" />
  </cestc-dialog>
</template>
<script>
import service from '@/api/dispatch'

export default {
  props: {
    gridObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeTab: 0,
      tableData: [],
      totalData: {},
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.getCount()
    this.searchList()
  },
  methods: {
    getCount() {
      service.gridManageCount({ deptCode: this.gridObj.code }).then(res => {
        const pdata = res.data || {}
        pdata.pTotal = (pdata.gridLeaderNum || 0) + (pdata.griderNum || 0)
        this.totalData = pdata
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    _search(tab) {
      if (tab === this.activeTab) return
      this.activeTab = tab
      this.pageNum = 1
      this.searchList()
    },
    searchList() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        pageNum,
        pageSize,
        deptCode: this.gridObj.code,
        containsSubAll: true
      }
      if (this.activeTab) params.type = this.activeTab
      service.queryAllGridUsersInfoPage(params).then(res => {
        const arr = res?.data?.list || []
        arr.sort((a, b) => {
          return -((a.isOnline || 0) - (b.isOnline || 0))
        })
        arr.forEach(item => {
          item.onlineStatusStr = `${item.isOnline}` === '1' ? '在线' : '离线'
        })
        this.tableData = arr
        this.page.total = res?.data?.total || 0
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.searchList()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.searchList()
    },
    videoCall(obj) {
      this.$bus.$emit('rtCommunication', 2, obj)
    },
    voiceCall(obj) {
      this.$bus.$emit('rtCommunication', 1, obj)
    },
    guiji(obj) {
      // obj.recordLine = 'LINESTRING(109.23292153052635 35.58529402021082,109.23875889777452 35.58459618855817,109.23983194322459 35.580095028286934,109.23294299143537 35.57911799884289)'
      if (obj.recordLine) {
        this.$emit('showGuiji', obj)
        setTimeout(() => {
          this.$emit('update:visible', false)
        }, 100)
      } else {
        this.$message.warning('无轨迹数据！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.grid-section {
    font-size: 14px;
    padding-bottom: 76px;
    .grid-info {
        display: flex;
        justify-content: space-between;
        .i-item {
            width: calc(50% - 8px);
            .i-item-label {
                color: #8A8A8A;
                margin-bottom:10px;
            }
        }
    }
    .grid-mans {
        margin-top: 20px;
        .g-tabs {
            display: flex;
            .g-tab{
                height: 32px;
                background: #FFFFFF;
                border: 1px solid #E7E7E7;
                padding: 0 16px;
                line-height: 32px;
                cursor: pointer;
                &:first-child{
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                }
                &:last-child{
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                }
                .g-count {
                    display: inline-block;
                    padding: 0;
                    margin: 0;
                    margin-left: 4px;
                }
                &:hover,&-true{
                    border: 1px solid #36A4FF;
                    color: #36A4FF;
                }
            }
        }
        .gm-tb {
            height: 288px;
            margin-top: 20px;
            ::v-deep{
                .el-table__fixed-right{
                    &::before{
                        display: none;
                    }
                }
                .gridman-online-1 {
                  color: #36A4FF !important;
                }
                .action-group {
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  .more-action {
                    margin-left: 8px;
                  }
                }
                .action-btn {
                  color: #36A4FF !important;
                  cursor: pointer;
                  &.is-disabled {
                    color: $disabled;
                    cursor: not-allowed;
                    // 禁用状态禁止点击，统一添加
                    pointer-events: none;
                  }
                }
            }
        }

    }
    .gm-page {
            position: absolute;
            width: 100%;
            left: 0;
            bottom:0;
            height: 76px;
            display: flex;
            align-items: center;
            padding-right: 28px;
            background: #FFFFFF;
            box-shadow: 0px -2px 7px 0px rgba(0,0,0,0.06);
        }
}
</style>
<style lang="scss">
.grm-dialog .el-dialog .el-dialog__footer{
    display: none;
}
.grm-dialog.cestc-dialog .el-dialog .el-dialog__body{
    max-height: 800px;
    height: auto;
}
</style>
