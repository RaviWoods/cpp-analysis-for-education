const consts = require('./consts.js')
const libclang = require('libclang');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const dclang = require('../node_modules/libclang/lib/dynamic_clang.js');
const graphviz = require("graphviz");

var TypeLabelNavbar = {
    "17": "Integer",
    "21": "Decimal",
    "13": "Character",
    "101": "Pointer",
    "112": "Array",
    "22": "Double"
};

var TypeLabel = {
    "17": "Integer\\n(int)",
    "21": "Decimal\\n(float)",
    "13": "Character\\n(char)",
    "101": "",
    "112": "",
    "22": "Precise Decimal\\n(double)"
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

function addArrayNode(declaration,id,type,size, name) {
    if(size == 1) {
        var innerlabel = "label = \"" + type + "\";" ;
    } else if(size == 2) {
        var innerlabel = "label = \"\<f0\>" + type + "| \<f1\>\";"
    } else if(size == 3) {
        var innerlabel = "label = \"\<f0\>" + type + "| \<f1\> | \<f2\>\";"
    } else {
        var innerlabel = "label = \"\<f0\>" + type + "| \<f1\>...| \<f2\>\";"
    }
    
    var outerLabel = "label = \"" + name + " of size " + size + "\";"
    var cluster = "subgraph cluster" + id + " {color=grey70; style=rounded;" + id + "[" + innerlabel + "shape = \"record\"];" + outerLabel + "}";
    return (declaration += cluster);
}

function addDataNode(g,id,name,label) {
    var node = g.addNode(id);
    node.set("shape","Mrecord");
    if(name==null) {
        node.set("label","<f0>" + getLabel(label));
    } else {
        console.log(getLabel[label])
        node.set("label","<f0>" + name + "| <f1>" + getLabel(label));
    }
    return id++;
}

function addEdge(declaration,id1,id2) {
    var edge = id1 + " -> " + id2 + ";";
    return (declaration += edge);
}

function getLabel(kind) {
    if(TypeLabel[kind]==null) {
        return dCConsts.CXTypeKind[kind];
    } else {
        return TypeLabel[kind];
    }
}

function getNavLabel(kind) {
    if(TypeLabelNavbar[kind]==null) {
        return dCConsts.CXTypeKind[kind];
    } else {
        return TypeLabelNavbar[kind];
    }
}

exports.parser2 =  function (fileName) {
    var declObj = {decls:[]};
    var i = 0;
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fileName, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        if(this.spelling == "__llvm__") {
            return;
        } else {
            var g = graphviz.digraph("G");
            var id = 0;
            g.set("rankdir","LR");
            g.set("splines","line");
            g.set("style","filled");
            var parsed = false;
            if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"]) {
                parsed = true;
                addDataNode(g,id,null,this.type.kind);
            }

            if(parsed) {
                declObj.decls[i] = {LineNumber:this.location.presumedLocation.line, Name:this.spelling, Type:getNavLabel(this.type.kind), Graph:g.to_dot(), StartColumn: this.location.presumedLocation.column, EndColumn:this.location.presumedLocation.column+this.spelling.length};
                i++;
            }
            return Cursor.Recurse;
        }
    });
    return declObj;
    index.dispose();
    tu.dispose;
}

/*
exports.parser2 =  function (fileName) {
    var declObj = {decls:[]};
    var boilerPlate = "digraph G { rankdir=LR; splines=ortho;compound=true;graph[style=\"filled\",fillcolor=\"cadetblue1\"]; node [shape=box,style=\"filled\", fillcolor=\"white\"];";
    var i = 0;
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fileName, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        if(this.spelling == "__llvm__") {
            return;
        } else {
            var parsed = false;
            var declaration = boilerPlate;
            if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"]) {
                currentParserElement = this.type;
                if(currentParserElement.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
                    parsed = true;
                    var id = 1;
                    declObj.decls[i] = {LineNumber:this.location.presumedLocation.line, Graph:declaration};
                    declaration = addArrayNode(declaration,id,TypeLabels[currentParserElement.arrayElementType.kind], currentParserElement.arraySize,this.spelling);
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
            } else if(this.kind == dCConsts.CXCursorKind["CXCursor_FunctionDecl"]) {
                //parsed = true;
                //for(var i = 0; i < this.type.argTypes; i++) {
                //}
            }

            if(parsed) {
                console.log("parsed")
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
*/

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
            'Number of arguments = ' +this.type.argTypes+ '\n' +
            'Line Number = '+this.location.presumedLocation.line+ '\n' +
            'Column Number = '+this.location.presumedLocation.column);
            for(var i = 0; i < this.type.argTypes; i++) {
                console.log(
                    'Argument' + i + ':\n' +
                    'Argument Type = ' +dCConsts.CXTypeKind[this.getArgument(i).type.kind]+ '\n' +
                    'Argument Name = ' +this.getArgument(i).spelling);
            }
            console.log('-----------');      
            return Cursor.Recurse;
        }
    });
    index.dispose();
    tu.dispose;
    return;
}