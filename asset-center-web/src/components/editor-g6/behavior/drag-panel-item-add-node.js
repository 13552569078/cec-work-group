import editorStyle from '../util/default-style';
import { getShapeName } from '../util/clazz';
import $bus from '@/utils/bus';
import store from '@/store'

export default function (G6) {
  G6.registerBehavior('dragPanelItemAddNode', {
    getDefaultCfg() {
      return {

      };
    },
    getEvents() {
      return {
        'canvas:mousemove': 'onMouseMove',
        'canvas:mouseup': 'onMouseUp',
        'canvas:mouseleave': 'onMouseLeave'
      }
    },
    onMouseMove(e) {
      if (this.graph.get('addNodeDragging')) {
        let delegateShape = this.graph.get('addDelegateShape');
        const addModel = this.graph.get('addModel');
        const width = parseInt(addModel.size.split('*')[0]);
        const height = parseInt(addModel.size.split('*')[1]);
        const point = this.graph.getPointByClient(e.x, e.y);
        const x = point.x;
        const y = point.y;
        if (!delegateShape) {
          const parent = this.graph.get('group');
          delegateShape = parent.addShape('rect', {
            attrs: {
              width,
              height,
              x: x - width / 2,
              y: y - height / 2,
              ...editorStyle.nodeDelegationStyle
            }
          });
          delegateShape.set('capture', false);
          this.graph.set('addDelegateShape', delegateShape);
        }
        delegateShape.attr({ x: x - width / 2, y: y - height / 2 });
        this.graph.paint();
        this.graph.emit('afternodedrag', delegateShape);
      }
    },
    onMouseUp(e) {
      if (this.graph.get('addNodeDragging')) {
        const p = this.graph.getPointByClient(e.clientX, e.clientY);
        const subProcessNode = this.graph.find('node', (node) => {
          if (node.get('model')) {
            const clazz = node.get('model').clazz;
            if (clazz === 'subProcess') {
              const bbox = node.getBBox();
              return p.x > bbox.minX && bbox.maxX > p.x &&
                p.y > bbox.minY && bbox.maxY > p.y;
            }
          } else {
            return false;
          }
        });
        if (subProcessNode) {
          if (p.x > 0 && p.y > 0) {
            this._addNodeBySubProcess(p, subProcessNode);
          }
        } else {
          if (!e.clientX && !e.clientY) {
            // 火狐浏览器中坐标点为0
            p.x = 0 - p.x
            p.y = e.screenY + p.y
            this._addNode(p);
          } else {
            this._addNode(p);
          }
        }
      }
    },
    _addNodeBySubProcess(p, node) {
      if (this.graph.get('addNodeDragging')) {
        const addModel = this.graph.get('addModel');
        const { clazz = 'userTask' } = addModel;
        addModel.shape = getShapeName(clazz);
        addModel.size = addModel.size.split('*');
        const timestamp = new Date().getTime();
        const id = clazz + timestamp;
        const bbox = node.getBBox();
        const x = p.x - bbox.x - bbox.width / 2;
        const y = p.y - bbox.y - bbox.height / 2;
        const nodeCfg = {
          ...addModel,
          x,
          y,
          id
        };
        const group = node.getContainer();
        const resultModel = group.addNodeModel(node, nodeCfg);
        if (this.graph.executeCommand) {
          this.graph.executeCommand('update', {
            itemId: node.get('id'),
            updateModel: resultModel
          });
        } else {
          this.graph.updateItem(node, resultModel);
        }
      }
    },
    onMouseLeave() {
      if (this.graph.get('addNodeDragging')) {
        this._clearDelegate();
        this.graph.emit('afternodedragend');
      }
    },
    _clearDelegate() {
      const delegateShape = this.graph.get('addDelegateShape');
      if (delegateShape) {
        delegateShape.remove();
        this.graph.set('addDelegateShape', null);
        this.graph.paint();
      }
      this.graph.emit('afternodedragend');
    },
    _addNode(p) {
      console.log(this.graph.get('addNodeDragging'), '&&&&&---->_addNode')

      if (this.graph.get('addNodeDragging')) {
        const addModel = JSON.parse(JSON.stringify(this.graph.get('addModel')));
        const { clazz = 'userTask' } = addModel;
        // type、shape属性同时存在即兼容之前版本的数据，又兼容g6的升级
        addModel.type = getShapeName(clazz);
        addModel.shape = getShapeName(clazz);
        const timestamp = new Date().getTime();
        const id = clazz + timestamp;
        const x = p.x;
        const y = p.y;
        if (this.graph.executeCommand) {
          this.graph.executeCommand('add', {
            type: 'node',
            addModel: {
              ...addModel,
              x: x,
              y: y,
              id: id
            }
          });
          if (addModel.type === 'input-node' || addModel.type === 'algo-node') {
            // 研判模型的增加、算法模型
            $bus.$emit('drag-add-model', {
              ...addModel,
              id: id
            })
          }
        } else {
          this.graph.add('node', {
            ...addModel,
            x: x,
            y: y,
            id: id
          });
        }
        // 将拖拽过来的“数据源、基础模型、研判模型、结果”的名字放到store中
        if (addModel.clazz === 'input') {
          const changeCurrentModelNames = store.state.settings.currentModelNames;
          store.dispatch('settings/changeCurrentModelNames', {
            ...changeCurrentModelNames,
            input: [...changeCurrentModelNames.input, addModel.label]
          })
        } else if (addModel.clazz === 'end') {
          const changeCurrentModelNames = store.state.settings.currentModelNames;
          store.dispatch('settings/changeCurrentModelNames', {
            ...changeCurrentModelNames,
            node: [...changeCurrentModelNames.node, addModel.label]
          })
        }
        this._clearDelegate();
        // 处理麒麟系统火狐浏览器addNodeDragging一直在的问题
        this.graph.set('addNodeDragging', false);
        this.graph.set('addModel', null);
      }
    }
  });
}