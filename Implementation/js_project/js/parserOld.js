/*
export DYLD_LIBRARY_PATH=/Applications/Xcode.app/Contents/Frameworks/
*/

const cppTestDir = './test/cpp'
const jsonTestDir = './test/json'

// DEBUG = 0 is production (No QUnit, No Printing)
// DEBUG = 1 runs QUnit
// DEBUG = 2 runs QUnit, and allows prints through debugParser
const DEBUG = 0;

if(DEBUG > 0) {
    document.getElementById('code-editor-container').style.display = 'none';
} else {
    document.getElementById('qunit-container').style.display = 'none';
}

const libclang = require('libclang');
const fs = require('fs');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const path = require('path');
const tempy = require('tempy');



var cppFilenames = [];
var jsonFilenames = [];

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;


var dclang = require('./node_modules/libclang/lib/dynamic_clang.js');
var consts = dclang.CONSTANTS;
var parsedKinds = ["CXCursor_VarDecl"]

if(DEBUG > 1) {
    debugParser(cppTestDir + '/testfile.cpp')
} 

var editor;

// require node modules before loader.js comes in
function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}
amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, './node_modules/monaco-editor/min'))
});
// workaround monaco-css not understanding the environment
self.module = undefined;
// workaround monaco-typescript not understanding the environment
self.process.browser = true;
amdRequire(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('container'), {
        value: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        language: 'javascript'
    });
    editor.onDidChangeModelContent((e) => {
        printCode();
    });
});

var cy = window.cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: [
    {
      selector: 'node',
      css: {
        'content': 'data(id)',
        'text-valign': 'center',
        'text-halign': 'center'
      }
    },
    {
      selector: '$node > node',
      css: {
        'padding-top': '10px',
        'padding-left': '10px',
        'padding-bottom': '10px',
        'padding-right': '10px',
        'text-valign': 'top',
        'text-halign': 'center',
        'background-color': '#bbb'
      }
    },
    {
      selector: 'edge',
      css: {
        'target-arrow-shape': 'triangle'
      }
    },
    {
      selector: ':selected',
      css: {
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      }
    }
  ],

  elements: {
    nodes: [
      { data: { id: 'a', parent: 'b' }, position: { x: 215, y: 85 } },
      { data: { id: 'b' } },
      { data: { id: 'c', parent: 'b' }, position: { x: 300, y: 85 } },
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
    name: 'preset',
    padding: 5
  }
});

function printCode() {
    var tempFileName = tempy.file({extension: 'cpp'})
    fs.writeFile(tempFileName, editor.getValue(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("STRING TO FILE TO PARSER");
        console.log("------");
        console.log(JSON.stringify(parser(tempFileName), null, 2));
    }); 
}

fs.readdirSync(cppTestDir).forEach(fileName => {
    if(path.parse(fileName).ext==".cpp") {
        cppFilenames.push(path.parse(fileName).name);
    }
})

fs.readdirSync(jsonTestDir).forEach(fileName => {
    if(path.parse(fileName).ext==".json") {
        jsonFilenames.push(path.parse(fileName).name);
    }
})


QUnit.test("test", function( assert ) {
    for (i in jsonFilenames) {
        for (j in cppFilenames) {
            if (jsonFilenames[i] == cppFilenames[j]) {
                var jsonString = fs.readFileSync("./test/json/" + jsonFilenames[i] + ".json", 'utf8');
                try {
                    JSON.parse(jsonString);
                } catch (e) {
                    console.log( "SYNTAX ERROR IN " + jsonFilenames[i] + ".json \n" + e);
                }
                assert.deepEqual(parser(cppTestDir + '/' + cppFilenames[j] + ".cpp"), JSON.parse(jsonString), cppFilenames[j]);
            }
        }
    }
});


var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                var item = this[i];
                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};

exports.parser =  function (fileName) {
    var declObj = {decls: []};
    var i = 0;
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fileName, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        if(this.spelling == "__llvm__") {
            return;
        } else {
            if(contains.call(parsedKinds, consts.CXCursorKind[this.kind])) {
                declObj.decls[i] = {Name:this.spelling, LineNumber: this.location.presumedLocation.line, Type:"CXType_Int"}
                if(this.kind == consts.CXCursorKind["CXCursor_VarDecl"] && this.pointeeType.kind != consts.CXTypeKind["CXType_Invalid"]) {
                    //declObj.decls[i].Type = consts.CXTypeKind[this.pointeeType.kind]
                } else if(this.kind == consts.CXCursorKind["CXCursor_VarDecl"]) {
                    //declObj.decls[i].Type = "CXType_Int";//consts.CXTypeKind[this.type.kind];
                }        
                i++;
            }
            return Cursor.Recurse;
        }
    });
    return declObj;
    index.dispose();
    tu.dispose;
    
}

exports.debugParser = function (fileName) {
    debugPrint("Debug Parser with file path = ", fileName);
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fileName, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        if(this.spelling == "__llvm__") {
            return;
        } else {
            debugPrint(
            'Name = '+this.spelling+ '\n' + 
            'Kind (Number) = '+this.kind+  '\n' + 
            'Kind = '+consts.CXCursorKind[this.kind]+ '\n' +
            'Type = '+consts.CXTypeKind[this.type.kind]+ '\n' +
            'Pointee Type = '+consts.CXTypeKind[this.pointeeType.kind]+ '\n' +
            'Pointee Type (Number) = '+this.pointeeType.kind+ '\n' +
            'Line Number = '+this.location.presumedLocation.line+ '\n' +
            'Column Number = '+this.location.presumedLocation.column+ '\n' +    
            '-----------------',null);            
            return Cursor.Recurse;
        }
    });
    index.dispose();
    tu.dispose;
    return;
}

function debugPrint(message,varName) {
    if(DEBUG > 1) {
        if(varName==null) {
            console.log(message);
        } else {
            console.log(message + varName);
        }
    }
}