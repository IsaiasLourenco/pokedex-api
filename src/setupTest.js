import 'text-encoding';
// setupTest.js
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
console.log("setupTest.js carregado!!")