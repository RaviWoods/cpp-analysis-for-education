(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Main = global.Main || {})));
}(this, (function (exports) { 'use strict';

var message = "Hello world!";

function main() {
    console.log(message);
}
main();

exports.main = main;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=Main.js.map