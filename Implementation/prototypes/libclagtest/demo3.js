/*


cd /Users/peterwoods/libclagtest
export DYLD_LIBRARY_PATH=/Applications/Xcode.app/Contents/Frameworks/

package.json

{
  "name": "libclagtest",
  "version": "1.0.0",
  "description": "",
  "main": "demo.js",

  "dependencies": {
    "libclang": "^0.0.11"
	},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

nvm use v6.9.5

PeterMBP15:libclagtest peterwoods$ node -v
v6.9.5


npm install

node demo3.js

*/


var libclang = require('libclang');

var
  Cursor = libclang.Cursor,
  Index = libclang.Index,
  TranslationUnit = libclang.TranslationUnit;

var dclang = require('./node_modules/libclang/lib/dynamic_clang');
// var dclang = require('dynamic_clang');
var consts = dclang.CONSTANTS;

var index = new Index(true, true);
var tu = new TranslationUnit.fromSource(index, '/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/prototypes/libclagtest/test.c', [
  '-xc++',
  //'-I/Users/tjfontaine/Development/node/deps/uv/include',
  //'-I/Users/tjfontaine/Development/node/deps/v8/include',
]);

tu.cursor.visitChildren(function (parent) {
//console.log (parent);
//	if (this.spelling === "analogRead") {
	console.log (this.spelling, this.kind, this.location.presumedLocation);
//	}

	switch (this.kind) {
		case Cursor.FunctionDecl:
			console.log('function', this.spelling, this.location.presumedLocation);
			// TODO: try/catch?
			var self = this;
		this.visitChildren (function (parent) {
			console.log ('function', self.spelling, 'has child', this.spelling);
		});
			console.log('displayName', this.displayName);
		console.log (this);
		process.exit(0);
			break;
		case Cursor.MacroDefinition:
		console.log('macro', this.spelling);
			break;
		case Cursor.InclusionDirective:
		console.log('inclusion', this.spelling);
			break;
	}
	return Cursor.Continue;
});
