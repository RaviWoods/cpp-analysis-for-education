(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/*
export DYLD_LIBRARY_PATH=/Applications/Xcode.app/Contents/Frameworks/
*/

var libclang = require('libclang');

var Cursor = libclang.Cursor;
var Index = libclang.Index;
var TranslationUnit = libclang.TranslationUnit;

var dclang = require('/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/project/node_modules/libclang/lib/dynamic_clang.js');
var consts = dclang.CONSTANTS;

function parser(fileDir, fileName) {
    var fullFilePath = fileDir + fileName;
    var index = new Index(true, true);
    var tu = new TranslationUnit.fromSource(index, fullFilePath, ['-xc++']);

    tu.cursor.visitChildren(function (parent) {
        if (this.spelling == "__llvm__") {
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
    return;
}

(function (args) {
    var parser$$1 = parser;
    var fileDir = "/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/CodeSamples/ParserTesting/";
    var fileName = "ptrsbasic.cpp";
    var testParser = parser$$1(fileDir, fileName);
    return 0;
})(process.argv.slice(2));

})));

//# sourceMappingURL=Main.js.map