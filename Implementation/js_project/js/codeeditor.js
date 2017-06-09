const consts = require('./consts.js')
const parser = require('./parser.js')
const graphing = require('./graphLayout')

var editor;
exports.editor = editor;
// require node modules before loader.js comes in
function uriFromPath(_path) {
    var pathName = consts.PATH.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}
amdRequire.config({
    baseUrl: uriFromPath(consts.PATH.join(__dirname, '../node_modules/monaco-editor/min'))
});
// workaround monaco-css not understanding the environment
self.module = undefined;
// workaround monaco-typescript not understanding the environment
self.process.browser = true;

amdRequire(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('container'), {
        value: [
            'int main() {',
            '\tint x;',
            '\treturn 0;',
            '}'
        ].join('\n'),
        language: 'cpp'
    });
    editor.onDidChangeModelContent((e) => {
        runGraphEngine()
    });
});

function runGraphEngine() {
    var tempFileName = consts.TEMPY.file({extension: 'cpp'})
    consts.FS.writeFile(tempFileName, editor.getValue(), function(err) {
        if(err) {
            return console.log(err);
        }
        graphing.layoutGraph(tempFileName);
    }); 
}

function printCode() {
    var tempFileName = consts.TEMPY.file({extension: 'cpp'})
    consts.FS.writeFile(tempFileName, editor.getValue(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("STRING TO FILE TO PARSER");
        console.log("------");
        console.log(JSON.stringify(parser.parser(tempFileName), null, 2));
    }); 
}
