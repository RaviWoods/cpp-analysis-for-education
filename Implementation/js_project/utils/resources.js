
Object.defineProperty(exports, "__esModule", { value: true });

// import path from 'path'
let path = require('path');



var getResourcesPath = function () {

console.log("res 4, arguments = ", arguments);

  var paths = Array.from(arguments)

console.log("res 4, paths = ", paths);
console.log("res 4x, process.cwd() = ", process.cwd());
console.log("res 4x, process.execPath = ", process.execPath);


  if (/[\\/]Electron\.app[\\/]/.test(process.execPath)) {

		console.log("res 4a, process.cwd() = ", process.cwd());

      // Development mode resources are located in project root.
    paths.unshift(process.cwd())
  } else {
		console.log("res 4b, process.resourcesPath = ", process.resourcesPath);
      // In builds the resources directory is located in 'Contents/Resources'
   
   // testing
   //  paths.unshift(process.resourcesPath)

    paths.unshift(process.cwd())


  }

	console.log("res 4c, paths = ", paths);


  return path.join.apply(null, paths)
}

exports.default = getResourcesPath;
