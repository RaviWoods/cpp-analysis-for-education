var parser = require("node-c-parser");

parser.lexer.cppUnit.clearPreprocessors("./c-demo.c", function(err, codeText){
    if(err){
        console.log(err);
    }
    else{
        var tokens = parser.lexer.lexUnit.tokenize(codeText);
        var parse_tree = parser.parse(tokens);
        console.log(tokens);
    }
});