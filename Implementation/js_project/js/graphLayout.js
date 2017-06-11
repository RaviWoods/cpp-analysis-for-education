const consts = require('./consts.js')
const parser = require('./parser.js')
const codeEditor = require('./codeEditor.js')
const viz = require('viz.js')

var graphObj;
var decorations;
var currentVar;
var init = false;

exports.layoutGraph =  function (tempFileName) {
    fileName = tempFileName;
    graphObj = parser.parser2(tempFileName);
    var x = false;
    for (i in graphObj.decls) {
        if(graphObj.decls[i].Name == currentVar) {
            x = true;
            document.getElementById("graph-container").innerHTML = viz(graphObj.decls[i].Graph);
            document.getElementById("decl-name").innerHTML = "Declaration of the " + graphObj.decls[i].Type + ", called " + graphObj.decls[i].Name;
        }
        decorations = codeEditor.editor.deltaDecorations([] , [
            { 
                range: new monaco.Range(graphObj.decls[i].LineNumber,graphObj.decls[i].StartColumn,graphObj.decls[i].LineNumber,graphObj.decls[i].EndColumn), 
                options: { 
                    className: 'decl-unselected'
                }
            }
        ]);
    }
    if(!x) {
        document.getElementById("graph-container").innerHTML = "";
        document.getElementById("decl-name").innerHTML = "Diagram";  
    }
  
}

exports.showGraph = function(lineNumber,columnNumber) {
    for (i in graphObj.decls) {
        if(lineNumber == graphObj.decls[i].LineNumber && columnNumber <= graphObj.decls[i].EndColumn && columnNumber >= graphObj.decls[i].StartColumn) {
            currentVar = graphObj.decls[i].Name;
            document.getElementById("graph-container").innerHTML = viz(graphObj.decls[i].Graph);
            document.getElementById("decl-name").innerHTML = "Declaration of the " + graphObj.decls[i].Type + ", called " + graphObj.decls[i].Name;
            decorations = codeEditor.editor.deltaDecorations([] , [
                { 
                    range: new monaco.Range(graphObj.decls[i].LineNumber,graphObj.decls[i].StartColumn,graphObj.decls[i].LineNumber,graphObj.decls[i].EndColumn), 
                    options: { 
                        className: 'decl-selected'
                    }
                }
            ]);
        }
        
    }
}

$("button").hover(function(e) {
    $("#panel").css({
        left: e.pageX + 1,
        top: e.pageY + 1
    }).stop().show(100);
}, function() {
    $("#panel").hide();
});

exports.showTip = function(lineNumber,columnNumber) {
    if(lineNumber == graphObj.decls[0].LineNumber && columnNumber <= graphObj.decls[0].EndColumn && columnNumber >= graphObj.decls[0].StartColumn) {
        $("#panel").css({
            left: 100 + 1,
            top: 100 + 1
        }).stop().show(100), function() {
            $("#panel").hide();
        };
    }
}
