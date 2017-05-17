"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.equal = equal;

var _Assert = require("fable-core/umd/Assert");

var _Util = require("fable-core/umd/Util");

function equal(expected, actual) {
    (0, _Assert.equal)((0, _Util.equals)(expected, actual), true);
}
//# sourceMappingURL=Util.js.map