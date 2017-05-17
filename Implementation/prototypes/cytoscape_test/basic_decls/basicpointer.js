

var cy = cytoscape({
  container: document.querySelector('#cy'),


  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(label)',
        'text-valign': 'center',
        'color': 'black',
        'background-color': 'white',
        'border-color': 'black',
        'border-width': 2,
        'text-outline-color': '#999',
        'shape': 'rectangle',
        'opacity': 1
      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': 'black',
        'line-color': 'black',
        'width': 1
      }),
  elements: {
    nodes: [
      { data: { id: 'a', label: 'int'}},
      { data: { id: 'f', label: 'foo'}}
    ],
    edges: [
      { data: { id: 'af', source: 'a', target: 'f' } }

    ]
  },
  layout: {
    name: 'grid',
    fit: false, // whether to fit the viewport to the graph
    padding: 10, // padding used on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 100, // extra spacing around nodes when avoidOverlap: true
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    condense: true, // uses all available space on false, uses minimal space on true
    rows: 2, // force num of rows in the grid
    cols: undefined, // force num of columns in the grid
    position: function( node ){}, // returns { row, col } for element
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop*/
  },
  boxSelectionEnabled: false,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
  userZoomingEnabled: false,
  userPanningEnabled: false,
  autoungrabify: true

});

