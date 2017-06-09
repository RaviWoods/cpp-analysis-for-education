const consts = require('./consts.js')
const parser = require('./parser.js')
const codeEditor = require('./codeEditor.js')

const viz = require('viz.js')
exports.layoutGraph =  function (tempFileName) {
    console.log("------");
    var graphObj = parser.parser2(tempFileName);
    console.log(graphObj.decls[0].Graph);
    document.getElementById("graph-container").innerHTML = viz(graphObj.decls[0].Graph);
}