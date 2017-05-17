var cy = cytoscape({
  container: document.querySelector('#cy'),


  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)',
        'text-valign': 'center',
        'color': 'black',
        'text-outline-width': 2,
        'background-color': '#999',
        'border-color': '#15d',
        'text-outline-color': '#999',
        'shape': 'rectangle',
        'opacity': 1
      })
    .selector('$node > node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'black',
        'text-outline-width': 2,
        'background-color': '#e12',
        'border-color': '#15d',
        'text-outline-color': '#999',
        'shape': 'rectangle',
        'opacity': 1
      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#ccc',
        'line-color': '#ccc',
        'width': 1
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      })
    .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      }),

  elements: {
    nodes: [
      { data: { id: 'a', parent: 'b' }, position: { x: 215, y: 85 } },
      { data: { id: 'b' } },
      { data: { id: 'c', parent: 'b' }, position: { x: 215, y: 50 } },
      { data: { id: 'd' }, position: { x: 215, y: 175 } },
      { data: { id: 'e' } },
      { data: { id: 'f', parent: 'e' }, position: { x: 300, y: 175 } }
    ],
    edges: [
      { data: { id: 'ad', source: 'a', target: 'd' } },
      { data: { id: 'eb', source: 'e', target: 'b' } }

    ]
  },
  layout: {
    name: 'preset'/*,
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

