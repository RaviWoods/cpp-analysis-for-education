/*
Outputs:
int foo[10]

Design made from constraints of system
*/

cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  layout: {
    name: 'preset',
    padding: 50
  },

  style: [{
    selector: 'node',
    css: {
      'content': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'shape': 'rectangle',
      'border-width': 1,
      'border-color': 'black',
      'background-color': 'white',
      width: '100px',
      height: '30px'
    }
  }, {
    selector: '.array-inner',
    css: {
      'background-color': '#bbb',
      "text-background-opacity": 1,
      "text-background-color": "white",
      "text-background-shape": "roundrectangle",
      "text-border-color": "white",
      "text-border-width": 5,
      "text-border-opacity": 1
    }
  }, {
    selector: '$node > node',
    css: {
      'background-color': 'white',
      'border-width': 0,
    }
  }, {
    selector: '.table',
    css: {
      content: '',
      'padding-top': '0',
      'padding-left': '0',
      'padding-bottom': '0',
      'padding-right': '0',
      'border-color': 'black',
      'background-color': 'white'
    }
  }, {
    selector: '.table-heading',
    css: {
      'background-color': 'white',
      'border-color': 'black'
    }
  }, {
    selector: 'edge',
    css: {
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': 'black',
        'line-color': 'black',
        'width': 1,
        'content': 'data(label)',
    }
  }],

  elements: {
    nodes: [{
      data: {
        id: 'array-table',
      },
      classes: 'table'
    }, {
      data: {
        id: 'array-node0',
        parent: 'array-table',
        label: 'int'
      },
      classes: 'table-heading',
      position: {
        x: 300,
        y: 0
      }
    }, {
      data: {
        id: 'array-node1',
        parent: 'array-table',
        label: 'size 10'
      },
      classes: 'array-inner',
      position: {
        x: 300,
        y: 30
      }
    }, {
      data: {
        id: 'array-node2',
        parent: 'array-table',
        label: ''
      },
      position: {
        x: 300,
        y: 60
      }
    }, {
      data: {
        id: 'node1',
        label: 'foo'
      },
      position: {
        x: 100,
        y: 0
      }
    }],
    edges: [
      { data: {label: '', source: 'node1', target: 'array-node0' } }
    ]
  },
  boxSelectionEnabled: false,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
  userZoomingEnabled: false,
  userPanningEnabled: false,
  autoungrabify: true
});