export default {
  nodeActivedOutterStyle: { lineWidth: 0 },
  groupSelectedOutterStyle: { stroke: '#E0F0FF', lineWidth: 2 },
  nodeSelectedOutterStyle: { stroke: '#E0F0FF', lineWidth: 2 },
  edgeActivedStyle:
  {
    stroke: '#13C2C3',
    strokeOpacity: 1
  },
  nodeActivedStyle: { fill: '#F3F9FF', stroke: '#1890FF' },
  groupActivedStyle: { stroke: '#1890FF' },
  edgeSelectedStyle:
  {
    lineWidth: 3,
    strokeOpacity: 1,
    stroke: '#13C2C3'
  },
  nodeSelectedStyle: { fill: 'rgba(92,101,141, 0.2)', stroke: '#1890FF' },
  groupSelectedStyle: { stroke: '#1890FF', fillOpacity: 0.92 },
  nodeStyle: {
    stroke: '#CED4D9',
    fill: '#FFFFFF',
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 10,
    shadowColor: 'rgba(13, 26, 38, 0.08)',
    lineWidth: 1,
    radius: 4,
    strokeOpacity: 0.7
  },
  edgeStyle:
  {
    stroke: '#516BF4',
    strokeOpacity: 0.95,
    lineWidth: 2,
    lineAppendWidth: 8,
    endArrow: true
  },
  groupBackgroundPadding: [40, 10, 10, 10],
  groupLabelOffsetX: 10,
  groupLabelOffsetY: 10,
  edgeLabelStyle: { fill: '#666', textAlign: 'center', textBaseline: 'middle' },
  edgeLabelRectPadding: 4,
  edgeLabelRectStyle: { fill: 'white' },
  nodeLabelStyle: { fill: '#666', textAlign: 'center', textBaseline: 'middle' },
  groupStyle: { stroke: '#CED4D9', radius: 4 },
  groupLabelStyle: { fill: '#666', textAlign: 'left', textBaseline: 'top' },
  multiSelectRectStyle: { fill: '#1890FF', fillOpacity: 0.08, stroke: '#1890FF', opacity: 0.1 },
  dragNodeHoverToGroupStyle: { stroke: '#1890FF', lineWidth: 2 },
  dragNodeLeaveFromGroupStyle: { stroke: '#BAE7FF', lineWidth: 2 },
  anchorPointStyle: { r: 6, fill: '#fff', stroke: '#1890FF', lineAppendWidth: 12 },
  anchorHotsoptStyle: { r: 12, fill: '#1890FF', fillOpacity: 0.25 },
  anchorHotsoptActivedStyle: { r: 14 },
  anchorPointHoverStyle: { r: 6, fill: '#1890FF', fillOpacity: 1, stroke: '#1890FF' },
  nodeControlPointStyle: { radius: 4, fill: '#fff', shadowBlur: 4, shadowColor: '#666' },
  edgeControlPointStyle: { radius: 6, symbol: 'square', lineAppendWidth: 6, fillOpacity: 0, strokeOpacity: 0 },
  nodeSelectedBoxStyle: { stroke: '#C2C2C2' },
  cursor: {
    panningCanvas: '-webkit-grabbing',
    beforePanCanvas: '-webkit-grab',
    hoverNode: 'move',
    hoverEffectiveAnchor: 'crosshair',
    hoverEdge: 'default',
    hoverGroup: 'move',
    hoverUnEffectiveAnchor: 'default',
    hoverEdgeControllPoint: 'crosshair',
    multiSelect: 'crosshair'
  },
  nodeDelegationStyle: {
    stroke: '#C8D1F8',
    fill: '#C8D1F8',
    fillOpacity: 0.08,
    lineDash: [2, 2],
    radius: 2,
    lineWidth: 1,
    shadowColor: '#B4BFEF',
    shadowBlur: 3,
    shadowOffsetX: 0,
    shadowOffsetY: 2
  },
  edgeDelegationStyle: { stroke: '#1890FF', lineDash: [4, 4], lineWidth: 1 }
};
