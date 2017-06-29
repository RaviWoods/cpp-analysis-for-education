const consts = require('./consts.js')
const parser = require('./parser.js')

var jsonFilenames = [];
var cppFilenames = [];

consts.FS.readdirSync(consts.CPPTESTDIR).forEach(fileName => {
    if(consts.PATH.parse(fileName).ext==".cpp") {
        cppFilenames.push(consts.PATH.parse(fileName).name);
    }
})

consts.FS.readdirSync(consts.JSONTESTDIR).forEach(fileName => {
    if(consts.PATH.parse(fileName).ext==".json") {
        jsonFilenames.push(consts.PATH.parse(fileName).name);
    }
})


QUnit.test("test", function( assert ) {
    for (i in jsonFilenames) {
        for (j in cppFilenames) {
            if (jsonFilenames[i] == cppFilenames[j]) {
                var jsonString = consts.FS.readFileSync("./test/graphviz/" + jsonFilenames[i] + ".json", 'utf8');
                try {
                    JSON.parse(jsonString);
                } catch (e) {
                    console.log( "SYNTAX ERROR IN " + jsonFilenames[i] + ".json \n" + e);
                }
                assert.deepEqual(parser.parser2(consts.CPPTESTDIR + '/' + cppFilenames[j] + ".cpp"), JSON.parse(jsonString), cppFilenames[j]);
            }
        }
    }
});

if(consts.DEBUG & consts.DEBUGFLAGS.TESTFILE) {
    parser.debugParser(consts.CPPTESTDIR + '/testfile.cpp')
    console.log("***ENDOFDEBUGPARSER***");
    console.log(JSON.stringify(parser.parser2(consts.CPPTESTDIR + '/testfile.cpp'),null,2))
    console.log("***ENDOFPROPERPARSE***");
}
