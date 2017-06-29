const consts = require('./consts.js')
const libclang = require('libclang');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const dclang = require('../node_modules/libclang/lib/dynamic_clang.js');
const graphviz = require("graphviz");

var id = 1;
var cid = 1;

//var constEdges = [];

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


function addArrayNode(g,name,size,label,constant) {
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
    if(size==0&&name==null) {
        nameNode.set("label","<f0>Unsized")
    } else if(size==0) {
        nameNode.set("label","<f0>" + name + "| <f1>Unsized")
    } else if(name==null) {
        nameNode.set("label","<f0> Size " + size);
    } else {
        nameNode.set("label","<f0>" + name + "| <f1>Size " + size);
    }
    
    var fullLabel;
    if(constant && getLabel(label)!= "") {
        fullLabel = getLabel(label) + "\\n\u{1F512}";
    } else { 
        fullLabel = getLabel(label);
    }
    if(size == 1) {
        arrayNode.set("label","<f0>" + fullLabel);
    } else if(size == 2) {
        arrayNode.set("label","<f0>" + fullLabel+ "| <f1>");
    } else if(size == 3) {
        arrayNode.set("label","<f0>" + fullLabel+ "| <f1> | <f2>");
    } else {
        arrayNode.set("label","<f0>" + fullLabel+ "| <f1>...| <f2>");
    }

    return;
}

function addDataNode(g,name,label, constant) {
    var node = g.addNode("node" + id);
    var fullLabel = getLabel(label);
    if(constant && getLabel(label)!= "") {
        fullLabel = getLabel(label) + "\\n\u{1F512}";
    } else { 
        fullLabel = getLabel(label);
    }

    if(name==null && getLabel(label) == "") {
        node.set("shape","Mrecord");
        node.set("label","<f0>" + fullLabel);
    } else if(name==null) {
        node.set("shape","record");
        node.set("label","<f0>" + fullLabel);
    } else if(name=="0return") {
        node.set("shape","Mrecord");
        node.set("label","<f0>" + getLabel(label));
    } else {
        node.set("shape","Mrecord");
        node.set("label","<f0>" + name + "| <f1>" + fullLabel);
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
        var edge = cluster.addEdge("node" + id, "node" + (id+1) + ":in");
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

function parse(obj, g, type, input) {
    g.set("fillcolor", "white");
    g.set("penwidth", 4.0);
    var parsed = false;

    var name;
    if(obj==null) {
        name = null
    } else if(obj=="0return") {
        name = "0return";
    } else {
        name = obj.spelling;
    }

    if(type.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
        parsed = true;
        addArrayNode(g,name,type.arraySize,type.arrayElementType.kind,type.arrayElementType.isConst());
        if(type.arrayElementType.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {
            pointerEdge = g.addEdge("node" + (id-1) + ":f0","node" + id);  
            if(type.arrayElementType.isConst()) {
                pointerEdge.set("label","\u{1F512}");
            }
            pointerEdge.set("penwidth","1.0");
            pointerEdge.set("arrowhead","normal");
            pointerEdge.set("color","black");
            pointerEdge.set("style","solid");
            parsed = parse(null,g,type.arrayElementType.pointeeType);
        }
    } else if(type.kind == dCConsts.CXTypeKind["CXType_Pointer"]) {
        addDataNode(g,name,type.kind,type.isConst());
        if(type.pointeeType.kind == dCConsts.CXTypeKind["CXType_Unexposed"] && type.pointeeType.canonical.kind == dCConsts.CXTypeKind["CXType_ConstantArray"]) {
            pointerEdge = g.addEdge("node" + (id-1) + ":f1","node" + id); 
            pointerEdge.set("lhead","cluster_" + cid);
            pointerEdge.set("penwidth","1.0");
            pointerEdge.set("arrowhead","normal");
            pointerEdge.set("color","black");
            pointerEdge.set("style","solid");
            if(type.isConst()) {
                pointerEdge.set("label","\u{1F512}");
            } 
            parsed = parse(null,g,type.pointeeType.canonical); 
        } else if(type.pointeeType.kind == dCConsts.CXTypeKind["CXType_Unexposed"] && type.pointeeType.canonical.kind == dCConsts.CXTypeKind["CXType_FunctionProto"]) {
            
            if(type.pointeeType.canonical.argTypes < 2) {
                pointerEdge = g.addEdge("node" + (id-1) + ":f1","node" + (id)+ ":name"); 
            } else {
                pointerEdge = g.addEdge("node" + (id-1) + ":f1","node" + (id+1)+ ":name"); 
            }
            pointerEdge.set("penwidth","1.0");
            pointerEdge.set("arrowhead","normal");
            pointerEdge.set("color","black");
            pointerEdge.set("style","solid");
            if(type.isConst()) {
                pointerEdge.set("label","\u{1F512}");
            } 
            parsed = parse(null,g,type.pointeeType.canonical); 
        } else {
            pointerEdge = g.addEdge("node" + (id-1) + ":f1","node" + (id)+ ":f0"); 
            pointerEdge.set("penwidth","1.0");
            pointerEdge.set("arrowhead","normal");
            pointerEdge.set("color","black");
            pointerEdge.set("style","solid");
            if(type.isConst()) {
                pointerEdge.set("label","\u{1F512}");
            } 
            parsed = parse(null,g,type.pointeeType); 
        }

    } else if(type.kind == dCConsts.CXTypeKind["CXType_FunctionProto"]) {
        parsed = true;
        var functionID = id;
        addFunctionCluster(g,name,type.argTypes);
        var cluster = g.addCluster("cluster_" + cid);
        cid++;
        var edge = g.addEdge("node" + (id-1) + ":out", "node" + id); 
        edge.set("lhead","cluster_" + (cid-1));
        if(type.result.kind==dCConsts.CXTypeKind["CXType_FirstBuiltin"]) {
            addDataNode(cluster,"&#10060;","NoOut",false);
        } else {
            parse("0return",cluster,type.result);
        }
        
        if(type.argTypes == 0) {
            var cluster = g.addCluster("cluster_" + cid);
            cid++;
            var edge2 = g.addEdge("node" + id,"node" + functionID + ":in"); 
            edge2.set("ltail","cluster_" + (cid-1));
            addDataNode(cluster,"&#10060;","NoIn",false);
        } else if(type.argTypes == 1) { 
            var cluster = g.addCluster("cluster_" + cid);
            cid++;
            var edge3 = g.addEdge("node" + id,"node" + functionID + ":in"); 
            edge3.set("ltail","cluster_" + (cid-1));
            if(obj==null) {
                parse(null,cluster,type.getArg(i),true);
            } else {
                parse(obj.getArgument(i),cluster,obj.getArgument(i).type,true);
            }
            
        } else {
            for(var i = 0; i < type.argTypes; i++) {
                var cluster = g.addCluster("cluster_" + cid);
                cid++;
                var edge4 = g.addEdge("node" + id,"node" + functionID + ":in");
                edge4.set("ltail","cluster_" + (cid-1));
                if(obj==null) {
                    parse(null,cluster,type.getArg(i),true);
                } else {
                    parse(obj.getArgument(i),cluster,obj.getArgument(i).type,true);
                }
            }
        }
    } else {
        parsed = true;
        addDataNode(g,name,type.kind,type.isConst());
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


exports.parser =  function (fileName) {
    var declObj = {decls:[]};
    //constEdges = [];
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
            } else if(this.kind == dCConsts.CXCursorKind["CXCursor_FunctionDecl"]) {
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
            'Const = ' +this.type.isConst()+ '\n' +
            'Number of arguments = ' +this.type.argTypes+ '\n' +
            'Return Type = ' +dCConsts.CXTypeKind[this.type.result.kind]+ '\n' +
            'Line Number = '+this.location.presumedLocation.line+ '\n' +
            'Column Number = '+this.location.presumedLocation.column);
            for(var i = 0; i < this.pointeeType.canonical.argTypes; i++) {
                console.log(
                    'Argument' + i + ':\n' +
                    'Argument Type = ' +this.pointeeType.canonical.getArg(i).spelling+ '\n' +
                    'Argument Name = ' +dCConsts.CXTypeKind[this.pointeeType.canonical.getArg(i).kind]);
            }
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