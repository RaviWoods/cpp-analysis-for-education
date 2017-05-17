/*
export DYLD_LIBRARY_PATH=/Applications/Xcode.app/Contents/Frameworks/
*/


var libclang = require('libclang');

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;

var dclang = require('./node_modules/libclang/lib/dynamic_clang');
var consts = dclang.CONSTANTS;

var index = new Index(true, true);
var tu = new TranslationUnit.fromSource(index, '/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/CodeSamples/ParserTesting/ptrsbasic.cpp', [
  '-xc++',
]);
 

tu.cursor.visitChildren(function (parent) {
    if(this.spelling == "__llvm__") {
        return;
    } else {
        console.log("Name = " + this.spelling);
        console.log("Kind = " + consts.CXCursorKind[this.kind]);
        console.log("Type = " + consts.CXTypeKind[this.type.kind]);
        console.log("Pointee Type = " + consts.CXTypeKind[this.pointeeType.kind]);
        console.log("Line Number = " + this.location.presumedLocation.line);
        console.log("Column Number = " + this.location.presumedLocation.column);
        console.log("------------");
        return Cursor.Recurse;
    }

});

index.dispose();
tu.dispose;
