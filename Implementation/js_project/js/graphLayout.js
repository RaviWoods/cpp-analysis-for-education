const consts = require('./consts.js')
const parser = require('./parser.js')
const codeEditor = require('./codeEditor.js')
const viz = require('viz.js')

var graphObj;
var decorationsList = [];
var currentVar;
var init = false;
var pageX;
var pageY;

exports.layoutGraph =  function (tempFileName) {
    fileName = tempFileName;
    graphObj = parser.parser2(tempFileName);
    var x = false;
    codeEditor.decorations = codeEditor.editor.deltaDecorations(codeEditor.decorations, []);
    decorationsList = [];
    
    for (i in graphObj.decls) {
        if(graphObj.decls[i].Name == currentVar) {
            console.log(graphObj.decls[i].Name+" selected")
            x = true;
            document.getElementById("graph-container").innerHTML = viz(graphObj.decls[i].Graph);
            document.getElementById("decl-name").innerHTML = "Declaration of the " + graphObj.decls[i].Type + ", called " + graphObj.decls[i].Name;
            decorationsList.push({
                range: new monaco.Range(graphObj.decls[i].LineNumber,graphObj.decls[i].StartColumn,graphObj.decls[i].LineNumber,graphObj.decls[i].EndColumn),
                options: {inlineClassName: 'decl-selected'}
            });
        } else {
            console.log(graphObj.decls[i].Name+" unselected")
            decorationsList.push({
                range: new monaco.Range(graphObj.decls[i].LineNumber,graphObj.decls[i].StartColumn,graphObj.decls[i].LineNumber,graphObj.decls[i].EndColumn),
                options: {inlineClassName: 'decl-unselected'}
            });
        }
    }
    codeEditor.decorations = codeEditor.editor.deltaDecorations(codeEditor.decorations, decorationsList);
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

        }
    }
    codeEditor.decorations = codeEditor.editor.deltaDecorations(codeEditor.decorations, []);
    decorationsList = [];
    for (i in graphObj.decls) {
        if(graphObj.decls[i].Name == currentVar) {
            decorationsList.push({
                range: new monaco.Range(graphObj.decls[i].LineNumber,graphObj.decls[i].StartColumn,graphObj.decls[i].LineNumber,graphObj.decls[i].EndColumn),
                options: {inlineClassName: 'decl-selected'}
            });
        } else {
            decorationsList.push({
                range: new monaco.Range(graphObj.decls[i].LineNumber,graphObj.decls[i].StartColumn,graphObj.decls[i].LineNumber,graphObj.decls[i].EndColumn),
                options: {inlineClassName: 'decl-unselected'}
            });
        }
    }
    codeEditor.decorations = codeEditor.editor.deltaDecorations(codeEditor.decorations, decorationsList);
}

$("body").mousemove(function(e) {
    pageX = e.pageX;
    pageY = e.pageY;
})

exports.showTip = function(lineNumber,columnNumber) {
    var show = false;
    for (i in graphObj.decls) {
        if(lineNumber == graphObj.decls[i].LineNumber && columnNumber <= graphObj.decls[i].EndColumn && columnNumber >= graphObj.decls[i].StartColumn) {
            show = true;
            $(".hidepopUp").show();         
            $(".hidepopUp").css({             
                top: (pageY+10) + "px",             
                left: (pageX+10) + "px"         
            });     
        }
    }
    
    if(!show) {
        $(".hidepopUp").hide(); 
    }
}
