
var DEBUGFLAGS = {
    OFF: 0,
    QUNIT: 1,
    PRINT: 2,
    TESTFILE: 4,
    MAX: 7
};

// DEBUG = 0 is production (No QUnit, No Printing)
// DEBUG = 1 runs QUnit
// DEBUG = 2 runs QUnit, and allows prints through debugParser
const DEBUG = 0*DEBUGFLAGS.QUNIT | 0*DEBUGFLAGS.PRINT | 0*DEBUGFLAGS.TESTFILE;

Object.defineProperty(exports, "DEBUGFLAGS", {
    value:        DEBUGFLAGS,
    enumerable:   true,
    writable:     false,
    configurable: false
});


Object.defineProperty(exports, "DEBUG", {
    value:        DEBUG,
    enumerable:   true,
    writable:     false,
    configurable: false
});

Object.defineProperty(exports, "PATH", {
    value:        require('path'),
    enumerable:   true,
    writable:     false,
    configurable: false
});

Object.defineProperty(exports, "FS", {
    value:        require('fs'),
    enumerable:   true,
    writable:     false,
    configurable: false
});

Object.defineProperty(exports, "TEMPY", {
    value:        require('tempy'),
    enumerable:   true,
    writable:     false,
    configurable: false
});

Object.defineProperty(exports, "CPPTESTDIR", {
    value:        './test/cpp',
    enumerable:   true,
    writable:     false,
    configurable: false
});

Object.defineProperty(exports, "JSONTESTDIR", {
    value:        './test/graphviz',
    enumerable:   true,
    writable:     false,
    configurable: false
});

if(DEBUG & DEBUGFLAGS.QUNIT) {
    document.getElementById('production-container').style.display = 'none';
} else {
    document.getElementById('test-container').style.display = 'none';
}

exports.debugPrint = function (message,varName) {
    if(DEBUG & DEBUGFLAGS.PRINT) {
        if(varName==null && message == null){
            return;
        }
        else if(varName==null) {
            console.log(message);
        } else if(message==null) {
            console.log(varName);
        } else {
            dCConsts.CXTypeKind[this.pointeeType.kind]
        }
    }
}





















