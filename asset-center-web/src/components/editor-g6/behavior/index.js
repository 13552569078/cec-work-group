import clickSelected from './click-selected'
import deleteItem from './delete-item'
import dragNode from './drag-node'
import dragEdge from './drag-edge'
import dragPanelItemAddNode from './drag-panel-item-add-node'
import hoverAnchorActived from './hover-anchor-actived'
import hoverNodeActived from './hover-node-actived'
import itemAlign from './item-align'
import dragPoint from './drag-point';
export default function(G6) {
  clickSelected(G6);
  deleteItem(G6);
  dragNode(G6);
  dragEdge(G6);
  dragPanelItemAddNode(G6);
  hoverAnchorActived(G6);
  hoverNodeActived(G6);
  itemAlign(G6);
  dragPoint(G6);
}
