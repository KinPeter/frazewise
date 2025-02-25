'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getEnv = getEnv;
function getEnv() {
  var variables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    variables[_i] = arguments[_i];
  }
  return variables.map(function (variable) {
    var value = process.env[variable];
    if (!value) {
      console.log(
        'Attempted to read '.concat(variable, ' from the environment but there was no value.')
      );
    }
    return value !== null && value !== void 0 ? value : '';
  });
}
