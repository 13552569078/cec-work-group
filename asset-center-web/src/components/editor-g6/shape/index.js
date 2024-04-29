import registerAnchor from './anchor'
import registerControlPoint from './control-point'
import registerNode from './node'
import registerFlowNode from './flow-node'
import registerEdge from './edge'
import registerSubProcess from './sub-process'

export default function(G6) {
  registerAnchor(G6);
  registerControlPoint(G6);
  registerNode(G6);
  registerFlowNode(G6);
  registerEdge(G6);
  registerSubProcess(G6)
}
