// var libclang = require('libclang');
//  
//  
 
var libclang = require('libclang');

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;

var dclang = require('./node_modules/libclang/lib/dynamic_clang');
// var dclang = require('dynamic_clang');
var consts = dclang.CONSTANTS;

var index = new Index(true, true);
var tu = new TranslationUnit.fromSource(index, '/Users/peterwoods/libclagtest/test.c', [
  '-xc++',
  //'-I/Users/tjfontaine/Development/node/deps/uv/include',
  //'-I/Users/tjfontaine/Development/node/deps/v8/include',
]);
 
 
tu.cursor.visitChildren(function (parent) {

//console.log("p1, this = ", this);

  if (this.kind != Cursor.MacroDefinition &&
      this.kind != Cursor.MacroInstantiation &&
      this.kind != Cursor.LastProcessing)
    console.log(consts.CXCursorKind[this.kind], this.spelling);
  switch (this.kind) {
    case Cursor.LastPreprocessing:
      return Cursor.Break;
      break;
    case Cursor.Namespace:
    case Cursor.ClassDecl:
    case Cursor.FunctionDecl:
    case Cursor.FunctionTemplate:
    case Cursor.EnumDecl:
      return Cursor.Recurse;
      break;
    default:
	//console.log("p2");
      return Cursor.Continue;
      break;
  }

console.log("p3");

});

 
 /*
// console.log("libclang = ", libclang);

var index = new libclang.Index();
var tu = new libclang.TranslationUnit();



// tu.fromSource(idx, 'myLibrary.h', ['-I/path/to/my/project']);
console.log("tu = ", tu);
console.log("index = ", index);

tu.fromSource(index, 'myLibrary.h', ['-I/path/to/my/project']);
*/


/* 
 
var index = new libclang.index();


tu.fromSource(idx, 'myLibrary.h', ['-I/path/to/my/project']);
 
tu.cursor().visitChildren(function (parent) {
  switch (this.kind) {
    case libclang.KINDS.CXCursor_FunctionDecl:
      console.log(this.spelling);
      break;
  }
  return libclang.CXChildVisit_Continue;
});
 
index.dispose();
tu.dispose();

*/

/*
var libclang = require('./libclang');

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;

var dclang = require('./lib/dynamic_clang');
var consts = dclang.CONSTANTS;

var index = new Index(true, true);
var tu = new TranslationUnit.fromSource(index, '/Users/tjfontaine/Development/node/src/node_buffer.h', [
  '-xc++',
  //'-I/Users/tjfontaine/Development/node/deps/uv/include',
  //'-I/Users/tjfontaine/Development/node/deps/v8/include',
]);


tu.cursor.visitChildren(function (parent) {
  if (this.kind != Cursor.MacroDefinition &&
      this.kind != Cursor.MacroInstantiation &&
      this.kind != Cursor.LastProcessing)
    console.log(consts.CXCursorKind[this.kind], this.spelling);
  switch (this.kind) {
    case Cursor.LastPreprocessing:
      return Cursor.Break;
      break;
    case Cursor.Namespace:
    case Cursor.ClassDecl:
    case Cursor.FunctionDecl:
    case Cursor.FunctionTemplate:
    case Cursor.EnumDecl:
      return Cursor.Recurse;
      break;
    default:
      return Cursor.Continue;
      break;
  }
});

*/