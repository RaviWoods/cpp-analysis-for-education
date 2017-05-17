var ref = require('ref');
var ffi = require('ffi');

// typedef
var sqlite3 = ref.types.void; // we don't know what the layout of "sqlite3" looks like
var sqlite3Ptr = ref.refType(sqlite3);
var sqlite3PtrPtr = ref.refType(sqlite3Ptr);
var stringPtr = ref.refType(ref.types.CString);

// binding to a few "libsqlite3" functions...
var libsqlite3 = ffi.Library('libsqlite3', {
  'sqlite3_open': [ 'int', [ 'string', sqlite3PtrPtr ] ],
  'sqlite3_close': [ 'int', [ sqlite3Ptr ] ],
  'sqlite3_exec': [ 'int', [ sqlite3Ptr, 'string', 'pointer', 'pointer', stringPtr ] ],
  'sqlite3_changes': [ 'int', [ sqlite3Ptr ]]
});


// var libclang = ffi.Library('/Applications/Xcode.app/Contents/Frameworks/libclang.dylib', {
var libclang = ffi.Library('libclang', {
});

 
var index = new libclang.index();
// var tu = new libclang.translationunit();


// now use them:
var dbPtrPtr = ref.alloc(sqlite3PtrPtr);
libsqlite3.sqlite3_open("test.sqlite3", dbPtrPtr);
var dbHandle = dbPtrPtr.deref();

