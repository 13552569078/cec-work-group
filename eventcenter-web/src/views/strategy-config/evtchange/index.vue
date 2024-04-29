<!--
@Author: lism
@Description: 流转配置
@Date: 2023-11-07
-->
<template>
  <div class="wrapcontainer">
    <div v-if="modalChangeValue == 1" class="tablelistbox">
      <fixed-page padding="0" :footer-height="76" :footer-margin="0" :total="1 || page.total">
        <template v-slot:header>
          <search-panel ref="searchpanel1" :label-width="'160px'" @search="_search" @reset="reset">
            <panel-item label="展示模式:">
              <el-switch
                v-model="modalChangeValue"
                active-color="#4CC09E"
                inactive-color="#BDBDBD"
                active-text="列表"
                inactive-text="图形"
                active-value="1"
                inactive-value="0"
                @change="modalChangeFn"
              />
            </panel-item>
            <panel-item label="配置所属系统">
              <el-select v-model="searchForm.sysFlag" clearable placeholder="请选择">
                <el-option
                  v-for="item in noswzxSysCodeOptions"
                  :key="item.dictValue"
                  :label="item.dictDesc"
                  :value="item.dictValue"
                />
              </el-select>
            </panel-item>
            <panel-item label="发起方事件类型名称">
              <el-input v-model="searchForm.originalName" clearable placeholder="请输入" />
            </panel-item>
            <panel-item label="发起方事件类型编码">
              <el-input v-model="searchForm.originalValue" clearable placeholder="请输入" />
            </panel-item>
            <panel-item label="事务总线事件类型名称">
              <el-input v-model="searchForm.replaceName" clearable placeholder="请输入" />
            </panel-item>
            <panel-item label="事务总线事件类型编码">
              <el-input v-model="searchForm.replaceValue" clearable placeholder="请输入" />
            </panel-item>
          </search-panel>

          <search-tips ref="searchTips" :total="page.total" show-actions is-in-search-box>
            <el-button
              type="primary"
              class="add-btn common-action-btn"
              icon="custom-add common-icon"
              @click="comActionAdd()"
            >新增调度配置</el-button>
          </search-tips>
        </template>
        <!-- 结果 -->
        <div ref="result" class="result">

          <el-table
            ref="tableHeight"
            :height="tableContentHeight"
            :data="tableData"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}"
            tooltip-effect="light"
          >
            <el-table-column
              type="index"
              width="55"
              :index="indexMethod"
              class-name="table-column-index"
            />
            <template v-for="(item, index) in columns">
              <el-table-column
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
              />
            </template>
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
              class-name="table-column-action"
            >
              <template slot-scope="scope">
                <span class="action-group">
                  <span v-if="scope.row.parentId === null || scope.row.parentId === ''" class="action-btn" @click="comActionEdit(scope.row)">编辑</span>
                  <span v-if="!scope.row.parentId" class="action-divider">|</span>
                  <span class="action-btn" @click="comActionDelete(scope.row)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
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

    <div v-if="modalChangeValue == 0" class="relationbox">
      <fixed-page padding="0" :footer-height="0" :footer-margin="0">
        <template v-slot:header>
          <search-panel ref="searchpanel2" :label-width="'160px'" @search="resultListTupu" @reset="resetTupu">
            <panel-item label="展示模式:">
              <el-switch
                v-model="modalChangeValue"
                active-color="#4CC09E"
                inactive-color="#BDBDBD"
                active-text="列表"
                inactive-text="图形"
                active-value="1"
                inactive-value="0"
                @change="modalChangeFn"
              />
            </panel-item>
            <panel-item label="系统来源">
              <el-select v-model="searchTupuForm.originatorSysCode" clearable placeholder="请选择" @change="changeSearchTupuOriginalSysFn">
                <el-option
                  v-for="item in noswzxSysCodeOptions"
                  :key="item.dictValue"
                  :label="item.dictDesc"
                  :value="item.dictValue"
                />
              </el-select>
            </panel-item>
            <panel-item label="事件类型">
              <el-select v-model="searchTupuForm.originalValue" clearable placeholder="请选择">
                <el-option
                  v-for="item in eventTypeWhhOptions"
                  :key="item.eventTypeCode"
                  :label="item.eventTypeName"
                  :value="item.eventTypeCode"
                />
              </el-select>
            </panel-item>
            <panel-item label="">
              <el-checkbox-group v-if="searchTupuForm.originatorSysCode" v-model="searchTupuFormTypeArr">
                <el-checkbox label="1" name="type">发起方</el-checkbox>
                <el-checkbox label="2" name="type">接收方</el-checkbox>
              </el-checkbox-group>
            </panel-item>
          </search-panel>
        </template>
        <!-- 结果 -->
        <div ref="result" class="resulttupu">
          <RelationGraph
            ref="seeksRelationGraph"
            :on-node-click="onNodeClick"
            :on-line-click="onLineClick"
          />
        </div>
      </fixed-page>
    </div>

    <div v-if="tupuNodesTableIsShow" class="tupuNodesTable">
      <div class=""><el-button type="primary" icon="el-icon-back" plain @click="tupuNodesBackFn">返回</el-button></div>
      <div class="comtablebox">
        <el-table
          ref="tableHeight"
          :data="tableDataNodes"
          style="width: 100%"
          row-key="id"
          :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="index"
            width="55"
            :index="indexMethod"
            class-name="table-column-index"
          />
          <template v-for="(item, index) in tableColumnNodes">
            <el-table-column
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
            />
          </template>
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            class-name="table-column-action"
          >
            <template slot-scope="scope">
              <span class="action-group">
                <span v-if="scope.row.parentId === null || scope.row.parentId === ''" class="action-btn" @click="comTupuActionEdit(scope.row)">编辑</span>
                <span v-if="!scope.row.parentId" class="action-divider">|</span>
                <span class="action-btn" @click="comTupuActionDelete(scope.row)">删除</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="comtablepages">
        <cestc-pagination
          :current-page.sync="pageNodes.pageNum"
          :page-size="pageNodes.pageSize"
          :total="pageNodes.total"
          layout="total,prev,pager,next,jumper,sizes"
          @current-change="handleCurrentChangeNodes"
          @size-change="handleSizeChangeNodes"
        />
      </div>
    </div>

    <div v-if="tupuLinesTableIsShow" class="tupuLinesTable">
      <div class=""><el-button type="primary" icon="el-icon-back" plain @click="tupuLinesBackFn">返回</el-button></div>
      <div class="comtablebox">
        <el-table
          ref="tableHeight"
          :data="tableDataLines"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            width="55"
            :index="indexMethod"
            class-name="table-column-index"
          />
          <template v-for="(item, index) in tableColumnLines">
            <el-table-column
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
              show-overflow-tooltip
            />
          </template>
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            class-name="table-column-action"
          >
            <template slot-scope="scope">
              <span class="action-group">
                <span class="action-btn" @click="comSingleActionEdit(scope.row)">编辑</span>
                <span class="action-divider">|</span>
                <span class="action-btn" @click="comSingleActionDelete(scope.row)">删除</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="comtablepages">
        <cestc-pagination
          :current-page.sync="pageLines.pageNum"
          :page-size="pageLines.pageSize"
          :total="pageLines.total"
          layout="total,prev,pager,next,jumper,sizes"
          @current-change="handleCurrentChangeLines"
          @size-change="handleSizeChangeLines"
        />
      </div>
    </div>

    <cmDialog v-if="dialogVisible" :dialog-visible="dialogVisible" :dig-type="digType" :dig-data="digData" :table-data-nodes-sys-flag="tableDataNodesSysFlag" />
    <cmSingleDialog v-if="dialogVisibleSingle" :dialog-visible="dialogVisibleSingle" :dig-type="digTypeSingle" :dig-data="digDataSingle" :table-data-lines-data="tableDataLinesData" />
  </div>
</template>

<script>
import pageMixin from '@/mixin/page.mixin'
import tableMixin from '@/mixin/tableWhh.mixin'
import moduleSrv from '@/api/dispatchWhh'
import cmDialog from './cmDialog'
import cmSingleDialog from './cmSingleDialog'
import RelationGraph from '@/utils/relation-graph.min'
import jQuery from 'jquery'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'SourceMsg',
  components: {
    cmDialog,
    cmSingleDialog,
    RelationGraph
  },
  mixins: [pageMixin, tableMixin],
  data() {
    return {
      isFullScreen: false,
      dialogVisible: false,
      digType: '',
      digData: {},
      searchForm: {
        sysFlag: '',
        originalValue: '',
        replaceValue: ''
      },
      searchTupuForm: {
        originatorSysCode: '',
        originalValue: '',
        type: ''
      },
      searchTupuFormTypeArr: ['1', '2'],
      tableColumn: [
        {
          prop: 'sysFlagText',
          label: '配置所属系统',
          visible: true,
          minWidth: 150
        },
        {
          prop: 'originalSysText',
          label: '发起方/接收方系统',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'originalName',
          label: '发起方/接收方事件类型名称',
          visible: true,
          minWidth: 230
        },
        {
          prop: 'originalValue',
          label: '发起方/接收方事件类型编码',
          visible: true,
          minWidth: 230
        },
        {
          prop: 'replaceName',
          label: '事务总线事件类型名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'replaceValue',
          label: '事务总线事件类型编码',
          visible: true,
          minWidth: 200
        }
      ],
      sysCodeOptions: [],
      noswzxSysCodeOptions: [],
      swzxSysCodeOptions: [],
      eventTypeWhhOptions: [],
      modalChangeValue: '0',
      modalChangeValueOptions: [
        {
          dictLabel: '图形模式',
          dictValue: '0'
        },
        {
          dictLabel: '列表模式',
          dictValue: '1'
        }
      ],
      tupuNodesTableIsShow: false,
      tableDataNodesSysFlag: '',
      tableDataNodes: [],
      tableColumnNodes: [
        {
          prop: 'originalSysText',
          label: '发起方/接收方系统',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'originalName',
          label: '发起方/接收方事件类型名称',
          visible: true,
          minWidth: 230
        },
        {
          prop: 'originalValue',
          label: '发起方/接收方事件类型编码',
          visible: true,
          minWidth: 230
        },
        {
          prop: 'replaceName',
          label: '事务总线事件类型名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'replaceValue',
          label: '事务总线事件类型编码',
          visible: true,
          minWidth: 200
        }
      ],
      pageNodes: {},
      tupuLinesTableIsShow: false,
      tableDataLinesData: {},
      tableDataLines: [],
      tableColumnLines: [
        {
          prop: 'originalSysText',
          label: '发起方系统',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'originalName',
          label: '发起方事件类型名称',
          visible: true,
          minWidth: 230
        },
        {
          prop: 'originalValue',
          label: '发起方事件类型编码',
          visible: true,
          minWidth: 230
        },
        {
          prop: 'receiveSysText',
          label: '接收方系统',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'receiveName',
          label: '接收方事件类型名称',
          visible: true,
          minWidth: 200
        },
        {
          prop: 'receiveValue',
          label: '接收方事件类型编码',
          visible: true,
          minWidth: 200
        }
      ],
      pageLines: {},
      dialogVisibleSingle: false,
      digTypeSingle: '',
      digDataSingle: {}
    }
  },
  computed: {
    taskTypeOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('plan_task_type')
    }
  },
  async mounted() {
    const params = {
      dictType: 'event_platform'
    }
    const res = await moduleSrv.getTcDictDataZiDian(params)
    if (res.code === SUCCESS_CODE) {
      this.sysCodeOptions = res.data || []
      this.noswzxSysCodeOptions = this.sysCodeOptions.filter(val => val.dictValue !== '100')
      this.swzxSysCodeOptions = this.sysCodeOptions.filter(val => val.dictValue === '100')
      this.$nextTick(() => {
        this.resultListTupu()
      })
    }
  },
  methods: {
    // 切换模式
    modalChangeFn(val) {
      console.log(val)
      if (+val === 0) {
        this.$nextTick(() => {
          this.resultListTupu()
          // 更新搜索项高度
          this.$refs.searchpanel2.refresh()
        })
      } else {
        this.$nextTick(() => {
          this._search()
          // 更新搜索项高度 和 表格高度
          this.$refs.searchpanel1.refresh()
          this.calcTableHeight()
        })
      }
    },
    // 列表模式
    _search() {
      const { pageNum = 1, pageSize = 10 } = this.page
      const params = {
        ...this.searchForm,
        pageNum,
        pageSize
      }
      moduleSrv.eventTypeConfigPage(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableData = list
          this.page.total = total
        }
      })
    },
    comActionAdd(row = {}) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'lieBiaoAdd'
      this.digData = row
    },
    comActionLook(row) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'lieBiaoView'
      this.digData = row
    },
    comActionEdit(row) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'lieBiaoEdit'
      this.digData = row
    },
    comActionDelete(row) {
      console.log('当前行数据：', row)
      this.$confirm('确定要删除该调度配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        moduleSrv.eventTypeConfigDelete({ id: row.id }).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 更新数据
            this._search()
            this.resultListTupu()
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    // 图形模式
    async changeSearchTupuOriginalSysFn(val) {
      if (val === '' || val === null || val === undefined) return
      const res = await moduleSrv.selectMinByPlatFromSearch({ platformSrc: val })
      this.eventTypeWhhOptions = res.data || []
    },
    resetTupu() {
      this.searchTupuForm = {
        originatorSysCode: '',
        originalValue: '',
        type: ''
      }
      this.searchTupuFormTypeArr = ['1', '2']
      this.eventTypeWhhOptions = []
      this.$nextTick(() => {
        this.resultListTupu()
      })
    },
    async resultListTupu() {
      const _this = this
      if (this.searchTupuFormTypeArr.length === 0) {
        this.$message.error('发起方/接收方至少选择一个！')
        return
      } else if (this.searchTupuFormTypeArr.length === 1) {
        this.searchTupuForm.type = this.searchTupuFormTypeArr[0]
      } else {
        this.searchTupuForm.type = undefined
      }
      const params = {
        ...this.searchTupuForm
      }
      const res = await moduleSrv.eventTypeConfigList(params)
      const useDatas = res.data || []
      const useNodesList = []

      // 遍历出所有系统节点
      this.noswzxSysCodeOptions.forEach((val, idx) => {
        const servicelogoclass = val.dictValue === '301' ? 'service-logo-0' : (val.dictValue === '302' ? 'service-logo-1' : (val.dictValue === '303' ? 'service-logo-2' : 'service-logo-3'))
        useNodesList.push({
          id: val.dictValue,
          html: `<div class="nodewrap">
                  <div class="service-logo ${servicelogoclass} service-logo-static"></div>
                  <div class="namebox">
                    <div class="ptn">${val.dictLabel}</div>
                    <div class="act nodeactdrop">
                      <i class="el-icon-more"></i>
                      <div class="caozuo">
                        <div class="add" data-originalsyscode="${val.dictValue}">添加</div>
                        <div class="detail" data-originalsyscode="${val.dictValue}">详情</div>
                      </div>
                    </div>
                  </div>
                </div>`,
          data: {
            originalSysCode: val.dictValue
          },
          styleClass: 'tupu_node_style'
        })
      })

      // 获取所有的事件类型 线 数据
      const useAllLinesList = []
      useDatas.forEach(val => {
        if (val.childrenList && val.childrenList.length > 0) {
          val.childrenList.forEach(vcld => {
            useAllLinesList.push({
              from: val.originalSysCode,
              to: vcld.originalSysCode,
              text: vcld.originalName,
              lineWidth: '2',
              color: '#78C2FF',
              data: {
                originatorSysCode: val.originalSysCode,
                receiverSysCode: vcld.originalSysCode
              },
              styleClass: 'tupu_line_style'
            })
          })
        }
      })
      console.log('useAllLinesList', useAllLinesList)
      // 去重过滤出 线
      const lingshiUseNodesLinesList = JSON.parse(JSON.stringify(useAllLinesList))
      const formToList = []
      const lastUseNodesLinesList = []
      lingshiUseNodesLinesList.forEach(val => {
        if (!formToList.includes(`${val.from}-${val.to}`)) {
          formToList.push(`${val.from}-${val.to}`)
          val.text = 0
          lastUseNodesLinesList.push(val)
        }
      })
      console.log('lingshiUseNodesLinesList', lingshiUseNodesLinesList)
      // 双循环统计 节点之间 事件类型线的个数
      lingshiUseNodesLinesList.forEach(val1 => {
        lastUseNodesLinesList.find(val2 => {
          if (val1.from === val2.from && val1.to === val2.to) {
            val2.text++
            return true
          }
        })
      })
      console.log('lastUseNodesLinesList', lastUseNodesLinesList)

      // 初始化图谱
      const graph_json_data = {
        rootId: this.searchTupuForm.originatorSysCode || '301',
        nodes: useNodesList,
        links: lastUseNodesLinesList
      }
      console.log(JSON.stringify(graph_json_data), 667)
      this.$refs.seeksRelationGraph && this.$refs.seeksRelationGraph.setJsonData(graph_json_data, (seeksRGGraph) => {
        seeksRGGraph.setOptions({
          allowShowMiniView: false,
          allowShowMiniNameFilter: false,
          allowSwitchLineShape: false,
          allowSwitchJunctionPoint: false,
          moveToCenterWhenResize: true,
          hideNodeContentByZoom: false,
          'layouts': [
            {
              'label': '中心',
              'layoutName': 'center',
              'layoutClassName': 'seeks-layout-center',
              distance_coefficient: 550
            }
          ]
        }, () => {
          // 这些写上当图谱初始化完成后需要执行的代码
          if (this.jqueryTimer) clearInterval(this.jqueryTimer)
          let isgoonflag = false
          this.jqueryTimer = setInterval(() => {
            if (isgoonflag) return
            if (jQuery('.add').length > 0 && jQuery('.detail').length > 0) {
              isgoonflag = true

              if (useNodesList.length > 3) {
                // 默认进来 缩小 25%
                seeksRGGraph.zoom(-40)
              } else {
                // 默认进来 缩小 25%
                seeksRGGraph.zoom(-30)
              }

              window.onresize = () => {
                // 可视区域的高度
                const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
                _this.isFullScreen = window.screen.height === clientHeight
                console.log('_this.isFullScreen', _this.isFullScreen)
                // 全屏时候，节点上吗的下拉菜单新增和详情不可见
                if (_this.isFullScreen) {
                  jQuery('.nodeactdrop').css('display', 'none')
                  jQuery('.whhtext-fullscreen').text('退出')
                } else {
                  jQuery('.nodeactdrop').css('display', 'block')
                  jQuery('.whhtext-fullscreen').text('全屏')
                }
              }

              // 如果带有搜索条件，将如同点击节点效果
              if (_this.searchTupuForm.originatorSysCode) {
                _this.onNodeClick({ data: { originalSysCode: _this.searchTupuForm.originatorSysCode }})
              }

              // 点击节点上吗新增
              jQuery('.add').off('click').on('click', (e) => {
                // 打开弹窗
                _this.dialogVisible = true
                _this.digType = 'tupuAdd'
                _this.digData = {
                  sysFlag: e.currentTarget.dataset.originalsyscode,
                  originatorList: [{
                    originalSysCode: e.currentTarget.dataset.originalsyscode
                  }]
                }
              })

              // 点击节点上吗详情
              jQuery('.detail').off('click').on('click', (e) => {
                _this.tableDataNodesSysFlag = e.currentTarget.dataset.originalsyscode
                _this.resultListNodes(_this.tableDataNodesSysFlag)
              })

              // 点击线
              jQuery('.c-rg-line').off('click').on('click', function(e) {
                // _this.tableDataLinesData = e.currentTarget.dataset.linedata ? JSON.parse(e.currentTarget.dataset.linedata) : {}
                // _this.resultListLines(_this.tableDataLinesData)
              })

              // 点击线上面文字，图谱缩小的时候，线上吗的text会消失，所以得用外层监听绑定事件
              jQuery(document).on('click', '.c-rg-link-text', function(e) {
                // 全屏时候，点击文字不做操作
                if (_this.isFullScreen) return
                _this.tableDataLinesData = e.currentTarget.dataset.linedata ? JSON.parse(e.currentTarget.dataset.linedata) : {}
                _this.resultListLines(_this.tableDataLinesData)
              })

              // 点击工具栏清除
              jQuery('.whhbtn_clear').off('click').on('click', function(e) {
                _this.onNodeClick({ data: { originalSysCode: 'clear' }})
              })
            }
          }, 100)
        })
      })
    },
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    // 点击节点详情的弹窗
    resultListNodes(sysFlag) {
      const { pageNum = 1, pageSize = 10 } = this.pageNodes
      const params = {
        sysFlag,
        pageNum,
        pageSize
      }
      moduleSrv.eventTypeConfigPage(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.tableDataNodes = list
          this.pageNodes.total = total
          this.tupuNodesTableIsShow = true
        }
      })
    },
    comTupuActionEdit(row) {
      console.log('当前行数据：', row)
      this.dialogVisible = true
      this.digType = 'tupuEdit'
      this.digData = row
    },
    comTupuActionDelete(row) {
      console.log('当前行数据：', row)
      this.$confirm('确定要删除该调度配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        moduleSrv.eventTypeConfigDelete({ id: row.id }).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 更新数据
            this._search()
            this.resultListTupu()
            this.resultListNodes(this.tableDataNodesSysFlag)
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    tupuNodesBackFn() {
      this.tupuNodesTableIsShow = false
    },
    handleCurrentChangeNodes(current) {
      this.pageNodes.pageNum = current
      this.resultListNodes(this.tableDataNodesSysFlag)
    },
    handleSizeChangeNodes(size) {
      this.pageNodes.pageSize = size
      this.resultListNodes(this.tableDataNodesSysFlag)
    },
    // 点击线的弹窗
    // 点击线的弹窗
    // 点击线的弹窗
    // 点击线的弹窗
    // 点击线的弹窗
    // 点击线的弹窗
    // 点击线的弹窗
    // 点击线的弹窗
    resultListLines({ originatorSysCode, receiverSysCode }) {
      let useOriginalValue, useReceiveValue
      if (+this.searchTupuForm.originatorSysCode === +originatorSysCode) {
        useOriginalValue = this.searchTupuForm.originalValue
        useReceiveValue = undefined
      } else if (+this.searchTupuForm.originatorSysCode === +receiverSysCode) {
        useOriginalValue = undefined
        useReceiveValue = this.searchTupuForm.originalValue
      }
      const { pageNum = 1, pageSize = 10 } = this.pageLines
      const params = {
        originatorSysCode,
        receiveSysCode: receiverSysCode,
        originalValue: useOriginalValue,
        receiveValue: useReceiveValue,
        pageNum,
        pageSize
      }
      moduleSrv.eventTypeConfigFromAndTo(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          const useTableDataLines = list
          this.tableDataLines = useTableDataLines
          this.pageLines.total = total
          this.tupuLinesTableIsShow = true
        }
      })
    },
    comSingleActionEdit(row) {
      console.log('当前行数据：', row)
      moduleSrv.eventTypeConfigGet({ id: row.receiveId }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          const resdata = res.data && res.data.length > 0 ? res.data[0] : {}
          this.dialogVisibleSingle = true
          this.digTypeSingle = 'tupuSingleEdit'
          this.digDataSingle = {
            id: row.receiveId,
            sysFlag: row.originalSysCode,
            replaceSysCode: '100',
            replaceNameValue: '',
            replaceName: resdata.replaceName,
            replaceValue: resdata.replaceValue,
            originatorList: [
              {
                originalSysCode: row.originalSysCode,
                originalOptions: [],
                originalNameValue: '',
                originalName: row.originalName,
                originalValue: row.originalValue
              }
            ],
            receiverList: [
              {
                originalSysCode: row.receiveSysCode,
                originalOptions: [],
                originalNameValue: '',
                originalName: row.receiveName,
                originalValue: row.receiveValue
              }
            ]
          }
        }
      })
    },
    comSingleActionDelete(row) {
      console.log('当前行数据：', row)
      this.$confirm('确定要删除该调度配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        moduleSrv.eventTypeConfigDelete({ id: row.receiveId }).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 更新数据
            this._search()
            this.resultListTupu()
            this.resultListLines(this.tableDataLinesData)
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    tupuLinesBackFn() {
      this.tupuLinesTableIsShow = false
    },
    handleCurrentChangeLines(current) {
      this.pageLines.pageNum = current
      this.resultListLines(this.tableDataLinesData)
    },
    handleSizeChangeLines(size) {
      this.pageLines.pageSize = size
      this.resultListLines(this.tableDataLinesData)
    },
    // 11111111111
    // 11111111111
    // 11111111111
    // 11111111111
    // 11111111111
    // 11111111111
    // 11111111111
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject, $event)
      const curClickNodeSysCode = nodeObject.data.originalSysCode
      const _all_nodes = this.$refs.seeksRelationGraph.getNodes()
      const _all_lines = this.$refs.seeksRelationGraph.getLines()

      if (curClickNodeSysCode === 'clear') {
        _all_lines.forEach(thisLine => {
          thisLine.relations.forEach(val => {
            val.styleClass = 'tupu_line_style'
            val.color = '#78C2FF'
            val.lineWidth = 2
          })
        })

        _all_nodes.forEach(thisNode => {
          jQuery(thisNode.el).find('.nodewrap').removeClass('nodewrap-zhu').removeClass('nodewrap-fu')
          jQuery(thisNode.el).find('.service-logo').removeClass('service-logo-checked')
          thisNode.opacity = 1
        })
      } else {
        // 过滤出需要亮的节点List
        const needLightNodes = [curClickNodeSysCode]
        _all_lines.forEach(thisLine => {
          console.log('thisLine', thisLine)
          thisLine.relations.forEach(val => {
            if (+val.data.originatorSysCode === +curClickNodeSysCode) {
              needLightNodes.push(val.data.receiverSysCode)
              val.styleClass = 'tupu_line_style c-rg-line-checked'
              val.color = '#67C23A'
              val.lineWidth = 3
            } else if (+val.data.receiverSysCode === +curClickNodeSysCode) {
              needLightNodes.push(val.data.originatorSysCode)
              val.styleClass = 'tupu_line_style c-rg-line-checked'
              val.color = '#d2c0a5'
              val.lineWidth = 3
            } else {
              val.styleClass = 'tupu_line_style'
              val.color = '#f9f9f9'
              val.lineWidth = 2
            }
          })
        })

        _all_nodes.forEach(thisNode => {
          console.log('thisNode', thisNode)
          if (needLightNodes.includes(thisNode.data.originalSysCode) && +thisNode.data.originalSysCode === +curClickNodeSysCode) {
            jQuery(thisNode.el).find('.nodewrap').addClass('nodewrap-zhu').removeClass('nodewrap-fu')
            jQuery(thisNode.el).find('.service-logo').addClass('service-logo-checked')
            thisNode.opacity = 1
          } else if (needLightNodes.includes(thisNode.data.originalSysCode)) {
            jQuery(thisNode.el).find('.nodewrap').addClass('nodewrap-fu').removeClass('nodewrap-zhu')
            jQuery(thisNode.el).find('.service-logo').removeClass('service-logo-checked')
            thisNode.opacity = 0.8
          } else {
            jQuery(thisNode.el).find('.nodewrap').removeClass('nodewrap-zhu').removeClass('nodewrap-fu')
            jQuery(thisNode.el).find('.service-logo').removeClass('service-logo-checked')
            thisNode.opacity = 0.05
          }
        })
      }
    },
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject, $event)
    }
  }
}
</script>
<style scoped lang="scss">
.wrapcontainer {
  height: 100%;
  flex: 1;
  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .relationbox {
    .resulttupu {
      height: calc(100vh - 280px);
    }
  }
  .tupuNodesTable,
  .tupuLinesTable {
    width: calc(100% - 20px);
    height: calc(100vh - 157px);
    padding: 10px;
    position: absolute;
    top: 74px;
    left: 10px;
    z-index: 1000;
    background: #ffffff;
    .comtablebox {
      margin-top: 10px;
    }
    .comtablepages {
      margin-top: 20px;
    }
  }
  ::v-deep {
    .el-table tr.hover-row > td {
      background: #f7f7f7;
    }
    .el-table__row--level-1 {
      background: #f7f7f7;
    }
    .rel-map {
      background: url('~@/assets/nodeImages/bg.png') #ffffff repeat !important;
      background-size: 100% 100%;
    }
    .nodewrap {
      padding: 10px;
      border-radius: 50%;
      .service-logo {
        height: 240px;
        width: 240px;
        margin: 0 auto;
        background-image: url('~@/assets/nodeImages/12345_sprit.png');
        background-size: 100% 14640px;
        // 61
        background-position-y: 0;
        animation: move 1s steps(1,start);
        &:hover {
          animation: movea 1s steps(1,start);
          background-position-y: 7440px;
        }
      }
      .service-logo-0 {
        background-image: url('~@/assets/nodeImages/12345_sprit.png');
      }
      .service-logo-1 {
        background-image: url('~@/assets/nodeImages/chenguan_sprit.png');
      }
      .service-logo-2 {
        background-image: url('~@/assets/nodeImages/zongzhi_sprit.png');
      }
      .service-logo-3 {
        background-image: url('~@/assets/nodeImages/chenguan_sprit.png');
      }
      .service-logo-checked {
        animation: moveaaa 1.8s steps(1,start) infinite;
        background-position-y: 14640px;
        &:hover {
          animation: moveaaa 1.8s steps(1,start) infinite;
          background-position-y: 14640px;
        }
      }
      @keyframes move {
        $n: 30;
        $x: 3.33%;
        from {
          background-position-y: 7440px;
        }
        @for $i from 1 to $n {
          $position: ($n - $i + 1)*240px ;
          $pre: $i - 1;
          #{$pre * $x},#{$i * $x} {
            background-position-y: $position;
          }
        }
        to {
          background-position-y: 0;
        }
      }
      @keyframes movea {
        $n: 30;
        $x: 3.33%;
        from {
          background-position-y: 14640px;
        }
        @for $i from 1 to $n {
          $position: 14640px - $i*240px ;
          $pre: $i - 1;
          #{$pre * $x},#{$i * $x} {
            background-position-y: $position;
          }
        }
        to {
          background-position-y: 7440px;
        }
      }
      @keyframes moveaaa {
        $n: 61;
        $x: 1.64%;
        from {
          background-position-y: 14640px;
        }
        @for $i from 1 to $n {
          $position: 14640px - $i*240px ;
          $pre: $i - 1;
          #{$pre * $x},#{$i * $x} {
            background-position-y: $position;
          }
        }
        to {
          background-position-y: 0px;
        }
      }

      .namebox {
        width: 215px;
        height: 40px;
        margin: 0 auto;
        margin-top: -10px;
        background: url('~@/assets/nodeImages/title_bg.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .ptn {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #FFFFFF;
          font-weight: bold;
        }
        .act {
          position: absolute;
          top: 11px;
          right: 55px;
          .el-icon-more {
            transform: rotate(90deg);
            font-size: 10px;
            color: #ffffff;
          }
          .caozuo {
            display: none;
            position: absolute;
            top: 15px;
            left: -20px;
            width: 60px;
            background: #FFFFFF;
            box-shadow: 0px 4px 8px 0px rgba(41,48,64,0.2);
            padding: 5px 0;
            .add, .detail {
              width: 100%;
              height: 32px;
              text-align: center;
              line-height: 32px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #4B4B4B;
              cursor: pointer;
              &:hover {
                background: #F9FAFE;
                color: #36A4FF;
              }
            }
          }
          &:hover {
            .caozuo {
              display: block;
            }
          }
        }
      }
    }
    .c-rg-line {
      stroke-dasharray: 10,10,10;
      stroke-dashoffset: 3px;
      stroke-linecap: butt;
    }
    .c-rg-line-checked {
      stroke-dasharray: 10,10,10 !important;
    }
    .c-rg-link-text {
      font-family: PingFangSC-Medium;
      font-size: 24px;
      cursor: pointer;
      text-decoration: underline;
    }
    .rel-linediv .c-rg-line-checked {
      animation: ACTRGLineChecked linear 10s infinite;
    }
    .whhbtn_auto, .whhbtn_reflesh, .whhbtn_download {
      display: none;
    }
  }
}

::v-deep {
  .fixed-page-body {
    height: calc(100% - 74px) !important;
  }
  .tree-box {
    height: calc(100% - 50px) !important;
  }
}
</style>
