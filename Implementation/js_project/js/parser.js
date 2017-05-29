/*
export DYLD_LIBRARY_PATH=/Applications/Xcode.app/Contents/Frameworks/
*/

const cppTestDir = './test/cpp'
const jsonTestDir = './test/json'

// DEBUG = 0 is production (No QUnit, No Printing)
// DEBUG = 1 runs QUnit
// DEBUG = 2 runs QUnit, and allows prints through debugParser
const DEBUG = 1;

if(DEBUG > 0) {
    document.getElementById('code-editor-container').style.display = 'none';
} else {
    document.getElementById('qunit-container').style.display = 'none';
}

const libclang = require('libclang');
const fs = require('fs');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const path = require('path');

var cppFilenames = [];
var jsonFilenames = [];

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;


var dclang = require('../node_modules/libclang/lib/dynamic_clang.js');
var consts = dclang.CONSTANTS;
var parsedKinds = ["CXCursor_VarDecl"]

if(DEBUG > 1) {
    debugParser('intdeclbasic.cpp')
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
                assert.deepEqual(parser(cppFilenames[j] + ".cpp"), JSON.parse(jsonString), cppFilenames[j]);
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

function parser(fileName) {
    var fullFilePath = cppTestDir + '/' + fileName;
    var declObj = {decls: []};
    var i = 0;
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fullFilePath, [
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

function debugParser(fileName) {
    var fullFilePath = cppTestDir + '/' + fileName;
    debugPrint("Debug Parser with file path = ", fullFilePath);
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fullFilePath, [
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