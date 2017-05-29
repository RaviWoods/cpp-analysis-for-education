/*
export DYLD_LIBRARY_PATH=/Applications/Xcode.app/Contents/Frameworks/
*/

var testDir = '/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/CodeSamples/GraphTesting'
var projectDir = '/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/js_project/'
var libclang = require('libclang');

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;

var dclang = require(projectDir + '/node_modules/libclang/lib/dynamic_clang.js');
var consts = dclang.CONSTANTS;
var parsedKinds = ["CXCursor_VarDecl"]

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
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

function parser(fileDir, fileName) {
    var fullFilePath = fileDir + '/' + fileName;
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
                declObj.decls[i] = {name:this.spelling, class:"", line: this.location.presumedLocation.line, data:{}}
                if(this.kind == consts.CXCursorKind["CXCursor_VarDecl"] && this.pointeeType.kind != consts.CXTypeKind["CXType_Invalid"]) {
                    declObj.decls[i].class = "pointer"
                    declObj.decls[i].data = {pointeeType:consts.CXTypeKind[this.pointeeType.kind]}
                } else if(this.kind == consts.CXCursorKind["CXCursor_VarDecl"]) {
                    declObj.decls[i].class = "basic"
                    declObj.decls[i].data = {type:consts.CXTypeKind[this.type.kind]}
                }        
                i++;
            }
            return Cursor.Recurse;
        }
    });
    console.log(JSON.stringify(declObj, null, 2)) 
    index.dispose();
    tu.dispose;
    return
}

function debugParser(fileDir, fileName) {
    var fullFilePath = fileDir + '/' + fileName
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fullFilePath, [
    '-xc++',
    ]);
    tu.cursor.visitChildren(function (parent) {
        if(this.spelling == "__llvm__") {
            return;
        } else {
            console.log("Name = " + this.spelling);
            console.log("Kind (Number) = " + this.kind)
            console.log("Kind = " + consts.CXCursorKind[this.kind]);
            console.log("Type = " + consts.CXTypeKind[this.type.kind]);
            console.log("Pointee Type = " + consts.CXTypeKind[this.pointeeType.kind]);
            console.log("Pointee Type (Number) = " + this.pointeeType.kind);
            console.log("Line Number = " + this.location.presumedLocation.line);
            console.log("Column Number = " + this.location.presumedLocation.column);
            console.log("------------")
            
            return Cursor.Recurse;
        }

    });

    index.dispose();
    tu.dispose;
    return
}

parser(testDir,'ptrsrecurse.cpp')