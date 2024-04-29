import editorStyle from '../util/default-style';
import { Marker } from '@antv/g-canvas/lib/shape';
import $bus from '@/utils/bus'
export default function (G6) {
  G6.registerBehavior('dragEdge', {
    getDefaultCfg() {
      return {
        updateEdge: true,
        delegate: true,
        delegateStyle: {},
        dragEdge: false
      };
    },
    getEvents() {
      return {
        'anchor:dragstart': 'onDragStart',
        'anchor:drag': 'onDrag',
        'anchor:dragend': 'onDragEnd',
        'anchor:dragenter': 'onDragEnter',
        'anchor:dragleave': 'onDragLeave'
      };
    },
    onDragEnter(e) {
      if (!this.origin) {
        return;
      }
      if (!this.sameNode(e)) {
        e.item.setHotspotActived(true);
        this.origin.targetNode = e.target.getParent().getParent().get('item');
        this.origin.targetAnchor = e.item.get('index');
      }
    },
    onDragLeave(e) {
      if (!this.origin) {
        return;
      }
      if (!this.sameNode(e)) {
        e.item.setHotspotActived(false);
        this.origin.targetNode = null;
        this.origin.targetAnchor = null;
      }
    },
    onDragStart(e) {
      const node = e.target.getParent().getParent().get('item');
      const anchorIndex = e.item.get('index');

      if (!this._judgeCanDrawEdge(node, anchorIndex)) {
        return
      }

      const point = node.getAnchorPoints()[anchorIndex];
      this.target = e.item;
      const groupId = node.get('groupId');

      if (groupId) {
        const subProcessNode = e.target.getParent().getParent().getParent().getParent().get('item');
        const subProcessBBox = subProcessNode.getBBox();
        this.origin = {
          x: point.x + subProcessBBox.x + subProcessBBox.width / 2,
          y: point.y + subProcessBBox.y + subProcessBBox.height / 2,
          sourceNode: node,
          sourceAnchor: anchorIndex
        };
        this.dragEdgeBeforeShowAnchorBySub(subProcessNode);
      } else {
        this.origin = {
          x: point.x,
          y: point.y,
          sourceNode: node,
          sourceAnchor: anchorIndex
        };
        this.dragEdgeBeforeShowAnchor(e);
      }
      this.graph.set('edgeDragging', true);
    },
    onDrag(e) {
      if (!this.origin) {
        return;
      }
      this._updateEdge(this.target, e);
    },
    onDragEnd(e) {
      if (!this.origin) {
        return;
      }

      const delegateShape = e.item.get('edgeDelegate');
      if (delegateShape) {
        delegateShape.remove();
        this.target.set('edgeDelegate', null);
      }

      this._updateEdge(this.target, e, true);
      this.graph.setItemState(this.origin.sourceNode, 'show-anchor', false);
      this.target = null;
      this.origin = null;
      this.graph.set('edgeDragging', false);
    },
    sameNode(e) {
      return e.target instanceof Marker && e.target.getParent() && e.target.getParent().getParent().get('item').get('id') === this.origin.sourceNode.get('id')
    },
    dragEdgeBeforeShowAnchorBySub(subProcessNode) {
      const group = subProcessNode.getContainer();
      group.nodes.forEach(a => {
        const aGroup = a.getContainer();
        aGroup.showAnchor();
        aGroup.anchorShapes.forEach(b => b.get('item').showHotpot());
      });
    },
    dragEdgeBeforeShowAnchor() {
      const sourceGroupId = this.origin.sourceNode.getModel().groupId;
      this.graph.getNodes().forEach(node => {
        if (node.getModel().clazz === 'start' ||
          node.getModel().clazz === 'timerStart' ||
          node.getModel().clazz === 'messageStart') { return; }
        const targetGroupId = node.getModel().groupId;
        if (!sourceGroupId && targetGroupId || sourceGroupId && !targetGroupId || sourceGroupId !== targetGroupId) { return; }
        const group = node.getContainer();
        group.showAnchor();
        group.anchorShapes.forEach(a => a.get('item').showHotpot())
      });
    },
    // 判断当前节点的锚点能否创建边连接
    _judgeCanDrawEdge(node, anchorIndex) {
      if (node._cfg.locked) {
        // 被锁定状态
        return false
      }
      const nodeItemModel = node.getModel();
      const outEdges = node.getOutEdges().length
      // 输入锚点不能创建新边的node
      const inputNotDrawEdgeNodes = ['operation-node', 'end-node', 'algo-node']
      // 有输出锚点的节点  只能输出一个边
      const hasOutputNodes = ['input-node', 'operation-node', 'algo-node']

      if (inputNotDrawEdgeNodes.indexOf(nodeItemModel.type) !== -1 && anchorIndex === 0) {
        return false
      } else if (hasOutputNodes.indexOf(nodeItemModel.type) !== -1 && outEdges === 0) {
        if (nodeItemModel.data.output.length) {
          return true
        } else {
          $bus.$emit('editor-err', '当前节点没有设置输出！')
          return false
        }
      } else if (hasOutputNodes.indexOf(nodeItemModel.type) !== -1 && outEdges !== 0) {
        return false
      } else {
        return true
      }
    },
    // 判断目标节点的锚点能否被新创建边连接
    _judgeTargetNodeCanDrawEdge(origin) {
      const targetNode = origin.targetNode
      const targetAnchor = origin.targetAnchor
      const sourceNode = origin.sourceNode
      if (!targetNode) {
        return true
      }
      const targetNodeModel = targetNode.getModel();
      const edges = targetNode.getEdges()

      const inEdges = targetNode.getInEdges().length
      // 操作项类型的节点的输入锚点能被连接的个数
      const onlyOneInputArr = ['统计', '过滤', '计算公式', '去重', '字段处理', 'Top值筛选']
      const onlytTwoInputArr = ['交集', '并集', '差集', '补集']

      const outputEdgeLimit = ['operation-node', 'algo-node']

      if (targetNodeModel.type === 'end-node' && edges.length !== 0) {
        return false
      } else if (targetNodeModel.type === 'input-node') {
        return false
      } else if (outputEdgeLimit.indexOf(targetNodeModel.type) !== -1 && targetAnchor === 1) {
        return false
      } else if (targetNodeModel.type === 'operation-node' && targetAnchor === 0) {
        if (onlyOneInputArr.indexOf(targetNodeModel.label) !== -1) {
          if (edges.length === 0) {
            return true
          } else if (edges.length === 1 && edges[0]._cfg.sourceNode._cfg.id === targetNodeModel.id) {
            return true
          } else {
            return false
          }
        } else if (onlytTwoInputArr.indexOf(targetNodeModel.label) !== -1) {
          if (edges.length === 0) {
            return true
          } else if (edges.length === 1 && (edges[0]._cfg.sourceNode._cfg.id === targetNodeModel.id || edges[0]._cfg.targetNode._cfg.id === targetNodeModel.id)) {
            return true
          } else if (edges.length === 2 && !(edges[0]._cfg.targetNode._cfg.id === targetNodeModel.id && edges[1]._cfg.targetNode._cfg.id === targetNodeModel.id)) {
            return true
          } else {
            return false
          }
        } else if (targetNodeModel.label === '自定义') {
          // 自定义不限制输入源数量
          return true;
        } else {
          return false
        }
      } else if (targetNodeModel.type === 'algo-node' && targetAnchor === 0) {
        // 算法模型的输入锚点  根据设置的输入源个数限制可以连接的边
        if (targetNodeModel.data && targetNodeModel.data.orgdata && targetNodeModel.data.orgdata.inputCount) {
          if (inEdges < targetNodeModel.data.orgdata.inputCount) {
            return true
          } else {
            return false
          }
        } else {
          $bus.$emit('editor-err', '当前节点没有设置输入源数量！')
          return false
        }
      } else {
        // 结果组件连接边时，进行输出字段的自动赋值
        if (targetNodeModel.type === 'end-node') {
          const sourceNodeModel = sourceNode.getModel();
          targetNodeModel.data.output = sourceNodeModel.data.output;
          targetNodeModel.data = JSON.parse(JSON.stringify(targetNodeModel.data)); // 使用深拷贝避免被冲掉
        }
        return true
      }
    },
    _updateEdge(item, e, force) {
      const x = e.x;
      const y = e.y;
      if (this.delegate && !force) {
        this._updateEdgeDelegate(item, x, y);
        return;
      }
      const node = e.target.getParent().getParent().get('item');
      const groupId = node.get('groupId');

      let canDraw = true
      if (this.origin) {
        canDraw = this._judgeTargetNodeCanDrawEdge(this.origin)
      }

      if (groupId && canDraw) {
        this._addSubProcessEdge(node, e);
      } else if (canDraw) {
        this._addEdge(e);
      }
      this._clearAllAnchor();
      this.graph.paint();
    },
    _updateEdgeDelegate(item, x, y) {
      const self = this;
      let edgeShape = item.get('edgeDelegate');
      if (!edgeShape) {
        const parent = self.graph.get('group');
        edgeShape = parent.addShape('line', {
          attrs: {
            x1: this.origin.x,
            y1: this.origin.y,
            x2: x,
            y2: y,
            ...editorStyle.edgeDelegationStyle
          }
        });
        edgeShape.set('capture', false);
        item.set('edgeDelegate', edgeShape);
      }
      edgeShape.attr({ x2: x, y2: y });
      this.graph.paint();
    },
    _clearAllAnchor() {
      this.graph.getNodes().forEach(node => {
        const group = node.getContainer();
        group.clearAnchor();
      });
    },
    _addSubProcessEdge(node) {
      if (this.origin.targetNode) {
        const group = node.getContainer().getParent().getParent();
        const subProcess = node.getContainer().getParent().getParent().get('item');
        const sourceId = this.origin.sourceNode.get('id');
        const targetId = this.origin.targetNode.get('id');
        const addModel = {
          id: sourceId + '_to_' + targetId,
          clazz: 'flow',
          source: sourceId,
          target: targetId,
          sourceAnchor: this.origin.sourceAnchor,
          targetAnchor: this.origin.targetAnchor
        };
        const resultModel = group.addEdgeModel(subProcess, addModel);
        if (this.graph.executeCommand) {
          this.graph.executeCommand('update', {
            itemId: subProcess.get('id'),
            updateModel: resultModel
          });
        } else {
          this.graph.updateItem(node, resultModel);
        }
      }
    },
    _addEdge() {
      if (this.origin.targetNode) {
        const timestamp = new Date().getTime();
        const addModel = {
          id: 'flow' + timestamp,
          clazz: 'flow',
          source: this.origin.sourceNode.get('id'),
          target: this.origin.targetNode.get('id'),
          sourceAnchor: this.origin.sourceAnchor,
          targetAnchor: this.origin.targetAnchor
        };
        if (this.graph.executeCommand) {
          this.graph.executeCommand('add', {
            type: 'edge',
            addModel: addModel
          });
        } else {
          this.graph.add('edge', addModel);
        }
      }
    }
  });
}
