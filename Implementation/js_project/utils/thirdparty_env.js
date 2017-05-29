// import getResourcesPath from './resources'

/*
/Applications/Xcode.app/Contents/Frameworks/
*/

Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("./resources");

console.log("tpe 1");
var thirdpartyPath = resources_1.default('thirdparty');
console.log("tpe 2");

// var thirdpartyPath = getResourcesPath('thirdparty')
var env = {}

if (process.platform === 'darwin') {

console.log("tpe 3");
  // Set 3rd party binaries and libraries
  env.PATH = [
    '$PATH',
    thirdpartyPath + '/poppler/bin',
    thirdpartyPath + '/tesseract/bin'
  ].join(':')


/*
DYLD_LIBRARY_PATH
*/

  env.DYLD_LIBRARY_PATH = [
    '/Applications/Xcode.app/Contents/Frameworks/'
  ].join(':')

console.log("tpe 4, env.DYLD_LIBRARY_PATH = ", env.DYLD_LIBRARY_PATH);
console.log("tpe 4, env = ", env);


  // env.TESSDATA_PREFIX = thirdpartyPath + '/tesseract/share/tessdata'
}

// export default env
exports.default = env;

