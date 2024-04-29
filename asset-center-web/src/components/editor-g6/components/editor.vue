<!--
* @Description：编辑器组件
* @Author：zhang sen
* @Date：2020-08-31
-->
<template>
  <div class="root">
    <div
      v-if="!isView"
      class="item-panel-wrapper"
    >
      <div
        v-if="bizType === 'judge'"
        class="title"
      >
        <em class="cls-line"></em>
        {{ judgeModelTitle }}
      </div>
      <!-- 组件面板 -->
      <item-panel
        ref="addItemPanel"
        :disable-tree-nodes="disableTreeNodes"
        :biz-type="bizType"
        :locked="locked"
        :height="bizType === 'judge' ? realHeight : height"
        @handleNodeClick="handleItemPanelClick"
        @handleEditBasicModel="handleEditBasicModel"
      />
    </div>

    <div class="editor-box">
      <!-- 工具栏 -->
      <div
        v-if="!isView"
        class="toolbar-wrapper"
      >
        <toolbar-panel
          ref="toolbar"
          :locked="locked"
        />
        <slot name="toolbarExtend" />
      </div>
      <!-- 编辑区 -->
      <div
        ref="canvas"
        class="canvas-panel"
        :style="{'height':(isView ? height : realHeight)+'px','width':'100%'}"
      >
        <!-- 下拉框 -->
        <div
          :style="dropdownStyle"
          class="c-dropdown"
        >
          <ul
            class="c-dropdown-menu c-popper"
            x-placement="bottom-end"
          >
            <li
              v-for="item in dropdownMenus"
              :key="item.label"
              class="c-dropdown-menu__item"
              @click="doDropdownMenuClick(item)"
            >
              {{ item.label }}
            </li>
            <div
              class="popper__arrow"
              style="left: 51px;"
            />
          </ul>
        </div>
        <!-- 提示框 -->
        <div
          class="c-tooltip__popper is-dark"
          :style="tooltipStyle"
        >
          <div v-for="text in tooltipText" :key="text">{{ text }}</div>
          <div class="editor-popper-arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import G6 from '@antv/g6/lib';
import { getShapeName } from '../util/clazz'
import Command from '../plugins/command'
import Toolbar from '../plugins/toolbar'
import AddItemPanel from '../plugins/addItem-panel'
import CanvasPanel from '../plugins/canvas-panel'
import toolbarPanel from '../components/toolbar-panel'
import itemPanel from '../components/item-panel'
import i18n from '../locales'
import { exportXML, exportImg } from '../util/bpmn'
import registerShape from '../shape'
import registerBehavior from '../behavior'
import $bus from '@/utils/bus'
import eventsName from '@/components/editor-g6/util/events'
registerShape(G6);
registerBehavior(G6);
import {
  getModelDataDetail,
  getBasicModelColumnList,
  getJudgeModeColumnResultList,
  fetchAlgoDetail
} from '@/api/editor-g6';
export default {
  name: 'WfdVue',
  components: {
    toolbarPanel,
    itemPanel
  },
  provide() {
    return {
      i18n: i18n[this.lang]
    }
  },
  props: {
    // 禁拖动的树节点id集合
    disableTreeNodes: {
      type: Array,
      default() {
        return []
      }
    },
    mode: {
      type: String,
      default: 'edit'
    },
    locked: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 800
    },
    lang: {
      type: String,
      default: 'zh'
    },
    data: {
      type: Object,
      default: () => ({ nodes: [], edges: [] })
    },
    bizType: {
      type: String, // base: 基础模型   // judge 研判模型
      default: 'judge'
    },
    // 研判模型名称
    judgeModelTitle: {
      type: String,
      default: ''
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropdownMenus: [],
      tooltipText: '',
      tooltipStyle: {
        display: 'none', // block,
        position: 'absolute',
        top: '0px',
        left: '0px'
      },
      dropdownStyle: {
        display: 'none', // block,
        position: 'absolute',
        width: '126px',
        top: '0px',
        left: '0px'
      },
      resizeFunc: () => { },
      selectedModel: {},
      processModel: {
        id: '',
        name: '',
        category: '',
        clazz: 'process',
        dataObjs: [],
        signalDefs: [],
        messageDefs: []
      },
      graph: null,
      cmdPlugin: null,
      addItemPanel: null
    };
  },
  computed: {
    realHeight() {
      return this.height - 66;
    }
  },
  watch: {
    data(oldData, newData) {
      if (oldData !== newData) {
        if (this.graph) {
          this.graph.changeData(this.initShape(newData));
          this.graph.setMode(this.mode);
          this.graph.emit('canvas:click');
          if (this.cmdPlugin) {
            this.cmdPlugin.initPlugin(this.graph);
          }
          if (this.isView) {
            this.graph.fitView(5)
          }
        }
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeFunc);
    this.graph.getNodes().forEach(node => {
      node.getKeyShape().stopAnimate();
    });
    $bus.$off(['editor-hide-dropdown', 'drag-add-model', 'broadcast-to-editor', 'editor-err']);
  },
  created() {
    this.initBus();
  },
  mounted() {
    let plugins = [];
    if (!this.isView) {
      this.cmdPlugin = new Command();
      const toolbar = new Toolbar({ container: this.$refs['toolbar'].$el });
      this.addItemPanel = new AddItemPanel({ container: this.$refs['addItemPanel'].$el });
      const canvasPanel = new CanvasPanel({ container: this.$refs['canvas'] });
      plugins = [
        this.cmdPlugin,
        toolbar,
        this.addItemPanel,
        canvasPanel
      ];
    }
    const width = this.$refs['canvas'].offsetWidth;
    const editConfArr = ['drag-canvas', 'hoverNodeActived', 'hoverAnchorActived', 'dragNode', 'dragEdge',
      'dragPanelItemAddNode', 'clickSelected', 'itemAlign', 'dragPoint', 'brush-select'];
    if (!this.locked) {
      editConfArr.push('deleteItem');
    }
    this.graph = new G6.Graph({
      plugins: plugins,
      container: this.$refs['canvas'],
      height: this.isView ? this.height - 1 : this.realHeight - 1,
      width: width,
      modes: {
        default: ['drag-canvas', 'clickSelected'],
        view: [],
        edit: editConfArr
      },
      defaultEdge: {
        type: 'flow-polyline-round'
      }
    });
    this.graph.saveXML = (createFile = true) => exportXML(this.graph.save(), this.processModel, createFile);
    this.graph.saveImg = (createFile = true) => exportImg(this.$refs['canvas'], this.processModel.name, createFile);

    if (this.isView) {
      this.graph.setMode('view');
    } else {
      this.graph.setMode(this.mode);
    }

    this.graph.data(this.initShape(this.data));
    this.graph.render();
    if (this.isView && this.data && this.data.nodes) {
      this.graph.fitView(5)
    }

    if (this.isView) return // 预览模式不进行监听

    this.initEvents();
    // 点击节点
    this.graph.on('node:click', e => {
      const nodeItemModel = e.item.getModel(); // 获取被点击的节点元素对象
      if (e.item._cfg.locked) {
        // 被锁定状态
        return
      }
      const point = this.graph.getCanvasByPoint(nodeItemModel.x, nodeItemModel.y);
      this.getDropdownMenus(nodeItemModel)
      this.showDropdownInfo(true, point)
      this.showTooltipInfo(false)
    });
    // 画布点击
    this.graph.on('canvas:click', () => {
      // 关闭下拉面板
      this.showDropdownInfo(false)
    })
    // 画布拖拽
    this.graph.on('canvas:dragstart', () => {
      // 关闭下拉面板
      this.showDropdownInfo(false)
    })
    // 节点拖拽
    this.graph.on('node:dragstart', () => {
      this.showDropdownInfo(false)
    });

    this.graph.on('node:mouseenter', e => {
      const nodeItem = e.item;
      this.graph.setItemState(nodeItem, 'hover', true);
      // 显示提示信息
      const nodeItemModel = nodeItem.getModel(); // 获取被点击的节点元素对象
      const point = this.graph.getCanvasByPoint(nodeItemModel.x, nodeItemModel.y);
      this.showTooltipInfo(true, point, nodeItemModel)
    });

    this.graph.on('node:mouseleave', e => {
      const nodeItem = e.item;
      this.graph.setItemState(nodeItem, 'hover', false);
      this.showTooltipInfo(false)
    });
  },
  methods: {
    // 响应引用别的模型
    referenceAnotherModel(msg) {
      let data = msg.data;
      if (this.bizType === 'base') {
        // 清空 & 重新渲染
        this.graph.clear();
        this.graph.data(data);
        this.graph.render();
      } else {
        const nowData = this.graph.save(); // 当前画布数据
        let dataStr = JSON.stringify(data);
        const now = Date.now();
        data.nodes.forEach((d, i) => {
          dataStr = dataStr.replace(new RegExp(d.id, 'g'), `${d.clazz}${now + i}`)
        })
        data.edges.forEach((e, i) => {
          dataStr = dataStr.replace(new RegExp(e.id, 'g'), `${e.clazz}${now + i}`)
        })
        data = JSON.parse(dataStr)
        data.nodes.forEach(d => {
          d.x += 10;
          d.y += 10;
          nowData.nodes.push(d)
        })
        data.edges.forEach(d => {
          d.startPoint.x += 10;
          d.startPoint.y += 10;
          d.endPoint.x += 10;
          d.endPoint.y += 10;
          nowData.edges.push(d)
        })
        this.graph.changeData(nowData);
      }
    },
    // 获取当前数据
    handleEditBasicModel() {
      const dataJson = this.graph.save()
      let flag = false
      if (dataJson) {
        Object.keys(dataJson).forEach(k => {
          if (dataJson[k] && dataJson[k].length) {
            flag = true
          }
        })
      }
      $bus.$emit('broadcast-from-editor', {
        event: eventsName.GET_DATA,
        data: flag ? JSON.stringify(dataJson) : ''
      })
    },
    // 响应保存
    saveEditorJson() {
      const dataJson = this.graph.save()
      /**
       * 校验流程图是否完整 (没有output的节点不能往下一级连接) 已经做处理
       * 1，所有节点是否都有边？
       * 2，是否有结果输出
       * 2.1基础模型有且一个，
       * 2.2研判模型有多个
       * */
      let endNodeNum = 0;
      let flag = false;
      const endNodeLabelAry = [];
      for (let i = 0; i < dataJson.nodes.length; i++) {
        const item = dataJson.nodes[i];
        const nodeItem = this.graph.findById(item.id);
        const edges = nodeItem.getEdges();
        if (item.type === 'input-node') {
          if (edges.length === 0) {
            this.$message.error(`${item.label}节点缺少连接线`);
            flag = true;
            break;
          } else if (!item.data || item.data.output.length === 0) {
            this.$message.error(`${item.label}节点没有配置输出字段`);
            flag = true;
            break;
          }
        } else if (item.type === 'operation-node') {
          const inEdges = nodeItem.getInEdges();
          if (edges.length < 2 || (edges.length === 2 && inEdges.length === 2)) {
            this.$message.error(`${item.label}节点缺少连接线`);
            flag = true;
            break;
          } else if (!item.data || item.data.output.length === 0) {
            this.$message.error(`${item.label}节点没有配置输出字段`);
            flag = true;
            break;
          }
        } else if (item.type === 'end-node') {
          endNodeNum++;
          endNodeLabelAry.push(item.label);
          if (edges.length === 0) {
            this.$message.error(`${item.label}节点缺少连接线`);
            flag = true;
            break;
          } else if (!item.data || item.data.output.length === 0) {
            this.$message.error(`${item.label}节点没有配置输出字段`);
            flag = true;
            break;
          }
        }
      }
      if (flag) return;
      // 结束节点的配置
      if (endNodeNum === 0) {
        this.$message.error('当前流程设置中缺少结束节点');
        flag = true;
      } else if (this.bizType === 'base' && endNodeNum > 1) {
        this.$message.error('基础模型配置不允许多个输出结果');
        flag = true;
      } else if (this.bizType === 'judge' && endNodeNum > 1) {
        endNodeLabelAry.sort();
        for (let i = 0; i < endNodeLabelAry.length - 1; i++) {
          if (endNodeLabelAry[i] === endNodeLabelAry[i + 1]) {
            this.$message.error('研判模型的输出结果名称不能重复');
            flag = true;
            break;
          }
        }
      }
      if (flag) return;
      $bus.$emit('broadcast-from-editor', {
        event: eventsName.SAVE,
        data: JSON.stringify(dataJson)
      })
    },

    handleItemPanelClick() {
      this.addItemPanel.initPlugin(this.graph);
    },
    initShape(data) {
      if (data && data.nodes) {
        return {
          nodes: data.nodes.map(node => {
            return {
              type: getShapeName(node.clazz),
              ...node
            }
          }),
          edges: data.edges
        }
      }
      return data;
    },
    initEvents() {
      this.graph.on('afteritemselected', (items) => {
        if (items && items.length > 0) {
          let item = this.graph.findById(items[0]);
          if (!item) {
            item = this.getNodeInSubProcess(items[0])
          }
          this.selectedModel = { ...item.getModel() };
        } else {
          this.selectedModel = this.processModel;
        }
      });
      const page = this.$refs['canvas'];
      const graph = this.graph;
      const height = this.isView ? this.height - 1 : this.realHeight - 1;
      this.resizeFunc = () => {
        graph.changeSize(page.offsetWidth, height);
      };
      window.addEventListener('resize', this.resizeFunc);
    },
    onItemCfgChange(key, value) {
      const items = this.graph.get('selectedItems');
      if (items && items.length > 0) {
        let item = this.graph.findById(items[0]);
        if (!item) {
          item = this.getNodeInSubProcess(items[0])
        }
        if (this.graph.executeCommand) {
          this.graph.executeCommand('update', {
            itemId: items[0],
            updateModel: { [key]: value }
          });
        } else {
          this.graph.updateItem(item, { [key]: value });
        }
        this.selectedModel = { ...item.getModel() };
      } else {
        const canvasModel = { ...this.processModel, [key]: value };
        this.selectedModel = canvasModel;
        this.processModel = canvasModel;
      }
    },
    getNodeInSubProcess(itemId) {
      const subProcess = this.graph.find('node', (node) => {
        if (node.get('model')) {
          const clazz = node.get('model').clazz;
          if (clazz === 'subProcess') {
            const containerGroup = node.getContainer();
            const subGroup = containerGroup.subGroup;
            const item = subGroup.findById(itemId);
            return subGroup.contain(item);
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      if (subProcess) {
        const group = subProcess.getContainer();
        return group.getItem(subProcess, itemId);
      }
      return null;
    },
    showDropdownInfo(flag, point) {
      if (flag) {
        this.dropdownStyle.display = 'block'
        this.dropdownStyle.left = point.x + 10 + 'px'
        this.dropdownStyle.top = point.y + 'px'
      } else {
        this.dropdownStyle.display = 'none'
      }
    },
    showTooltipInfo(flag, point, msg) {
      if (flag) {
        this.tooltipText = []
        if (msg) {
          if (msg.clazz === 'algo') {
            this.tooltipText.push('算法模型名称：' + msg.label)
          } else if (msg.clazz !== 'operation') {
            this.tooltipText.push('组件名称：' + msg.label)
          }
          if (msg.data && msg.data.name) {
            this.tooltipText.push('组件名称：' + msg.data.name)
          }
          if (msg.data && msg.data.remark) {
            this.tooltipText.push('备注：' + msg.data.remark)
          }
        }
        if (!this.tooltipText.length) return;
        // this.tooltipText = text || ''
        this.tooltipStyle.display = 'block'
        this.tooltipStyle.left = point.x - 80 + 'px'
        this.tooltipStyle.top = point.y + 36 + 'px'
      } else {
        this.tooltipStyle.display = 'none'
        this.tooltipText = []
      }
    },
    doDropdownMenuClick(item) {
      const itemObj = this.graph.findById(item.model.id);
      const edges = itemObj.getInEdges();

      const sourceNodes = []
      edges.forEach(edge => {
        const node = edge.getSource()
        sourceNodes.push(JSON.parse(JSON.stringify(node.getModel())))
      })

      $bus.$emit('broadcast-from-editor', {
        event: eventsName.CLICK_DROPDOWN_MENU,
        data: JSON.parse(JSON.stringify(item)),
        sourceNodes: sourceNodes
      })
    },
    answerDropdownMenuClick(item) {
      let group, child, nodeModel, edges;
      const itemObj = this.graph.findById(item.model.id);
      switch (item.label) {
        case '修改名称':
          // 获取元素的容器
          group = itemObj.getContainer();
          child = group.find(function (item) {
            return item.attr('textType') === 'name'; // 找到首个填充为红色的图形
          });
          // 更新显示
          child.attrs.text = item.model.label;
          this.graph.updateItem(item.model.id, item.model);
          this.showDropdownInfo(false);
          break;
        default:
          nodeModel = itemObj.getModel();
          nodeModel.data = item.model.data;
          // 运算组件可修改显示名称
          if (nodeModel.data.name) {
            // 获取元素的容器
            group = itemObj.getContainer();
            child = group.find(function (item) {
              return item.attr('textType') === 'name'; // 找到首个填充为红色的图形
            });
            // 更新显示
            if (nodeModel.clazz === 'algo') {
              child.attrs.text = this.getLabelText(`算法-${nodeModel.label}-${nodeModel.data.name}`);
            } else {
              child.attrs.text = this.getLabelText(`${nodeModel.label}-${nodeModel.data.name}`);
            }
            this.graph.updateItem(item.model.id, item.model);
          }

          edges = itemObj.getOutEdges();
          if (edges.length) {
            // 如果被赋值节点的后边连接有结束节点，自动赋值结束节点的output
            const edgesOut = itemObj.getOutEdges();
            const targetNodeModel = edgesOut[0].getTarget().getModel();
            if (targetNodeModel.type === 'end-node') {
              targetNodeModel.data.output = JSON.parse(JSON.stringify(nodeModel.data.output));
            }
          }

          this.showDropdownInfo(false);
      }
    },
    getDropdownMenus(model) {
      const arr = []
      let labelArr = []
      if (model.type === 'end-node') {
        labelArr = ['查看数据结构', '备注', '修改名称']
      } else if (model.type === 'input-node') {
        labelArr = model.data.nodeType === 3 ? ['查看数据结构', '查看模型', '编辑', '备注'] : ['查看数据结构', '备注']
      } else if (model.type === 'operation-node') {
        labelArr = ['查看规则', '备注']
      } else if (model.type === 'algo-node') {
        labelArr = ['查看规则', '备注']
      }
      labelArr.forEach((item) => {
        arr.push({
          label: item,
          model: model
        })
      })
      this.dropdownMenus = arr
    },
    initBus() {
      $bus.$on('editor-err', (msg) => {
        this.$message.error(msg);
      })

      $bus.$on('editor-hide-dropdown', (msg) => {
        this.showDropdownInfo(false);
        if (msg.ev === 'delete-Keydown') {
          this.showTooltipInfo(false);
        }
      })

      $bus.$on('drag-add-model', (msg) => {
        // 研判模型的添加，执行输出选择弹窗
        const node = this.graph.findById(msg.id);
        node.lock(); // 状态锁着

        // 研判模型弹出输出结果选择框
        if (msg.data.nodeType === 3) {
          getJudgeModeColumnResultList({
            modelId: msg.data.modelId,
            modelType: 3
          }).then(res => {
            node.unlock();
            if (res.code === 0) {
              const operationIds = []
              const mapObj = {}
              res.data.forEach(i => {
                operationIds.push({
                  id: i.operationId,
                  name: i.operationName
                });
                mapObj[i.operationId] = [];
                i.mrsList.forEach(j => {
                  mapObj[i.operationId].push({
                    'name': j.columnName,
                    'desc': j.columnDesc,
                    'type': j.columnType,
                    'length': j.columnLength
                  })
                })
              });
              msg.data.outputId = operationIds[0].id;
              msg.data.output = mapObj[operationIds[0].id] || [];
              msg.data.biz = {
                judgeModeIds: operationIds,
                judgeModeOutputMap: mapObj
              };
              if (!msg.data.output.length) {
                this.$message({
                  message: '研判模型的输出字段列表请求无数据',
                  type: 'warning'
                });
                return;
              }
              if (msg.data.biz.judgeModeIds.length === 1) return;
              // 研判模型添加
              $bus.$emit('broadcast-from-editor', {
                event: eventsName.ADD_JUDGE_MODEL,
                data: JSON.parse(JSON.stringify({
                  label: '编辑',
                  model: msg
                }))
              })
            }
          })
        } else if (msg.data.nodeType === 1) {
          getModelDataDetail(msg.data.modelId).then(res => {
            if (res.code === 0) {
              res.data.attributeList.forEach(i => {
                msg.data.output.push({
                  'name': i.attributeCode,
                  'desc': i.attributeName,
                  'type': i.attributeType,
                  'length': i.attributeLength
                })
              })
              if (!msg.data.output.length) {
                this.$message({
                  message: '模型数据字段列表请求无数据',
                  type: 'warning'
                });
              }
            }
            node.unlock();
          })
        } else if (msg.data.nodeType === 2) {
          getBasicModelColumnList({
            modelId: msg.data.modelId,
            modelType: 2
          }).then(res => {
            if (res.code === 0) {
              res.data.forEach(i => {
                msg.data.output.push({
                  'name': i.columnName,
                  'desc': i.columnDesc,
                  'type': i.columnType,
                  'length': i.columnLength
                })
              })
              if (!msg.data.output.length) {
                this.$message({
                  message: '基础模型的输出字段列表请求无数据',
                  type: 'warning'
                });
              }
            }
            node.unlock();
          })
        } else if (msg.data.nodeType === 6) {
          fetchAlgoDetail(msg.data.modelId).then(res => {
            msg.data.orgdata = {
              algoCode: res.data.algoCode,
              algoName: res.data.assetName,
              apiAddress: res.data.apiAddress,
              inputCount: res.data.inputCount,
              input: res.data.input,
              output: res.data.output
            };
            node.unlock();
          })
          node.unlock();
        }
        this.showDropdownInfo(false)
      })

      // 相应来自编辑器外边的事件
      $bus.$on('broadcast-to-editor', (msg) => {
        let itemObj, nodeModel;
        switch (msg.event) {
          // 研判模型添加
          case eventsName.ADD_JUDGE_MODEL:
            itemObj = this.graph.findById(msg.data.model.id);
            nodeModel = itemObj.getModel();
            nodeModel.data = msg.data.model.data;
            break;
          // 点击memu处理
          case eventsName.CLICK_DROPDOWN_MENU:
            this.answerDropdownMenuClick(msg.data);
            break;
          // 保存绘制数据
          case eventsName.SAVE:
            this.saveEditorJson();
            break;
          case eventsName.CITE_MODEL:
            this.referenceAnotherModel(msg);
            break;
        }
      })
    },
    getLength (str) {
      // eslint-disable-next-line no-control-regex
      return str.replace(/[^\x00-\xff]/g, 'aa').length;
    },
    getLabelText(str) {
      if (this.getLength(str) <= 14) {
        return str;
      }
      const arr = str.split('');
      let len = 0;
      let data = ''
      for (let i = 0; i < arr.length; i++) {
        if (this.getLength(arr[i]) === 2) {
          len += 2
        } else {
          len++
        }
        if (len >= 14) {
          data = str.substr(0, i + 1) + '...'
          break;
        }
      }
      return data
    }
  }

};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.toolbar-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid #f4f4f4;
}
.root {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  border: 1px solid #d9d9d9;
  .item-panel-wrapper {
    box-sizing: border-box;
    width: 290px;
    height: 100%;
    border-top: 1px solid #f4f4f4;
    border-right: 1px solid #f4f4f4;
    flex-shrink: 0;
    .title {
      width: 100%;
      height: 63px;
      line-height: 63px;
      box-sizing: border-box;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(64, 64, 64, 1);
      padding-left: 16px;
      border-bottom: 1px solid #f4f4f4;
    }
  }
  .editor-box {
    flex: 1;
  }
}
.canvas-panel {
  position: relative;
  flex: 0 0 auto;
  float: left;
  width: 100%;
  background-color: #fff;
  user-select: none;
}
.editor-popper-arrow {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 0;
  height: 0;
  &::after {
    display: block;
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 0;
    height: 0;
    border: 6px solid #303133;
    border-left: 6px solid transparent;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
  }
}
.cls-line{
  display: inline-block;
  height: 18px;
  width: 4px;
  background: $primaryColor;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
