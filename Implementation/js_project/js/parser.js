const consts = require('./consts.js')
const libclang = require('libclang');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const dclang = require('../node_modules/libclang/lib/dynamic_clang.js');
const graphviz = require("graphviz");

var id = 0;
var cid = 0;

var TypeLabelNavbar = {
    "17": "Integer",
    "21": "Decimal",
    "13": "Character",
    "101": "Pointer",
    "112": "Array",
    "22": "Double",
    "111": "Function",
};

var TypeLabel = {
    "17": "Integer\\n(int)",
    "21": "Decimal\\n(float)",
    "13": "Character\\n(char)",
    "101": "",
    "111": "",
    "112": "",
    "22": "Precise Decimal\\n(double)",
    "NoOut": "No output\\n (void)",
    "NoIn" : "No input\\n (void)",
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

function addArrayNode(g,name,size,label) {
    var cluster = g.addCluster("cluster_" + cid);
    cid++;
    cluster.set("style","rounded");
    cluster.set("color","grey90");
    var nameNode = cluster.addNode("node" + id);
    nameNode.set("shape","Mrecord");
    id++;
    var arrayNode = cluster.addNode("node" + id);
    arrayNode.set("shape","record");
    id++;
    console.log(name);
    if(size==0&&name==null) {
        nameNode.set("label","<f0>Unsized")
    } else if(size==0) {
        nameNode.set("label","<f0>" + name + "| <f1>Unsized")
    } else if(name==null) {
        nameNode.set("label","<f0> Size " + size);
    } else {
        nameNode.set("label","<f0>" + name + "| <f1>Size " + size);
    }
    
    if(size == 1) {
        arrayNode.set("label","<f0>" + getLabel(label));
    } else if(size == 2) {
        arrayNode.set("label","<f0>" + getLabel(label)+ "| <f1>");
    } else if(size == 3) {
        arrayNode.set("label","<f0>" + getLabel(label)+ "| <f1> | <f2>");
    } else {
        arrayNode.set("label","<f0>" + getLabel(label)+ "| <f1>...| <f2>");
    }

    return;
}

function addDataNode(g,name,label) {
    var node = g.addNode("node" + id);
    if(name==null) {
        node.set("shape","record");
        node.set("label","<f0>" + getLabel(label));
    } else if(name=="0return") {
        node.set("shape","Mrecord");
        node.set("label","<f0>" + getLabel(label));
    } else {
        node.set("shape","Mrecord");
        node.set("label","<f0>" + name + "| <f1>" + getLabel(label));
    }
    id++;
    return;
}

function addFunctionCluster(g,name,inputNum) {
    var cluster = g.addCluster("cluster_" + cid);
    cluster.set("color","white");
    cid++;
    if(inputNum > 1) {
        var preFuncNode = cluster.addNode("node" + id);
        preFuncNode.set("shape","point");
        preFuncNode.set("style","filled");
        preFuncNode.set("width","0.1");
        preFuncNode.set("fillcolor","gray60");
        preFuncNode.set("color","gray60");
        cluster.addEdge("node" + id, "node" + (id+1) + ":in");
        id++;
    }
    var funcNode = cluster.addNode("node" + id);
    if(name==null) {
        funcNode.set("shape","record");
        funcNode.set("label","<name>|{<in>IN|<out>OUT}");
    } else {
        funcNode.set("shape","record");
        funcNode.set("label","<name>" + name + "|{<in>IN|<out>OUT}");
    }
    id++;
    return;  
}

function getLabel(kind) {
    if(TypeLabel[kind]==null) {
        return dCConsts.CXTypeKind[kind];
    } else {
        return TypeLabel[kind];
    }
}

function parse(obj, g, type) {
    var parsed = false;
    var name;
    if(obj==null) {
        name = null;
    } else if(obj=="0return") {
        name = "0return";
    } else {
        name = obj.spelling;
    }
    if(type.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
        parsed = true;
        addArrayNode(g,name,type.arraySize,type.arrayElementType.kind);
        if(type.arrayElementType.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {
            pointerEdge = g.addEdge("node" + (id-1) + ":f0","node" + id);  
            pointerEdge.set("penwidth","1.0");
            pointerEdge.set("arrowhead","normal");
            pointerEdge.set("color","black");
            pointerEdge.set("style","solid");
            parsed = parse(null,g,type.arrayElementType.pointeeType);
        }
    } else if(type.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {
        addDataNode(g,name,type.kind);
        pointerEdge = g.addEdge("node" + (id-1) + ":f1","node" + id);  
        pointerEdge.set("penwidth","1.0");
        pointerEdge.set("arrowhead","normal");
        pointerEdge.set("color","black");
        pointerEdge.set("style","solid");
        if(type.pointeeType.kind == dCConsts.CXTypeKind["CXType_Unexposed"] && type.pointeeType.canonical.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
            pointerEdge.set("lhead","cluster_" + cid);
            parsed = parse(null,g,type.pointeeType.canonical); 
        } else if(type.pointeeType.kind == dCConsts.CXTypeKind["CXType_Unexposed"]) {
            parsed = parse(null,g,type.pointeeType.canonical); 
        } else {
            parsed = parse(null,g,type.pointeeType); 
        }
    } else if(type.kind == dCConsts.CXTypeKind["CXType_FunctionProto"]) {
        parsed = true;
        var functionID = id;
        addFunctionCluster(g,name,type.argTypes);
        var cluster = g.addCluster("cluster_" + cid);
        cid++;
        g.addEdge("node" + (id-1) + ":out", "node" + id); 
        if(obj.type.result.kind==dCConsts.CXTypeKind["CXType_FirstBuiltin"]) {
            addDataNode(cluster,"&#10060;","NoOut");
        } else {
            parse("0return",cluster,obj.type.result);
        }
        if(type.argTypes == 0) {
            var cluster = g.addCluster("cluster_" + cid);
            cid++;
            g.addEdge("node" + id,"node" + functionID + ":in"); 
            addDataNode(cluster,"&#10060;","NoIn");
        } else if(type.argTypes == 1) { 
            var cluster = g.addCluster("cluster_" + cid);
            cid++;
            g.addEdge("node" + id,"node" + functionID + ":in"); 
            parse(obj.getArgument(i),cluster,obj.getArgument(i).type);
        } else {
            for(var i = 0; i < type.argTypes; i++) {
                var cluster = g.addCluster("cluster_" + cid);
                cid++;
                g.addEdge("node" + id,"node" + functionID); 
                parse(obj.getArgument(i),cluster,obj.getArgument(i).type)
            }
        }
    } else {
        parsed = true;
        addDataNode(g,name,type.kind);
    }
    return parsed;
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
            id = 0;
            cid = 0;
            g.set("rankdir","LR");
            g.set("splines","line");
            g.set("style","filled");
            g.set("color","gray60");
            g.set("compound","true");
            g.setNodeAttribut("shape","record");
            g.setNodeAttribut("style","filled");
            g.setNodeAttribut("fillcolor","white");
            g.setEdgeAttribut("penwidth","2.0");
            g.setEdgeAttribut("arrowhead","none");
            g.setEdgeAttribut("style","dashed");
            g.setEdgeAttribut("color","gray60");
            var parsed = false;
            if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"]) {
                parsed = parse(this,g,this.type);
            } else if(this.kind == dCConsts.CXCursorKind["CXCursor_FunctionDecl"] && this.spelling!="main") {
                parsed = parse(this,g,this.type);
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
            'Canon Type = ' +dCConsts.CXTypeKind[this.pointeeType.canonical.result.kind]+ '\n' +
            'Number of arguments = ' +this.type.argTypes+ '\n' +
            'Return Type = ' +dCConsts.CXTypeKind[this.type.result.kind]+ '\n' +
            'Line Number = '+this.location.presumedLocation.line+ '\n' +
            'Column Number = '+this.location.presumedLocation.column);
            for(var i = 0; i < this.pointeeType.canonical.argTypes; i++) {
                console.log(
                    'Argument' + i + ':\n' );
                    //'Argument Type = ' +dCConsts.CXTypeKind[this.Recurse.type.kind]+ '\n' +
                    //'Argument Name = ' +this.Recurse);
            }
            console.log('-----------');      
            return Cursor.Recurse;
        }
    });
    index.dispose();
    tu.dispose;
    return;
}