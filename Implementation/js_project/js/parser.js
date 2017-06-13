const consts = require('./consts.js')
const libclang = require('libclang');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const dclang = require('../node_modules/libclang/lib/dynamic_clang.js');

var TypeLabelNavbar = {
    "17": "Integer",
    "21": "Decimal",
    "13": "Character",
    "101": "Pointer",
    "112": "Array",
    "22": "Double"
};

var TypeLabels = {
    "17": "Integer",
    "21": "Decimal",
    "13": "Character",
    "101": "",
    "112": "",
    "22": "Double"
};

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;

var dCConsts = dclang.CONSTANTS;
var parsedKinds = ["CXCursor_VarDecl"]

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
                if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"]) {
                    declObj.decls[i] = {Name:this.spelling, LineNumber: this.location.presumedLocation.line, Type:dCConsts.CXTypeKind[this.type.kind]}
                    currentJSONElement = declObj.decls[i];
                    currentParserElement = this.type;
                    while((currentParserElement.kind == dCConsts.CXTypeKind["CXType_ConstantArray"])||(currentParserElement.kind == dCConsts.CXTypeKind["CXType_Pointer"])) {
                        if (currentParserElement.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
                            currentJSONElement.Type = dCConsts.CXTypeKind[currentParserElement.kind]
                            currentJSONElement.ArraySize = currentParserElement.arraySize;
                            currentJSONElement.ElementType = dCConsts.CXTypeKind[currentParserElement.arrayElementType.kind];
                            currentJSONElement = currentJSONElement.ElementType;
                            currentParserElement = currentParserElement.arrayElementType;    
                            if(fileName == './test/cpp/C5.cpp') {
                                consts.debugPrint("array parser",null)
                            }
                        } else if(currentParserElement.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {

                            currentJSONElement.Type = dCConsts.CXTypeKind[currentParserElement.kind]
                            currentParserElement = currentParserElement.pointeeType; 
                            currentJSONElement.PointeeType = {Type:dCConsts.CXTypeKind[currentParserElement.kind]}
                            if(fileName == './test/cpp/C5.cpp') {
                                consts.debugPrint("parser parser",null)
                            }
                            currentJSONElement = currentJSONElement.PointeeType;
                        }
                        if(fileName == './test/cpp/C5.cpp') {
                            consts.debugPrint(dCConsts.CXTypeKind[currentParserElement.kind],null)
                        }
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

function addArrayNode(declaration,id,type,size) {
    if(size == 1) {
        var innerlabel = "label = \"" + type + "\";" ;
    } else if(size == 2) {
        var innerlabel = "label = \"\<f0\>" + type + "| \<f1\>\";"
    } else if(size == 3) {
        var innerlabel = "label = \"\<f0\>" + type + "| \<f1\> | \<f2\>\";"
    } else {
        var innerlabel = "label = \"\<f0\>" + type + "| \<f1\>...| \<f2\>\";"
    }
    
    var outerLabel = "label = \"Size " + size + "\";"
    var cluster = "subgraph cluster" + id + " {color=grey90; style=rounded;" + id + "[" + innerlabel + "shape = \"record\"];" + outerLabel + "}";
    return (declaration += cluster);
}

function addNode(declaration,id,label) {
    var node = id + " [label=\"" + label + "\"];";
    return (declaration += node);
}

function addEdge(declaration,id1,id2) {
    var edge = id1 + " -> " + id2 + ";";
    return (declaration += edge);
}

exports.parser2 =  function (fileName) {
    var declObj = {decls: []};
    var boilerPlate = "digraph G { rankdir=LR; edge[arrowhead=\"open\",penwidth= \"1\"]; node [shape=box];";
    var i = 0;
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fileName, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        
        if(this.spelling == "__llvm__") {
            return;
        } else {
            var parsed;
            var declaration = boilerPlate;
            if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"]) {
                currentParserElement = this.type;
                if(currentParserElement.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
                    parsed = true;
                    var id = 1;
                    declaration = addNode(declaration,id,this.spelling);
                    id++;
                    declObj.decls[i] = {LineNumber:this.location.presumedLocation.line, Graph:declaration};
                    declaration = addArrayNode(declaration,id,TypeLabels[currentParserElement.arrayElementType.kind], currentParserElement.arraySize);
                    declaration = addEdge(declaration,id-1,id);
                    id++;
                } else if (currentParserElement.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {
                    parsed = true;
                    var id = 1;
                    declaration = addNode(declaration,id,this.spelling);
                    id++;
                    declObj.decls[i] = {LineNumber:this.location.presumedLocation.line, Graph:declaration};
                    while(currentParserElement.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {
                        currentParserElement = currentParserElement.pointeeType; 
                        declaration = addNode(declaration,id,TypeLabels[currentParserElement.kind]);
                        declaration = addEdge(declaration,id-1,id);
                        id++;
                    }
                } else {
                    parsed = true;
                    declaration = addNode(declaration,2,this.spelling,currentParserElement.kind);
                }
            } 

            if(parsed) {
                declaration = declaration += "}";
                declObj.decls[i] = {LineNumber:this.location.presumedLocation.line, Name:this.spelling, Type:TypeLabelNavbar[this.type.kind], Graph:declaration, StartColumn: this.location.presumedLocation.column, EndColumn:this.location.presumedLocation.column+this.spelling.length};
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
    console.log("Debug Parser with file path = " +  fileName);
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fileName, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        if(this.spelling == "__llvm__") {
            return;
        } else {
            console.log(
            'Name = '+this.spelling+ '\n' + 
            'Kind (Number) = '+this.kind+  '\n' + 
            'Kind = '+dCConsts.CXCursorKind[this.kind]+ '\n' +
            'Type = '+dCConsts.CXTypeKind[this.type.kind]+ '\n' +
            'Array Size = '+this.type.arraySize+ '\n' +
            'Element Size = '+dCConsts.CXTypeKind[this.type.arrayElementType.kind]+ '\n' +
            'Pointee Type = ' +dCConsts.CXTypeKind[this.pointeeType.kind]+ '\n' +
            'Pointee Type (Number) = '+this.pointeeType.kind+ '\n' +
            "Size of Array Pointed to = "+this.type.pointeeType.arraySize+ '\n' +
            "Type of Pointer in Array = "+dCConsts.CXTypeKind[this.type.pointeeType.arrayElementType.kind]+ '\n' +
            'Line Number = '+this.location.presumedLocation.line+ '\n' +
            'Column Number = '+this.location.presumedLocation.column+ '\n' +    
            '-----------------');            
            return Cursor.Recurse;
        }
    });
    index.dispose();
    tu.dispose;
    return;
}