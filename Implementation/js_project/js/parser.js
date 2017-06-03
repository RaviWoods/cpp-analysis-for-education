const consts = require('./consts.js')
const libclang = require('libclang');
const DYLD_LIBRARY_PATH= process.env.DYLD_LIBRARY_PATH;
const dclang = require('../node_modules/libclang/lib/dynamic_clang.js');

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
            if(contains.call(parsedKinds, dCConsts.CXCursorKind[this.kind])) {
                declObj.decls[i] = {Name:this.spelling, LineNumber: this.location.presumedLocation.line, Type:""}
                if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"] && this.pointeeType.kind != dCConsts.CXTypeKind["CXType_Invalid"]) {
                    //declObj.decls[i].Type = dCConsts.CXTypeKind[this.pointeeType.kind]
                } else if(this.kind == dCConsts.CXCursorKind["CXCursor_VarDecl"]) {
                    declObj.decls[i].Type = dCConsts.CXTypeKind[this.type.kind];
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
            'ArraySize = '+this.type.arraySize+ '\n' +
            'Pointee Type = '+dCConsts.CXTypeKind[this.pointeeType.kind]+ '\n' +
            'Pointee Type (Number) = '+this.pointeeType.kind+ '\n' +
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