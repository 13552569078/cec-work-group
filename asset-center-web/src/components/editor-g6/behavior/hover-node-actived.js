import { Marker } from '@antv/g-canvas/lib/shape';
export default function(G6) {
  G6.registerBehavior('hoverNodeActived', {
    getEvents() {
      return {
        'node:mouseenter': 'onNodeEnter',
        'node:mouseleave': 'onNodeLeave',
        'anchor:mouseleave': 'onAnchorLeave'
      }
    },
    onAnchorLeave(e) {
      const node = e.item.getContainer().getParent();
      if (node && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(node.get('item'), 'show-anchor', false);
      }
    },
    onNodeEnter(e) {
      const clazz = e.item.getModel().clazz;
      if (clazz !== 'endEvent' && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(e.item, 'show-anchor', true);
      }
    },
    onNodeLeave(e) {
      // console.log(e.target, '**********', e.target instanceof Marker, Marker)
      // 注意：在服务器打包后 e.target 没有对应的工厂函数 e.target instanceof Marker 无效，使用e.target.cfg && !e.target.cfg.el 来临时区别是锚点还是 node本身
      if (!(e.target instanceof Marker || (e.target.cfg && !e.target.cfg.el)) && !this.graph.get('edgeDragging')) {
      // if(!(e.target instanceof Marker) && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(e.item, 'show-anchor', false);
      }
    }
  });
}
