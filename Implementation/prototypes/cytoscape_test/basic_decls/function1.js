

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
        'border-width': 1,
        'text-outline-color': 'white',
        'text-outline-width': 0,
        'shape': 'rectangle',
        'opacity': 1,
        'width': 'label',
      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': 'black',
        'target-arrow-fill': 'solid',
        'line-color': 'black',
        'line-style': 'solid',
        'width': 13
      }),
  elements: {
    nodes: [
      { data: 
          { id: 'a1', label: 'int a1'},
          position: {
            x: 0,
            y: 0
          }},
      { data: { id: 'a2', label: 'int a2'},
          position: {
            x: 300,
            y: 0
          }},
      { data: { id: 'b', label: 'foo'},
          position: {
            x: 150,
            y: 150
          }},
      { data: { id: 'c', label: 'int'},
          position: {
            x: 150,
            y: 300
          }}
    ],
    edges: [
      { data: { id: 'a1b', source: 'a1', target: 'b' } },
      { data: { id: 'a2b', source: 'a2', target: 'b' } },
      { data: { id: 'bc', source: 'b', target: 'c' } }

    ]
  },
  layout: {
    name: 'preset'/*,
    fit: false, // whether to fit the viewport to the graph
    padding: 20, // padding used on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 100, // extra spacing around nodes when avoidOverlap: true
    nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    condense: true, // uses all available space on false, uses minimal space on true
    rows: 3, // force num of rows in the grid
    cols: 3, // force num of columns in the grid
    position: function( node ){return (1,1)}, // returns { row, col } for element
    sort: function(a, b){ return 0 }, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
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

